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
import { useTranslation } from "../context/LanguageContext";

const API_URL = "http://192.168.0.105:8083";
// const API_URL = "https://ac8b5f7d0939.ngrok-free.app";

export default function SignIn() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

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
    setIsAuthenticating(true);
    if (!email || !password) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      setIsAuthenticating(false);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      // Se o status for 200, login bem-sucedido
      if (response.status === 200 && response.data.token) {
        await SecureStore.setItemAsync("access_token", response.data.token);
        router.push("/home");
      } else {
        // Caso raro: resposta inesperada
        Alert.alert("Erro", "Resposta inesperada do servidor.");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data;

        if (status === 404 && typeof message === "string") {
          Alert.alert("Erro", "Usuário não encontrado.");
        } else if (status === 401 && typeof message === "string") {
          Alert.alert("Erro", "Senha incorreta.");
        } else if (typeof message === "string") {
          Alert.alert("Erro", message);
        } else {
          Alert.alert("Erro", "Erro ao fazer login.");
        }
      } else {
        Alert.alert("Erro", "Erro inesperado.");
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white-500">
        <ActivityIndicator size="large" color="#b41976" />
      </SafeAreaView>
    );
  }
  if (isAuthenticating) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white-500">
        <ActivityIndicator size="large" color="#b41976" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <StatusBar style="light" translucent />

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
          {t("auth.login.welcome") || "Bem-vindo(a) de volta!"}
        </Text>
      </View>

      <View className="flex-1 bg-white-500 px-6 py-10">
        <Text className="text-black-500 font-bold mb-6">
          {t("auth.login.title")}
        </Text>

        <TextInput
          placeholder={t("auth.login.email")}
          keyboardType="email-address"
          className="border-b-4 border-white-600 mb-4 p-2 bg-white-600 rounded-lg"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder={t("auth.login.password")}
          secureTextEntry
          className="border-b-4 border-white-600 mb-4 p-2 bg-white-600 rounded-lg"
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          onPress={() => {
            router.push("/recuperar_senha");
          }}
        >
          <Text className="text-right">
            <Text className="text-primary-500">
              {t("auth.login.forgotPassword")}
            </Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-primary-500 px-4 py-2 mt-10 rounded-lg justify-center items-center w-full"
          onPress={handleLogin}
        >
          <Text className="text-white-500 font-bold text-center text-xl">
            {t("auth.login.loginButton")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            router.push("/sing-up");
          }}
        >
          <Text className="text-center mt-2">
            <Text className="text-black-500">{t("auth.login.noAccount")}</Text>
            <Text className="text-primary-500">{t("auth.login.signUp")}</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
