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
import {getSuppliers, saveSuppliers} from '../utils/storage';

const SupplierListScreen = ({navigation}) => {
  const [suppliers, setSuppliers] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      loadSuppliers();
    }, [])
  );

  const loadSuppliers = async () => {
    const data = await getSuppliers();
    setSuppliers(data);
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Supplier',
      'Are you sure you want to delete this supplier?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updated = suppliers.filter(s => s.id !== id);
            await saveSuppliers(updated);
            loadSuppliers();
          },
        },
      ]
    );
  };

  const renderItem = ({item}) => (
    <Card>
      <Text style={styles.name}>{item.name}</Text>
      {item.contact && <Text style={styles.contact}>📞 {item.contact}</Text>}
      {item.email && <Text style={styles.email}>✉️ {item. email}</Text>}
      {item.address && <Text style={styles.address}>📍 {item.address}</Text>}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('SupplierForm', {supplier: item})}>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id)}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={suppliers}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles. emptyText}>No suppliers found.  Add your first supplier!</Text>
        }
      />
      <View style={styles.footer}>
        <Button
          title="Add New Supplier"
          onPress={() => navigation.navigate('SupplierForm')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:  colors.background,
  },
  list: {
    padding:  16,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: colors. text,
    marginBottom: 8,
  },
  contact: {
    fontSize: 14,
    color:  colors.textSecondary,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
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
    color: colors. white,
    fontWeight: '600',
  },
  deleteButton: {
    flex: 1,
    padding: 10,
    backgroundColor: colors.danger,
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
    borderTopColor: colors. border,
  },
});

export default SupplierListScreen;