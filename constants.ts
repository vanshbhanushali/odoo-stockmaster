import { AppState, Location, OperationStatus, OperationType, Product, Operation } from './types';

export const PRODUCT_CATEGORIES = [
  'Hardware',
  'Raw Material',
  'Consumable',
  'Furniture',
  'Accessories'
];

export const LOCATIONS: Location[] = [
  { id: 'loc_vendor', name: 'Vendors', type: 'VENDOR' },
  { id: 'loc_customer', name: 'Customers', type: 'CUSTOMER' },
  { id: 'loc_wh_stock', name: 'WH/Stock', type: 'INTERNAL' },
  { id: 'loc_wh_pack', name: 'WH/Packing Zone', type: 'INTERNAL' },
  { id: 'loc_wh_input', name: 'WH/Input', type: 'INTERNAL' },
  { id: 'loc_loss', name: 'Inventory Loss', type: 'INVENTORY_LOSS' },
];

export const INITIAL_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Steel Rods 10mm', sku: 'ST-1001', category: 'Raw Material', uom: 'Units', stock: 150, locationId: 'loc_wh_stock', price: 12.50 },
  { id: 'p2', name: 'Office Chair', sku: 'FURN-001', category: 'Furniture', uom: 'Units', stock: 45, locationId: 'loc_wh_stock', price: 85.00 },
  { id: 'p3', name: 'Bolt M4', sku: 'HDW-022', category: 'Hardware', uom: 'Box', stock: 500, locationId: 'loc_wh_stock', price: 0.50 },
  { id: 'p4', name: 'Red Paint', sku: 'PNT-RED', category: 'Consumable', uom: 'Liters', stock: 20, locationId: 'loc_wh_stock', price: 18.00 },
  { id: 'p5', name: 'Laptop Stand', sku: 'ACC-LAP', category: 'Accessories', uom: 'Units', stock: 0, locationId: 'loc_wh_stock', price: 25.00 },
];

export const INITIAL_OPERATIONS: Operation[] = [
  {
    id: 'op1',
    type: OperationType.RECEIPT,
    reference: 'WH/IN/0001',
    sourceLocationId: 'loc_vendor',
    destLocationId: 'loc_wh_stock',
    status: OperationStatus.DONE,
    date: '2023-10-25',
    lines: [{ productId: 'p1', productName: 'Steel Rods 10mm', quantity: 50 }]
  },
  {
    id: 'op2',
    type: OperationType.DELIVERY,
    reference: 'WH/OUT/0001',
    sourceLocationId: 'loc_wh_stock',
    destLocationId: 'loc_customer',
    status: OperationStatus.READY,
    date: '2023-10-26',
    lines: [{ productId: 'p2', productName: 'Office Chair', quantity: 5 }]
  },
  {
    id: 'op3',
    type: OperationType.INTERNAL,
    reference: 'WH/INT/0001',
    sourceLocationId: 'loc_wh_stock',
    destLocationId: 'loc_wh_pack',
    status: OperationStatus.DRAFT,
    date: '2023-10-27',
    lines: [{ productId: 'p3', productName: 'Bolt M4', quantity: 100 }]
  }
];