import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useTranslation, useLanguage } from "../context/LanguageContext";
import { Feather } from "@expo/vector-icons";

const languages = [
  {
    code: "pt-BR",
    name: "Português",
    nativeName: "Português",
    flag: "🇧🇷",
    country: "BR",
  },
  {
    code: "es-ES",
    name: "Español",
    nativeName: "Español",
    flag: "🌐",
    country: "ES",
  },
];

export default function Settings() {
  const { t } = useTranslation();
  const { currentLanguage, setLanguage } = useLanguage();
  const [notifications, setNotifications] = useState(true);

  const handleLanguageChange = async (languageCode: string) => {
    try {
      await setLanguage(languageCode as "pt-BR" | "es-ES");
    } catch (error) {
      console.error("Erro ao alterar idioma:", error);
    }
  };

  const getCurrentLanguageDisplay = () => {
    const current = languages.find((lang) => lang.code === currentLanguage);
    return current?.nativeName || "Português";
  };

  const LanguageCard = ({ language }: { language: (typeof languages)[0] }) => {
    const isSelected = currentLanguage === language.code;

    return (
      <TouchableOpacity
        className={`p-4 rounded-xl mb-3 ${
          isSelected
            ? "bg-pink-50 border border-primary-200"
            : "bg-white border border-gray-200"
        }`}
        style={{
          shadowColor: isSelected ? "#B91C7C" : "#000",
          shadowOffset: { width: 0, height: isSelected ? 2 : 1 },
          shadowOpacity: isSelected ? 0.12 : 0.05,
          shadowRadius: isSelected ? 6 : 3,
        }}
        onPress={() => handleLanguageChange(language.code)}
      >
        <View className="flex-row items-center">
          <Text className="text-2xl mr-3">{language.flag}</Text>
          <View className="flex-1">
            <Text
              className={`font-semibold text-base ${
                isSelected ? "text-primary-500" : "text-gray-900"
              }`}
            >
              {language.name}
            </Text>
            <Text className="text-gray-500 text-sm">{language.nativeName}</Text>
          </View>
          {isSelected && (
            <View className="w-6 h-6 bg-primary-500 rounded-full items-center justify-center">
              <Feather name="check" size={16} color="white" />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const SettingCard = ({
    icon,
    title,
    subtitle,
    onPress,
    showArrow = true,
    rightComponent,
  }: {
    icon: string;
    title: string;
    subtitle: string;
    onPress?: () => void;
    showArrow?: boolean;
    rightComponent?: React.ReactNode;
  }) => (
    <TouchableOpacity
      className="bg-white rounded-xl p-4 mb-3 border border-gray-200"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      }}
      onPress={onPress}
      disabled={!onPress && !rightComponent}
    >
      <View className="flex-row items-center">
        <View className="w-10 h-10 bg-primary-50 rounded-full items-center justify-center mr-3">
          <Feather name={icon as any} size={20} color="#B91C7C" />
        </View>
        <View className="flex-1">
          <Text className="text-gray-900 font-semibold text-base">{title}</Text>
          <Text className="text-gray-500 text-sm">{subtitle}</Text>
        </View>
        {rightComponent
          ? rightComponent
          : showArrow && (
              <Feather name="chevron-right" size={20} color="#9CA3AF" />
            )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 0 }}
      >
        {/* Header */}
        <View className="bg-white px-6 py-4 mb-6">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => router.back()}
              className="mr-4 w-10 h-10 items-center justify-center rounded-full"
              activeOpacity={0.7}
            >
              <Feather name="arrow-left" size={24} color="#374151" />
            </TouchableOpacity>
            <Text className="text-xl font-semibold text-gray-900">
              {t("common.settings") || "Configuración"}
            </Text>
          </View>
        </View>

        {/* Content Container */}
        <View style={{ paddingHorizontal: 24 }}>
          {/* General Section */}
          <View className="mb-8">
            <Text className="text-lg font-medium text-gray-900 mb-4">
              {t("settings.general") || "General"}
            </Text>

            {/* Current Language Display */}
            <View
              className="rounded-xl p-4 mb-6 bg-white border border-gray-200"
              style={{
                shadowColor: "#B91C7C",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 6,
              }}
            >
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-primary-100 rounded-full items-center justify-center mr-3">
                  <Feather name="globe" size={20} color="#B91C7C" />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-900">
                    {t("common.language") || "Idioma"}
                  </Text>
                  <Text className="text-gray-600 text-sm">
                    {getCurrentLanguageDisplay()}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Language Selection */}
          <View className="mb-8">
            <View className="mb-4">
              <Text className="text-lg font-medium text-gray-900">
                {t("common.language") || "Idioma"}
              </Text>
              <Text className="text-gray-600 text-sm mt-1">
                {currentLanguage === "es-ES"
                  ? "Selecciona tu idioma preferido"
                  : "Selecione seu idioma preferido"}
              </Text>
            </View>

            <View>
              {languages.map((language) => (
                <LanguageCard key={language.code} language={language} />
              ))}
            </View>

            {/* Language Change Notice */}
            <View className="flex-row bg-blue-50 border border-blue-100 rounded-xl p-4 mt-4">
              <Feather
                name="info"
                size={20}
                color="#3B82F6"
                style={{ marginTop: 2, marginRight: 12 }}
              />
              <Text className="text-gray-800 text-sm flex-1">
                {currentLanguage === "es-ES"
                  ? "El cambio de idioma se aplicará inmediatamente en toda la aplicación"
                  : "A alteração do idioma será aplicada imediatamente em todo o aplicativo"}
              </Text>
            </View>
          </View>

          {/* Account Section */}
          <View className="mb-8">
            <Text className="text-lg font-medium text-gray-900 mb-4">
              {t("settings.account") || "Cuenta"}
            </Text>

            <SettingCard
              icon="user"
              title={t("settings.profile") || "Perfil"}
              subtitle={
                t("settings.profileSubtitle") ||
                "Gestionar información personal"
              }
              // onPress={() => router.push("/profile")}
            />

            <SettingCard
              icon="bell"
              title={t("settings.notifications") || "Notificaciones"}
              subtitle={
                t("settings.notificationsSubtitle") ||
                "Configurar alertas y recordatorios"
              }
              showArrow={false}
              rightComponent={
                <Switch
                  value={notifications}
                  onValueChange={setNotifications}
                  trackColor={{ false: "#D1D5DB", true: "#B91C7C" }}
                  thumbColor={notifications ? "#FFFFFF" : "#FFFFFF"}
                />
              }
            />
          </View>

          {/* Support Section */}
          <View className="mb-8">
            <Text className="text-lg font-medium text-gray-900 mb-4">
              {t("settings.support") || "Soporte"}
            </Text>

            <SettingCard
              icon="help-circle"
              title={t("settings.help") || "Ayuda y FAQ"}
              subtitle={
                t("settings.helpSubtitle") || "Preguntas frecuentes y soporte"
              }
              onPress={() => router.push("/faq")}
            />

            <SettingCard
              icon="info"
              title={t("settings.about") || "Acerca de la App"}
              subtitle={t("settings.aboutSubtitle") || "Versión 1.0.0"}
              onPress={() => {
                // Implementar tela sobre o app
              }}
            />
          </View>

          {/* Sign Out */}
          <TouchableOpacity
            className="border border-red-200 rounded-xl p-4 bg-red-50 flex-row items-center justify-center"
            style={{
              shadowColor: "#EF4444",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.08,
              shadowRadius: 2,
            }}
            onPress={() => {
              router.replace("/sing-in");
            }}
          >
            <Feather name="log-out" size={20} color="#EF4444" />
            <Text className="text-red-500 font-semibold text-base ml-2">
              {t("settings.logout") || "Cerrar Sesión"}
            </Text>
          </TouchableOpacity>

          {/* Espaço no final */}
          <View className="h-6" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
