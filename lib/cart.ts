import { CartItem, Product } from './supabase';

export class CartService {
  static getCart(): CartItem[] {
    if (typeof window === 'undefined') return [];
    const cart = localStorage.getItem('buynestt_cart');
    return cart ? JSON.parse(cart) : [];
  }

  static addToCart(product: Product, quantity: number = 1) {
    const cart = this.getCart();
    const existingItem = cart.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ product, quantity });
    }

    localStorage.setItem('buynestt_cart', JSON.stringify(cart));
    return cart;
  }

  static removeFromCart(productId: string) {
    const cart = this.getCart();
    const updatedCart = cart.filter(item => item.product.id !== productId);
    localStorage.setItem('buynestt_cart', JSON.stringify(updatedCart));
    return updatedCart;
  }

  static updateQuantity(productId: string, quantity: number) {
    const cart = this.getCart();
    const item = cart.find(item => item.product.id === productId);
    if (item) {
      item.quantity = Math.max(0, quantity);
      if (item.quantity === 0) {
        return this.removeFromCart(productId);
      }
    }
    localStorage.setItem('buynestt_cart', JSON.stringify(cart));
    return cart;
  }

  static clearCart() {
    localStorage.removeItem('buynestt_cart');
    return [];
  }

  static getCartTotal(): number {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }

  static getCartCount(): number {
    const cart = this.getCart();
    return cart.reduce((count, item) => count + item.quantity, 0);
  }
}