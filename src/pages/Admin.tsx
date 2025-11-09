import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { getStudents, rechargeStudent, getComplaints, getOrders, type Student, type Complaint, type Order } from '@/lib/storage';
import { LogOut, Users, CreditCard, MessageSquare, TrendingUp, AlertCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import mecLogo from '@/assets/mec-logo-official.png';

const Admin = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [rushStatus, setRushStatus] = useState<'free' | 'moderate' | 'rush'>('moderate');

  useEffect(() => {
    loadData();
    // Simulate random rush status
    const interval = setInterval(() => {
      const statuses: ('free' | 'moderate' | 'rush')[] = ['free', 'moderate', 'rush'];
      setRushStatus(statuses[Math.floor(Math.random() * statuses.length)]);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    setStudents(getStudents());
    setComplaints(getComplaints());
    setOrders(getOrders());
  };

  const handleRecharge = () => {
    if (!selectedStudent || !rechargeAmount) {
      toast.error('Please select student and enter amount');
      return;
    }
    
    const amount = parseFloat(rechargeAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter valid amount');
      return;
    }

    rechargeStudent(selectedStudent, amount);
    toast.success(`₹${amount} recharged successfully to ${selectedStudent}`);
    setRechargeAmount('');
    setSelectedStudent('');
    loadData();
  };

  const getRushColor = () => {
    switch (rushStatus) {
      case 'free': return 'bg-green-500';
      case 'moderate': return 'bg-yellow-500';
      case 'rush': return 'bg-red-500';
    }
  };

  const getRushText = () => {
    switch (rushStatus) {
      case 'free': return 'Free - Low Rush';
      case 'moderate': return 'Moderate Rush';
      case 'rush': return 'High Rush Hour';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background">
      <nav className="bg-card shadow-card border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/login')}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <img src={mecLogo} alt="MEC Logo" className="w-10 h-10" />
            <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
          </div>
          <Button 
            variant="ghost" 
            onClick={() => navigate('/login')}
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{students.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {orders.filter(o => o.status !== 'delivered').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Complaints</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {complaints.filter(c => c.status === 'pending').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Canteen Status</CardTitle>
              <div className={`w-3 h-3 rounded-full ${getRushColor()}`} />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-semibold">{getRushText()}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="recharge" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="recharge">Recharge</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="complaints">Complaints</TabsTrigger>
          </TabsList>

          <TabsContent value="recharge" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Student Recharge</CardTitle>
                <CardDescription>Add balance to student accounts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="student">Select Student</Label>
                  <select 
                    id="student"
                    className="w-full p-2 border rounded-md bg-background"
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                  >
                    <option value="">-- Select Student --</option>
                    {students.map(student => (
                      <option key={student.id} value={student.id}>
                        {student.id} - {student.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (₹)</Label>
                  <Input 
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={rechargeAmount}
                    onChange={(e) => setRechargeAmount(e.target.value)}
                  />
                </div>
                <Button onClick={handleRecharge} className="w-full">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Recharge Account
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Student List</CardTitle>
                <CardDescription>All registered students</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {students.map(student => (
                    <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-semibold">{student.name}</p>
                        <p className="text-sm text-muted-foreground">{student.id}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">₹{student.balance}</p>
                        <p className="text-xs text-muted-foreground">{student.points} points</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="complaints" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Complaints</CardTitle>
                <CardDescription>Student feedback and issues</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {complaints.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No complaints</p>
                  ) : (
                    complaints.map(complaint => (
                      <div key={complaint.id} className="p-4 border rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold">{complaint.name}</p>
                          <Badge variant={complaint.status === 'pending' ? 'destructive' : 'secondary'}>
                            {complaint.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{complaint.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(complaint.timestamp).toLocaleString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
