import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Image,
} from "react-native";
import { router } from "expo-router";
import { useTranslation } from "../context/LanguageContext";
import Entypo from "@expo/vector-icons/Entypo";

export default function Profile() {
  const { t } = useTranslation();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View className="bg-white border-b border-gray-200 px-6 py-4">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2">
            <Entypo name="chevron-left" size={24} color="#EC4899" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900">
            {t("profile.title") || "Perfil Profissional"}
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 p-6">
        {/* Profile Header */}
        <View className="items-center mb-8">
          <View className="w-24 h-24 rounded-full bg-primary-500 items-center justify-center mb-4">
            <Entypo name="user" size={40} color="white" />
          </View>
          <Text className="text-2xl font-bold text-gray-900 mb-1">
            Dr. João Silva
          </Text>
          <Text className="text-gray-600">
            {t("profile.specialty") || "Fisioterapeuta"}
          </Text>
          <Text className="text-sm text-gray-500">CRM: 12345-SP</Text>
        </View>

        {/* Profile Info */}
        <View className="space-y-4">
          <View className="bg-gray-50 p-4 rounded-xl">
            <Text className="text-sm text-gray-600 mb-1">
              {t("profile.email") || "E-mail"}
            </Text>
            <Text className="text-lg text-gray-900 font-medium">
              joao.silva@exemplo.com
            </Text>
          </View>

          <View className="bg-gray-50 p-4 rounded-xl">
            <Text className="text-sm text-gray-600 mb-1">
              {t("profile.phone") || "Telefone"}
            </Text>
            <Text className="text-lg text-gray-900 font-medium">
              (11) 99999-9999
            </Text>
          </View>

          <View className="bg-gray-50 p-4 rounded-xl">
            <Text className="text-sm text-gray-600 mb-1">
              {t("profile.institution") || "Instituição"}
            </Text>
            <Text className="text-lg text-gray-900 font-medium">
              Hospital Universitário
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="mt-8 space-y-4">
          <TouchableOpacity className="bg-primary-500 p-4 rounded-xl">
            <Text className="text-white text-center font-bold text-lg">
              {t("profile.editProfile") || "Editar Perfil"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-red-500 p-4 rounded-xl">
            <Text className="text-white text-center font-bold text-lg">
              {t("profile.logout") || "Sair da Conta"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
