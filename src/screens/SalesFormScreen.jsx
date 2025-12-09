import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import colors from '../constants/colors';
import {
  getCustomers,
  getItems,
  saveItems,
  getSales,
  saveSales,
} from '../utils/storage';
import {generateId, getTodayDate, formatCurrency} from '../utils/helpers';

const SalesFormScreen = ({navigation}) => {
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(getTodayDate());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const customersData = await getCustomers();
    const itemsData = await getItems();
    setCustomers(customersData);
    setItems(itemsData);
  };

  const addItem = () => {
    setSelectedItems([
      ...selectedItems,
      {id: generateId(), itemId: '', quantity: '', price:  ''},
    ]);
  };

  const removeItem = (id) => {
    setSelectedItems(selectedItems.filter(item => item.id !== id));
  };

  const updateItem = (id, field, value) => {
    setSelectedItems(
      selectedItems.map(item =>
        item.id === id ?  {...item, [field]: value} : item
      )
    );
  };

  const getItemDetails = (itemId) => {
    return items.find(i => i.id === itemId);
  };

  const calculateTotal = () => {
    return selectedItems.reduce((sum, item) => {
      const qty = parseFloat(item.quantity) || 0;
      const price = parseFloat(item.price) || 0;
      return sum + qty * price;
    }, 0);
  };

  const validateForm = () => {
    if (!selectedCustomer) {
      Alert.alert('Error', 'Please select a customer');
      return false;
    }

    if (selectedItems.length === 0) {
      Alert.alert('Error', 'Please add at least one item');
      return false;
    }

    for (let item of selectedItems) {
      if (!item.itemId || ! item.quantity || !item.price) {
        Alert.alert('Error', 'Please fill all item details');
        return false;
      }
      if (parseFloat(item.quantity) <= 0 || parseFloat(item.price) <= 0) {
        Alert.alert('Error', 'Quantity and price must be greater than 0');
        return false;
      }

      // Check stock availability
      const itemDetails = getItemDetails(item.itemId);
      if (itemDetails && parseFloat(item.quantity) > itemDetails.currentStock) {
        Alert.alert('Error', `Insufficient stock for ${itemDetails.name}. Available: ${itemDetails.currentStock}`);
        return false;
      }
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      // Update stock for each item
      const updatedItems = [...items];
      selectedItems.forEach(selectedItem => {
        const itemIndex = updatedItems.findIndex(i => i.id === selectedItem.itemId);
        if (itemIndex !== -1) {
          updatedItems[itemIndex].currentStock =
            (updatedItems[itemIndex].currentStock || 0) - parseFloat(selectedItem.quantity);
        }
      });
      await saveItems(updatedItems);

      // Save sale record
      const sales = await getSales();
      const newSale = {
        id: generateId(),
        customerId: selectedCustomer,
        date: date,
        items: selectedItems.map(item => ({
          itemId: item. itemId,
          itemName:  getItemDetails(item.itemId)?.name || '',
          quantity: parseFloat(item.quantity),
          price: parseFloat(item.price),
        })),
        total: calculateTotal(),
        notes: notes.trim(),
        createdAt: new Date().toISOString(),
      };

      await saveSales([...sales, newSale]);

      Alert.alert('Success', 'Sale recorded successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save sale');
      console.error(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Select Customer *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedCustomer}
              onValueChange={setSelectedCustomer}
              style={styles.picker}>
              <Picker.Item label="-- Select Customer --" value="" />
              {customers.map(customer => (
                <Picker. Item key={customer.id} label={customer.name} value={customer.id} />
              ))}
            </Picker>
          </View>
        </View>

        <Input
          label="Date"
          value={date}
          onChangeText={setDate}
          placeholder="YYYY-MM-DD"
        />

        <Text style={styles.sectionTitle}>Items</Text>

        {selectedItems.map((item, index) => {
          const itemDetails = item.itemId ? getItemDetails(item.itemId) : null;
          
          return (
            <Card key={item.id} style={styles.itemCard}>
              <Text style={styles.itemNumber}>Item #{index + 1}</Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Select Item *</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={item.itemId}
                    onValueChange={(value) => {
                      updateItem(item.id, 'itemId', value);
                      const selected = getItemDetails(value);
                      if (selected) {
                        updateItem(item.id, 'price', selected.price. toString());
                      }
                    }}
                    style={styles.picker}>
                    <Picker.Item label="-- Select Item --" value="" />
                    {items.map(i => (
                      <Picker.Item 
                        key={i.id} 
                        label={`${i.name} (Stock: ${i.currentStock || 0})`} 
                        value={i.id} 
                      />
                    ))}
                  </Picker>
                </View>
              </View>

              {itemDetails && (
                <Text style={styles.stockInfo}>
                  Available Stock: {itemDetails.currentStock || 0}
                </Text>
              )}

              <Input
                label="Quantity *"
                value={item.quantity}
                onChangeText={(value) => updateItem(item.id, 'quantity', value)}
                placeholder="0"
                keyboardType="decimal-pad"
              />

              <Input
                label="Price per Unit *"
                value={item.price}
                onChangeText={(value) => updateItem(item.id, 'price', value)}
                placeholder="0.00"
                keyboardType="decimal-pad"
              />

              {item.quantity && item. price && (
                <Text style={styles.subtotal}>
                  Subtotal: {formatCurrency(parseFloat(item.quantity) * parseFloat(item.price))}
                </Text>
              )}

              <Button
                title="Remove Item"
                variant="danger"
                onPress={() => removeItem(item.id)}
              />
            </Card>
          );
        })}

        <Button
          title="+ Add Item"
          variant="secondary"
          onPress={addItem}
          style={styles.addButton}
        />

        <Input
          label="Notes"
          value={notes}
          onChangeText={setNotes}
          placeholder="Optional notes"
          multiline
          numberOfLines={3}
        />

        <Card style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total Amount:</Text>
          <Text style={styles.totalAmount}>{formatCurrency(calculateTotal())}</Text>
        </Card>

        <Button title="Save Sale" onPress={handleSave} />
        <Button
          title="Cancel"
          variant="secondary"
          onPress={() => navigation.goBack()}
          style={styles.cancelButton}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:  colors.background,
  },
  form: {
    padding:  16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize:  14,
    fontWeight:  '500',
    color: colors.text,
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.white,
  },
  picker: {
    height: 50,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 12,
  },
  itemCard: {
    marginBottom: 16,
  },
  itemNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 12,
  },
  stockInfo: {
    fontSize: 14,
    color: colors.info,
    fontWeight: '500',
    marginBottom: 8,
  },
  subtotal: {
    fontSize: 16,
    fontWeight: '600',
    color:  colors.success,
    marginBottom: 12,
    textAlign: 'right',
  },
  addButton: {
    marginBottom: 16,
  },
  totalCard: {
    backgroundColor: colors.success,
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    color: colors.white,
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors. white,
  },
  cancelButton: {
    marginTop:  12,
  },
});

export default SalesFormScreen;