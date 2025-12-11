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
  getSuppliers,
  getItems,
  saveItems,
  getPurchases,
  savePurchases,
} from '../utils/storage';
import {generateId, getTodayDate, formatCurrency} from '../utils/helpers';

const PurchaseFormScreen = ({navigation}) => {
  const [suppliers, setSuppliers] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(getTodayDate());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const suppliersData = await getSuppliers();
    const itemsData = await getItems();
    setSuppliers(suppliersData);
    setItems(itemsData);
  };

  const addItem = () => {
    setSelectedItems([
      ...selectedItems,
      {id: generateId(), itemId: '', quantity: '', price: ''},
    ]);
  };

  const removeItem = (id) => {
    setSelectedItems(selectedItems.filter(item => item.id !== id));
  };

  const updateItem = (id, field, value) => {
    setSelectedItems(
      selectedItems.map(item =>
        item.id === id ?  {... item, [field]: value} :  item
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
    if (!selectedSupplier) {
      Alert.alert('Error', 'Please select a supplier');
      return false;
    }

    if (selectedItems.length === 0) {
      Alert.alert('Error', 'Please add at least one item');
      return false;
    }

    for (let i = 0; i < selectedItems.length; i++) {
      const item = selectedItems[i];
      
      // Check if item is selected
      if (!item.itemId || item.itemId === '' || item.itemId === undefined) {
        Alert.alert('Error', `Please select an item for Item #${i + 1}`);
        return false;
      }
      
      // Check if quantity is filled
      const qtyStr = item.quantity ? item.quantity.toString().trim() : '';
      if (!qtyStr || qtyStr === '') {
        Alert.alert('Error', `Please enter quantity for Item #${i + 1}`);
        return false;
      }
      
      // Check if price is filled
      const priceStr = item.price ? item.price.toString().trim() : '';
      if (!priceStr || priceStr === '') {
        Alert.alert('Error', `Please enter price for Item #${i + 1}`);
        return false;
      }
      
      // Validate quantity and price are valid numbers
      const qty = parseFloat(qtyStr);
      const price = parseFloat(priceStr);
      
      if (isNaN(qty) || qty <= 0) {
        Alert.alert('Error', `Please enter a valid quantity greater than 0 for Item #${i + 1}`);
        return false;
      }
      
      if (isNaN(price) || price <= 0) {
        Alert.alert('Error', `Please enter a valid price greater than 0 for Item #${i + 1}`);
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
      const updatedItems = [... items];
      selectedItems.forEach(selectedItem => {
        const itemIndex = updatedItems.findIndex(i => i.id === selectedItem.itemId);
        if (itemIndex !== -1) {
          updatedItems[itemIndex]. currentStock =
            (updatedItems[itemIndex].currentStock || 0) + parseFloat(selectedItem.quantity);
        }
      });
      await saveItems(updatedItems);

      // Save purchase record
      const purchases = await getPurchases();
      const newPurchase = {
        id: generateId(),
        supplierId: selectedSupplier,
        date: date,
        items: selectedItems. map(item => ({
          itemId: item.itemId,
          itemName: getItemDetails(item.itemId)?.name || '',
          quantity: parseFloat(item.quantity),
          price: parseFloat(item.price),
        })),
        total: calculateTotal(),
        notes: notes. trim(),
        createdAt:  new Date().toISOString(),
      };

      await savePurchases([... purchases, newPurchase]);

      Alert.alert('Success', 'Purchase recorded successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save purchase');
      console.error(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Select Supplier *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedSupplier}
              onValueChange={setSelectedSupplier}
              mode="dropdown"
              style={styles.picker}>
              <Picker.Item label="-- Select Supplier --" value="" enabled={false} />
              {suppliers.map(supplier => (
                <Picker. Item key={supplier.id} label={supplier.name} value={supplier.id} />
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

        {selectedItems.map((item, index) => (
          <Card key={item.id} style={styles.itemCard}>
            <Text style={styles.itemNumber}>Item #{index + 1}</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Select Item *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={item.itemId}
                  onValueChange={(value) => updateItem(item. id, 'itemId', value)}
                  mode="dropdown"
                  style={styles. picker}>
                  <Picker.Item label="-- Select Item --" value="" enabled={false} />
                  {items.map(i => (
                    <Picker.Item key={i.id} label={`${i.name} (${i.code})`} value={i.id} />
                  ))}
                </Picker>
              </View>
            </View>

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

            {item.quantity && item.price && (
              <Text style={styles.subtotal}>
                Subtotal:  {formatCurrency(parseFloat(item.quantity) * parseFloat(item.price))}
              </Text>
            )}

            <Button
              title="Remove Item"
              variant="danger"
              onPress={() => removeItem(item.id)}
            />
          </Card>
        ))}

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
          <Text style={styles.totalLabel}>Total Amount: </Text>
          <Text style={styles.totalAmount}>{formatCurrency(calculateTotal())}</Text>
        </Card>

        <Button title="Save Purchase" onPress={handleSave} />
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
    backgroundColor: colors.background,
  },
  form: {
    padding: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label:  {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth:  1,
    borderColor:  colors.border,
    borderRadius: 8,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
    color: colors.text,
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
  subtotal: {
    fontSize: 16,
    fontWeight: '600',
    color: colors. success,
    marginBottom: 12,
    textAlign: 'right',
  },
  addButton: {
    marginBottom: 16,
  },
  totalCard: {
    backgroundColor: colors.primary,
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
    color: colors.white,
  },
  cancelButton: {
    marginTop: 12,
  },
});

export default PurchaseFormScreen;
