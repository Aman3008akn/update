import { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { products as localProducts } from '@/data/products';
import { supabase } from '@/lib/supabase';
import ProductCard from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SlidersHorizontal, Star } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

export default function CatalogPage() {
  const { category } = useParams();
  const [products, setProducts] = useState<any[]>(localProducts);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase.from('products').select('*');
        if (!error && data) {
          const mappedProducts = data.map(p => ({
            ...p,
            inStock: p.in_stock,
            originalPrice: p.originalPrice || p.original_price
          }));
          setProducts(mappedProducts);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();

    // Enable Real-time Updates
    const channel = supabase
      .channel('public:products')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        (payload) => {
          console.log('Real-time change received!', payload);
          fetchProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [minRating, setMinRating] = useState(0);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  const categoryName = category?.split('-').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ') || 'All Products';

  // Extract unique values for filters
  const allSizes = Array.from(new Set(products.flatMap(p => p.size || [])));
  const allMaterials = Array.from(new Set(products.flatMap(p => p.material || [])));
  const allBrands = Array.from(new Set(products.map(p => p.brand).filter(Boolean))) as string[];

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(p => {
      if (category && category !== 'all') {
        const productCategory = p.category.toLowerCase().replace(/\s+/g, '-');
        if (productCategory !== category) return false;
      }
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      if (p.rating < minRating) return false;

      // Size filter
      if (selectedSizes.length > 0 && (!p.size || !p.size.some(s => selectedSizes.includes(s)))) return false;

      // Material filter
      if (selectedMaterials.length > 0 && (!p.material || !p.material.some(m => selectedMaterials.includes(m)))) return false;

      // Brand filter
      if (selectedBrands.length > 0 && (!p.brand || !selectedBrands.includes(p.brand))) return false;

      return true;
    });

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered = filtered.filter(p => p.badges?.includes('new'));
        break;
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return filtered;
  }, [category, sortBy, priceRange, minRating, selectedSizes, selectedMaterials, selectedBrands]);

  const FilterPanel = () => (
    <div className="space-y-8">
      {/* Price Range */}
      <div>
        <Label className="text-[#2C3E50] font-semibold mb-3 block">Price Range</Label>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          max={5000}
          step={100}
          className="mb-2"
        />
        <div className="flex justify-between text-sm text-gray-600">
          <span>₹{priceRange[0].toLocaleString('en-IN')}</span>
          <span>₹{priceRange[1].toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Rating */}
      <div>
        <Label className="text-[#2C3E50] font-semibold mb-3 block">Minimum Rating</Label>
        <div className="space-y-2">
          {[4, 4.5, 5].map(rating => (
            <div key={rating} className="flex items-center">
              <Checkbox
                id={`rating-${rating}`}
                checked={minRating === rating}
                onCheckedChange={(checked) => setMinRating(checked ? rating : 0)}
              />
              <Label htmlFor={`rating-${rating}`} className="ml-2 flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
                <span className="ml-2 text-sm">{rating}+ Stars</span>
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Size Filter */}
      <div>
        <Label className="text-[#2C3E50] font-semibold mb-3 block">Size</Label>
        <div className="space-y-2">
          {allSizes.map(size => (
            <div key={size} className="flex items-center">
              <Checkbox
                id={`size-${size}`}
                checked={selectedSizes.includes(size)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedSizes([...selectedSizes, size]);
                  } else {
                    setSelectedSizes(selectedSizes.filter(s => s !== size));
                  }
                }}
              />
              <Label htmlFor={`size-${size}`} className="ml-2 text-sm capitalize">
                {size}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Material Filter */}
      <div>
        <Label className="text-[#2C3E50] font-semibold mb-3 block">Material</Label>
        <div className="space-y-2">
          {allMaterials.map(material => (
            <div key={material} className="flex items-center">
              <Checkbox
                id={`material-${material}`}
                checked={selectedMaterials.includes(material)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedMaterials([...selectedMaterials, material]);
                  } else {
                    setSelectedMaterials(selectedMaterials.filter(m => m !== material));
                  }
                }}
              />
              <Label htmlFor={`material-${material}`} className="ml-2 text-sm capitalize">
                {material}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Brand Filter */}
      <div>
        <Label className="text-[#2C3E50] font-semibold mb-3 block">Brand</Label>
        <div className="space-y-2">
          {allBrands.map(brand => (
            <div key={brand} className="flex items-center">
              <Checkbox
                id={`brand-${brand}`}
                checked={selectedBrands.includes(brand)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedBrands([...selectedBrands, brand]);
                  } else {
                    setSelectedBrands(selectedBrands.filter(b => b !== brand));
                  }
                }}
              />
              <Label htmlFor={`brand-${brand}`} className="ml-2 text-sm">
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full bg-gradient-to-r from-[#F5C842] to-amber-500 text-[#2C3E50] font-bold hover:from-[#F5C842]/90 hover:to-amber-500/90"
        onClick={() => {
          setPriceRange([0, 5000]);
          setMinRating(0);
          setSelectedSizes([]);
          setSelectedMaterials([]);
          setSelectedBrands([]);
        }}
      >
        Reset All Filters
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7F9FC] to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Premium Header */}
        <div className="mb-8 bg-gradient-to-r from-[#2C3E50] to-[#1a2530] rounded-2xl p-1 shadow-xl">
          <div className="bg-gradient-to-r from-[#2C3E50] to-[#1a2530] rounded-xl p-6">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F5C842] to-amber-300 mb-2">
              {categoryName}
            </h1>
            <p className="text-gray-300">{filteredProducts.length} premium products found</p>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-[#2C3E50] mb-4 flex items-center">
                <SlidersHorizontal className="w-5 h-5 mr-2 text-[#F5C842]" />
                Premium Filters
              </h2>
              <FilterPanel />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Sort and Mobile Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="text-sm text-gray-600">
                Showing <span className="font-semibold">{filteredProducts.length}</span> products
              </div>

              <div className="flex gap-3">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>

                {/* Mobile Filter Button */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden">
                      <SlidersHorizontal className="w-4 h-4 mr-2" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <div className="mt-8">
                      <h2 className="text-xl font-bold text-[#2C3E50] mb-4 flex items-center">
                        <SlidersHorizontal className="w-5 h-5 mr-2 text-[#F5C842]" />
                        Premium Filters
                      </h2>
                      <FilterPanel />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-[#2C3E50] mb-2">No Products Found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters to see more products</p>
                <Button
                  className="bg-gradient-to-r from-[#F5C842] to-amber-500 text-[#2C3E50] font-bold hover:from-[#F5C842]/90 hover:to-amber-500/90"
                  onClick={() => {
                    setPriceRange([0, 5000]);
                    setMinRating(0);
                    setSelectedSizes([]);
                    setSelectedMaterials([]);
                    setSelectedBrands([]);
                  }}
                >
                  Reset All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}