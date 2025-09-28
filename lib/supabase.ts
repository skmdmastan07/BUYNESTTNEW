import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Retailer {
  id: string;
  email: string;
  shop_name: string;
  owner_name: string;
  region: string;
  categories: string[];
  created_at: string;
  weekly_streak: number;
  monthly_streak: number;
  total_spent: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  pack_size: string;
  stock: number;
  image_url: string;
  distributor: string;
  rating: number;
  moq: number;
  tags: string[];
  created_at: string;
}

export interface Order {
  id: string;
  retailer_id: string;
  products: { product_id: string; quantity: number; price: number }[];
  total_amount: number;
  status: 'pending' | 'confirmed' | 'delivered';
  created_at: string;
  discount_applied: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

// Check if we're in demo mode (missing Supabase credentials)
export const isDemoMode = supabaseUrl === 'https://demo.supabase.co' || supabaseAnonKey === 'demo-key';