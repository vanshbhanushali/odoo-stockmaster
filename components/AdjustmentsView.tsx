import React, { useState } from 'react';
import { Location, Product } from '../types';
import { Warehouse, Plus, Save, MapPin, Package, Search } from 'lucide-react';

interface AdjustmentsViewProps {
  locations: Location[];
  products: Product[];
  onAddLocation: (name: string) => void;
  onAdjustStock: (productId: string, newStock: number, newLocationId: string) => void;
}

export const AdjustmentsView: React.FC<AdjustmentsViewProps> = ({ 
  locations, 
  products, 
  onAddLocation,
  onAdjustStock
}) => {
  const [isWarehouseModalOpen, setIsWarehouseModalOpen] = useState(false);
  const [newWarehouseName, setNewWarehouseName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Adjustment State
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editStock, setEditStock] = useState<number>(0);
  const [editLocation, setEditLocation] = useState<string>('');

  const internalLocations = locations.filter(l => l.type === 'INTERNAL');
  
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateWarehouse = (e: React.FormEvent) => {
    e.preventDefault();
    if (newWarehouseName.trim()) {
      onAddLocation(newWarehouseName);
      setNewWarehouseName('');
      setIsWarehouseModalOpen(false);
    }
  };

  const startEdit = (product: Product) => {
    setEditingProductId(product.id);
    setEditStock(product.stock);
    setEditLocation(product.locationId);
  };

  const saveEdit = () => {
    if (editingProductId) {
      onAdjustStock(editingProductId, editStock, editLocation);
      setEditingProductId(null);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      
      {/* --- Warehouse Management Section --- */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Warehouse className="w-5 h-5 text-odoo-600 dark:text-odoo-400" />
              Warehouses & Locations
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Manage your physical storage locations.</p>
          </div>
          <button 
            onClick={() => setIsWarehouseModalOpen(true)}
            className="bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Warehouse
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {internalLocations.map(loc => (
            <div key={loc.id} className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                  <Warehouse className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono text-slate-400">{loc.id}</span>
              </div>
              <h4 className="font-semibold text-slate-800 dark:text-slate-200">{loc.name}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {products.filter(p => p.locationId === loc.id).length} Products Stored
              </p>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-slate-200 dark:border-slate-800" />

      {/* --- Stock Adjustments Section --- */}
      <section className="flex flex-col h-[500px]">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-odoo-600 dark:text-odoo-400" />
              Stock Adjustments
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Correct inventory levels or move products manually.</p>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search product..." 
              className="pl-9 pr-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-odoo-500 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm flex-1 overflow-hidden flex flex-col transition-colors">
          <div className="overflow-auto flex-1">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-800/50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3">Product</th>
                  <th className="px-6 py-3">Current Location</th>
                  <th className="px-6 py-3 text-center">Current Stock</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredProducts.map(product => (
                  <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 group transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{product.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{product.sku}</div>
                    </td>
                    
                    {editingProductId === product.id ? (
                      <>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            <select 
                              className="p-1 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 w-full dark:text-white"
                              value={editLocation}
                              onChange={(e) => setEditLocation(e.target.value)}
                            >
                              {internalLocations.map(l => (
                                <option key={l.id} value={l.id}>{l.name}</option>
                              ))}
                            </select>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                           <input 
                              type="number" 
                              className="w-20 p-1 border border-slate-300 dark:border-slate-700 rounded text-center mx-auto block bg-white dark:bg-slate-800 dark:text-white"
                              value={editStock}
                              onChange={(e) => setEditStock(parseInt(e.target.value))}
                           />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => setEditingProductId(null)}
                              className="px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"
                            >
                              Cancel
                            </button>
                            <button 
                              onClick={saveEdit}
                              className="px-3 py-1 text-xs font-medium bg-odoo-500 text-white hover:bg-odoo-600 rounded flex items-center gap-1"
                            >
                              <Save className="w-3 h-3" /> Apply
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                          {locations.find(l => l.id === product.locationId)?.name || product.locationId}
                        </td>
                        <td className="px-6 py-4 text-center font-mono">
                          <span className={product.stock < 10 ? 'text-red-600 dark:text-red-400 font-bold' : 'text-slate-700 dark:text-slate-300'}>
                            {product.stock}
                          </span> <span className="text-slate-500 dark:text-slate-500">{product.uom}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => startEdit(product)}
                            className="text-odoo-action font-medium hover:underline text-xs"
                          >
                            Adjust
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Modal for New Warehouse */}
      {isWarehouseModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in border border-slate-200 dark:border-slate-800">
            <div className="bg-slate-50 dark:bg-slate-800 px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <h3 className="font-semibold text-lg text-slate-800 dark:text-white">Create Warehouse</h3>
              <button onClick={() => setIsWarehouseModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">&times;</button>
            </div>
            <form onSubmit={handleCreateWarehouse} className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Warehouse Name</label>
                <input 
                  autoFocus
                  type="text" 
                  className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-odoo-500 focus:border-transparent outline-none bg-white dark:bg-slate-900 dark:text-white"
                  placeholder="e.g., West Coast Distribution"
                  value={newWarehouseName}
                  onChange={(e) => setNewWarehouseName(e.target.value)}
                  required
                />
                <p className="text-xs text-slate-400 mt-2">This will be created as an Internal Location.</p>
              </div>
              <div className="flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsWarehouseModalOpen(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-odoo-500 text-white rounded hover:bg-odoo-600 transition-colors shadow-sm"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};