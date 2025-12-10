import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../constants/colors';

import DashboardScreen from '../screens/DashboardScreen';
import InventoryNavigator from './InventoryNavigator';
import TransactionsNavigator from './TransactionsNavigator';
import ContactsNavigator from './ContactsNavigator';

const Tab = createBottomTabNavigator();

const DashboardTabIcon = ({color, size}) => (
  <Icon name="view-dashboard" size={size} color={color} />
);

const InventoryTabIcon = ({color, size}) => (
  <Icon name="package-variant" size={size} color={color} />
);

const TransactionsTabIcon = ({color, size}) => (
  <Icon name="swap-horizontal" size={size} color={color} />
);

const ContactsTabIcon = ({color, size}) => (
  <Icon name="account-group" size={size} color={color} />
);

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray,
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          backgroundColor: colors.white,
          elevation: 8,
          shadowColor: colors.black,
          shadowOffset: {width: 0, height: -3},
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarKeyboardHidesTabBar: true,
      }}>
      <Tab.Screen
        name="DashboardTab"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: DashboardTabIcon,
        }}
      />
      <Tab.Screen
        name="InventoryTab"
        component={InventoryNavigator}
        options={{
          tabBarLabel: 'Inventory',
          tabBarIcon: InventoryTabIcon,
        }}
      />
      <Tab.Screen
        name="TransactionsTab"
        component={TransactionsNavigator}
        options={{
          tabBarLabel: 'Transactions',
          tabBarIcon: TransactionsTabIcon,
        }}
      />
      <Tab.Screen
        name="ContactsTab"
        component={ContactsNavigator}
        options={{
          tabBarLabel: 'Contacts',
          tabBarIcon: ContactsTabIcon,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
