import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Alert,
  StatusBar,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useLanguage, useTranslation } from "../context/LanguageContext";
import { countries, Language } from "../locales";

const { height } = Dimensions.get("window");

export default function LanguageSelector() {
  const { setLanguage } = useLanguage();
  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  // Função para obter textos baseados na seleção atual ou fallback para português
  const getLocalizedText = (ptText: string, esText: string) => {
    if (selectedLanguage === "es-ES") {
      return esText;
    }
    return ptText;
  };

  const handleConfirm = async () => {
    if (!selectedLanguage) {
      Alert.alert(
        getLocalizedText("Seleção necessária", "Selección necesaria"),
        getLocalizedText(
          "Por favor, selecione um idioma.",
          "Por favor, selecciona un idioma."
        )
      );
      return;
    }
    try {
      await setLanguage(selectedLanguage as Language);
      router.replace("/");
    } catch (error) {
      console.error("Erro ao salvar idioma:", error);
      Alert.alert(
        getLocalizedText("Erro", "Error"),
        getLocalizedText(
          "Não foi possível salvar sua preferência de idioma.",
          "No fue posible guardar tu preferencia de idioma."
        )
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#b41976" />

      {/* Header Section with Globe Icon */}
      <View style={styles.headerContainer}>
        <View style={styles.globeIconContainer}>
          <Feather name="globe" size={40} color="white" />
        </View>
      </View>

      {/* Bottom Sheet / Panel */}
      <View style={styles.bottomSheet}>
        <View style={styles.sheetHandle} />
        <Text style={styles.appName}>LINFEDEMAPP</Text>
        <Text style={styles.sheetTitle}>
          {getLocalizedText("Selecione seu idioma", "Selecciona tu idioma")}
        </Text>
        <Text style={styles.sheetSubtitle}>
          {getLocalizedText(
            "Escolha o idioma que prefere usar no aplicativo.",
            "Elige el idioma que prefieres usar en la aplicación."
          )}
        </Text>

        {/* Language Options */}
        <View style={styles.optionsContainer}>
          {countries.map((country) => {
            const isSelected = selectedLanguage === country.code;

            return (
              <TouchableOpacity
                key={country.code}
                style={
                  isSelected ? styles.optionCardSelected : styles.optionCard
                }
                onPress={() => setSelectedLanguage(country.code)}
                activeOpacity={1}
              >
                <View style={styles.optionInfo}>
                  <Text style={styles.optionFlag}>{country.flag}</Text>
                  <View>
                    <Text
                      style={
                        isSelected
                          ? styles.optionCountrySelected
                          : styles.optionCountry
                      }
                    >
                      {country.country}
                    </Text>
                    <Text
                      style={
                        isSelected
                          ? styles.optionLanguageSelected
                          : styles.optionLanguage
                      }
                    >
                      {country.name}
                    </Text>
                  </View>
                </View>
                {isSelected && (
                  <View style={styles.checkContainer}>
                    <Feather name="check" size={16} color="white" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Confirm Button */}
        <TouchableOpacity
          style={[
            styles.confirmButton,
            !selectedLanguage && styles.confirmButtonDisabled,
          ]}
          onPress={handleConfirm}
          disabled={!selectedLanguage}
        >
          <Text style={styles.confirmButtonText}>
            {getLocalizedText("Confirmar", "Confirmar")}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#b41976",
  },
  headerContainer: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: height * 0.55,
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.6,
    backgroundColor: "white",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 12,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  sheetHandle: {
    width: 40,
    height: 5,
    backgroundColor: "#e5e7eb",
    borderRadius: 2.5,
    alignSelf: "center",
    marginBottom: 16,
  },
  globeIconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  appName: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#b41976",
    letterSpacing: 3,
    marginBottom: 8,
    opacity: 0.8,
  },
  sheetTitle: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1f2937",
  },
  sheetSubtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 24,
  },
  optionsContainer: {
    flex: 1,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f9fafb",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#e5e7eb",
  },
  optionCardSelected: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fce7f3",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#b41976",
    shadowColor: "#b41976",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  optionInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionFlag: {
    fontSize: 24,
    marginRight: 16,
    opacity: 0.7,
  },
  optionCountry: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4a4a4a",
  },
  optionCountrySelected: {
    fontSize: 18,
    fontWeight: "700",
    color: "#b41976",
  },
  optionLanguage: {
    fontSize: 14,
    color: "#6b7280",
  },
  optionLanguageSelected: {
    fontSize: 14,
    fontWeight: "600",
    color: "#b41976",
  },
  checkContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#b41976",
    justifyContent: "center",
    alignItems: "center",
  },
  confirmButton: {
    backgroundColor: "#b41976",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 24,
    marginTop: 12,
    elevation: 2,
    shadowColor: "#b41976",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  confirmButtonDisabled: {
    backgroundColor: "#d1d5db",
    elevation: 0,
  },
  confirmButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
