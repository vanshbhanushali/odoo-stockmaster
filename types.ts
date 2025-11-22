export enum OperationType {
  RECEIPT = 'RECEIPT', // Incoming from Vendor
  DELIVERY = 'DELIVERY', // Outgoing to Customer
  INTERNAL = 'INTERNAL', // Warehouse to Warehouse / Rack to Rack
  ADJUSTMENT = 'ADJUSTMENT' // Correction
}

export enum OperationStatus {
  DRAFT = 'DRAFT',
  READY = 'READY',
  DONE = 'DONE',
  CANCELLED = 'CANCELLED'
}

export interface Location {
  id: string;
  name: string;
  type: 'VENDOR' | 'CUSTOMER' | 'INTERNAL' | 'INVENTORY_LOSS';
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  uom: string; // Unit of Measure
  stock: number;
  locationId: string; // Simplified: Primary location for this demo
  price: number;
}

export interface OperationLine {
  productId: string;
  productName: string; // Denormalized for display
  quantity: number;
}

export interface Operation {
  id: string;
  type: OperationType;
  reference: string; // e.g., WH/IN/001
  sourceLocationId: string;
  destLocationId: string;
  status: OperationStatus;
  date: string;
  lines: OperationLine[];
}

export interface AppState {
  products: Product[];
  operations: Operation[];
  locations: Location[];
}

export type ViewState = 'DASHBOARD' | 'PRODUCTS' | 'OPERATIONS_RECEIPT' | 'OPERATIONS_DELIVERY' | 'OPERATIONS_INTERNAL' | 'ADJUSTMENTS' | 'SETTINGS';
