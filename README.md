# Project Rembulan

The platform provides a seamless and branded experience for customers.
It allows them to browse the restaurant's unique menu,
customize their orders, manage their cart, and securely process payments.
Additionally, this application features an order history section,
making it easy for customers to track and reorder their favorite meals.

## Features

### 1. Menu Display
- Categorized Menu: Displays the restaurant's menu items organized into categories (e.g., appetizers, main courses, desserts).
- Detailed Item View: Each menu item includes a detailed view with a description, price, and image.
- Daily Specials: Highlight special items or promotions available for a limited time.
### 2. Order Customization
   - Customizable Orders: Allows customers to customize their orders, such as selecting portion sizes, adding extra toppings, or specifying special instructions.
   - Real-time Price Updates: Automatically updates the total price based on customizations and quantity changes.
### 3. Shopping Cart
   - Cart Management: Users can add, remove, or update items in their cart before checking out.
   - Summary View: The cart provides a summary of all items, including subtotal, taxes, and total amount.
   - Persistent Cart: Saves the cart contents for returning users, even if they leave and return later.
### 4. Secure Checkout
   - Payment Integration: Secure payment processing through Midtrans, supporting multiple payment methods (credit card, bank transfer, e-wallets).
   - Order Confirmation: Provides an order summary and confirmation before finalizing the purchase.
   - Receipt Generation: Sends a digital receipt to the user via email or in-app notification.
### 5. Order History
   - Past Orders: Users can view their past orders, including order details, payment status, and delivery or pickup times.
   - Reorder Function: A one-click reorder option for repeating previous orders.
### 6. User Account Management
   - User Registration/Login: Secure registration and login system using email and password.
   - Profile Management: Users can manage their personal information, including name, contact details, and delivery addresses.
   - Saved Payment Methods: Option to save payment details for faster checkout in the future.
### 7. Notifications
   - Order Status Updates: Real-time notifications for order confirmation, preparation, and delivery or pickup status.
   - Promotional Alerts: Sends notifications for special promotions, discounts, or new menu items.
### 8. Responsive Design
   - Mobile-Friendly: The application is fully responsive, ensuring a seamless experience across desktops, tablets, and smartphones.
   - Accessibility Features: Includes support for accessibility, such as keyboard navigation, screen reader compatibility, and high-contrast themes.


## Technologies Used

### Frontend
  - ReactJS: To build a responsive and dynamic user interface.
  - React Router: For smooth client-side routing across the menu, cart, and order history.
  - TypeScript: For enhanced code maintainability and type safety.
### Backend
  - Express: To manage server-side operations and API communication. 
  - TypeScript: For server-side development, ensuring robust and error-free code.

### Payment Gateway
  - Midtrans: For secure payment processing, offering various payment methods.

### Database:
  - PostgreSQL: To store menu items, user details, and order history.