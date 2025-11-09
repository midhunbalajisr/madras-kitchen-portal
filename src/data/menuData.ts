import biriyaniImg from '@/assets/biriyani.jpg';
import idlyImg from '@/assets/idly.jpg';
import dosaImg from '@/assets/dosa.jpg';
import orangeJuiceImg from '@/assets/orange-juice.jpg';
import friedRiceImg from '@/assets/fried-rice.jpg';
import samosaImg from '@/assets/samosa.jpg';
import fruitSaladImg from '@/assets/fruit-salad.jpg';
import paneerImg from '@/assets/paneer.jpg';
import coffeeImg from '@/assets/coffee.jpg';
import chickenTikkaImg from '@/assets/chicken-tikka.jpg';
import watermelonJuiceImg from '@/assets/watermelon-juice.jpg';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: 'veg' | 'non-veg' | 'snacks' | 'juice' | 'fruits';
  description: string;
  available: boolean;
}

export const menuItems: MenuItem[] = [
  // Veg Items
  {
    id: 'veg-001',
    name: 'Idly Set',
    price: 40,
    image: idlyImg,
    category: 'veg',
    description: '4 Soft idlis with sambar and chutney',
    available: true,
  },
  {
    id: 'veg-002',
    name: 'Masala Dosa',
    price: 60,
    image: dosaImg,
    category: 'veg',
    description: 'Crispy dosa with potato masala filling',
    available: true,
  },
  {
    id: 'veg-003',
    name: 'Paneer Butter Masala',
    price: 120,
    image: paneerImg,
    category: 'veg',
    description: 'Creamy paneer curry with rich tomato gravy',
    available: true,
  },
  {
    id: 'veg-004',
    name: 'Vegetable Fried Rice',
    price: 80,
    image: friedRiceImg,
    category: 'veg',
    description: 'Flavorful fried rice with mixed vegetables',
    available: true,
  },
  {
    id: 'veg-005',
    name: 'Chole Bhature',
    price: 90,
    image: samosaImg,
    category: 'veg',
    description: 'Spicy chickpea curry with fluffy bhature',
    available: true,
  },
  {
    id: 'veg-006',
    name: 'Veg Pulao',
    price: 70,
    image: friedRiceImg,
    category: 'veg',
    description: 'Aromatic rice with vegetables and spices',
    available: true,
  },
  {
    id: 'veg-007',
    name: 'Plain Dosa',
    price: 45,
    image: dosaImg,
    category: 'veg',
    description: 'Classic crispy dosa with chutneys',
    available: true,
  },
  {
    id: 'veg-008',
    name: 'Veg Thali',
    price: 110,
    image: idlyImg,
    category: 'veg',
    description: 'Complete meal with rice, roti, dal, sabzi',
    available: true,
  },

  // Non-Veg Items
  {
    id: 'non-veg-001',
    name: 'Chicken Biriyani',
    price: 190,
    image: biriyaniImg,
    category: 'non-veg',
    description: 'Aromatic rice with tender chicken pieces',
    available: true,
  },
  {
    id: 'non-veg-002',
    name: 'Chicken Tikka',
    price: 150,
    image: chickenTikkaImg,
    category: 'non-veg',
    description: 'Grilled chicken pieces with spices',
    available: true,
  },
  {
    id: 'non-veg-003',
    name: 'Mutton Biriyani',
    price: 220,
    image: biriyaniImg,
    category: 'non-veg',
    description: 'Traditional mutton biriyani with raita',
    available: true,
  },
  {
    id: 'non-veg-004',
    name: 'Chicken Fried Rice',
    price: 110,
    image: friedRiceImg,
    category: 'non-veg',
    description: 'Fried rice with chicken pieces',
    available: true,
  },
  {
    id: 'non-veg-005',
    name: 'Fish Fry',
    price: 140,
    image: chickenTikkaImg,
    category: 'non-veg',
    description: 'Crispy fried fish with masala',
    available: true,
  },
  {
    id: 'non-veg-006',
    name: 'Egg Curry',
    price: 80,
    image: paneerImg,
    category: 'non-veg',
    description: 'Boiled eggs in spicy curry',
    available: true,
  },
  {
    id: 'non-veg-007',
    name: 'Chicken 65',
    price: 130,
    image: chickenTikkaImg,
    category: 'non-veg',
    description: 'Spicy deep-fried chicken appetizer',
    available: true,
  },

  // Snacks
  {
    id: 'snack-001',
    name: 'Samosa',
    price: 20,
    image: samosaImg,
    category: 'snacks',
    description: 'Crispy triangular pastry with filling',
    available: true,
  },
  {
    id: 'snack-002',
    name: 'Vada Pav',
    price: 30,
    image: samosaImg,
    category: 'snacks',
    description: 'Mumbai style potato fritter in bun',
    available: true,
  },
  {
    id: 'snack-003',
    name: 'Bread Pakora',
    price: 25,
    image: samosaImg,
    category: 'snacks',
    description: 'Bread slices dipped in batter and fried',
    available: true,
  },
  {
    id: 'snack-004',
    name: 'Pani Puri',
    price: 35,
    image: samosaImg,
    category: 'snacks',
    description: 'Crispy puris with tangy water',
    available: true,
  },
  {
    id: 'snack-005',
    name: 'Bhel Puri',
    price: 40,
    image: samosaImg,
    category: 'snacks',
    description: 'Puffed rice with chutneys and vegetables',
    available: true,
  },
  {
    id: 'snack-006',
    name: 'Pakora Plate',
    price: 45,
    image: samosaImg,
    category: 'snacks',
    description: 'Mixed vegetable fritters',
    available: true,
  },

  // Juices
  {
    id: 'juice-001',
    name: 'Orange Juice',
    price: 60,
    image: orangeJuiceImg,
    category: 'juice',
    description: 'Freshly squeezed orange juice',
    available: true,
  },
  {
    id: 'juice-002',
    name: 'Watermelon Juice',
    price: 50,
    image: watermelonJuiceImg,
    category: 'juice',
    description: 'Fresh watermelon juice',
    available: true,
  },
  {
    id: 'juice-003',
    name: 'Mango Juice',
    price: 70,
    image: orangeJuiceImg,
    category: 'juice',
    description: 'Sweet mango juice',
    available: true,
  },
  {
    id: 'juice-004',
    name: 'Mixed Fruit Juice',
    price: 80,
    image: orangeJuiceImg,
    category: 'juice',
    description: 'Blend of seasonal fruits',
    available: true,
  },
  {
    id: 'juice-005',
    name: 'Filter Coffee',
    price: 30,
    image: coffeeImg,
    category: 'juice',
    description: 'Traditional South Indian coffee',
    available: true,
  },
  {
    id: 'juice-006',
    name: 'Lemon Juice',
    price: 40,
    image: watermelonJuiceImg,
    category: 'juice',
    description: 'Refreshing lemon juice',
    available: true,
  },

  // Fruits
  {
    id: 'fruit-001',
    name: 'Fruit Salad',
    price: 60,
    image: fruitSaladImg,
    category: 'fruits',
    description: 'Fresh mixed fruit salad',
    available: true,
  },
  {
    id: 'fruit-002',
    name: 'Apple',
    price: 40,
    image: fruitSaladImg,
    category: 'fruits',
    description: 'Fresh red apple',
    available: true,
  },
  {
    id: 'fruit-003',
    name: 'Banana',
    price: 20,
    image: fruitSaladImg,
    category: 'fruits',
    description: 'Fresh banana',
    available: true,
  },
  {
    id: 'fruit-004',
    name: 'Orange',
    price: 30,
    image: fruitSaladImg,
    category: 'fruits',
    description: 'Juicy orange',
    available: true,
  },
  {
    id: 'fruit-005',
    name: 'Papaya Slice',
    price: 35,
    image: fruitSaladImg,
    category: 'fruits',
    description: 'Fresh papaya slices',
    available: true,
  },
  {
    id: 'fruit-006',
    name: 'Watermelon Slice',
    price: 25,
    image: fruitSaladImg,
    category: 'fruits',
    description: 'Fresh watermelon slice',
    available: true,
  },
];

export const categories = [
  { id: 'veg', name: 'Veg', icon: '🥗' },
  { id: 'non-veg', name: 'Non-Veg', icon: '🍗' },
  { id: 'snacks', name: 'Snacks', icon: '🍿' },
  { id: 'juice', name: 'Beverages', icon: '🥤' },
  { id: 'fruits', name: 'Fruits', icon: '🍎' },
];

export const getDayOffer = () => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const today = days[new Date().getDay()];

  const offers: Record<string, { title: string; description: string; discount: string }> = {
    monday: {
      title: 'Combo Monday',
      description: 'Get any main course + juice combo',
      discount: '15% OFF',
    },
    tuesday: {
      title: 'Coupon Tuesday',
      description: 'Extra 20 points on every order',
      discount: 'Double Points',
    },
    wednesday: {
      title: 'Mid-Week Special',
      description: 'Free samosa with any meal',
      discount: 'Free Snack',
    },
    thursday: {
      title: 'Thirsty Thursday',
      description: 'Buy 1 Get 1 on all beverages',
      discount: 'BOGO',
    },
    friday: {
      title: 'Friday Feast',
      description: 'Flat ₹50 off on orders above ₹200',
      discount: '₹50 OFF',
    },
    saturday: {
      title: 'Weekend Special',
      description: 'Special biriyani varieties available',
      discount: '10% OFF',
    },
    sunday: {
      title: 'Sunday Brunch',
      description: 'Breakfast items at discounted rates',
      discount: '20% OFF',
    },
  };

  return offers[today];
};
