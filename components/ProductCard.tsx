'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Plus, Package, CircleAlert as AlertCircle } from 'lucide-react';
import { Product } from '@/lib/supabase';
import { CartService } from '@/lib/cart';
import { toast } from '@/hooks/use-toast';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
  reason?: string;
  onQuickView?: (product: Product) => void;
}

export default function ProductCard({ product, reason, onQuickView }: ProductCardProps) {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    CartService.addToCart(product, 1);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  const getStockStatus = () => {
    if (product.stock === 0) return { label: 'Out of Stock', color: 'destructive' };
    if (product.stock < 10) return { label: 'Low Stock', color: 'secondary' };
    return { label: 'In Stock', color: 'default' };
  };

  const stockStatus = getStockStatus();

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="w-full"
    >
      <Card 
        className="h-full cursor-pointer bg-white hover:shadow-xl transition-all duration-300 rounded-lg overflow-hidden border-0 shadow-md"
        onClick={() => onQuickView?.(product)}
      >
        <div className="relative">
          <div className="aspect-square relative overflow-hidden bg-gray-100">
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          
          {reason && (
            <div className="absolute top-2 left-2 z-10">
              <Badge variant="secondary" className="bg-buynestt-gold/90 text-black text-xs">
                {reason}
              </Badge>
            </div>
          )}
          
          <div className="absolute top-2 right-2 z-10">
            <Badge 
              variant={stockStatus.color as any}
              className={`text-xs ${stockStatus.color === 'destructive' ? 'bg-red-100 text-red-800' : stockStatus.color === 'secondary' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}
            >
              {stockStatus.label}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">
              {product.name}
            </h3>
            <p className="text-sm text-gray-600">{product.pack_size}</p>
          </div>

          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(product.rating)
                    ? 'fill-buynestt-gold text-buynestt-gold'
                    : 'text-gray-300'
                }`}
              />
            ))}
            <span className="text-xs text-gray-600 ml-1">({product.rating})</span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                ₹{product.price}
              </p>
              <p className="text-xs text-gray-500">MOQ: {product.moq} units</p>
            </div>
            
            <div className="flex items-center space-x-1">
              <Package className="h-3 w-3 text-gray-500" />
              <span className="text-xs text-gray-600">{product.stock}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-gray-500 truncate flex-1">
              by {product.distributor}
            </p>
            
            <Button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              size="sm"
              className="bg-buynestt-gold hover:bg-yellow-600 text-black font-semibold px-3"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>

          {product.stock < product.moq && product.stock > 0 && (
            <div className="flex items-center space-x-1 text-xs text-orange-600 bg-orange-50 p-2 rounded">
              <AlertCircle className="h-3 w-3" />
              <span>Stock below MOQ</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}