import { useState, useEffect } from 'react';

interface Product {
  id?: string;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  stock: number;
  inStock: boolean;
  image: string;
  description: string;
  size?: string[];
  material?: string[];
  brand?: string;
}

interface ProductFormProps {
  product?: Product;
  onSubmit: (product: Product) => void;
  onCancel: () => void;
}

// Available categories from the data file
const categories = [
  'Figurines',
  'Manga',
  'Posters',
  'Accessories',
  'Tech Gadgets',
  'Apparel',
  'Mystery Boxes',
];

// Common materials
const materials = [
  'PVC',
  'ABS Plastic',
  'Metal',
  'Fabric',
  'Paper',
  'Cotton',
  'Polyester',
  'TPU',
  'PC',
  'Neoprene',
  'Enamel',
  'Heat Resistant Fiber',
  'Various',
];

// Common sizes for different categories
const sizeOptions = {
  'Figurines': ['Small (10cm)', 'Medium (15cm)', 'Large (20cm)', 'Extra Large (25cm)', 'XXL (30cm)'],
  'Manga': ['Single Volume', 'Bundle (5 volumes)', 'Bundle (10 volumes)', 'Bundle (20 volumes)', 'Complete Set'],
  'Posters': ['A4 (210mm x 297mm)', 'A3 (297mm x 420mm)', 'A2 (420mm x 594mm)', 'A1 (594mm x 841mm)'],
  'Accessories': ['Small', 'Medium', 'Large', 'One Size Fits Most', 'Universal Fit'],
  'Tech Gadgets': ['Standard', 'Compact', 'Full Size', 'Mini', 'Universal'],
  'Apparel': ['S', 'M', 'L', 'XL', 'XXL'],
  'Mystery Boxes': ['Box (Various Items)'],
};

export default function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState<Product>({
    name: product?.name || '',
    category: product?.category || '',
    subcategory: product?.subcategory || '',
    price: product?.price || 0,
    stock: product?.stock || 0,
    inStock: product?.inStock !== undefined ? product.inStock : true,
    image: product?.image || '',
    description: product?.description || '',
    size: product?.size || [],
    material: product?.material || [],
    brand: product?.brand || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedSizes, setSelectedSizes] = useState<string[]>(product?.size || []);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>(product?.material || []);

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        price: product.price || 0,
        stock: product.stock || 0,
      });
      setSelectedSizes(product.size || []);
      setSelectedMaterials(product.material || []);
    }
  }, [product]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }
    
    if (formData.price <= 0) {
      newErrors.price = 'Price must be a positive number';
    }
    
    if (formData.stock < 0) {
      newErrors.stock = 'Stock cannot be negative';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'price' || name === 'stock') {
      setFormData(prev => ({
        ...prev,
        [name]: Number(value)
      }));
    } else if (name === 'inStock') {
      setFormData(prev => ({
        ...prev,
        inStock: (e.target as HTMLSelectElement).value === 'true'
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSizeChange = (size: string) => {
    const newSelectedSizes = selectedSizes.includes(size)
      ? selectedSizes.filter(s => s !== size)
      : [...selectedSizes, size];
    
    setSelectedSizes(newSelectedSizes);
    setFormData(prev => ({
      ...prev,
      size: newSelectedSizes
    }));
  };

  const handleMaterialChange = (material: string) => {
    const newSelectedMaterials = selectedMaterials.includes(material)
      ? selectedMaterials.filter(m => m !== material)
      : [...selectedMaterials, material];
    
    setSelectedMaterials(newSelectedMaterials);
    setFormData(prev => ({
      ...prev,
      material: newSelectedMaterials
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit({
        ...formData,
        id: product?.id || `prod-${Date.now()}`,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Product Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-gray-800 border ${
              errors.name ? 'border-red-500' : 'border-gray-700'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white placeholder-gray-500`}
            placeholder="Enter product name"
          />
          {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-gray-800 border ${
              errors.category ? 'border-red-500' : 'border-gray-700'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white`}
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          {errors.category && <p className="mt-1 text-sm text-red-400">{errors.category}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Subcategory</label>
          <input
            type="text"
            name="subcategory"
            value={formData.subcategory}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white placeholder-gray-500"
            placeholder="Enter subcategory"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Brand</label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white placeholder-gray-500"
            placeholder="Enter brand name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Price (₹) *</label>
          <input
            type="number"
            name="price"
            value={formData.price || ''}
            onChange={handleChange}
            min="0"
            step="0.01"
            className={`w-full px-4 py-3 bg-gray-800 border ${
              errors.price ? 'border-red-500' : 'border-gray-700'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white placeholder-gray-500`}
            placeholder="Enter price"
          />
          {errors.price && <p className="mt-1 text-sm text-red-400">{errors.price}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Stock *</label>
          <input
            type="number"
            name="stock"
            value={formData.stock || ''}
            onChange={handleChange}
            min="0"
            className={`w-full px-4 py-3 bg-gray-800 border ${
              errors.stock ? 'border-red-500' : 'border-gray-700'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white placeholder-gray-500`}
            placeholder="Enter stock quantity"
          />
          {errors.stock && <p className="mt-1 text-sm text-red-400">{errors.stock}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
          <select
            name="inStock"
            value={formData.inStock.toString()}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
          >
            <option value="true">In Stock</option>
            <option value="false">Out of Stock</option>
          </select>
        </div>
      </div>
      
      {/* Size Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Size Options</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {(sizeOptions[formData.category as keyof typeof sizeOptions] || 
            ['Small', 'Medium', 'Large', 'Extra Large', 'One Size Fits Most']).map(size => (
            <div key={size} className="flex items-center">
              <input
                type="checkbox"
                id={`size-${size}`}
                checked={selectedSizes.includes(size)}
                onChange={() => handleSizeChange(size)}
                className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-600 rounded bg-gray-700"
              />
              <label htmlFor={`size-${size}`} className="ml-2 text-sm text-gray-300">
                {size}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Material Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Materials</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {materials.map(material => (
            <div key={material} className="flex items-center">
              <input
                type="checkbox"
                id={`material-${material}`}
                checked={selectedMaterials.includes(material)}
                onChange={() => handleMaterialChange(material)}
                className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-600 rounded bg-gray-700"
              />
              <label htmlFor={`material-${material}`} className="ml-2 text-sm text-gray-300">
                {material}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Image URL</label>
        <input
          type="text"
          name="image"
          value={formData.image}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white placeholder-gray-500"
          placeholder="Enter image URL"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white placeholder-gray-500"
          placeholder="Enter product description"
        />
      </div>
      
      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-all duration-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-yellow-500/30"
        >
          {product ? 'Update Product' : 'Save Product'}
        </button>
      </div>
    </form>
  );
}