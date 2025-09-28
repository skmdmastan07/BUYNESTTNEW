import { Product, Order, Retailer } from './supabase';

// Seed data for demo mode
export const SEED_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Basmati Rice Premium',
    category: 'Groceries',
    price: 120,
    pack_size: '1kg',
    stock: 50,
    image_url: 'https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg?auto=compress&cs=tinysrgb&w=400',
    distributor: 'Grain Masters Ltd',
    rating: 4.5,
    moq: 10,
    tags: ['rice', 'premium', 'staple'],
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Masala Tea Powder',
    category: 'Beverages',
    price: 85,
    pack_size: '500g',
    stock: 30,
    image_url: 'https://images.pexels.com/photos/1793035/pexels-photo-1793035.jpeg?auto=compress&cs=tinysrgb&w=400',
    distributor: 'Chai Co.',
    rating: 4.2,
    moq: 5,
    tags: ['tea', 'masala', 'beverage'],
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Mixed Namkeen Pack',
    category: 'Snacks',
    price: 45,
    pack_size: '200g',
    stock: 25,
    image_url: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=400',
    distributor: 'Crispy Snacks',
    rating: 4.0,
    moq: 12,
    tags: ['namkeen', 'snacks', 'salty'],
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Coconut Oil Pure',
    category: 'Groceries',
    price: 180,
    pack_size: '1L',
    stock: 20,
    image_url: 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=400',
    distributor: 'Kerala Naturals',
    rating: 4.7,
    moq: 6,
    tags: ['oil', 'coconut', 'cooking'],
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Chocolate Biscuits',
    category: 'Snacks',
    price: 25,
    pack_size: '100g',
    stock: 40,
    image_url: 'https://images.pexels.com/photos/1854652/pexels-photo-1854652.jpeg?auto=compress&cs=tinysrgb&w=400',
    distributor: 'Sweet Treats Co',
    rating: 4.3,
    moq: 20,
    tags: ['biscuits', 'chocolate', 'sweet'],
    created_at: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Fresh Milk Pack',
    category: 'Dairy',
    price: 30,
    pack_size: '500ml',
    stock: 15,
    image_url: 'https://images.pexels.com/photos/236010/pexels-photo-236010.jpeg?auto=compress&cs=tinysrgb&w=400',
    distributor: 'Dairy Fresh',
    rating: 4.6,
    moq: 24,
    tags: ['milk', 'dairy', 'fresh'],
    created_at: new Date().toISOString(),
  },
  {
    id: '7',
    name: 'Turmeric Powder',
    category: 'Spices',
    price: 65,
    pack_size: '200g',
    stock: 35,
    image_url: 'https://images.pexels.com/photos/4198015/pexels-photo-4198015.jpeg?auto=compress&cs=tinysrgb&w=400',
    distributor: 'Spice Garden',
    rating: 4.4,
    moq: 8,
    tags: ['turmeric', 'spices', 'powder'],
    created_at: new Date().toISOString(),
  },
  {
    id: '8',
    name: 'Instant Noodles',
    category: 'Snacks',
    price: 15,
    pack_size: '75g',
    stock: 60,
    image_url: 'https://images.pexels.com/photos/884600/pexels-photo-884600.jpeg?auto=compress&cs=tinysrgb&w=400',
    distributor: 'Quick Foods',
    rating: 3.9,
    moq: 24,
    tags: ['noodles', 'instant', 'quick'],
    created_at: new Date().toISOString(),
  },
];

export const SEED_ORDERS: Order[] = [
  {
    id: '1',
    retailer_id: 'demo-user-1',
    products: [
      { product_id: '1', quantity: 10, price: 120 },
      { product_id: '3', quantity: 12, price: 45 },
    ],
    total_amount: 1740,
    status: 'delivered',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    discount_applied: 0,
  },
  {
    id: '2',
    retailer_id: 'demo-user-1',
    products: [
      { product_id: '2', quantity: 5, price: 85 },
      { product_id: '4', quantity: 6, price: 180 },
    ],
    total_amount: 1505,
    status: 'delivered',
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    discount_applied: 45, // 3% weekly streak discount
  },
];

// Generate purchase history for recommendations
export function generatePurchaseHistory(): { [productId: string]: number } {
  return {
    '1': 25, // Basmati Rice - frequently bought
    '2': 15, // Masala Tea
    '3': 20, // Namkeen
    '4': 8,  // Coconut Oil
    '5': 12, // Chocolate Biscuits
    '6': 30, // Fresh Milk
    '7': 10, // Turmeric
    '8': 18, // Instant Noodles
  };
}

// Co-purchase matrix for recommendations
export const CO_PURCHASE_MATRIX: { [key: string]: { [key: string]: number } } = {
  '1': { '7': 0.8, '4': 0.6, '2': 0.5 }, // Rice -> Turmeric, Oil, Tea
  '2': { '5': 0.7, '8': 0.4, '1': 0.5 }, // Tea -> Biscuits, Noodles, Rice  
  '3': { '8': 0.6, '5': 0.5, '2': 0.4 }, // Namkeen -> Noodles, Biscuits, Tea
  '4': { '1': 0.6, '7': 0.7, '6': 0.3 }, // Oil -> Rice, Turmeric, Milk
  '5': { '2': 0.7, '6': 0.8, '3': 0.5 }, // Biscuits -> Tea, Milk, Namkeen
  '6': { '5': 0.8, '2': 0.6, '4': 0.3 }, // Milk -> Biscuits, Tea, Oil
  '7': { '1': 0.8, '4': 0.7, '2': 0.4 }, // Turmeric -> Rice, Oil, Tea
  '8': { '3': 0.6, '2': 0.4, '5': 0.3 }, // Noodles -> Namkeen, Tea, Biscuits
};

export class DataService {
  static async getProducts(): Promise<Product[]> {
    return SEED_PRODUCTS;
  }

  static async getProductById(id: string): Promise<Product | null> {
    return SEED_PRODUCTS.find(p => p.id === id) || null;
  }

  static async getOrders(retailerId: string): Promise<Order[]> {
    return SEED_ORDERS.filter(o => o.retailer_id === retailerId);
  }

  static async searchProducts(query: string): Promise<Product[]> {
    const lowercaseQuery = query.toLowerCase();
    return SEED_PRODUCTS.filter(p => 
      p.name.toLowerCase().includes(lowercaseQuery) ||
      p.category.toLowerCase().includes(lowercaseQuery) ||
      p.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  static async getProductsByCategory(category: string): Promise<Product[]> {
    return SEED_PRODUCTS.filter(p => p.category === category);
  }
}