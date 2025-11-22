import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ArrowLeftRight, 
  Settings, 
  LogOut, 
  Menu,
  Truck,
  ArrowDownLeft,
  ClipboardList,
  Search,
  Bell,
  ChevronLeft,
  Moon,
  Sun,
  User
} from 'lucide-react';
import { AppState, OperationType, ViewState, OperationStatus, Product, Operation, Location } from './types';
import { INITIAL_OPERATIONS, INITIAL_PRODUCTS, LOCATIONS } from './constants';
import { Dashboard } from './components/Dashboard';
import { ProductList } from './components/ProductList';
import { OperationsList } from './components/OperationsList';
import { AdjustmentsView } from './components/AdjustmentsView';
import { Auth } from './components/Auth';

const SidebarItem = ({ 
  icon, 
  label, 
  active, 
  onClick,
  collapsed 
}: { 
  icon: React.ReactNode; 
  label: string; 
  active: boolean; 
  onClick: () => void;
  collapsed: boolean;
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 transition-all duration-200 border-l-4
      ${active 
        ? 'bg-slate-800 border-odoo-500 text-white' 
        : 'border-transparent text-slate-400 hover:bg-slate-800 hover:text-slate-100'
      }
      ${collapsed ? 'justify-center px-2' : ''}
    `}
    title={collapsed ? label : ''}
  >
    <div className={`${collapsed ? 'w-6 h-6' : 'w-5 h-5'}`}>{icon}</div>
    {!collapsed && <span className="font-medium text-sm">{label}</span>}
  </button>
);

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Application State
  const [state, setState] = useState<AppState>({
    products: INITIAL_PRODUCTS,
    operations: INITIAL_OPERATIONS,
    locations: LOCATIONS
  });

  const [currentView, setCurrentView] = useState<ViewState>('DASHBOARD');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Handle Dark Mode Class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // --- Actions ---

  const handleAddProduct = (newProduct: Product) => {
    setState(prev => ({
      ...prev,
      products: [newProduct, ...prev.products]
    }));
  };

  const handleCreateOperation = (newOp: Operation) => {
    setState(prev => ({
      ...prev,
      operations: [newOp, ...prev.operations]
    }));
  };

  const handleValidateOperation = (opId: string) => {
    setState(prev => {
      const opIndex = prev.operations.findIndex(o => o.id === opId);
      if (opIndex === -1) return prev;

      const op = prev.operations[opIndex];
      if (op.status === OperationStatus.DONE) return prev;

      // Clone products to update stock
      const newProducts = [...prev.products];

      op.lines.forEach(line => {
        const productIndex = newProducts.findIndex(p => p.id === line.productId);
        if (productIndex > -1) {
          const product = { ...newProducts[productIndex] };
          
          const isSourceInternal = prev.locations.find(l => l.id === op.sourceLocationId)?.type === 'INTERNAL';
          const isDestInternal = prev.locations.find(l => l.id === op.destLocationId)?.type === 'INTERNAL';

          if (!isSourceInternal && isDestInternal) {
             product.stock += line.quantity;
             product.locationId = op.destLocationId;
          } else if (isSourceInternal && !isDestInternal) {
             product.stock -= line.quantity;
          } else if (isSourceInternal && isDestInternal) {
             product.locationId = op.destLocationId;
          }
          
          newProducts[productIndex] = product;
        }
      });

      const newOperations = [...prev.operations];
      newOperations[opIndex] = { ...op, status: OperationStatus.DONE };

      return {
        ...prev,
        products: newProducts,
        operations: newOperations
      };
    });
  };

  const handleAddLocation = (name: string) => {
    const newLocation: Location = {
      id: `loc_${Date.now()}`,
      name: name,
      type: 'INTERNAL'
    };
    setState(prev => ({
      ...prev,
      locations: [...prev.locations, newLocation]
    }));
  };

  const handleStockAdjustment = (productId: string, newStock: number, newLocationId: string) => {
    setState(prev => ({
      ...prev,
      products: prev.products.map(p => 
        p.id === productId 
          ? { ...p, stock: newStock, locationId: newLocationId }
          : p
      )
    }));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('DASHBOARD');
  };

  // --- Render ---

  if (!isAuthenticated) {
    return <Auth onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans transition-colors duration-300">
       {/* Fixed Top Navbar */}
       <header className="h-16 fixed top-0 left-0 right-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm z-50 flex items-center justify-between px-4 lg:px-6 transition-colors duration-300">
          {/* Left: Toggle & Brand */}
          <div className="flex items-center gap-4">
             <button
               onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
               className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
             >
               {sidebarCollapsed ? <Menu className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
             </button>
             <div className="flex items-center gap-2.5">
               <div className="w-9 h-9 bg-odoo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
                 SM
               </div>
               <span className="text-xl font-bold text-slate-800 dark:text-white tracking-tight hidden sm:block">StockMaster</span>
             </div>
          </div>

          {/* Center: Search (Visual only) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search operations, products..."
                className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-transparent focus:bg-white dark:focus:bg-slate-900 focus:border-odoo-500 dark:focus:border-odoo-500 focus:ring-2 focus:ring-odoo-100 dark:focus:ring-odoo-900 rounded-lg text-sm transition-all outline-none text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Right: Actions & Profile */}
          <div className="flex items-center gap-3 sm:gap-5">
             <button className="relative p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
             </button>
             <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
             <div className="flex items-center gap-3 pl-2">
                <div className="text-right hidden sm:block">
                   <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 leading-tight">Inventory Manager</p>
                   <p className="text-xs text-slate-500 dark:text-slate-400">Admin Workspace</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-odoo-100 dark:bg-slate-800 border border-odoo-200 dark:border-slate-700 flex items-center justify-center text-odoo-700 dark:text-odoo-400 font-bold text-sm cursor-pointer hover:bg-odoo-200 dark:hover:bg-slate-700 transition-colors">
                  IM
                </div>
             </div>
          </div>
       </header>

       {/* Main Layout Wrapper */}
       <div className="flex flex-1 pt-16 h-screen overflow-hidden">
          {/* Sidebar */}
          <aside className={`
             bg-slate-900 dark:bg-slate-950 text-slate-300 flex flex-col transition-all duration-300 ease-in-out z-40 border-r border-transparent dark:border-slate-800
             ${sidebarCollapsed ? 'w-16' : 'w-64'}
          `}>
             <nav className="flex-1 py-6 space-y-1 overflow-y-auto custom-scrollbar">
                <SidebarItem 
                  icon={<LayoutDashboard />} 
                  label="Dashboard" 
                  active={currentView === 'DASHBOARD'} 
                  onClick={() => setCurrentView('DASHBOARD')}
                  collapsed={sidebarCollapsed}
                />
                <SidebarItem 
                  icon={<Package />} 
                  label="Products" 
                  active={currentView === 'PRODUCTS'} 
                  onClick={() => setCurrentView('PRODUCTS')}
                  collapsed={sidebarCollapsed}
                />
                
                <div className={`px-4 py-2 text-xs font-bold text-slate-500 uppercase mt-6 mb-2 ${sidebarCollapsed ? 'hidden' : 'block'}`}>
                  Operations
                </div>
                
                <SidebarItem 
                  icon={<ArrowDownLeft />} 
                  label="Receipts" 
                  active={currentView === 'OPERATIONS_RECEIPT'} 
                  onClick={() => setCurrentView('OPERATIONS_RECEIPT')}
                  collapsed={sidebarCollapsed}
                />
                <SidebarItem 
                  icon={<Truck />} 
                  label="Deliveries" 
                  active={currentView === 'OPERATIONS_DELIVERY'} 
                  onClick={() => setCurrentView('OPERATIONS_DELIVERY')}
                  collapsed={sidebarCollapsed}
                />
                <SidebarItem 
                  icon={<ArrowLeftRight />} 
                  label="Internal Transfers" 
                  active={currentView === 'OPERATIONS_INTERNAL'} 
                  onClick={() => setCurrentView('OPERATIONS_INTERNAL')}
                  collapsed={sidebarCollapsed}
                />
                <SidebarItem 
                  icon={<ClipboardList />} 
                  label="Adjustments" 
                  active={currentView === 'ADJUSTMENTS'} 
                  onClick={() => setCurrentView('ADJUSTMENTS')}
                  collapsed={sidebarCollapsed}
                />
             </nav>

             {/* Bottom Settings/Logout */}
             <div className="p-4 border-t border-slate-800 space-y-1">
                <SidebarItem 
                  icon={<Settings />} 
                  label="Settings" 
                  active={currentView === 'SETTINGS'} 
                  onClick={() => setCurrentView('SETTINGS')}
                  collapsed={sidebarCollapsed}
                />
                <SidebarItem 
                  icon={<LogOut />} 
                  label="Logout" 
                  active={false} 
                  onClick={handleLogout}
                  collapsed={sidebarCollapsed}
                />
             </div>
          </aside>

          {/* Content Area */}
          <main className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-950 p-6 relative w-full transition-colors duration-300">
             {/* Page Title */}
             <div className="mb-6 animate-fade-in">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                   {currentView === 'DASHBOARD' ? 'Dashboard' :
                    currentView === 'PRODUCTS' ? 'Products' :
                    currentView === 'OPERATIONS_RECEIPT' ? 'Receipts' :
                    currentView === 'OPERATIONS_DELIVERY' ? 'Deliveries' :
                    currentView === 'OPERATIONS_INTERNAL' ? 'Internal Transfers' :
                    currentView === 'SETTINGS' ? 'Settings' : 'Adjustments & Warehouses'}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {currentView === 'DASHBOARD' ? 'Real-time overview of inventory performance.' :
                   currentView === 'PRODUCTS' ? 'Manage your product catalog and stock levels.' :
                   currentView === 'ADJUSTMENTS' ? 'Create warehouses and adjust stock levels.' :
                   currentView === 'SETTINGS' ? 'Configure system preferences.' :
                   'Manage stock movements and operations.'}
                </p>
             </div>
             
             {/* View Content */}
             {currentView === 'DASHBOARD' && <Dashboard state={state} />}
             {currentView === 'PRODUCTS' && (
                <ProductList 
                  products={state.products} 
                  onAddProduct={handleAddProduct} 
                />
             )}
             {currentView === 'OPERATIONS_RECEIPT' && (
                <OperationsList 
                  type={OperationType.RECEIPT}
                  operations={state.operations}
                  products={state.products}
                  locations={state.locations}
                  onCreateOperation={handleCreateOperation}
                  onValidateOperation={handleValidateOperation}
                />
             )}
             {currentView === 'OPERATIONS_DELIVERY' && (
                <OperationsList 
                  type={OperationType.DELIVERY}
                  operations={state.operations}
                  products={state.products}
                  locations={state.locations}
                  onCreateOperation={handleCreateOperation}
                  onValidateOperation={handleValidateOperation}
                />
             )}
             {currentView === 'OPERATIONS_INTERNAL' && (
                <OperationsList 
                  type={OperationType.INTERNAL}
                  operations={state.operations}
                  products={state.products}
                  locations={state.locations}
                  onCreateOperation={handleCreateOperation}
                  onValidateOperation={handleValidateOperation}
                />
             )}
             {currentView === 'ADJUSTMENTS' && (
                <AdjustmentsView 
                  locations={state.locations}
                  products={state.products}
                  onAddLocation={handleAddLocation}
                  onAdjustStock={handleStockAdjustment}
                />
             )}
             {currentView === 'SETTINGS' && (
                <div className="animate-fade-in space-y-6 max-w-3xl">
                  {/* Appearance Settings */}
                  <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 p-6 transition-colors">
                    <div className="flex items-center gap-2 mb-6">
                      <Settings className="w-5 h-5 text-odoo-600 dark:text-odoo-400" />
                      <h3 className="text-lg font-bold text-slate-800 dark:text-white">System Preferences</h3>
                    </div>
                    
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-lg transition-colors ${isDarkMode ? 'bg-slate-800' : 'bg-orange-50'}`}>
                             {isDarkMode ? <Moon className="w-6 h-6 text-slate-300" /> : <Sun className="w-6 h-6 text-orange-500" />}
                          </div>
                          <div>
                              <p className="font-semibold text-slate-800 dark:text-slate-200">Dark Mode</p>
                              <p className="text-sm text-slate-500 dark:text-slate-400">
                                {isDarkMode ? 'Switch to light mode for bright environments.' : 'Switch to dark mode for low-light environments.'}
                              </p>
                          </div>
                      </div>
                      <button
                          onClick={() => setIsDarkMode(!isDarkMode)}
                          className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-odoo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${isDarkMode ? 'bg-odoo-600' : 'bg-slate-300'}`}
                      >
                          <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-200 ${isDarkMode ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>
                  </div>

                  {/* User Settings Placeholder */}
                  <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 p-6 transition-colors opacity-70">
                     <div className="flex items-center gap-4">
                        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                           <User className="w-6 h-6 text-slate-500 dark:text-slate-400" />
                        </div>
                        <div>
                           <p className="font-semibold text-slate-800 dark:text-slate-200">Profile Settings</p>
                           <p className="text-sm text-slate-500 dark:text-slate-400">Manage your account details and password.</p>
                        </div>
                     </div>
                  </div>
                </div>
             )}
          </main>
       </div>
    </div>
  );
}