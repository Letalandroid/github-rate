import { StyleSheet, Image, View, Text, TextInput, StatusBar, Pressable } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TabTwoScreen() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState('letalandroid');

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://github.com/${username}.png`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const json = await response.json();
      setData(json);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const saveChanges = async () => {
    await AsyncStorage.setItem('username', username);
    alert(`Guardado: ${username}`);
  };

  const loadUsername = async () => {
    try {
      const storedUsername = await AsyncStorage.getItem('username');
      if (storedUsername) {
        setUsername(storedUsername);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadUsername();
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Image source={{ uri: `https://github.com/${username}.png` }} style={styles.image} />
      <Text style={styles.text}>{username}</Text>
      <TextInput
        onChangeText={setUsername}
        placeholder="Ingrese su nombre de usuario"
        style={styles.input}
      />
      <Pressable onPress={saveChanges}>
        <Text style={styles.buttonText}>Guardar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight,
    flex: 1,
    backgroundColor: Colors.dark.background,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  text: {
    color: Colors.dark.text,
    fontSize: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  input: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.dark.text,
    borderRadius: 5,
    color: Colors.dark.text,
  },
  buttonText: {
    color: Colors.dark.text,
    fontSize: 16,
    padding: 10,
    backgroundColor: Colors.dark.tint,
    borderRadius: 5,
  },
});
