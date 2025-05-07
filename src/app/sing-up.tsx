import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import axios from "axios";
import {API_URL} from '@env';

export default function SingUp() {
  const [name, setName] = useState("");
  const [idade, setIdade] = useState("");
  const [origem, setOrigem] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [titulacao, setTitulacao] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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

    try {
      const response = await axios.post(
        `${API_URL}/auth/register`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
        router.push("/sing-in");
      } else {
        Alert.alert("Erro", "Erro ao realizar o cadastro.");
      }
    } catch (error: any) {
      console.error("Erro na requisição:", error);
      const message =
        error.response?.data?.message ||
        "Não foi possível realizar o cadastro.";
      Alert.alert("Erro", message);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <StatusBar style="light" backgroundColor="#b41976ff" translucent />
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
          Seja bem-vinda!
        </Text>
      </View>

      {/* Form Section */}
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 24,
          paddingVertical: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-black-500 font-bold mb-6">Cadastro</Text>

        {/* Input Fields */}
        <TextInput
          placeholder="Nome completo"
          className="border-b-4 border-white-600 mb-4 p-2 bg-white-600 rounded-lg"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          placeholder="E-mail"
          keyboardType="email-address"
          className="border-b-4 border-white-600 mb-4 p-2 bg-white-600 rounded-lg"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Idade"
          keyboardType="numeric"
          className="border-b-4 border-white-600 mb-4 p-2 bg-white-600 rounded-lg"
          value={idade}
          onChangeText={setIdade}
        />
        <TextInput
          placeholder="Telefone"
          keyboardType="phone-pad"
          className="border-b-4 border-white-600 mb-4 p-2 bg-white-600 rounded-lg"
          value={telefone}
          onChangeText={setTelefone}
        />
        <TextInput
          placeholder="Origem (Ex: País, Estado, etc.)"
          className="border-b-4 border-white-600 mb-4 p-2 bg-white-600 rounded-lg"
          value={origem}
          onChangeText={setOrigem}
        />
        <TextInput
          placeholder="Titulação (Ex: Graduação, mestrado, etc.)"
          className="border-b-4 border-white-600 mb-4 p-2 bg-white-600 rounded-lg"
          value={titulacao}
          onChangeText={setTitulacao}
        />
        <TextInput
          placeholder="Senha"
          secureTextEntry
          className="border-b-4 border-white-600 mb-4 p-2 bg-white-600 rounded-lg"
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          placeholder="Confirmar senha"
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
            router.push("/");
          }}
        >
          <Text className="text-center">
            <Text className="text-primary-500">Preciso de ajuda</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
