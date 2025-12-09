import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import Card from '../components/Card';
import Button from '../components/Button';
import colors from '../constants/colors';
import {getItems, saveItems} from '../utils/storage';

const ItemListScreen = ({navigation}) => {
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

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedItems = items.filter(item => item.id !== id);
            await saveItems(updatedItems);
            loadItems();
          },
        },
      ]
    );
  };

  const renderItem = ({item}) => (
    <Card>
      <View style={styles.itemHeader}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles. itemCode}>#{item.code}</Text>
      </View>
      <Text style={styles.itemDescription}>{item.description}</Text>
      <View style={styles.itemFooter}>
        <Text style={styles.itemPrice}>Price: ${item.price}</Text>
        <Text style={styles.itemStock}>Stock: {item.currentStock || 0}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('ItemForm', {item})}>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item. id)}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
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
          <Text style={styles. emptyText}>No items found.  Add your first item!</Text>
        }
      />
      <View style={styles.footer}>
        <Button
          title="Add New Item"
          onPress={() => navigation.navigate('ItemForm')}
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
  list: {
    padding: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  itemCode: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  itemDescription: {
    fontSize: 14,
    color:  colors.textSecondary,
    marginBottom: 12,
  },
  itemFooter: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  itemStock: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.primary,
  },
  actions:  {
    flexDirection: 'row',
    gap: 12,
  },
  editButton: {
    flex: 1,
    padding: 10,
    backgroundColor: colors.primary,
    borderRadius: 6,
    alignItems: 'center',
  },
  editText: {
    color: colors.white,
    fontWeight: '600',
  },
  deleteButton: {
    flex: 1,
    padding: 10,
    backgroundColor:  colors.danger,
    borderRadius: 6,
    alignItems: 'center',
  },
  deleteText: {
    color: colors.white,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: colors.textSecondary,
  },
  footer: {
    padding: 16,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor:  colors.border,
  },
});

export default ItemListScreen;