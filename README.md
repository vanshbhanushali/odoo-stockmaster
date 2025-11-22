# StockMaster IMS

StockMaster IMS is a modular Inventory Management System designed to digitize and streamline stock operations. It features product management, stock movements (Receipts, Deliveries, Internal Transfers), and adjustments, all within an intuitive and responsive interface.

## Features

- **Dashboard**: Real-time overview of inventory performance.
- **Product Management**: Add, edit, and manage products with categories, stock levels, and pricing.
- **Stock Operations**:
  - **Receipts**: Manage incoming stock from vendors.
  - **Deliveries**: Track outgoing stock to customers.
  - **Internal Transfers**: Move stock between warehouses or locations.
  - **Adjustments**: Correct inventory levels and manage warehouses.
- **Dark Mode**: Toggle between light and dark themes for better usability.
- **Authentication**: Secure login and user management.

## How to Run the Project

1. **Clone the Repository**:

   ```sh
   git clone <repository-url>
   cd stockmaster-ims

2. **Install Dependencies:**:

   ```sh
   npm install


  
3. **Set Environment Variables: Create a .env.local file in the root directory and add the following**:

   ```sh
   GEMINI_API_KEY=your_api_key_here

4. **Start the Development Server**:

   ```sh
   npm ren dev


5. Access the Application: Open your browser and navigate to <http://localhost:3000>.

How to Review the Project

1. Explore the Dashboard:
   View real-time stats on inventory, low stock alerts, and pending operations.

2. Test Product Management:
   Add new products, search for existing ones, and view product details.

3. Simulate Stock Operations:
   Create and validate Receipts, Deliveries, and Internal Transfers.
   Adjust stock levels and manage warehouses.

4. Switch Themes:
   Toggle between light and dark modes to test the UI responsiveness.

5. Authentication:
   Test the login and signup flows, including OTP verification and password reset.

*Project Structure*
App.tsx: Main application logic and state management.
components: Modular React components for different views (Dashboard, ProductList, etc.).
constants.ts: Initial data and constants for the app.
types.ts: TypeScript types and enums for the app's data models.
vite.config.ts: Vite configuration for development and build.

demo video:
