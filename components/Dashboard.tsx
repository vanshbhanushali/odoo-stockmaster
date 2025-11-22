import React from 'react';
import { AppState, OperationStatus, OperationType } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Package, AlertTriangle, ArrowDownLeft, ArrowUpRight, Truck, RefreshCw } from 'lucide-react';

interface DashboardProps {
  state: AppState;
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 flex items-center justify-between transition-colors">
    <div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{value}</h3>
    </div>
    <div className={`p-3 rounded-full ${color} bg-opacity-20`}>
      {icon}
    </div>
  </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ state }) => {
  const { products, operations } = state;

  const totalStock = products.reduce((acc, p) => acc + p.stock, 0);
  const lowStockCount = products.filter(p => p.stock < 10).length;
  const pendingReceipts = operations.filter(o => o.type === OperationType.RECEIPT && o.status !== OperationStatus.DONE && o.status !== OperationStatus.CANCELLED).length;
  const pendingDeliveries = operations.filter(o => o.type === OperationType.DELIVERY && o.status !== OperationStatus.DONE && o.status !== OperationStatus.CANCELLED).length;

  // Chart Data Preparation
  const categoryData = products.reduce((acc: any[], product) => {
    const existing = acc.find(i => i.name === product.category);
    if (existing) {
      existing.value += product.stock;
    } else {
      acc.push({ name: product.category, value: product.stock });
    }
    return acc;
  }, []);

  const COLORS = ['#00a09d', '#714b67', '#f59e0b', '#3b82f6', '#ef4444'];

  const operationStatusData = [
    { name: 'Receipts', value: pendingReceipts },
    { name: 'Deliveries', value: pendingDeliveries },
    { name: 'Internal', value: operations.filter(o => o.type === OperationType.INTERNAL && o.status === OperationStatus.READY).length }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Items in Stock"
          value={totalStock}
          icon={<Package className="w-6 h-6 text-odoo-500" />}
          color="bg-odoo-500"
        />
        <StatCard
          title="Low Stock Alerts"
          value={lowStockCount}
          icon={<AlertTriangle className="w-6 h-6 text-red-500" />}
          color="bg-red-500"
        />
        <StatCard
          title="Pending Receipts"
          value={pendingReceipts}
          icon={<ArrowDownLeft className="w-6 h-6 text-green-600" />}
          color="bg-green-600"
        />
        <StatCard
          title="Pending Deliveries"
          value={pendingDeliveries}
          icon={<Truck className="w-6 h-6 text-blue-500" />}
          color="bg-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Stock by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.3} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(248, 250, 252, 0.1)' }} 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: '#1e293b', color: '#fff' }} 
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Operations Overview</h3>
          <div className="h-64 flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={operationStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {operationStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', color: '#fff', border: 'none', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 text-sm text-slate-600 dark:text-slate-400 mt-2">
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-[#00a09d]"></div> Receipts</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-[#714b67]"></div> Deliveries</div>
             <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-[#f59e0b]"></div> Internal</div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
          <h3 className="font-semibold text-slate-800 dark:text-white">Recent Moves</h3>
          <button className="text-sm text-odoo-500 font-medium hover:underline">View All</button>
        </div>
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-900/50">
            <tr>
              <th className="px-6 py-3">Reference</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Source</th>
              <th className="px-6 py-3">Destination</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {operations.slice(0, 5).map((op) => (
              <tr key={op.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">{op.reference}</td>
                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{op.date}</td>
                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{op.sourceLocationId}</td>
                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{op.destLocationId}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                    ${op.status === 'DONE' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                      op.status === 'READY' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 
                      op.status === 'DRAFT' ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                    {op.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};