import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { router } from "expo-router";
import axios from "axios";

const API_URL = "http://150.161.61.1:8083";
// const API_URL = "http://192.168.15.108:8081";

export default function SingUp() {
  const [name, setName] = useState("");
  const [idade, setIdade] = useState("");
  const [origem, setOrigem] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [titulacao, setTitulacao] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    if (
      !name ||
      !idade ||
      !origem ||
      !email ||
      !telefone ||
      !titulacao ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Erro", "Por favor, insira um e-mail válido.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem. Por favor, verifique.");
      return;
    }

    const payload = {
      name,
      idade,
      origem,
      email,
      telefone,
      titulacao,
      password,
    };

    setIsRegistering(true);

    try {
      const response = await axios.post(`${API_URL}/auth/register`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 || response.status === 201) {
        Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
        router.push("/sing-in");
      } else {
        Alert.alert("Erro", "Erro ao realizar o cadastro.");
      }
    } catch (error: any) {
      // console.error("Erro na requisição:", error);
      const message =
        error.response?.data?.message ||
        "Não foi possível realizar o cadastro.";
      Alert.alert("Erro", message);
    } finally {
      setIsRegistering(false);
    }
  };

  if (isRegistering) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#b41976ff" />
        <Text className="mt-4 text-black-500">Realizando cadastro...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <StatusBar style="light" translucent />
      {/* Header */}
      <View
        className="bg-primary-500 px-6 py-10"
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
          Seja bem-vindo(a)!
        </Text>
      </View>

      {/* Form Section */}
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid
        extraScrollHeight={130}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ paddingHorizontal: 20, paddingVertical: 20 }}>
          <Text className="text-black-500 font-bold mb-6">Cadastro</Text>

          {/* Input Fields */}
          <TextInput
            placeholder="Nome completo"
            placeholderTextColor="#666"
            className="border-b-4 border-white-600 mb-4 p-2 bg-white-600 rounded-lg"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            placeholder="E-mail"
            placeholderTextColor="#666"
            keyboardType="email-address"
            className="border-b-4 border-white-600 mb-4 p-2 bg-white-600 rounded-lg"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            placeholder="Idade"
            placeholderTextColor="#666"
            keyboardType="numeric"
            className="border-b-4 border-white-600 mb-4 p-2 bg-white-600 rounded-lg"
            value={idade}
            onChangeText={setIdade}
          />
          <TextInput
            placeholder="Telefone"
            placeholderTextColor="#666"
            keyboardType="phone-pad"
            className="border-b-4 border-white-600 mb-4 p-2 bg-white-600 rounded-lg"
            value={telefone}
            onChangeText={setTelefone}
          />
          <TextInput
            placeholder="Origem (Ex: País, Estado, etc.)"
            placeholderTextColor="#666"
            className="border-b-4 border-white-600 mb-4 p-2 bg-white-600 rounded-lg"
            value={origem}
            onChangeText={setOrigem}
          />
          <TextInput
            placeholder="Profissão"
            placeholderTextColor="#666"
            className="border-b-4 border-white-600 mb-4 p-2 bg-white-600 rounded-lg"
            value={titulacao}
            onChangeText={setTitulacao}
          />
          <TextInput
            placeholder="Senha"
            placeholderTextColor="#666"
            secureTextEntry
            className="border-b-4 border-white-600 mb-4 p-2 bg-white-600 rounded-lg"
            value={password}
            onChangeText={setPassword}
          />
          <TextInput
            placeholder="Confirmar senha"
            placeholderTextColor="#666"
            secureTextEntry
            className="border-b-4 border-white-600 mb-4 p-2 bg-white-600 rounded-lg"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <TouchableOpacity
            className="bg-primary-500 px-4 py-2 mt-10 rounded-lg justify-center items-center w-full"
            onPress={handleRegister}
          >
            <Text className="text-white-500 font-bold text-center text-xl">
              Cadastrar
            </Text>
          </TouchableOpacity>

          {/* Register Link */}
          <TouchableOpacity
            onPress={() => {
              router.push("/sing-in");
            }}
          >
            <Text className="text-center mt-2">
              <Text className="text-black-500">Já tem uma conta? </Text>
              <Text className="text-primary-500">Entrar agora</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="mt-10"
            onPress={() => {
              router.push("/faq");
            }}
          >
            <Text className="text-center">
              <Text className="text-primary-500">Preciso de ajuda</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
