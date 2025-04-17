import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";

export default function SingIn() {
  return (
    <SafeAreaView className="flex-1">
      <StatusBar style="light" backgroundColor="#b41976ff" translucent />
      {/* Header */}
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

      {/* Form Section */}
      <View className="flex-1 bg-white-500 px-6 py-10">
        <Text className="text-black-500 font-bold mb-6">Login</Text>

        {/* Input Fields */}
        <TextInput
          placeholder="E-mail"
          keyboardType="email-address"
          className="border-b-4 border-white-600 mb-4 p-2 bg-white-600 rounded-lg"
        />
        <TextInput
          placeholder="Senha"
          secureTextEntry
          className="border-b-4 border-white-600 mb-4 p-2 bg-white-600 rounded-lg"
        />
        <TouchableOpacity>
          <Text className="text-right">
            <Text className="text-primary-500">Esqueceu a senha?</Text>
          </Text>
        </TouchableOpacity>

        {/* Submit Button */}
        <TouchableOpacity
          className="bg-primary-500 px-4 py-2 mt-10 rounded-lg justify-center items-center w-full"
          onPress={() => {
            router.navigate("/stack/home");
          }}
        >
          <Text className="text-white-500 font-bold text-center text-xl">
            Entrar
          </Text>
        </TouchableOpacity>

        {/* Register Link */}
        <TouchableOpacity
          onPress={() => {
            router.navigate("/sing-up");
          }}
        >
          <Text className="text-center mt-2">
            <Text className="text-black-500">Não tem uma conta? </Text>
            <Text className="text-primary-500">Registrar agora</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="mt-52"
          onPress={() => {
            router.navigate("/");
          }}
        >
          <Text className="text-center">
            <Text className="text-primary-500">Preciso de ajuda</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
