import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, StatusBar} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../constants/colors';
import Card from '../components/Card';

const TransactionsHomeScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Icon name="swap-horizontal" size={28} color={colors.white} />
          <Text style={styles.headerTitle}>Transactions</Text>
        </View>
        <Text style={styles.headerSubtitle}>Manage purchases and sales</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity
          onPress={() => navigation.navigate('PurchaseList')}
          activeOpacity={0.8}>
          <Card style={styles.optionCard}>
            <View style={[styles.iconContainer, {backgroundColor: colors.danger + '20'}]}>
              <Icon name="cart" size={48} color={colors.danger} />
            </View>
            <Text style={styles.optionTitle}>Purchases</Text>
            <Text style={styles.optionDescription}>
              View purchase history and add new purchases
            </Text>
            <View style={styles.arrow}>
              <Icon name="chevron-right" size={24} color={colors.danger} />
            </View>
          </Card>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('SalesList')}
          activeOpacity={0.8}>
          <Card style={styles.optionCard}>
            <View style={[styles.iconContainer, {backgroundColor: colors.success + '20'}]}>
              <Icon name="cash-multiple" size={48} color={colors.success} />
            </View>
            <Text style={styles.optionTitle}>Sales</Text>
            <Text style={styles.optionDescription}>
              View sales history and record new sales
            </Text>
            <View style={styles.arrow}>
              <Icon name="chevron-right" size={24} color={colors.success} />
            </View>
          </Card>
        </TouchableOpacity>
      </View>
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
    paddingTop: 16,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
    marginLeft: 12,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.9,
    marginTop: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  optionCard: {
    padding: 24,
    marginBottom: 20,
    position: 'relative',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  optionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  arrow: {
    position: 'absolute',
    right: 24,
    top: '50%',
    marginTop: -12,
  },
});

export default TransactionsHomeScreen;
