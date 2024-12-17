import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [isFirstUse, setIsFirstUse] = useState(null);
  const [fullName, setFullName] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [storedLogin, setStoredLogin] = useState(null);
  const [storedPassword, setStoredPassword] = useState(null);

  useEffect(() => {
    checkIfFirstUse();
  }, []);

  const checkIfFirstUse = async () => {
    try {
      const savedLogin = await AsyncStorage.getItem('userLogin');
      const savedPassword = await AsyncStorage.getItem('userPassword');

      if (savedLogin && savedPassword) {
        setStoredLogin(savedLogin);
        setStoredPassword(savedPassword);
        setIsFirstUse(false);
      } else {
        setIsFirstUse(true);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível verificar as credenciais.');
    }
  };

  const handleRegister = async () => {
    if (!fullName || !login || !password) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios.');
      return;
    }

    try {
      await AsyncStorage.setItem('userLogin', login);
      await AsyncStorage.setItem('userPassword', password);
      setIsFirstUse(false);
      Alert.alert('Sucesso', 'Usuário registrado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar as informações.');
    }
  };

  const handleLogin = () => {
    if (login === storedLogin && password === storedPassword) {
      Alert.alert('Sucesso', 'Login realizado com sucesso!');
    } else {
      Alert.alert('Erro', 'Login ou senha inválidos.');
    }
  };

  if (isFirstUse === null) {
    return (
      <View style={styles.container}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isFirstUse ? (
        <>
          <Text style={styles.title}>Registro</Text>
          <TextInput
            placeholder="Nome Completo"
            value={fullName}
            onChangeText={setFullName}
            style={styles.input}
          />
          <TextInput
            placeholder="Login"
            value={login}
            onChangeText={setLogin}
            style={styles.input}
          />
          <TextInput
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
          <Button title="Registrar" onPress={handleRegister} />
        </>
      ) : (
        <>
          <Text style={styles.title}>Login</Text>
          <TextInput
            placeholder="Login"
            value={login}
            onChangeText={setLogin}
            style={styles.input}
          />
          <TextInput
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
          <Button title="Entrar" onPress={handleLogin} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
});