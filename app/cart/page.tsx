'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Truck, 
  CreditCard,
  Gift,
  ArrowRight
} from 'lucide-react';
import { CartService } from '@/lib/cart';
import { AuthService } from '@/lib/auth';
import { CartItem, Retailer } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '@/components/Layout';

const BULK_THRESHOLD = 2000;

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [user, setUser] = useState<Retailer | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCartItems(CartService.getCart());
    setUser(AuthService.getCurrentUser());
  }, []);

  const updateQuantity = (productId: string, quantity: number) => {
    const updatedCart = CartService.updateQuantity(productId, quantity);
    setCartItems(updatedCart);
    
    if (quantity === 0) {
      toast({
        title: "Removed from cart",
        description: "Item has been removed from your cart",
      });
    }
  };

  const removeItem = (productId: string) => {
    const updatedCart = CartService.removeFromCart(productId);
    setCartItems(updatedCart);
    toast({
      title: "Removed from cart",
      description: "Item has been removed from your cart",
    });
  };

  const clearCart = () => {
    const updatedCart = CartService.clearCart();
    setCartItems(updatedCart);
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
    });
  };

  const subtotal = cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const deliveryFee = subtotal >= BULK_THRESHOLD ? 0 : 50;
  
  // Calculate streak discounts
  let discountPercentage = 0;
  if (user) {
    if (user.weekly_streak >= 3) discountPercentage += 3;
    if (user.monthly_streak >= 3) discountPercentage += 2;
  }
  
  const streakDiscount = subtotal * (discountPercentage / 100);
  const total = subtotal - streakDiscount - appliedDiscount + deliveryFee;

  const applyPromoCode = () => {
    setLoading(true);
    setTimeout(() => {
      if (promoCode.toLowerCase() === 'save10') {
        setAppliedDiscount(subtotal * 0.1);
        toast({
          title: "Promo code applied!",
          description: "You saved 10% with SAVE10",
        });
      } else {
        toast({
          title: "Invalid code",
          description: "The promo code you entered is not valid",
          variant: "destructive",
        });
      }
      setLoading(false);
    }, 1000);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    
    setLoading(true);
    setTimeout(() => {
      CartService.clearCart();
      setCartItems([]);
      toast({
        title: "Order placed successfully!",
        description: "Your order has been confirmed and will be delivered soon.",
      });
      setLoading(false);
    }, 2000);
  };

  if (cartItems.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md mx-auto px-4"
          >
            <ShoppingCart className="h-24 w-24 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">
              Start adding some products to your cart to see them here
            </p>
            <Link href="/recommendations">
              <Button className="bg-buynestt-gold hover:bg-yellow-600 text-black">
                Browse Recommendations
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 font-cinzel mb-2">Shopping Cart</h1>
            <p className="text-gray-600">{cartItems.length} items in your cart</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card className="bg-white shadow-sm border-0">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Cart Items</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Clear All
                  </Button>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {cartItems.map((item, index) => (
                    <motion.div
                      key={item.product.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.product.image_url}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                        <p className="text-sm text-gray-600">{item.product.pack_size}</p>
                        <p className="text-lg font-bold text-gray-900">₹{item.product.price}</p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        
                        <span className="w-12 text-center font-semibold">{item.quantity}</span>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-gray-900">
                          ₹{(item.product.price * item.quantity).toLocaleString()}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.product.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 mt-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-white shadow-sm border-0 sticky top-24">
                <CardHeader>
                  <CardTitle className="text-lg">Order Summary</CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Delivery Status */}
                  {subtotal < BULK_THRESHOLD && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Truck className="h-5 w-5 text-blue-600" />
                        <span className="font-semibold text-blue-900">Free Delivery</span>
                      </div>
                      <p className="text-sm text-blue-700">
                        Add ₹{(BULK_THRESHOLD - subtotal).toLocaleString()} more for free delivery
                      </p>
                    </div>
                  )}

                  {subtotal >= BULK_THRESHOLD && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <Truck className="h-5 w-5 text-green-600" />
                        <span className="font-semibold text-green-900">🎉 Free delivery unlocked!</span>
                      </div>
                    </div>
                  )}

                  {/* Streak Discount */}
                  {user && discountPercentage > 0 && (
                    <div className="bg-buynestt-gold/10 border border-buynestt-gold/20 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Gift className="h-5 w-5 text-buynestt-gold" />
                        <span className="font-semibold text-buynestt-gold">Streak Discount</span>
                      </div>
                      <p className="text-sm text-gray-700">
                        {discountPercentage}% discount from your ordering streak!
                      </p>
                    </div>
                  )}

                  {/* Promo Code */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Promo Code
                    </label>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Enter code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        onClick={applyPromoCode}
                        disabled={loading || !promoCode}
                      >
                        Apply
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Try: SAVE10</p>
                  </div>

                  <Separator />

                  {/* Cost Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>₹{subtotal.toLocaleString()}</span>
                    </div>
                    
                    {streakDiscount > 0 && (
                      <div className="flex justify-between text-sm text-buynestt-gold">
                        <span>Streak Discount ({discountPercentage}%)</span>
                        <span>-₹{streakDiscount.toLocaleString()}</span>
                      </div>
                    )}
                    
                    {appliedDiscount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Promo Discount</span>
                        <span>-₹{appliedDiscount.toLocaleString()}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-sm">
                      <span>Delivery Fee</span>
                      <span>{deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    disabled={loading}
                    className="w-full bg-buynestt-gold hover:bg-yellow-600 text-black font-semibold py-3"
                  >
                    {loading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-black border-t-transparent rounded-full mr-2"
                      />
                    ) : (
                      <CreditCard className="mr-2 h-5 w-5" />
                    )}
                    {loading ? 'Processing...' : 'Checkout'}
                  </Button>

                  <Link href="/recommendations">
                    <Button variant="outline" className="w-full">
                      Continue Shopping
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}