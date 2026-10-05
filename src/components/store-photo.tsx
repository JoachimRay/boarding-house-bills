import { useState } from 'react';
import { Button, Image, Linking } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { ThemedText } from './themed-text';

export function StorePhoto() {
  const [photo, setPhoto] = useState('');
  const [denied, setDenied] = useState(false);

  async function take() {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    setDenied(!granted);
    if (!granted) return;

    const result = await ImagePicker.launchCameraAsync();
    if (!result.canceled) setPhoto(result.assets[0].uri);
  }

  return (
    <>
      <Button title="Take a store photo" onPress={() => void take()} />
      {photo !== '' && (
        <Image source={{ uri: photo }} style={{ height: 220, width: '100%' }} />
      )}
      {denied && <ThemedText>Camera is off for this app.</ThemedText>}
      {denied && (
        <Button title="Open settings" onPress={() => void Linking.openSettings()} />
      )}
    </>
  );
}