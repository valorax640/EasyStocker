import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import colors from '../constants/colors';

import TransactionsHomeScreen from '../screens/TransactionsHomeScreen';
import PurchaseListScreen from '../screens/PurchaseListScreen';
import PurchaseFormScreen from '../screens/PurchaseFormScreen';
import SalesListScreen from '../screens/SalesListScreen';
import SalesFormScreen from '../screens/SalesFormScreen';

const Stack = createNativeStackNavigator();

const TransactionsNavigator = () => {
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
        name="TransactionsHome"
        component={TransactionsHomeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PurchaseList"
        component={PurchaseListScreen}
        options={{title: 'Purchase History'}}
      />
      <Stack.Screen
        name="PurchaseForm"
        component={PurchaseFormScreen}
        options={{title: 'New Purchase'}}
      />
      <Stack.Screen
        name="SalesList"
        component={SalesListScreen}
        options={{title: 'Sales History'}}
      />
      <Stack.Screen
        name="SalesForm"
        component={SalesFormScreen}
        options={{title: 'New Sale'}}
      />
    </Stack.Navigator>
  );
};

export default TransactionsNavigator;
