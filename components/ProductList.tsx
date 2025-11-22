import React, { useState } from 'react';
import { Product } from '../types';
import { PRODUCT_CATEGORIES } from '../constants';
import { Plus, Search, MoreHorizontal } from 'lucide-react';

interface ProductListProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
}

export const ProductList: React.FC<ProductListProps> = ({ products, onAddProduct }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    sku: '',
    category: '',
    uom: 'Units',
    stock: 0,
    price: 0,
    locationId: 'loc_wh_stock'
  });

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProduct.name && newProduct.sku) {
      onAddProduct({
        ...newProduct,
        id: `p${Date.now()}`,
      } as Product);
      setIsModalOpen(false);
      setNewProduct({ name: '', sku: '', category: '', uom: 'Units', stock: 0, price: 0, locationId: 'loc_wh_stock' });
    }
  };

  return (
    <div className="h-full flex flex-col animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white hidden">Products</h2>
        <div className="flex gap-3 w-full justify-end">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-odoo-500 focus:border-transparent w-64 text-slate-800 dark:text-white placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-odoo-500 hover:bg-odoo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Create
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-lg shadow border border-slate-200 dark:border-slate-800 flex-1 overflow-auto transition-colors">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-800/50 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">SKU</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3 text-right">Price</th>
              <th className="px-6 py-3 text-center">On Hand</th>
              <th className="px-6 py-3">UoM</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">{product.name}</td>
                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{product.sku}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs font-medium text-slate-600 dark:text-slate-300">
                    {product.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-slate-800 dark:text-slate-300">₹{product.price.toFixed(2)}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`font-bold ${product.stock < 10 ? 'text-red-500' : 'text-green-600 dark:text-green-400'}`}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{product.uom}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-400 hover:text-odoo-500 p-1">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in border border-slate-200 dark:border-slate-800">
            <div className="bg-slate-50 dark:bg-slate-800 px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <h3 className="font-semibold text-lg text-slate-800 dark:text-white">New Product</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Product Name</label>
                <input
                  required
                  type="text"
                  className="w-full p-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded focus:ring-2 focus:ring-odoo-500 outline-none dark:text-white"
                  value={newProduct.name}
                  onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">SKU</label>
                  <input
                    required
                    type="text"
                    className="w-full p-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded focus:ring-2 focus:ring-odoo-500 outline-none dark:text-white"
                    value={newProduct.sku}
                    onChange={e => setNewProduct({...newProduct, sku: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    className="w-full p-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded focus:ring-2 focus:ring-odoo-500 outline-none dark:text-white"
                    value={newProduct.category}
                    onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                  >
                    <option value="">Select Category</option>
                    {PRODUCT_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cost</label>
                  <input
                    type="number"
                    className="w-full p-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded focus:ring-2 focus:ring-odoo-500 outline-none dark:text-white"
                    value={newProduct.price}
                    onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Stock</label>
                  <input
                    type="number"
                    className="w-full p-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded focus:ring-2 focus:ring-odoo-500 outline-none dark:text-white"
                    value={newProduct.stock}
                    onChange={e => setNewProduct({...newProduct, stock: parseInt(e.target.value)})}
                  />
                </div>
                 <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">UoM</label>
                  <select
                    className="w-full p-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded focus:ring-2 focus:ring-odoo-500 outline-none dark:text-white"
                    value={newProduct.uom}
                    onChange={e => setNewProduct({...newProduct, uom: e.target.value})}
                  >
                    <option>Units</option>
                    <option>kg</option>
                    <option>m</option>
                    <option>Box</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-odoo-500 text-white rounded hover:bg-odoo-600 transition-colors shadow-sm"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};