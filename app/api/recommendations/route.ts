import { NextRequest, NextResponse } from 'next/server';
import { DataService, CO_PURCHASE_MATRIX, generatePurchaseHistory } from '@/lib/data';

interface RecommendationResult {
  product_id: string;
  score: number;
  reason: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const retailerId = searchParams.get('retailerId') || 'demo-user-1';
    const type = searchParams.get('type') || 'all'; // 'frequent', 'trending', 'personalized', or 'all'

    const products = await DataService.getProducts();
    const purchaseHistory = generatePurchaseHistory();
    
    let recommendations: any[] = [];

    if (type === 'frequent' || type === 'all') {
      // Frequently bought again - based on purchase history
      const frequentItems = Object.entries(purchaseHistory)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 6)
        .map(([productId, count]) => {
          const product = products.find(p => p.id === productId);
          return product ? {
            ...product,
            reason: `Bought ${count} times before`
          } : null;
        })
        .filter(Boolean);

      if (type === 'frequent') {
        return NextResponse.json({ recommendations: frequentItems });
      }
      recommendations.push(...frequentItems.slice(0, 6));
    }

    if (type === 'trending' || type === 'all') {
      // Trending in category - high-rated new items
      const trending = products
        .filter(p => p.rating >= 4.0)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 6)
        .map(product => ({
          ...product,
          reason: `${product.rating}⭐ trending`
        }));

      if (type === 'trending') {
        return NextResponse.json({ recommendations: trending });
      }
      recommendations.push(...trending);
    }

    if (type === 'personalized' || type === 'all') {
      // Personalized recommendations using co-purchase matrix
      const personalizedRecs: RecommendationResult[] = [];
      
      // Get top purchased items
      const topPurchased = Object.entries(purchaseHistory)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3);

      for (const [productId] of topPurchased) {
        const coPurchases = CO_PURCHASE_MATRIX[productId] || {};
        
        for (const [coProductId, score] of Object.entries(coPurchases)) {
          const baseProduct = products.find(p => p.id === productId);
          personalizedRecs.push({
            product_id: coProductId,
            score,
            reason: `Pairs well with ${baseProduct?.name || 'your purchases'}`
          });
        }
      }

      // Sort by score and get unique recommendations
      const uniquePersonalized = personalizedRecs
        .sort((a, b) => b.score - a.score)
        .filter((item, index, arr) => arr.findIndex(x => x.product_id === item.product_id) === index)
        .slice(0, 6)
        .map(rec => {
          const product = products.find(p => p.id === rec.product_id);
          return product ? {
            ...product,
            reason: rec.reason
          } : null;
        })
        .filter(Boolean);

      if (type === 'personalized') {
        return NextResponse.json({ recommendations: uniquePersonalized });
      }
      recommendations.push(...uniquePersonalized);
    }

    return NextResponse.json({ 
      recommendations: recommendations.slice(0, 18) // Limit total results
    });

  } catch (error) {
    console.error('Recommendations API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}