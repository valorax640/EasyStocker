import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { useFocusEffect, useNavigation, CommonActions } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../components/Card';
import colors from '../constants/colors';
import { getPurchases, getSales, getItems } from '../utils/storage';
import { formatCurrency, getTodayDate, getMonthStartDate } from '../utils/helpers';

const DashboardScreen = () => {
  const navigation = useNavigation();
  const [todaySales, setTodaySales] = useState(0);
  const [todayPurchases, setTodayPurchases] = useState(0);
  const [monthSales, setMonthSales] = useState(0);
  const [monthPurchases, setMonthPurchases] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [currency, setCurrency] = useState('₹');

  useFocusEffect(
    React.useCallback(() => {
      loadDashboardData();
    }, [])
  );

  const loadDashboardData = async () => {
    try {
      const purchases = await getPurchases();
      const sales = await getSales();
      const items = await getItems();

      const today = getTodayDate();
      const monthStart = getMonthStartDate();

      // Calculate today's sales
      const todaySalesData = sales.filter(s => s.date === today);
      const todaySalesTotal = todaySalesData.reduce((sum, s) => sum + s.total, 0);
      setTodaySales(todaySalesTotal);

      // Calculate today's purchases
      const todayPurchasesData = purchases.filter(p => p.date === today);
      const todayPurchasesTotal = todayPurchasesData.reduce((sum, p) => sum + p.total, 0);
      setTodayPurchases(todayPurchasesTotal);

      // Calculate month's sales
      const monthSalesData = sales.filter(s => s.date >= monthStart);
      const monthSalesTotal = monthSalesData.reduce((sum, s) => sum + s.total, 0);
      setMonthSales(monthSalesTotal);

      // Calculate month's purchases
      const monthPurchasesData = purchases.filter(p => p.date >= monthStart);
      const monthPurchasesTotal = monthPurchasesData.reduce((sum, p) => sum + p.total, 0);
      setMonthPurchases(monthPurchasesTotal);

      // Count low stock items
      const lowStock = items.filter(item => item.currentStock <= (item.minStock || 0));
      setLowStockCount(lowStock.length);
      setTotalItems(items.length);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const quickActions = [
    {
      title: 'Items',
      icon: 'package-variant',
      color: colors.primary,
      gradient: [colors.primary, colors.primaryDark],
      onPress: () => {
        navigation.navigate('InventoryTab', {
          screen: 'InventoryHome',
        });
        setTimeout(() => {
          navigation.navigate('InventoryTab', {
            screen: 'ItemList',
          });
        }, 0);
      },
    },
    {
      title: 'New Sale',
      icon: 'cash-plus',
      color: colors.success,
      gradient: [colors.success, '#059669'],
      onPress: () => {
        navigation.navigate('TransactionsTab', {
          screen: 'TransactionsHome',
        });
        setTimeout(() => {
          navigation.navigate('TransactionsTab', {
            screen: 'SalesForm',
          });
        }, 0);
      },
    },
    {
      title: 'Purchase',
      icon: 'cart-plus',
      color: colors.info,
      gradient: [colors.info, '#2563EB'],
      onPress: () => {
        navigation.navigate('TransactionsTab', {
          screen: 'TransactionsHome',
        });
        setTimeout(() => {
          navigation.navigate('TransactionsTab', {
            screen: 'PurchaseForm',
          });
        }, 0);
      },
    },
    {
      title: 'Stock',
      icon: 'chart-box',
      color: colors.secondary,
      gradient: [colors.secondary, '#7C3AED'],
      onPress: () => {
        navigation.navigate('InventoryTab', {
          screen: 'InventoryHome',
        });
        setTimeout(() => {
          navigation.navigate('InventoryTab', {
            screen: 'StockList',
          });
        }, 0);
      },
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>EasyStocker</Text>
          <Text style={styles.headerSubtitle}>Manage your inventory</Text>
        </View>
        <TouchableOpacity
          style={styles.notificationButton}
        >
          <Icon name="bell-outline" size={24} color={colors.white} />
          {lowStockCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{lowStockCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }>
        {/* Stats Cards */}
        <View style={styles.statsSection}>
          <Card style={styles.statCard}>
            <View style={[styles.iconContainer, { backgroundColor: colors.success + '20' }]}>
              <Icon name="currency-inr" size={24} color={colors.success} />
            </View>
            <Text style={styles.statLabel}>Today's Sales</Text>
            <Text style={[styles.statValue, { color: colors.success }]}>
              {formatCurrency(todaySales, currency)}
            </Text>
          </Card>

          <Card style={styles.statCard}>
            <View style={[styles.iconContainer, { backgroundColor: colors.danger + '20' }]}>
              <Icon name="cart" size={24} color={colors.danger} />
            </View>
            <Text style={styles.statLabel}>Today's Purchases</Text>
            <Text style={[styles.statValue, { color: colors.danger }]}>
              {formatCurrency(todayPurchases, currency)}
            </Text>
          </Card>
        </View>

        <View style={styles.statsSection}>
          <Card style={styles.statCard}>
            <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
              <Icon name="chart-line" size={24} color={colors.primary} />
            </View>
            <Text style={styles.statLabel}>Month's Sales</Text>
            <Text style={[styles.statValue, { color: colors.primary }]}>
              {formatCurrency(monthSales, currency)}
            </Text>
          </Card>

          <Card style={styles.statCard}>
            <View style={[styles.iconContainer, { backgroundColor: colors.danger + '20' }]}>
              <Icon name="cart" size={24} color={colors.danger} />
            </View>
            <Text style={styles.statLabel}>Month's Purchases</Text>
            <Text style={[styles.statValue, { color: colors.danger }]}>
              {formatCurrency(monthPurchases, currency)}
            </Text>
          </Card>
        </View>

        {/* Low Stock Alert */}
        {lowStockCount > 0 && (
          <TouchableOpacity
            onPress={() => navigation.navigate('InventoryTab', { screen: 'StockList' })}>
            <Card style={styles.alertCard}>
              <View style={styles.alertContent}>
                <Icon name="alert-circle" size={24} color={colors.white} />
                <Text style={styles.alertText}>
                  {lowStockCount} item{lowStockCount > 1 ? 's' : ''} running low on stock
                </Text>
                <Icon name="chevron-right" size={24} color={colors.white} />
              </View>
            </Card>
          </TouchableOpacity>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.actionCard, { backgroundColor: action.color }]}
                onPress={action.onPress}
                activeOpacity={0.8}>
                <Icon name={action.icon} size={32} color={colors.white} />
                <Text style={styles.actionTitle}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* More Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>More Options</Text>

          <Card>
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => navigation.navigate('ContactsTab', { screen: 'SupplierList' })}>
              <View style={styles.listItemLeft}>
                <View style={[styles.listIcon, { backgroundColor: colors.info + '20' }]}>
                  <Icon name="store" size={20} color={colors.info} />
                </View>
                <Text style={styles.listItemText}>Suppliers</Text>
              </View>
              <Icon name="chevron-right" size={24} color={colors.gray} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.listItem}
              onPress={() => navigation.navigate('ContactsTab', { screen: 'CustomerList' })}>
              <View style={styles.listItemLeft}>
                <View style={[styles.listIcon, { backgroundColor: colors.secondary + '20' }]}>
                  <Icon name="account-group" size={20} color={colors.secondary} />
                </View>
                <Text style={styles.listItemText}>Customers</Text>
              </View>
              <Icon name="chevron-right" size={24} color={colors.gray} />
            </TouchableOpacity>
          </Card>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight : 40,
    paddingBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.9,
    marginTop: 4,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: colors.danger,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  statsSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 6,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  alertCard: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: colors.danger,
    paddingVertical: 12,
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  alertText: {
    flex: 1,
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 12,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: '48%',
    aspectRatio: 1.3,
    borderRadius: 16,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  actionTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  listItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  listItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  bottomPadding: {
    height: 20,
  },
});

export default DashboardScreen;
