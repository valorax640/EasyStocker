import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  ITEMS: 'items',
  SUPPLIERS: 'suppliers',
  CUSTOMERS: 'customers',
  PURCHASES: 'purchases',
  SALES: 'sales',
  SETTINGS: 'settings',
};

// Generic functions
export const saveData = async (key, data) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error saving ${key}:`, error);
    return false;
  }
};

export const getData = async (key) => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Error getting ${key}:`, error);
    return null;
  }
};

// Items
export const saveItems = async (items) => saveData(KEYS.ITEMS, items);
export const getItems = async () => {
  const items = await getData(KEYS. ITEMS);
  return items || [];
};

// Suppliers
export const saveSuppliers = async (suppliers) => saveData(KEYS.SUPPLIERS, suppliers);
export const getSuppliers = async () => {
  const suppliers = await getData(KEYS.SUPPLIERS);
  return suppliers || [];
};

// Customers
export const saveCustomers = async (customers) => saveData(KEYS.CUSTOMERS, customers);
export const getCustomers = async () => {
  const customers = await getData(KEYS.CUSTOMERS);
  return customers || [];
};

// Purchases
export const savePurchases = async (purchases) => saveData(KEYS. PURCHASES, purchases);
export const getPurchases = async () => {
  const purchases = await getData(KEYS.PURCHASES);
  return purchases || [];
};

// Sales
export const saveSales = async (sales) => saveData(KEYS.SALES, sales);
export const getSales = async () => {
  const sales = await getData(KEYS. SALES);
  return sales || [];
};

// Settings
export const saveSettings = async (settings) => saveData(KEYS. SETTINGS, settings);
export const getSettings = async () => {
  const settings = await getData(KEYS.SETTINGS);
  return settings || {currency: '$', gstEnabled: false, pin: null};
};

// Clear all data
export const clearAllData = async () => {
  try {
    await AsyncStorage.multiRemove([
      KEYS. ITEMS,
      KEYS. SUPPLIERS,
      KEYS. CUSTOMERS,
      KEYS. PURCHASES,
      KEYS. SALES,
      KEYS. SETTINGS,
    ]);
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
};