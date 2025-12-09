import React, {useState} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import Card from '../components/Card';
import colors from '../constants/colors';
import {getItems} from '../utils/storage';

const StockListScreen = () => {
  const [items, setItems] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      loadItems();
    }, [])
  );

  const loadItems = async () => {
    const data = await getItems();
    setItems(data);
  };

  const isLowStock = (item) => {
    return item.currentStock <= (item.minStock || 0);
  };

  const renderItem = ({item}) => (
    <Card style={isLowStock(item) && styles.lowStockCard}>
      <View style={styles.header}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={[
          styles.stock,
          isLowStock(item) && styles.lowStockText
        ]}>
          {item.currentStock || 0}
        </Text>
      </View>
      <Text style={styles.code}>Code: {item.code}</Text>
      <View style={styles.footer}>
        <Text style={styles.minStock}>Min Stock: {item. minStock || 0}</Text>
        {isLowStock(item) && (
          <Text style={styles.lowStockLabel}>⚠️ LOW STOCK</Text>
        )}
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No items in stock.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: 16,
  },
  lowStockCard: {
    borderWidth: 2,
    borderColor: colors. lowStock,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  stock: {
    fontSize:  24,
    fontWeight: 'bold',
    color: colors.success,
  },
  lowStockText: {
    color: colors.lowStock,
  },
  code: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  footer:  {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  minStock: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  lowStockLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.lowStock,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: colors.textSecondary,
  },
});

export default StockListScreen;