import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import colors from '../constants/colors';
import {getSettings, saveSettings, clearAllData} from '../utils/storage';

const SettingsScreen = () => {
  const [currency, setCurrency] = useState('$');
  const [gstEnabled, setGstEnabled] = useState(false);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [currentPin, setCurrentPin] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const settings = await getSettings();
    setCurrency(settings.currency || '$');
    setGstEnabled(settings.gstEnabled || false);
    setCurrentPin(settings.pin || '');
  };

  const handleSaveSettings = async () => {
    try {
      const settings = await getSettings();
      const updatedSettings = {
        ...settings,
        currency: currency.trim() || '$',
        gstEnabled: gstEnabled,
      };

      await saveSettings(updatedSettings);
      Alert.alert('Success', 'Settings saved successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save settings');
      console.error(error);
    }
  };

  const handleSetPin = async () => {
    if (!pin || pin.length < 4) {
      Alert.alert('Error', 'PIN must be at least 4 digits');
      return;
    }

    if (pin !== confirmPin) {
      Alert.alert('Error', 'PINs do not match');
      return;
    }

    try {
      const settings = await getSettings();
      await saveSettings({...settings, pin: pin});
      Alert.alert('Success', 'PIN set successfully!');
      setPin('');
      setConfirmPin('');
      setCurrentPin(pin);
    } catch (error) {
      Alert.alert('Error', 'Failed to set PIN');
      console.error(error);
    }
  };

  const handleRemovePin = async () => {
    Alert.alert(
      'Remove PIN',
      'Are you sure you want to remove the PIN lock?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              const settings = await getSettings();
              await saveSettings({...settings, pin: null});
              Alert.alert('Success', 'PIN removed successfully!');
              setCurrentPin('');
              setPin('');
              setConfirmPin('');
            } catch (error) {
              Alert.alert('Error', 'Failed to remove PIN');
              console.error(error);
            }
          },
        },
      ]
    );
  };

  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your data. This action cannot be undone.  Are you sure?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            const success = await clearAllData();
            if (success) {
              Alert.alert('Success', 'All data cleared successfully!');
              loadSettings();
            } else {
              Alert.alert('Error', 'Failed to clear data');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Icon name="cog" size={28} color={colors.white} />
          <Text style={styles.headerTitle}>Settings</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Card>
          <View style={styles.cardHeader}>
            <Icon name="currency-usd" size={24} color={colors.primary} />
            <Text style={styles.sectionTitle}>General Settings</Text>
          </View>

          <Input
            label="Currency Symbol"
            value={currency}
            onChangeText={setCurrency}
            placeholder="$"
            icon="currency-usd"
          />

          <View style={styles.switchContainer}>
            <View style={styles.switchLeft}>
              <Icon name="percent" size={20} color={colors.text} />
              <Text style={styles.switchLabel}>Enable GST</Text>
            </View>
            <Switch
              value={gstEnabled}
              onValueChange={setGstEnabled}
              trackColor={{false: colors.border, true: colors.primary}}
              thumbColor={colors.white}
            />
          </View>

          <Button
            title="Save Settings"
            onPress={handleSaveSettings}
            icon="content-save"
          />
        </Card>

        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="lock" size={24} color={colors.danger} />
            <Text style={styles.sectionTitle}>Security</Text>
          </View>

          {currentPin ? (
            <View>
              <View style={styles.statusContainer}>
                <Icon name="check-circle" size={20} color={colors.success} />
                <Text style={styles.pinStatusEnabled}>PIN Lock is enabled</Text>
              </View>
              <Button
                title="Remove PIN"
                variant="danger"
                onPress={handleRemovePin}
                icon="lock-open"
              />
            </View>
          ) : (
            <View>
              <View style={styles.statusContainer}>
                <Icon name="alert-circle" size={20} color={colors.warning} />
                <Text style={styles.pinStatusDisabled}>PIN Lock is disabled</Text>
              </View>
              <Input
                label="New PIN"
                value={pin}
                onChangeText={setPin}
                placeholder="Enter 4+ digit PIN"
                keyboardType="number-pad"
                secureTextEntry
                icon="lock"
              />
              <Input
                label="Confirm PIN"
                value={confirmPin}
                onChangeText={setConfirmPin}
                placeholder="Re-enter PIN"
                keyboardType="number-pad"
                secureTextEntry
                icon="lock-check"
              />
              <Button
                title="Set PIN"
                onPress={handleSetPin}
                icon="lock"
              />
            </View>
          )}
        </Card>

        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="database" size={24} color={colors.warning} />
            <Text style={styles.sectionTitle}>Data Management</Text>
          </View>
          <View style={styles.warningContainer}>
            <Icon name="alert" size={20} color={colors.danger} />
            <Text style={styles.warningText}>
              This will permanently delete all your items, suppliers, customers, 
              purchases, sales, and settings. This action cannot be undone!
            </Text>
          </View>
          <Button
            title="Clear All Data"
            variant="danger"
            onPress={handleClearAllData}
            icon="delete-forever"
          />
        </Card>

        <View style={styles.footer}>
          <Icon name="package-variant" size={32} color={colors.primary} />
          <Text style={styles.footerTitle}>EasyStocker</Text>
          <Text style={styles.footerVersion}>Version 1.0.0</Text>
          <Text style={styles.footerText}>Offline Inventory Management</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
    marginLeft: 12,
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginTop: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 12,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.light,
    borderRadius: 12,
    marginBottom: 16,
  },
  switchLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
    fontWeight: '500',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.light,
    borderRadius: 12,
    marginBottom: 16,
  },
  pinStatusEnabled: {
    fontSize: 14,
    color: colors.success,
    marginLeft: 8,
    fontWeight: '500',
  },
  pinStatusDisabled: {
    fontSize: 14,
    color: colors.warning,
    marginLeft: 8,
    fontWeight: '500',
  },
  warningContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: colors.danger + '10',
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: colors.danger,
    marginLeft: 8,
    lineHeight: 20,
  },
  footer: {
    marginTop: 32,
    marginBottom: 32,
    alignItems: 'center',
  },
  footerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 12,
  },
  footerVersion: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 4,
  },
  footerText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
});

export default SettingsScreen;