import React, { useState } from 'react';
import { Operation, OperationType, OperationStatus, Product, Location } from '../types';
import { Plus, ArrowRight, CheckCircle, XCircle, Clock, Truck } from 'lucide-react';

interface OperationsListProps {
  type: OperationType;
  operations: Operation[];
  products: Product[];
  locations: Location[];
  onCreateOperation: (op: Operation) => void;
  onValidateOperation: (id: string) => void;
}

export const OperationsList: React.FC<OperationsListProps> = ({
  type,
  operations,
  products,
  locations,
  onCreateOperation,
  onValidateOperation
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New Operation State
  const [sourceId, setSourceId] = useState(type === OperationType.RECEIPT ? 'loc_vendor' : 'loc_wh_stock');
  const [destId, setDestId] = useState(type === OperationType.DELIVERY ? 'loc_customer' : 'loc_wh_stock');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [qty, setQty] = useState(1);

  const filteredOps = operations.filter(o => o.type === type);

  const getTitle = () => {
    switch (type) {
      case OperationType.RECEIPT: return 'Receipts';
      case OperationType.DELIVERY: return 'Delivery Orders';
      case OperationType.INTERNAL: return 'Internal Transfers';
      default: return 'Operations';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const product = products.find(p => p.id === selectedProduct);
    
    const newOp: Operation = {
      id: `op${Date.now()}`,
      type,
      reference: `WH/${type === OperationType.RECEIPT ? 'IN' : type === OperationType.DELIVERY ? 'OUT' : 'INT'}/${Date.now().toString().slice(-4)}`,
      sourceLocationId: sourceId,
      destLocationId: destId,
      status: OperationStatus.READY,
      date: new Date().toISOString().split('T')[0],
      lines: [{
        productId: selectedProduct,
        productName: product?.name || 'Unknown',
        quantity: qty
      }]
    };
    onCreateOperation(newOp);
    setIsModalOpen(false);
    setSelectedProduct('');
    setQty(1);
  };

  const getStatusColor = (status: OperationStatus) => {
     switch(status) {
       case OperationStatus.DONE: return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-800';
       case OperationStatus.READY: return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-800';
       case OperationStatus.CANCELLED: return 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
       default: return 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-800';
     }
  };

  return (
    <div className="h-full flex flex-col animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div className="hidden">
           <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{getTitle()}</h2>
           <p className="text-sm text-slate-500">Manage your {getTitle().toLowerCase()} here.</p>
        </div>
        <div className="w-full flex justify-end">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-odoo-action hover:bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            New {type === OperationType.RECEIPT ? 'Receipt' : type === OperationType.DELIVERY ? 'Delivery' : 'Transfer'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-auto pb-4">
        {filteredOps.map((op) => (
          <div key={op.id} className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start">
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white">{op.reference}</h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">{op.date}</span>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-bold border ${getStatusColor(op.status)}`}>
                {op.status}
              </span>
            </div>
            <div className="p-4 flex-1">
              <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300 mb-4">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400 uppercase">Source</span>
                  <span className="font-medium">{op.sourceLocationId}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                <div className="flex flex-col text-right">
                  <span className="text-xs text-slate-400 uppercase">Destination</span>
                  <span className="font-medium">{op.destLocationId}</span>
                </div>
              </div>
              <div className="space-y-2">
                {op.lines.map((line, idx) => (
                  <div key={idx} className="flex justify-between text-sm bg-slate-50 dark:bg-slate-800 p-2 rounded border border-transparent dark:border-slate-700">
                    <span className="text-slate-700 dark:text-slate-200">{line.productName}</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{line.quantity} units</span>
                  </div>
                ))}
              </div>
            </div>
            {op.status !== OperationStatus.DONE && op.status !== OperationStatus.CANCELLED && (
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  onClick={() => onValidateOperation(op.id)}
                  className="text-sm bg-odoo-500 hover:bg-odoo-600 text-white px-3 py-1.5 rounded shadow-sm flex items-center gap-1 transition-colors"
                >
                  <CheckCircle className="w-3 h-3" /> Validate
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in border border-slate-200 dark:border-slate-800">
            <div className="bg-slate-50 dark:bg-slate-800 px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <h3 className="font-semibold text-lg text-slate-800 dark:text-white">Create {getTitle().slice(0, -1)}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Source Location</label>
                  <select className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-900 dark:text-white" value={sourceId} onChange={e => setSourceId(e.target.value)}>
                    {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Dest Location</label>
                  <select className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-900 dark:text-white" value={destId} onChange={e => setDestId(e.target.value)}>
                    {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                  </select>
                </div>
              </div>
              
              <div className="border-t border-slate-100 dark:border-slate-700 pt-4">
                <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">Product Lines</h4>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <select 
                      required
                      className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-900 dark:text-white"
                      value={selectedProduct}
                      onChange={e => setSelectedProduct(e.target.value)}
                    >
                      <option value="">Select Product...</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock})</option>)}
                    </select>
                  </div>
                  <div className="w-24">
                    <input 
                      type="number" 
                      min="1" 
                      className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-900 dark:text-white" 
                      value={qty} 
                      onChange={e => setQty(parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 flex justify-end gap-3">
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
                  Create Draft
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};