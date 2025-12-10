import React, {useState, useEffect} from 'react';
import {View, StyleSheet, ScrollView, Alert} from 'react-native';
import Input from '../components/Input';
import Button from '../components/Button';
import colors from '../constants/colors';
import {getItems, saveItems} from '../utils/storage';
import {generateId} from '../utils/helpers';

const ItemFormScreen = ({navigation, route}) => {
  const editItem = route.params?.item;
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    price: '',
    minStock: '',
    currentStock:  '0',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editItem) {
      setFormData({
        name: editItem.name,
        code: editItem.code,
        description: editItem. description || '',
        price: editItem. price. toString(),
        minStock: editItem.minStock?. toString() || '',
        currentStock: editItem.currentStock?. toString() || '0',
      });
    }
  }, [editItem]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name. trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.code.trim()) {
      newErrors.code = 'Code is required';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const items = await getItems();
      
      const newItem = {
        id: editItem ? editItem.id : generateId(),
        name: formData.name. trim(),
        code: formData.code.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        minStock: parseInt(formData.minStock, 10) || 0,
        currentStock: editItem ? editItem.currentStock : parseInt(formData.currentStock, 10) || 0,
        createdAt: editItem ? editItem.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      let updatedItems;
      if (editItem) {
        updatedItems = items.map(item => item.id === editItem.id ?  newItem : item);
      } else {
        updatedItems = [...items, newItem];
      }

      await saveItems(updatedItems);
      Alert.alert('Success', `Item ${editItem ? 'updated' :  'added'} successfully!`);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save item');
      console.error(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Input
          label="Item Name *"
          value={formData. name}
          onChangeText={(text) => setFormData({... formData, name: text})}
          placeholder="Enter item name"
          error={errors.name}
        />

        <Input
          label="Item Code *"
          value={formData.code}
          onChangeText={(text) => setFormData({...formData, code: text})}
          placeholder="Enter item code"
          error={errors. code}
        />

        <Input
          label="Description"
          value={formData.description}
          onChangeText={(text) => setFormData({...formData, description: text})}
          placeholder="Enter description"
          multiline
          numberOfLines={3}
        />

        <Input
          label="Price *"
          value={formData.price}
          onChangeText={(text) => setFormData({...formData, price: text})}
          placeholder="0.00"
          keyboardType="decimal-pad"
          error={errors.price}
        />

        <Input
          label="Minimum Stock"
          value={formData.minStock}
          onChangeText={(text) => setFormData({...formData, minStock: text})}
          placeholder="0"
          keyboardType="number-pad"
        />

        {! editItem && (
          <Input
            label="Initial Stock"
            value={formData.currentStock}
            onChangeText={(text) => setFormData({...formData, currentStock: text})}
            placeholder="0"
            keyboardType="number-pad"
          />
        )}

        <Button title={editItem ? 'Update Item' : 'Add Item'} onPress={handleSave} />
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

const styles = StyleSheet. create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  form: {
    padding: 16,
  },
  cancelButton: {
    marginTop: 12,
  },
});

export default ItemFormScreen;
