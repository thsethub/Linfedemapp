import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  // FlatList,
  Image,
  // ScrollView,
  // Platform,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native";
import { StatusBar } from "expo-status-bar";
import Dropdown from "@/components/dropdown";
import DatePicker from "@/components/datepicker"; // Importa o componente DatePicker
import { router } from "expo-router";
import { useMeasurementContext } from "@/context/context";
import Header from "@/components/headerFicha1";
import { Entypo } from "@expo/vector-icons";
import { useTranslation } from "@/context/LanguageContext";

export default function FichaExame1() {
  const { t } = useTranslation();
  const { patientData, setPatientData } = useMeasurementContext();
  const [isDatePickerVisible, setDatePickerVisible] = useState(false); // Controle do DatePicker
  const [selectedDate, setSelectedDate] = useState(patientData.birthDate || ""); // Data formatada

  const handleInputChange = (
    field: keyof typeof patientData,
    value: string
  ) => {
    setPatientData({ ...patientData, [field]: value });
  };

  const handleDateConfirm = (date: string) => {
    setSelectedDate(date);
    handleInputChange("birthDate", date); // Atualiza o estado do contexto
  };

  const currentDate = new Date();
  const formattedCurrentDate = `${String(currentDate.getDate()).padStart(
    2,
    "0"
  )}/${String(currentDate.getMonth() + 1).padStart(
    2,
    "0"
  )}/${currentDate.getFullYear()}`;

  // Função para formatar o telefone
  const formatPhoneNumber = (value: string) => {
    // Remove todos os caracteres não numéricos
    const cleaned = value.replace(/\D/g, "");

    // Aplica a máscara
    if (cleaned.length <= 2) {
      return `(${cleaned}`;
    } else if (cleaned.length <= 7) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    } else if (cleaned.length <= 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(
        7
      )}`;
    } else {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(
        7,
        11
      )}`;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white-600 mt-8">
      <StatusBar style="dark" translucent />
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid
        extraScrollHeight={210}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center items-center">
          {/* Header */}
          <Header title={t("patient.title")} />

          {/* Formulário */}
          <View
            className="flex-1 p-6 bg-white-500 mt-4"
            style={{
              width: 360,
              borderRadius: 40,
              backgroundColor: "#Fff",
            }}
          >
            <View className="flex-row mb-4">
              <Image
                source={require("../assets/user.png")}
                className="w-6 h-6"
                style={{ marginBottom: 10, marginRight: 10 }}
              />
              <Text className="text-lg font-semibold">
                {t("patient.patientData")}
              </Text>
            </View>

            {/* Nome completo */}
            <Text className="text-lg font-medium mb-2">
              {t("patient.fullName")}
            </Text>
            <TextInput
              className="bg-white-600 text-black rounded-md p-2 mb-4"
              placeholder={t("patient.fullNamePlaceholder")}
              placeholderTextColor="#A9A9A9"
              value={patientData.fullName}
              onChangeText={(value) => handleInputChange("fullName", value)}
            />

            {/* Data de nascimento */}
            <Text className="text-lg font-medium mb-2">
              {t("patient.birthDate")}
            </Text>
            <TouchableOpacity
              onPress={() => setDatePickerVisible(true)} // Abre o DatePicker
              className="bg-white-600 rounded-md p-2 mb-4 border border-gray-300"
            >
              <Text
                className={`${
                  selectedDate ? "text-black" : "text-gray-400"
                } text-base`}
              >
                {selectedDate || t("patient.selectDate")}
              </Text>
            </TouchableOpacity>

            {/* Componente DatePicker */}
            <DatePicker
              visible={isDatePickerVisible}
              onClose={() => setDatePickerVisible(false)}
              onConfirm={handleDateConfirm}
              initialDate={selectedDate || formattedCurrentDate}
            />

            {/* Endereço */}
            <Text className="text-lg font-medium mb-2">
              {t("patient.address")}
            </Text>
            <TextInput
              className="bg-white-600 rounded-md p-2 mb-4"
              placeholder={t("patient.addressPlaceholder")}
              placeholderTextColor="#A9A9A9"
              value={patientData.address}
              onChangeText={(value) => handleInputChange("address", value)}
            />

            {/* Telefone */}
            <Text className="text-lg font-medium mb-2">
              {t("patient.phone")}
            </Text>
            <TextInput
              className="bg-white-600 rounded-md p-2 mb-4"
              placeholder={t("patient.phonePlaceholder")}
              placeholderTextColor="#A9A9A9"
              keyboardType="numeric"
              value={patientData.phone}
              onChangeText={(value) =>
                handleInputChange("phone", formatPhoneNumber(value))
              }
            />

            {/* Peso corporal e Altura */}
            <View className="flex-row justify-between mb-4">
              <View className="w-[48%]">
                <Text className="text-lg font-medium mb-2">
                  {t("patient.weight")}
                </Text>
                <View className="flex-row items-center">
                  <TextInput
                    className="bg-white-600 text-black rounded-md p-2 flex-1"
                    placeholder={t("patient.weightPlaceholder")}
                    placeholderTextColor="#A9A9A9"
                    keyboardType="numeric"
                    value={patientData.weight}
                    onChangeText={(value) => handleInputChange("weight", value)}
                  />
                  <Text className="ml-2 text-gray-700">kg</Text>
                </View>
              </View>

              <View className="w-[48%]">
                <Text className="text-lg font-medium mb-2">
                  {t("patient.height")}
                </Text>
                <View className="flex-row items-center">
                  <TextInput
                    className="bg-white-600 text-black rounded-md p-2 flex-1"
                    placeholder={t("patient.heightPlaceholder")}
                    placeholderTextColor="#A9A9A9"
                    keyboardType="numeric"
                    value={patientData.height}
                    onChangeText={(value) => handleInputChange("height", value)}
                  />
                  <Text className="ml-2 text-gray-700">cm</Text>
                </View>
              </View>
            </View>

            {/* Nível de atividade física */}
            <Dropdown
              title={t("patient.activityLevel")}
              items={[
                {
                  label: t("patient.activityLevels.sedentary"),
                  value: "sedentary",
                },
                {
                  label: t("patient.activityLevels.irregular"),
                  value: "irregular",
                },
                { label: t("patient.activityLevels.active"), value: "active" },
                {
                  label: t("patient.activityLevels.veryActive"),
                  value: "veryActive",
                },
              ]}
              selectedValue={patientData.activityLevel}
              setSelectedValue={(value) =>
                handleInputChange("activityLevel", value ?? "")
              }
            />

            {/* Estado civil */}
            <Dropdown
              title={t("patient.maritalStatus")}
              items={[
                {
                  label: t("patient.maritalStatuses.single"),
                  value: "single",
                },
                {
                  label: t("patient.maritalStatuses.married"),
                  value: "married",
                },
                {
                  label: t("patient.maritalStatuses.widowed"),
                  value: "widowed",
                },
                {
                  label: t("patient.maritalStatuses.divorced"),
                  value: "divorced",
                },
              ]}
              selectedValue={patientData.maritalStatus}
              setSelectedValue={(value) =>
                handleInputChange("maritalStatus", value ?? "")
              }
            />

            {/* Profissão/Ocupação */}
            <Text className="text-lg font-medium mb-2">
              {t("patient.occupation")}
            </Text>
            <TextInput
              className="bg-white-600 rounded-md p-2 mb-4"
              placeholder={t("patient.occupationPlaceholder")}
              placeholderTextColor="#A9A9A9"
              value={patientData.occupation}
              onChangeText={(value) => handleInputChange("occupation", value)}
            />
          </View>

          {/* Botão para próxima tela */}
          <TouchableOpacity
            onPress={() => {
              router.push("/fichaExame2");
            }}
            style={{
              width: 300,
              marginTop: 20,
              marginBottom: 20,
              backgroundColor: "#b41976",
              paddingVertical: 12,
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
              {t("patient.next")}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
      {/* Botão flutuante de ajuda (não fixo, acompanha o scroll) */}
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 60,
          right: 30,
          width: 50,
          height: 50,
          backgroundColor: "#b41976",
          borderRadius: 30,
          justifyContent: "center",
          alignItems: "center",
          // Adicionando sombra
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
          elevation: 5,
        }}
        onPress={() => {
          router.navigate("/faq");
        }}
      >
        <Entypo name="help" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
