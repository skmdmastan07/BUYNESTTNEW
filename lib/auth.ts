import { supabase, isDemoMode, Retailer } from './supabase';

// Demo user for when Supabase is not configured
const DEMO_USER: Retailer = {
  id: 'demo-user-1',
  email: 'demo@buynestt.test',
  shop_name: 'Corner Store Plus',
  owner_name: 'Rajesh Kumar',
  region: 'Mumbai Central',
  categories: ['Groceries', 'Snacks', 'Beverages'],
  created_at: new Date().toISOString(),
  weekly_streak: 2,
  monthly_streak: 3,
  total_spent: 45000,
};

export class AuthService {
  static async signIn(email: string, password: string) {
    if (isDemoMode) {
      // Demo mode authentication
      if (email === 'demo@buynestt.test' && password === 'password') {
        localStorage.setItem('buynestt_user', JSON.stringify(DEMO_USER));
        return { user: DEMO_USER, error: null };
      }
      return { user: null, error: { message: 'Invalid demo credentials' } };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return { user: null, error };

    // Fetch retailer profile
    const { data: retailer } = await supabase
      .from('retailers')
      .select('*')
      .eq('email', email)
      .single();

    return { user: retailer, error: null };
  }

  static async signUp(email: string, password: string, profile: Partial<Retailer>) {
    if (isDemoMode) {
      const newUser = {
        ...DEMO_USER,
        id: 'demo-user-' + Date.now(),
        email,
        ...profile,
        created_at: new Date().toISOString(),
      };
      localStorage.setItem('buynestt_user', JSON.stringify(newUser));
      return { user: newUser, error: null };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) return { user: null, error };

    // Create retailer profile
    const retailer = {
      id: data.user?.id,
      email,
      ...profile,
      weekly_streak: 0,
      monthly_streak: 0,
      total_spent: 0,
    };

    const { data: newRetailer, error: profileError } = await supabase
      .from('retailers')
      .insert(retailer)
      .select()
      .single();

    return { user: newRetailer, error: profileError };
  }

  static async signOut() {
    if (isDemoMode) {
      localStorage.removeItem('buynestt_user');
      localStorage.removeItem('buynestt_cart');
      return;
    }
    
    await supabase.auth.signOut();
  }

  static getCurrentUser(): Retailer | null {
    if (isDemoMode) {
      const user = localStorage.getItem('buynestt_user');
      return user ? JSON.parse(user) : null;
    }

    // In real implementation, this would fetch from Supabase
    return null;
  }

  static async resetPassword(email: string) {
    if (isDemoMode) {
      // Simulate password reset
      return { error: null };
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return { error };
  }
}