import { Product } from '@/data/products';

interface ProductDetailsModalProps {
  product: Product;
  onClose: () => void;
}

export default function ProductDetailsModal({ product, onClose }: ProductDetailsModalProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-64 object-cover"
            />
          </div>
        </div>
        
        <div className="md:w-2/3 space-y-4">
          <div>
            <h3 className="text-xl font-bold text-white">{product.name}</h3>
            <p className="text-gray-400">{product.id}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">Category</p>
              <p className="font-medium text-white">{product.category}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-400">Subcategory</p>
              <p className="font-medium text-white">{product.subcategory}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-400">Price</p>
              <p className="font-bold text-yellow-400">₹{product.price?.toLocaleString('en-IN')}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-400">Stock</p>
              <p className="font-medium text-white">{product.stock} units</p>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-400">Status</p>
            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
              product.inStock 
                ? 'bg-green-900/50 text-green-400 border border-green-800/50' 
                : 'bg-red-900/50 text-red-400 border border-red-800/50'
            }`}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
        </div>
      </div>
      
      <div>
        <p className="text-sm text-gray-400 mb-2">Description</p>
        <p className="text-white">{product.description}</p>
      </div>
      
      <div className="flex justify-end pt-4">
        <button
          onClick={onClose}
          className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-yellow-500/30"
        >
          Close
        </button>
      </div>
    </div>
  );
}