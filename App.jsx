import React, {useState, useEffect} from 'react';
import {StatusBar, View, ActivityIndicator} from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import LockScreen from './src/screens/LockScreen';
import {getSettings} from './src/utils/storage';

const App = () => {
  const [isLocked, setIsLocked] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPin, setHasPin] = useState(false);

  useEffect(() => {
    checkPinStatus();
  }, []);

  const checkPinStatus = async () => {
    try {
      const settings = await getSettings();
      if (settings && settings.pin) {
        setHasPin(true);
        setIsLocked(true);
      } else {
        setHasPin(false);
        setIsLocked(false);
      }
    } catch (error) {
      console.error('Error checking PIN status:', error);
      setIsLocked(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnlock = () => {
    setIsLocked(false);
  };

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems:  'center'}}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (hasPin && isLocked) {
    return <LockScreen onUnlock={handleUnlock} />;
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <AppNavigator />
    </>
  );
};

export default App;