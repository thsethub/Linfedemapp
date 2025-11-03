import React from "react";
import { View, Text, TouchableOpacity, Alert, ScrollView } from "react-native";
import { useLanguage } from "../context/LanguageContext";
import { countries, Language } from "../locales";

interface LanguageChangerProps {
  onLanguageChange?: () => void;
}

export default function LanguageChanger({
  onLanguageChange,
}: LanguageChangerProps) {
  const { currentLanguage, setLanguage, t } = useLanguage();

  const handleChangeLanguage = async (newLanguage: Language) => {
    if (newLanguage === currentLanguage) return;

    try {
      await setLanguage(newLanguage);
      onLanguageChange?.();

      const message =
        newLanguage === "pt-BR"
          ? "Idioma alterado para Português"
          : "Idioma cambiado a Español";

      Alert.alert(newLanguage === "pt-BR" ? "Sucesso" : "Éxito", message, [
        { text: "OK" },
      ]);
    } catch (error) {
      console.error("Erro ao alterar idioma:", error);
      Alert.alert(
        currentLanguage === "pt-BR" ? "Erro" : "Error",
        currentLanguage === "pt-BR"
          ? "Não foi possível alterar o idioma"
          : "No se pudo cambiar el idioma",
        [{ text: "OK" }]
      );
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{
        padding: 20,
        paddingBottom: 40,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2 text-gray-900">
          {t("common.language") ||
            (currentLanguage === "pt-BR" ? "Idioma" : "Idioma")}
        </Text>
        <Text className="text-gray-600 mb-6">
          {currentLanguage === "pt-BR"
            ? "Selecione seu idioma preferido"
            : "Selecciona tu idioma preferido"}
        </Text>
      </View>

      <View className="space-y-3">
        {countries.map((country) => {
          const isSelected = currentLanguage === country.code;
          return (
            <TouchableOpacity
              key={country.code}
              className={`p-4 rounded-2xl border-2 flex-row items-center justify-between ${
                isSelected
                  ? "border-primary-500 bg-pink-50"
                  : "border-gray-200 bg-white"
              }`}
              onPress={() => handleChangeLanguage(country.code)}
              style={{
                elevation: isSelected ? 4 : 2,
                shadowColor: isSelected ? "#EC4899" : "#000",
                shadowOffset: { width: 0, height: isSelected ? 3 : 1 },
                shadowOpacity: isSelected ? 0.2 : 0.1,
                shadowRadius: isSelected ? 6 : 3,
              }}
            >
              <View className="flex-row items-center flex-1">
                <View className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center mr-4">
                  <Text className="text-2xl">{country.flag}</Text>
                </View>
                <View className="flex-1">
                  <Text
                    className={`text-lg font-bold ${
                      isSelected ? "text-primary-500" : "text-gray-900"
                    }`}
                  >
                    {country.country}
                  </Text>
                  <Text className="text-gray-500 text-sm font-medium">
                    {country.name}
                  </Text>
                </View>
              </View>

              <View
                className={`w-6 h-6 border-2 rounded-full items-center justify-center ${
                  isSelected
                    ? "border-primary-500 bg-primary-500"
                    : "border-gray-300"
                }`}
              >
                {isSelected && (
                  <Text className="text-white text-xs font-bold">✓</Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Informação adicional */}
      <View className="mt-8 bg-blue-50 p-4 rounded-xl border-l-4 border-blue-400">
        <Text className="text-center text-gray-600 text-sm leading-5">
          💡{" "}
          {currentLanguage === "pt-BR"
            ? "A alteração do idioma será aplicada imediatamente em todo o aplicativo"
            : "El cambio de idioma se aplicará inmediatamente en toda la aplicación"}
        </Text>
      </View>
    </ScrollView>
  );
}
