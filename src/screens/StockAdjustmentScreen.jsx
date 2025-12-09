import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, Alert} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Input from '../components/Input';
import Button from '../components/Button';
import colors from '../constants/colors';
import {getItems, saveItems} from '../utils/storage';

const StockAdjustmentScreen = ({navigation}) => {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [adjustmentType, setAdjustmentType] = useState('add');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [currentStock, setCurrentStock] = useState(0);

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    if (selectedItem) {
      const item = items.find(i => i.id === selectedItem);
      setCurrentStock(item?. currentStock || 0);
    }
  }, [selectedItem]);

  const loadItems = async () => {
    const data = await getItems();
    setItems(data);
  };

  const validateForm = () => {
    if (!selectedItem) {
      Alert.alert('Error', 'Please select an item');
      return false;
    }

    if (! quantity || parseFloat(quantity) <= 0) {
      Alert.alert('Error', 'Please enter a valid quantity');
      return false;
    }

    if (!reason. trim()) {
      Alert.alert('Error', 'Please provide a reason for adjustment');
      return false;
    }

    if (adjustmentType === 'subtract') {
      const item = items.find(i => i.id === selectedItem);
      if (parseFloat(quantity) > item.currentStock) {
        Alert.alert('Error', 'Cannot subtract more than current stock');
        return false;
      }
    }

    return true;
  };

  const handleAdjust = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const updatedItems = items.map(item => {
        if (item.id === selectedItem) {
          const adjustment = parseFloat(quantity);
          const newStock = adjustmentType === 'add'
            ? item.currentStock + adjustment
            :  item.currentStock - adjustment;
          
          return {
            ...item,
            currentStock: newStock,
            lastAdjustment: {
              date: new Date().toISOString(),
              type: adjustmentType,
              quantity: adjustment,
              reason: reason.trim(),
            },
          };
        }
        return item;
      });

      await saveItems(updatedItems);
      Alert.alert('Success', 'Stock adjusted successfully!');
      
      // Reset form
      setSelectedItem('');
      setQuantity('');
      setReason('');
      setAdjustmentType('add');
      loadItems();
    } catch (error) {
      Alert.alert('Error', 'Failed to adjust stock');
      console.error(error);
    }
  };

  const getNewStock = () => {
    if (! quantity || ! selectedItem) return currentStock;
    const adjustment = parseFloat(quantity);
    return adjustmentType === 'add'
      ? currentStock + adjustment
      : currentStock - adjustment;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Select Item *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedItem}
              onValueChange={setSelectedItem}
              style={styles.picker}>
              <Picker.Item label="-- Select Item --" value="" />
              {items.map(item => (
                <Picker.Item
                  key={item.id}
                  label={`${item.name} (Current: ${item.currentStock || 0})`}
                  value={item.id}
                />
              ))}
            </Picker>
          </View>
        </View>

        {selectedItem && (
          <View style={styles.stockInfo}>
            <Text style={styles.stockLabel}>Current Stock:</Text>
            <Text style={styles.stockValue}>{currentStock}</Text>
          </View>
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Adjustment Type *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={adjustmentType}
              onValueChange={setAdjustmentType}
              style={styles.picker}>
              <Picker.Item label="Add Stock" value="add" />
              <Picker.Item label="Subtract Stock" value="subtract" />
            </Picker>
          </View>
        </View>

        <Input
          label="Quantity *"
          value={quantity}
          onChangeText={setQuantity}
          placeholder="0"
          keyboardType="decimal-pad"
        />

        {selectedItem && quantity && (
          <View style={styles.stockInfo}>
            <Text style={styles.stockLabel}>New Stock:</Text>
            <Text style={[
              styles.stockValue,
              {color: adjustmentType === 'add' ? colors.success : colors. warning}
            ]}>
              {getNewStock()}
            </Text>
          </View>
        )}

        <Input
          label="Reason for Adjustment *"
          value={reason}
          onChangeText={setReason}
          placeholder="e.g., Damaged, Lost, Found extra stock"
          multiline
          numberOfLines={3}
        />

        <Button title="Adjust Stock" onPress={handleAdjust} />
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
    backgroundColor: colors. background,
  },
  form: {
    padding: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth:  1,
    borderColor:  colors.border,
    borderRadius: 8,
    backgroundColor:  colors.white,
  },
  picker: {
    height:  50,
  },
  stockInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor:  colors.light,
    borderRadius: 8,
    marginBottom: 16,
  },
  stockLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  stockValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors. primary,
  },
  cancelButton: {
    marginTop:  12,
  },
});

export default StockAdjustmentScreen;