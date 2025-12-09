import React, {useState} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import Card from '../components/Card';
import Button from '../components/Button';
import colors from '../constants/colors';
import {getPurchases, getSuppliers} from '../utils/storage';
import {formatDate, formatCurrency} from '../utils/helpers';

const PurchaseListScreen = ({navigation}) => {
  const [purchases, setPurchases] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    const purchasesData = await getPurchases();
    const suppliersData = await getSuppliers();
    setPurchases(purchasesData. sort((a, b) => new Date(b.date) - new Date(a.date)));
    setSuppliers(suppliersData);
  };

  const getSupplierName = (supplierId) => {
    const supplier = suppliers.find(s => s. id === supplierId);
    return supplier ? supplier.name : 'Unknown Supplier';
  };

  const renderItem = ({item}) => (
    <Card>
      <View style={styles.header}>
        <Text style={styles.date}>{formatDate(item.date)}</Text>
        <Text style={styles.total}>{formatCurrency(item. total)}</Text>
      </View>
      <Text style={styles.supplier}>Supplier: {getSupplierName(item.supplierId)}</Text>
      <Text style={styles.itemsCount}>{item.items.length} item(s)</Text>
      {item.notes && <Text style={styles.notes}>Notes: {item.notes}</Text>}
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={purchases}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No purchases recorded yet. </Text>
        }
      />
      <View style={styles. footer}>
        <Button
          title="New Purchase"
          onPress={() => navigation.navigate('PurchaseForm')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list:  {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  date:  {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  supplier: {
    fontSize: 14,
    color: colors. textSecondary,
    marginBottom: 4,
  },
  itemsCount: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  notes: {
    fontSize: 13,
    color: colors.gray,
    fontStyle: 'italic',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color:  colors.textSecondary,
  },
  footer: {
    padding: 16,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});

export default PurchaseListScreen;