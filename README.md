# EasyStocker - Offline Inventory Management App

A fully offline inventory management system built with React Native 0.80. 1.  No internet connection required, no permissions needed! 

## ✨ Features

### Core Features
- **Item Management**: Add, edit, delete items with price and stock tracking
- **Supplier Management**:  Manage supplier contacts and information
- **Customer Management**: Track customer details
- **Purchase Entry**: Record purchases with multiple items per transaction
- **Sales Entry**: Record sales with automatic stock deduction
- **Stock Management**: View current stock with low stock alerts
- **Stock Adjustment**: Manual stock corrections with reason tracking
- **Transaction History**: View complete purchase and sales history
- **Dashboard**: Real-time overview of today's and month's transactions

### Settings
- Currency symbol customization
- GST toggle (on/off)
- Optional PIN lock for security
- Clear all data option

### Storage
- 100% offline using AsyncStorage
- No backend required
- No internet connection needed
- No permissions required

## 📱 Requirements

- Node.js >= 18
- React Native 0.80.1
- iOS 13+ or Android 5.0+

## 🚀 Installation

### 1. Clone or Create Project

```bash
npx react-native@0.80.1 init EasyStocker
cd EasyStocker
```

### 2. Install Dependencies

```bash
npm install
```

Required packages (already in package.json):
```bash
npm install @react-navigation/native@^6.1.18
npm install @react-navigation/native-stack@^6.11.0
npm install react-native-safe-area-context@^4.12.0
npm install react-native-screens@^4.4.0
npm install @react-native-async-storage/async-storage@^2.1.0
```

### 3. iOS Setup (Mac only)

```bash
cd ios
pod install
cd ..
```

### 4. Run the App

**For Android:**
```bash
npm run android
```

**For iOS:**
```bash
npm run ios
```

## 📁 Project Structure

```
EasyStocker/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Header.jsx
│   │   ├── Input.jsx
│   │   ├── LoadingSpinner.jsx
│   │   └── Modal.jsx
│   ├── navigation/          # Navigation setup
│   │   └── AppNavigator.jsx
│   ├── screens/             # All app screens
│   │   ├── DashboardScreen.jsx
│   │   ├── ItemListScreen.jsx
│   │   ├── ItemFormScreen.jsx
│   │   ├── SupplierListScreen.jsx
│   │   ├── SupplierFormScreen.jsx
│   │   ├── CustomerListScreen.jsx
│   │   ├── CustomerFormScreen. jsx
│   │   ├── PurchaseListScreen.jsx
│   │   ├── PurchaseFormScreen.jsx
│   │   ├── SalesListScreen.jsx
│   │   ├── SalesFormScreen.jsx
│   │   ├── StockListScreen. jsx
│   │   ├── StockAdjustmentScreen.jsx
│   │   ├── SettingsScreen.jsx
│   │   └── LockScreen.jsx
│   ├── utils/               # Utility functions
│   │   ├── storage.js       # AsyncStorage operations
│   │   └── helpers.js       # Helper functions
│   ├── constants/           # App constants
│   │   └── colors.js        # Color palette
│   └── App.jsx              # Root component
├── android/                 # Android native code
├── ios/                     # iOS native code
├── index.js                 # App entry point
├── package.json             # Dependencies
└── README.md               # This file
```

## 🎯 Usage Guide

### First Time Setup
1. Launch the app
2. Start from Dashboard
3. Go to Settings to configure currency and GST

### Adding Items
1. Navigate to Items from Dashboard
2. Click "Add New Item"
3. Fill in item details (name, code, price, minimum stock)
4. Save

### Recording Purchases
1. Navigate to Purchase from Dashboard
2. Click "New Purchase"
3. Select supplier
4. Add items with quantities and prices
5. Stock automatically increases

### Recording Sales
1. Navigate to Sales from Dashboard
2. Click "New Sale"
3. Select customer
4. Add items (stock availability checked)
5. Stock automatically decreases

### Stock Adjustment
1. Navigate to Adjustment from Dashboard
2. Select item
3. Choose Add or Subtract
4. Enter quantity and reason
5. Save adjustment

### Setting PIN Lock
1. Go to Settings
2. Enter a 4+ digit PIN
3. Confirm PIN
4. App will require PIN on next launch

## 🔧 Troubleshooting

### Android Build Issues
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### iOS Build Issues
```bash
cd ios
pod deintegrate
pod install
cd ..
npm run ios
```

### Clear Metro Cache
```bash
npm start -- --reset-cache
```

## 🚫 What's NOT Included

- No PDF/Excel reports
- No cloud backup
- No multi-device sync
- No charts/graphs export
- No online features
- No user authentication (only local PIN)

## 📝 Data Storage

All data is stored locally on the device using AsyncStorage: 
- Items
- Suppliers
- Customers
- Purchases
- Sales
- Settings (including PIN)

**Warning**:  Uninstalling the app will delete all data permanently!

## 🎨 Customization

### Change Colors
Edit `src/constants/colors.js`

### Modify Features
All screens are in `src/screens/`
All components are in `src/components/`

## 📄 License

This project is open source and available for personal and commercial use.

## 🤝 Support

For issues or questions, please check: 
1. React Native documentation
2. React Navigation documentation
3. AsyncStorage documentation

## 🎉 Happy Stocking! 

Built with ❤️ using React Native 0.80.1