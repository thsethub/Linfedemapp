import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import axios from "axios";

const API_URL = "http://191.252.38.73:8083"



export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      const token = await SecureStore.getItemAsync("access_token");
      if (token) {
        try {
          // Faz requisição para validar o token
          const response = await axios.get(`${API_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.status === 200) {
            // Token válido, redireciona para Home
            console.log("Token:", token); // Log do token recebido
            router.push("/home");
          }
        } catch (error) {
          // Token inválido ou expirado
          await SecureStore.deleteItemAsync("access_token");
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    checkToken();
  }, []);

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      const { token } = response.data;

      console.log("Token:", token); // Log do token recebido
      await SecureStore.setItemAsync("access_token", token);
      router.push("/home");
    } catch (error) {
      // console.error("Erro ao fazer login:", error);
      Alert.alert("Erro", "E-mail ou senha inválidos.");
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white-500">
        <ActivityIndicator size="large" color="#b41976" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <StatusBar style="light" backgroundColor="#b41976ff" translucent />

      <View
        className="bg-primary-500 px-6 py-10 mb-10"
        style={{
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
          height: 200,
        }}
      >
        <Text className="text-white-500 font-regular mb-6 mt-16">
          LINFEDEMAPP
        </Text>
        <Text className="text-white-500 font-semibold text-3xl">
          Bem-vinda de volta!
        </Text>
      </View>

      <View className="flex-1 bg-white-500 px-6 py-10">
        <Text className="text-black-500 font-bold mb-6">Login</Text>

        <TextInput
          placeholder="E-mail"
          keyboardType="email-address"
          className="border-b-4 border-white-600 mb-4 p-2 bg-white-600 rounded-lg"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Senha"
          secureTextEntry
          className="border-b-4 border-white-600 mb-4 p-2 bg-white-600 rounded-lg"
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity>
          <Text className="text-right">
            <Text className="text-primary-500">Esqueceu a senha?</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-primary-500 px-4 py-2 mt-10 rounded-lg justify-center items-center w-full"
          onPress={handleLogin}
        >
          <Text className="text-white-500 font-bold text-center text-xl">
            Entrar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            router.push("/sing-up");
          }}
        >
          <Text className="text-center mt-2">
            <Text className="text-black-500">Não tem uma conta? </Text>
            <Text className="text-primary-500">Registrar agora</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
