import React, {useState} from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import Input from '../components/Input';
import Button from '../components/Button';
import colors from '../constants/colors';
import {getSettings} from '../utils/storage';

const LockScreen = ({onUnlock}) => {
  const [enteredPin, setEnteredPin] = useState('');

  const handleUnlock = async () => {
    try {
      const settings = await getSettings();
      if (enteredPin === settings.pin) {
        onUnlock();
      } else {
        Alert.alert('Error', 'Incorrect PIN');
        setEnteredPin('');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to verify PIN');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🔒</Text>
      <Text style={styles.title}>EasyStocker</Text>
      <Text style={styles.subtitle}>Enter PIN to unlock</Text>
      
      <View style={styles.form}>
        <Input
          value={enteredPin}
          onChangeText={setEnteredPin}
          placeholder="Enter PIN"
          keyboardType="number-pad"
          secureTextEntry
        />
        <Button title="Unlock" onPress={handleUnlock} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors. primary,
    justifyContent: 'center',
    alignItems:  'center',
    padding: 32,
  },
  icon:  {
    fontSize: 64,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.white,
    marginBottom: 32,
  },
  form:  {
    width: '100%',
    maxWidth: 400,
  },
});

export default LockScreen;