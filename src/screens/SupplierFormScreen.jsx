import React, {useState, useEffect} from 'react';
import {View, StyleSheet, ScrollView, Alert} from 'react-native';
import Input from '../components/Input';
import Button from '../components/Button';
import colors from '../constants/colors';
import {getSuppliers, saveSuppliers} from '../utils/storage';
import {generateId} from '../utils/helpers';

const SupplierFormScreen = ({navigation, route}) => {
  const editSupplier = route.params?.supplier;
  const [formData, setFormData] = useState({
    name: '',
    contact:  '',
    email: '',
    address: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editSupplier) {
      setFormData({
        name: editSupplier.name,
        contact: editSupplier.contact || '',
        email: editSupplier.email || '',
        address: editSupplier.address || '',
      });
    }
  }, [editSupplier]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const suppliers = await getSuppliers();
      
      const newSupplier = {
        id: editSupplier ? editSupplier.id : generateId(),
        name: formData.name.trim(),
        contact: formData. contact.trim(),
        email: formData.email.trim(),
        address: formData.address. trim(),
        createdAt:  editSupplier ? editSupplier.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      let updatedSuppliers;
      if (editSupplier) {
        updatedSuppliers = suppliers.map(s => s.id === editSupplier.id ? newSupplier : s);
      } else {
        updatedSuppliers = [...suppliers, newSupplier];
      }

      await saveSuppliers(updatedSuppliers);
      Alert.alert('Success', `Supplier ${editSupplier ? 'updated' : 'added'} successfully!`);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save supplier');
      console.error(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Input
          label="Supplier Name *"
          value={formData.name}
          onChangeText={(text) => setFormData({...formData, name: text})}
          placeholder="Enter supplier name"
          error={errors.name}
        />

        <Input
          label="Contact Number"
          value={formData.contact}
          onChangeText={(text) => setFormData({...formData, contact: text})}
          placeholder="Enter contact number"
          keyboardType="phone-pad"
        />

        <Input
          label="Email"
          value={formData.email}
          onChangeText={(text) => setFormData({...formData, email: text})}
          placeholder="Enter email"
          keyboardType="email-address"
        />

        <Input
          label="Address"
          value={formData.address}
          onChangeText={(text) => setFormData({...formData, address: text})}
          placeholder="Enter address"
          multiline
          numberOfLines={3}
        />

        <Button title={editSupplier ? 'Update Supplier' : 'Add Supplier'} onPress={handleSave} />
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

export default SupplierFormScreen;