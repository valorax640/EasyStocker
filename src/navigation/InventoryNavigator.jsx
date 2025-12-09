import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import colors from '../constants/colors';

import ItemListScreen from '../screens/ItemListScreen';
import ItemFormScreen from '../screens/ItemFormScreen';
import StockListScreen from '../screens/StockListScreen';
import StockAdjustmentScreen from '../screens/StockAdjustmentScreen';

const Stack = createNativeStackNavigator();

const InventoryNavigator = () => {
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
        name="ItemList"
        component={ItemListScreen}
        options={{title: 'Items'}}
      />
      <Stack.Screen
        name="ItemForm"
        component={ItemFormScreen}
        options={{title: 'Item Details'}}
      />
      <Stack.Screen
        name="StockList"
        component={StockListScreen}
        options={{title: 'Stock Overview'}}
      />
      <Stack.Screen
        name="StockAdjustment"
        component={StockAdjustmentScreen}
        options={{title: 'Adjust Stock'}}
      />
    </Stack.Navigator>
  );
};

export default InventoryNavigator;
