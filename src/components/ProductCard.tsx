import { Product } from '@/types/database';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ShoppingCart, Package, Star } from 'lucide-react';
import { useProducts } from '@/contexts/ProductContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useProducts();
  
  const displayImage = (product.images && product.images.length > 0 
    ? product.images[0] 
    : product.image_url) || null;

  const formatImageUrl = (url?: string | null) => {
    if (!url) return '/placeholder.svg';
    try {
      const u = new URL(url);
      if (u.hostname.includes('images.unsplash.com')) {
        if (!u.searchParams.has('auto')) {
          u.searchParams.set('auto', 'format');
          u.searchParams.set('fit', 'crop');
          u.searchParams.set('w', '800');
          u.searchParams.set('q', '80');
        }
        return u.toString();
      }
      return url;
    } catch {
      return url || '/placeholder.svg';
    }
  };

  const imgSrc = formatImageUrl(displayImage);
  
  const originalPrice = product.discount > 0 
    ? (Number(product.price) / (1 - product.discount / 100)).toFixed(2)
    : null;

  return (
    <Card className="group overflow-hidden border-2 hover:border-primary/50 hover:shadow-2xl transition-all duration-500 bg-card h-full flex flex-col">
      <div className="relative aspect-square bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center overflow-hidden">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={`${product.name} - ${product.category}`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg';
              e.currentTarget.onerror = null;
            }}
          />
        ) : (
          <Package className="w-16 h-16 text-muted-foreground group-hover:scale-110 transition-transform duration-300" />
        )}
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {product.discount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute top-3 right-3 bg-destructive text-destructive-foreground font-bold text-sm px-3 py-1 shadow-lg animate-pulse"
          >
            -{product.discount}% OFF
          </Badge>
        )}
        {product.is_alcoholic && (
          <Badge variant="secondary" className="absolute top-3 left-3 font-semibold shadow-md">
            21+
          </Badge>
        )}
        
        {product.stock_quantity <= 10 && product.stock_quantity > 0 && (
          <Badge className="absolute bottom-3 left-3 bg-amber-500 text-white">
            Only {product.stock_quantity} left
          </Badge>
        )}
      </div>
      
      <div className="p-5 space-y-3 flex-1 flex flex-col">
        <div className="flex-1">
          <h3 className="font-bold text-lg line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          
          {product.rating > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <Star className="w-4 h-4 fill-[hsl(var(--rating-star))] text-[hsl(var(--rating-star))]" />
              <span className="text-sm font-semibold">{product.rating.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground ml-1">(4.5k reviews)</span>
            </div>
          )}
          
          {product.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}
        </div>
        
        <div className="space-y-3 pt-3 border-t">
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              ₹{Number(product.price).toFixed(2)}
            </p>
            {originalPrice && (
              <div className="flex items-center gap-1">
                <p className="text-sm text-muted-foreground line-through">
                  ₹{originalPrice}
                </p>
                <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                  Save ₹{(Number(originalPrice) - Number(product.price)).toFixed(0)}
                </Badge>
              </div>
            )}
          </div>
          
          <Button
            onClick={() => addToCart(product)}
            disabled={product.stock_quantity <= 0}
            className="w-full group-hover:scale-105 transition-transform font-semibold"
            size="lg"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {product.stock_quantity <= 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </div>
      </div>
    </Card>
  );
};
