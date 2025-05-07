import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native";
import Dropdown from "@/components/dropdown";
import DatePicker from "@/components/datepicker"; // Importa o componente DatePicker
import { router } from "expo-router";
import { useMeasurementContext } from "@/context/context";
import Header from "@/components/headerFicha1";

export default function FichaExame1() {
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
      <StatusBar barStyle="dark-content" backgroundColor="#f4f4f4" />
      <FlatList
        data={[]}
        renderItem={null}
        ListHeaderComponent={
          <View className="flex-1 justify-center items-center">
            {/* Header */}
            <Header title="Ficha do Paciente" />

            {/* Formulário */}
            <View
              className="flex-1 p-6 bg-white-500 mt-4"
              style={{
                width: 360,
                borderRadius: 40,
                backgroundColor: "#FFF",
              }}
            >
              <View className="flex-row mb-4">
                <Image
                  source={require("../assets/user.png")}
                  className="w-6 h-6"
                  style={{ marginBottom: 10, marginRight: 10 }}
                />
                <Text className="text-lg font-semibold">Dados da paciente</Text>
              </View>

              {/* Nome completo */}
              <Text className="text-lg font-medium mb-2">Nome completo</Text>
              <TextInput
                className="bg-white-600 text-black rounded-md p-2 mb-4"
                placeholder="Nome"
                placeholderTextColor="#A9A9A9"
                value={patientData.fullName}
                onChangeText={(value) => handleInputChange("fullName", value)}
              />

              {/* Data de nascimento */}
              <Text className="text-lg font-medium mb-2">
                Data de nascimento
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
                  {selectedDate || "Selecione a data"}
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
              <Text className="text-lg font-medium mb-2">Endereço</Text>
              <TextInput
                className="bg-white-600 rounded-md p-2 mb-4"
                placeholder="Endereço"
                placeholderTextColor="#A9A9A9"
                value={patientData.address}
                onChangeText={(value) => handleInputChange("address", value)}
              />

              {/* Telefone */}
              <Text className="text-lg font-medium mb-2">Telefone</Text>
              <TextInput
                className="bg-white-600 rounded-md p-2 mb-4"
                placeholder="(__) ____-____"
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
                    Peso corporal
                  </Text>
                  <View className="flex-row items-center">
                    <TextInput
                      className="bg-white-600 text-black rounded-md p-2 flex-1"
                      placeholder="Ex: 70"
                      placeholderTextColor="#A9A9A9"
                      keyboardType="numeric"
                      value={patientData.weight}
                      onChangeText={(value) =>
                        handleInputChange("weight", value)
                      }
                    />
                    <Text className="ml-2 text-gray-700">kg</Text>
                  </View>
                </View>

                <View className="w-[48%]">
                  <Text className="text-lg font-medium mb-2">Altura</Text>
                  <View className="flex-row items-center">
                    <TextInput
                      className="bg-white-600 text-black rounded-md p-2 flex-1"
                      placeholder="Ex: 170"
                      placeholderTextColor="#A9A9A9"
                      keyboardType="numeric"
                      value={patientData.height}
                      onChangeText={(value) =>
                        handleInputChange("height", value)
                      }
                    />
                    <Text className="ml-2 text-gray-700">cm</Text>
                  </View>
                </View>
              </View>

              {/* Nível de atividade física */}
              <Dropdown
                title="Nível de atividade física"
                items={[
                  { label: "Sedentária", value: "Sedentária" },
                  { label: "Irregular", value: "Irregular" },
                  { label: "Ativa", value: "Ativa" },
                  { label: "Muito ativa", value: "Muito ativa" },
                ]}
                selectedValue={patientData.activityLevel}
                setSelectedValue={(value) =>
                  handleInputChange("activityLevel", value ?? "")
                }
              />

              {/* Estado civil */}
              <Dropdown
                title="Estado civil"
                items={[
                  { label: "Solteira", value: "Solteira" },
                  { label: "Casada", value: "Casada" },
                  { label: "Viúva", value: "Viúva" },
                  { label: "Divorciada", value: "Divorciada" },
                ]}
                selectedValue={patientData.maritalStatus}
                setSelectedValue={(value) =>
                  handleInputChange("maritalStatus", value ?? "")
                }
              />

              {/* Profissão/Ocupação */}
              <Text className="text-lg font-medium mb-2">
                Profissão/Ocupação
              </Text>
              <TextInput
                className="bg-white-600 rounded-md p-2 mb-4"
                placeholder="Digite a profissão/ocupação"
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
                Próximo
              </Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}
