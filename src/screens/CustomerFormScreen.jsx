import React, {useState, useEffect} from 'react';
import {View, StyleSheet, ScrollView, Alert} from 'react-native';
import Input from '../components/Input';
import Button from '../components/Button';
import colors from '../constants/colors';
import {getCustomers, saveCustomers} from '../utils/storage';
import {generateId} from '../utils/helpers';

const CustomerFormScreen = ({navigation, route}) => {
  const editCustomer = route. params?.customer;
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email:  '',
    address: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editCustomer) {
      setFormData({
        name:  editCustomer.name,
        contact: editCustomer.contact || '',
        email: editCustomer.email || '',
        address: editCustomer.address || '',
      });
    }
  }, [editCustomer]);

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
      const customers = await getCustomers();
      
      const newCustomer = {
        id: editCustomer ? editCustomer.id : generateId(),
        name: formData.name.trim(),
        contact: formData. contact.trim(),
        email: formData.email.trim(),
        address: formData.address. trim(),
        createdAt:  editCustomer ? editCustomer. createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      let updatedCustomers;
      if (editCustomer) {
        updatedCustomers = customers.map(c => c.id === editCustomer.id ? newCustomer : c);
      } else {
        updatedCustomers = [... customers, newCustomer];
      }

      await saveCustomers(updatedCustomers);
      Alert.alert('Success', `Customer ${editCustomer ? 'updated' : 'added'} successfully! `);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save customer');
      console.error(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Input
          label="Customer Name *"
          value={formData.name}
          onChangeText={(text) => setFormData({...formData, name: text})}
          placeholder="Enter customer name"
          error={errors. name}
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
          value={formData. address}
          onChangeText={(text) => setFormData({... formData, address: text})}
          placeholder="Enter address"
          multiline
          numberOfLines={3}
        />

        <Button title={editCustomer ? 'Update Customer' : 'Add Customer'} onPress={handleSave} />
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

export default CustomerFormScreen;