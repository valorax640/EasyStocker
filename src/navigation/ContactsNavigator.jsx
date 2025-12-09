import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import colors from '../constants/colors';

import SupplierListScreen from '../screens/SupplierListScreen';
import SupplierFormScreen from '../screens/SupplierFormScreen';
import CustomerListScreen from '../screens/CustomerListScreen';
import CustomerFormScreen from '../screens/CustomerFormScreen';

const Stack = createNativeStackNavigator();

const ContactsNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.white,
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
        headerShadowVisible: true,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen
        name="SupplierList"
        component={SupplierListScreen}
        options={{title: 'Suppliers'}}
      />
      <Stack.Screen
        name="SupplierForm"
        component={SupplierFormScreen}
        options={{title: 'Supplier Details'}}
      />
      <Stack.Screen
        name="CustomerList"
        component={CustomerListScreen}
        options={{title: 'Customers'}}
      />
      <Stack.Screen
        name="CustomerForm"
        component={CustomerFormScreen}
        options={{title: 'Customer Details'}}
      />
    </Stack.Navigator>
  );
};

export default ContactsNavigator;
