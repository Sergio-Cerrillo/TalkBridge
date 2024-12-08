import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import { LoadingScreen } from './components/LoadingScreen';
import { LogSign } from './components/LogSign';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import LanguageSelector from './components/LanguageSelector';
import { MainPage } from './components/MainPage';
import { Management } from './components/Management';


const firebaseConfig = {
  apiKey: "AIzaSyAa2gFIiFy86V0Bq1TueI22QDOedAgrItA",
  authDomain: "talkbridge-81739.firebaseapp.com",
  projectId: "talkbridge-81739",
  storageBucket: "talkbridge-81739.firebasestorage.app",
  messagingSenderId: "778370200362",
  appId: "G-QZ062L9XV3",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const usersCollection = firebase.firestore().collection('users');

export default function App() {

  const [selectedLanguageKnow, setSelectedLanguageKnow] = useState('en');
  const [selectedLanguageLearn, setSelectedLanguageLearn] = useState('en');
  const [selectedGender, setSelectedGender] = useState()
  const Stack = createStackNavigator();

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  const onAuthStateChanged = (user) => {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber
  }, [])

  if (initializing) return <LoadingScreen />

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Loading">
        <Stack.Screen name="Loading" component={LoadingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="LogSign" options={{ headerShown: false }}>
          {() => (
            <LogSign
              selectedLanguageKnow={selectedLanguageKnow}
              selectedLanguageLearn={selectedLanguageLearn}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="LangSelect" options={{ headerShown: false }} >
          {() => (
            <LanguageSelector
              setSelectedLanguageKnow={setSelectedLanguageKnow}
              setSelectedLanguageLearn={setSelectedLanguageLearn}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="MainPage" component={MainPage} options={{ headerShown: false }} />
        <Stack.Screen name="Management" component={Management} options={{ headerShown: false }} />
      </Stack.Navigator>

    </NavigationContainer>
  );
}


