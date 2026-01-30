# Trading Platform Frontend - Complete Implementation

## Project Structure

```
src/
├── api/                 # API service files
│   ├── auth.api.js     # Login/Signup API calls
│   ├── stocks.api.js   # Stock fetching & searching
│   ├── trade.api.js    # Buy/Sell orders & Portfolio
│   ├── wallet.api.js   # Wallet operations
│   └── axios.js        # Axios instance with token auth
├── pages/              # Page components
│   ├── Auth/
│   │   ├── Login.jsx   # Login page with validation
│   │   ├── Signup.jsx  # Signup page with validation
│   │   └── Auth.css    # Auth styles
│   ├── Dashboard.jsx   # Portfolio & wallet dashboard
│   ├── Stocks.jsx      # Stock listing & search
│   └── Trade.jsx       # Buy/Sell trading page
├── context/
│   └── AuthContext.jsx # Global auth state management
├── components/
│   └── ProtectedRoute.jsx # Protected route wrapper
├── utils/
│   └── validation.js   # Form validation utilities
├── styles/             # Global & page styles
│   ├── Dashboard.css   # Dashboard styling
│   ├── Trade.css       # Trade page styling
│   ├── global.css      # Global styles
│   └── variable.css    # CSS variables (if needed)
├── App.jsx            # Main app with routing
├── App.css            # App styles
└── main.jsx           # Entry point

```

## Features Implemented

### 1. Authentication
- **Login Page** (`/login`)
  - Email & password validation
  - Error handling for invalid credentials
  - Token-based authentication
  - Navigate to dashboard on success

- **Signup Page** (`/signup`)
  - Full validation (name, email, mobile, password)
  - Phone number must be 10 digits
  - Password confirmation matching
  - Server error handling
  - Redirect to login on success

### 2. Protected Routes
- All pages except `/login` and `/signup` require authentication
- Token stored in localStorage
- Automatic redirect to login if not authenticated

### 3. Dashboard (`/dashboard`)
- **Portfolio Overview**
  - Current portfolio holdings with details
  - Unrealized P&L calculations
  - Realized P&L from completed trades
  - Live price updates

- **Statistics Cards**
  - Total portfolio value
  - Unrealized P&L (positive/negative)
  - Realized P&L

- **Portfolio Table**
  - Symbol, Quantity, Avg Price, Current Price
  - Current Value, Unrealized P&L, Return %
  - Color-coded gains/losses

- **Wallet Management**
  - Add funds modal
  - Deposit amount validation
  - Real-time balance updates

### 4. Stocks Market (`/stocks`)
- **Stock Listing**
  - Display all available stocks
  - Search functionality (by symbol or name)
  - Click to select and view details

- **Stock Details**
  - Current price with live updates
  - Open, High, Low prices
  - Volume information
  - Price change and percentage change
  - Color-coded positive/negative changes

- **Trade Button**
  - Navigate to trade page for selected stock

### 5. Trading Page (`/trade`)
- **Buy/Sell Toggle**
  - Switch between buy and sell modes
  - Visual indicator of active mode

- **Order Form**
  - Quantity input with validation
  - Real-time total cost calculation
  - Sufficient balance validation

- **Order Summary**
  - Price per unit
  - Quantity
  - Total amount

- **Validation**
  - Minimum quantity check
  - Sufficient balance check (for buy)
  - Sufficient holding quantity check (for sell)
  - Real-time error messages

- **Success Feedback**
  - Confirmation message
  - Auto-redirect to dashboard

## Validation Rules

### Login Form
- Email: Required, valid email format
- Password: Required, minimum 6 characters

### Signup Form
- Name: Required, minimum 2 characters
- Email: Required, valid email format
- Mobile: Required, exactly 10 digits
- Password: Required, minimum 6 characters
- Confirm Password: Must match password field

### Trade Form
- Symbol: Required
- Quantity: Required, positive integer
- Buy: Wallet balance must be sufficient
- Sell: Must have sufficient quantity in portfolio

## API Integration

All API calls are made through the `api/` folder with proper error handling:

- **Auth**: Login, Register
- **Stocks**: Get all stocks, Get stock quote, Search stocks
- **Trade**: Buy stock, Sell stock, Get portfolio, Get portfolio details, Get realized PnL
- **Wallet**: Initialize wallet, Credit, Debit, Get balance

## Security Features

- JWT token stored in localStorage
- Token automatically added to all API requests via axios interceptor
- Protected routes check for token existence
- Auto-logout on missing token

## Styling

- **Color Scheme**: Dark theme with neon accents
  - Primary Background: #1a202c (slate-900)
  - Cards: #2d3748 (slate-800)
  - Text: #f1f5f9 (slate-100)
  - Accents: #00f6ff (neon-blue), #39ff14 (neon-green)
  - Errors: #ff4444 (red)

- **Responsive Design**: Mobile-friendly layouts
- **Smooth Transitions**: Hover effects and animations

## How to Run

```bash
cd client
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`

## Backend Connection

The frontend connects to the backend running on `http://localhost:5000`

All API endpoints are configured in `src/api/axios.js`

## Environment Variables (if needed)

Create a `.env` file in the client directory:
```
VITE_API_URL=http://localhost:5000
```

## Pages Flow

```
/ → /login → (Authenticate) → /dashboard
                ↓
           /signup (New User)
                ↓
             /login

From Dashboard:
→ /stocks (View all stocks)
  → /trade (Buy/Sell stocks)
    → /dashboard (View results)

→ /logout → /login
```

## Key Components Details

### AuthContext
- Manages user authentication state
- Provides login, signup, logout methods
- Token management
- Error handling

### ProtectedRoute
- Checks for token in localStorage
- Redirects to login if not authenticated
- Wraps protected pages

### Validation Utils
- Email validation (regex)
- Phone validation (10 digits)
- Password validation (min 6 chars)
- Form-specific validators
- Error message generation

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

Modern browsers with ES6+ support required.
