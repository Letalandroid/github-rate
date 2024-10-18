import { StyleSheet, Text, View, StatusBar, Image, Pressable, Platform } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useEffect, useState } from 'react';
import Spinner from 'react-native-loading-spinner-overlay';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const gh_icon = require('../../assets/images/gh_white.png');
const fire = require('../../assets/images/fire.png');

export default function HomeScreen() {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const [username, setUsername] = useState('letalandroid');

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://streak-stats-getinfo.onrender.com/getAll?username=${username}`);
      if (!response.ok) {
        alert('Network response was not ok');
        return;
      }
      const json = await response.json();
      setData(json);
      await loadUsername();
    } catch (err) {
      setError(err);
    }
  };

  const loadUsername = async () => {
    try {
      const storedUsername = await AsyncStorage.getItem('username');
      if (storedUsername) {
        setUsername(storedUsername);
      }
    } catch (error) {
      alert('Error al obtener el username')
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await loadUsername();
      fetchData();
    };
    loadData();
  }, []);

  useEffect(() => {
    if (username) {
      fetchData();
    }
  }, [username]);

  return (
    loading ? (
      <View style={styles.container}>
        <StatusBar
          barStyle="default"
        />
        <Spinner
        visible={loading}
        textContent={'Loading...'}
        />
      </View>
    ) : (
      <View style={styles.container}>
        <Pressable style={styles.gh_img} onPress={() => navigation.navigate('(tabs)/explore')}>
            <Image style={{width: 65, height: 65, borderRadius: 100}} source={{ uri: `https://github.com/${username}.png` }} />
        </Pressable>
        <Text style={styles.title}>🔥 {username} 🔥</Text>
        <View>
          <Image source={fire} style={styles.fire_img} />
          <View style={styles.cont_txt_streak}>
            <Text style={styles.txt_streak}>{data?.streaks[0].text[0] ?? 0}</Text>
          </View>
        </View>
        <Pressable style={styles.btn} onPress={() => fetchData()}>
          <Text style={styles.btnText}>Recargar</Text>
        </Pressable>
        <StatusBar
          barStyle="light-content"
        />
      </View>
    )
  );
}

const isIOS = Platform.OS === 'ios';

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight,
    flex: 1,
    backgroundColor: Colors.dark.background,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20
  },
  gh_img: {
    position: 'absolute',
    alignSelf: 'center',
    top: isIOS ? 50 : (10 + (StatusBar.currentHeight != undefined ? StatusBar.currentHeight : 0)),
  },
  title: {
    color: Colors.dark.text,
    fontWeight: 'bold',
    fontSize: 28,
  },
  fire_img: {
    width: 150,
    height: 150,
  },
  btn: {
    backgroundColor: Colors.dark.tint,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center', // Centra el texto horizontalmente
  },
  btnText: {
    color: Colors.dark.text,
    fontWeight: 'bold',
    fontSize: 20,
  },
  txt_streak: {
    color: Colors.dark.fire,
    backgroundColor: Colors.dark.text,
    fontWeight: 'bold',
    fontSize: 25,
    textAlign: 'center',
  },
  cont_txt_streak: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    zIndex: 5,
    paddingHorizontal: 12,
    paddingVertical: 3,
    backgroundColor: Colors.dark.text,
    borderWidth: 5,
    borderColor: Colors.dark.fire,
    borderRadius: 100
  },
});