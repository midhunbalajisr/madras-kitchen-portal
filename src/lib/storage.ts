// LocalStorage utilities for Madras Kitchen

export interface Student {
  id: string;
  name: string;
  email: string;
  balance: number;
  points: number;
  orders: Order[];
}

export interface Order {
  id: string;
  studentId: string;
  items: CartItem[];
  total: number;
  paymentMethod: string;
  status: 'pending' | 'preparing' | 'ready' | 'delivered';
  token: string;
  timestamp: number;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

export interface Complaint {
  id: string;
  studentId: string;
  name: string;
  description: string;
  timestamp: number;
  status: 'pending' | 'resolved';
}

export interface Feedback {
  id: string;
  studentId: string;
  rating: number;
  comment: string;
  token: string;
  timestamp: number;
  respondents: string[];
}

// Storage keys
const STORAGE_KEYS = {
  STUDENTS: 'madras_kitchen_students',
  ORDERS: 'madras_kitchen_orders',
  COMPLAINTS: 'madras_kitchen_complaints',
  FEEDBACK: 'madras_kitchen_feedback',
  CURRENT_USER: 'madras_kitchen_current_user',
  CART: 'madras_kitchen_cart',
};

// Generic storage functions
export const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

export const saveToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

// Student functions
export const getStudents = (): Student[] => {
  return getFromStorage<Student[]>(STORAGE_KEYS.STUDENTS, []);
};

export const saveStudent = (student: Student): void => {
  const students = getStudents();
  const index = students.findIndex(s => s.id === student.id);
  if (index >= 0) {
    students[index] = student;
  } else {
    students.push(student);
  }
  saveToStorage(STORAGE_KEYS.STUDENTS, students);
};

export const getStudentById = (id: string): Student | null => {
  const students = getStudents();
  return students.find(s => s.id === id) || null;
};

export const rechargeStudent = (id: string, amount: number): void => {
  const student = getStudentById(id);
  if (student) {
    student.balance += amount;
    saveStudent(student);
  }
};

// Order functions
export const getOrders = (): Order[] => {
  return getFromStorage<Order[]>(STORAGE_KEYS.ORDERS, []);
};

export const saveOrder = (order: Order): void => {
  const orders = getOrders();
  orders.unshift(order);
  saveToStorage(STORAGE_KEYS.ORDERS, orders);
};

export const updateOrderStatus = (orderId: string, status: Order['status']): void => {
  const orders = getOrders();
  const order = orders.find(o => o.id === orderId);
  if (order) {
    order.status = status;
    saveToStorage(STORAGE_KEYS.ORDERS, orders);
  }
};

// Cart functions
export const getCart = (): CartItem[] => {
  return getFromStorage<CartItem[]>(STORAGE_KEYS.CART, []);
};

export const saveCart = (cart: CartItem[]): void => {
  saveToStorage(STORAGE_KEYS.CART, cart);
};

export const addToCart = (item: CartItem): void => {
  const cart = getCart();
  const existingItem = cart.find(i => i.id === item.id);
  if (existingItem) {
    existingItem.quantity += item.quantity;
  } else {
    cart.push(item);
  }
  saveCart(cart);
};

export const removeFromCart = (itemId: string): void => {
  const cart = getCart().filter(item => item.id !== itemId);
  saveCart(cart);
};

export const clearCart = (): void => {
  saveCart([]);
};

export const updateCartItemQuantity = (itemId: string, quantity: number): void => {
  const cart = getCart();
  const item = cart.find(i => i.id === itemId);
  if (item) {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      item.quantity = quantity;
      saveCart(cart);
    }
  }
};

// Complaint functions
export const getComplaints = (): Complaint[] => {
  return getFromStorage<Complaint[]>(STORAGE_KEYS.COMPLAINTS, []);
};

export const saveComplaint = (complaint: Complaint): void => {
  const complaints = getComplaints();
  complaints.unshift(complaint);
  saveToStorage(STORAGE_KEYS.COMPLAINTS, complaints);
};

// Feedback functions
export const getFeedbacks = (): Feedback[] => {
  return getFromStorage<Feedback[]>(STORAGE_KEYS.FEEDBACK, []);
};

export const saveFeedback = (feedback: Feedback): void => {
  const feedbacks = getFeedbacks();
  feedbacks.unshift(feedback);
  saveToStorage(STORAGE_KEYS.FEEDBACK, feedbacks);
};

// Current user functions
export const getCurrentUser = (): Student | null => {
  return getFromStorage<Student | null>(STORAGE_KEYS.CURRENT_USER, null);
};

export const setCurrentUser = (student: Student | null): void => {
  saveToStorage(STORAGE_KEYS.CURRENT_USER, student);
};

export const logout = (): void => {
  setCurrentUser(null);
  clearCart();
};

// Generate random token
export const generateToken = (): string => {
  return Math.floor(10000 + Math.random() * 90000).toString();
};

// Generate random student ID
export const generateStudentId = (): string => {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `MEC${randomNum}`;
};

// Initialize demo data if needed
export const initializeDemoData = (): void => {
  const students = getStudents();
  if (students.length === 0) {
    const demoStudents: Student[] = [
      {
        id: 'MEC1001',
        name: 'Rahul Kumar',
        email: 'rahul@mec.edu',
        balance: 500,
        points: 50,
        orders: [],
      },
      {
        id: 'MEC1002',
        name: 'Priya Sharma',
        email: 'priya@mec.edu',
        balance: 750,
        points: 80,
        orders: [],
      },
      {
        id: 'MEC1003',
        name: 'Arjun Patel',
        email: 'arjun@mec.edu',
        balance: 300,
        points: 30,
        orders: [],
      },
      {
        id: 'MEC1004',
        name: 'Sneha Reddy',
        email: 'sneha@mec.edu',
        balance: 600,
        points: 60,
        orders: [],
      },
      {
        id: 'MEC1005',
        name: 'Vikram Singh',
        email: 'vikram@mec.edu',
        balance: 450,
        points: 40,
        orders: [],
      },
      {
        id: 'MEC1006',
        name: 'Anjali Menon',
        email: 'anjali@mec.edu',
        balance: 800,
        points: 90,
        orders: [],
      },
      {
        id: 'MEC1007',
        name: 'Karthik Raj',
        email: 'karthik@mec.edu',
        balance: 550,
        points: 55,
        orders: [],
      },
      {
        id: 'MEC1008',
        name: 'Deepika Iyer',
        email: 'deepika@mec.edu',
        balance: 700,
        points: 75,
        orders: [],
      },
      {
        id: 'MEC1009',
        name: 'Aditya Gupta',
        email: 'aditya@mec.edu',
        balance: 400,
        points: 35,
        orders: [],
      },
      {
        id: 'MEC1010',
        name: 'Pooja Nair',
        email: 'pooja@mec.edu',
        balance: 650,
        points: 65,
        orders: [],
      },
      {
        id: 'MEC1011',
        name: 'Rohan Desai',
        email: 'rohan@mec.edu',
        balance: 520,
        points: 52,
        orders: [],
      },
      {
        id: 'MEC1012',
        name: 'Divya Krishna',
        email: 'divya@mec.edu',
        balance: 580,
        points: 58,
        orders: [],
      },
    ];
    saveToStorage(STORAGE_KEYS.STUDENTS, demoStudents);
  }
};
