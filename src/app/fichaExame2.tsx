import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Image,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useMeasurementContext } from "@/context/context";
import { router } from "expo-router";
import SinglePicker from "@/components/singlepicker"; // Adjust the path as needed
import Dropdown from "@/components/dropdown2"; // Adjust the path as needed
import Header from "@/components/headerFicha2";
import axios from "axios";
import { Alert } from "react-native";
import * as SecureStore from "expo-secure-store"; // Importa o SecureStore para armazenar o token

const API_URL = "http://191.252.38.73:8083"

export default function FichaExame2() {
  const { patientData, setPatientData, clearAllData } = useMeasurementContext();

  // Função para salvar o paciente no banco de dados
  const savePatient = async () => {
    try {
      // Recupera o token armazenado
      const token = await SecureStore.getItemAsync("access_token");

      if (!token) {
        Alert.alert("Erro", "Token de autenticação não encontrado.");
        return;
      }

      // Faz a requisição para obter o ID do usuário autenticado
      const userResponse = await axios.get(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const usuarioId = userResponse.data.id;

      // Garante que todos os campos de `questions` tenham valores
      const updatedPatientData = { ...patientData };
      console.log(
        "Estado atual de patientData antes de envio:",
        updatedPatientData
      );

      // Garante que a data do diagnóstico esteja formatada corretamente
      const formattedDate =
        updatedPatientData.cancerDiagnosisDate &&
        updatedPatientData.cancerDiagnosisDate !== "/"
          ? updatedPatientData.cancerDiagnosisDate
          : "Data não informada";

      // Mapeia os campos do patientData para o formato esperado
      const dataToSend = {
        usuarioId,
        nome: updatedPatientData.fullName,
        dataNascimento: updatedPatientData.birthDate,
        endereco: updatedPatientData.address,
        telefone: updatedPatientData.phone,
        pesoCorporal: updatedPatientData.weight,
        altura: updatedPatientData.height,
        nivelAtividadeFisica: updatedPatientData.activityLevel,
        estadoCivil: updatedPatientData.maritalStatus,
        ocupacao: updatedPatientData.occupation,
        dataDiagnostiCancer: formattedDate,
        procedimentos: updatedPatientData.procedures,
        alteracoesCutaneas: updatedPatientData.skinChanges,
        queixasMusculoesqueleticas:
          updatedPatientData.musculoskeletalComplaints,
        sintomasLinfedema: updatedPatientData.lymphedemaSymptoms,
        sinalCacifo: updatedPatientData.cacifoSign,
        sinalCascaLaranja: updatedPatientData.orangePeelSign,
        sinalStemmer: updatedPatientData.stemmerSign,
        radioterapia: {
          tipo: updatedPatientData.radiotherapy.type,
          duracao: updatedPatientData.radiotherapy.duration,
        },
        cirurgia: {
          tipo: updatedPatientData.surgery.type,
          duracao: updatedPatientData.surgery.duration,
        },
        disseccaoAxilar: {
          tipo: updatedPatientData.axillaryDissection.type,
          duracao: updatedPatientData.axillaryDissection.duration,
        },
        alteracoesMusculoesqueleticas:
          updatedPatientData.musculoskeletalChanges,
        detalhesSintomasLinfedema: updatedPatientData.lymphedemaSymptomsDetails,
      };

      console.log("Dados formatados para envio:", dataToSend);

      // Envia os dados ao backend
      const response = await axios.post(
        `${API_URL}/api/pacientes`,
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Paciente salvo com sucesso:", response.data);

      // Limpa os dados do paciente e navega para a home
      clearAllData();
      Alert.alert("Sucesso", "Paciente salvo com sucesso!", [
        {
          text: "OK",
          onPress: () => router.push("/home"),
        },
      ]);
    } catch (error) {
      console.error("Erro ao salvar o paciente:", error);
      Alert.alert("Erro", "Não foi possível salvar o paciente.");
    }
  };

  const goToMensuration = async () => {
    try {
      // Recupera o token armazenado
      const token = await SecureStore.getItemAsync("access_token");

      if (!token) {
        Alert.alert("Erro", "Token de autenticação não encontrado.");
        return;
      }

      // Faz a requisição para obter o ID do usuário autenticado
      const userResponse = await axios.get(`${API_URL}:8080/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const usuarioId = userResponse.data.id;

      // Garante que todos os campos de `questions` tenham valores
      const updatedPatientData = { ...patientData };

      // Garante que a data do diagnóstico esteja formatada corretamente
      const formattedDate =
        updatedPatientData.cancerDiagnosisDate &&
        updatedPatientData.cancerDiagnosisDate !== "/"
          ? updatedPatientData.cancerDiagnosisDate
          : "Data não informada";

      // Mapeia os campos do patientData para o formato esperado
      const dataToSend = {
        usuarioId,
        nome: updatedPatientData.fullName,
        dataNascimento: updatedPatientData.birthDate,
        endereco: updatedPatientData.address,
        telefone: updatedPatientData.phone,
        pesoCorporal: updatedPatientData.weight,
        altura: updatedPatientData.height,
        nivelAtividadeFisica: updatedPatientData.activityLevel,
        estadoCivil: updatedPatientData.maritalStatus,
        ocupacao: updatedPatientData.occupation,
        dataDiagnostiCancer: formattedDate,
        procedimentos: updatedPatientData.procedures,
        alteracoesCutaneas: updatedPatientData.skinChanges,
        queixasMusculoesqueleticas:
          updatedPatientData.musculoskeletalComplaints,
        sintomasLinfedema: updatedPatientData.lymphedemaSymptoms,
        sinalCacifo: updatedPatientData.cacifoSign,
        sinalCascaLaranja: updatedPatientData.orangePeelSign,
        sinalStemmer: updatedPatientData.stemmerSign,
        radioterapia: {
          tipo: updatedPatientData.radiotherapy.type,
          duracao: updatedPatientData.radiotherapy.duration,
        },
        cirurgia: {
          tipo: updatedPatientData.surgery.type,
          duracao: updatedPatientData.surgery.duration,
        },
        disseccaoAxilar: {
          tipo: updatedPatientData.axillaryDissection.type,
          duracao: updatedPatientData.axillaryDissection.duration,
        },
        alteracoesMusculoesqueleticas:
          updatedPatientData.musculoskeletalChanges,
        detalhesSintomasLinfedema: updatedPatientData.lymphedemaSymptomsDetails,
      };

      // Envia os dados ao backend
      const response = await axios.post(
        `${API_URL}/api/pacientes`,
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Paciente salvo com sucesso:", response.data);

      // Limpa os dados do paciente e navega para a tela de mensuração
      clearAllData();
      Alert.alert("Sucesso", "Paciente salvo com sucesso!", [
        {
          text: "OK",
          onPress: () => router.push("/calculadora"),
        },
      ]);
    } catch (error) {
      console.error("Erro ao salvar o paciente:", error);
      Alert.alert("Erro", "Não foi possível salvar o paciente.");
    }
  };

  const [selectedMonth, setSelectedMonth] = useState<string | null>(
    patientData.cancerDiagnosisDate?.split("/")[0] || null
  );
  const [selectedYear, setSelectedYear] = useState<string | null>(
    patientData.cancerDiagnosisDate?.split("/")[1] || null
  );

  // const handleDateSelection2 = (month: string | null, year: string | null) => {
  //   const formattedDate = `${month || ""}/${year || ""}`;
  //   setPatientData({ ...patientData, cancerDiagnosisDate: formattedDate });
  // };

  // useEffect(() => {
  //   handleDateSelection2(selectedMonth, selectedYear);
  // }, [selectedMonth, selectedYear]);

  const handleToggleSelection = (
    value: string,
    selectedList: string[],
    field: keyof typeof patientData
  ) => {
    const updatedList = selectedList.includes(value)
      ? selectedList.filter((item) => item !== value)
      : [...selectedList, value];
    setPatientData({ ...patientData, [field]: updatedList });
  };

  const handleInputChange = (
    field: keyof typeof patientData,
    value: string
  ) => {
    console.log(`Campo atualizado: ${field}, Novo valor: ${value}`); // Log para debug
    setPatientData({ ...patientData, [field]: value });
  };

  const handleDurationChange = (
    field: keyof typeof patientData,
    value: string
  ) => {
    setPatientData({
      ...patientData,
      [field]:
        typeof patientData[field] === "object" && patientData[field] !== null
          ? { ...patientData[field], duration: value }
          : { duration: value },
    });
  };

  const handleDropdownChange = (
    field: keyof typeof patientData,
    value: any
  ) => {
    setPatientData({
      ...patientData,
      [field]: value,
    });
  };

  const handleDateSelection = (month: string | null, year: string | null) => {
    const formattedDate = `${month || ""}/${year || ""}`;
    setPatientData({ ...patientData, cancerDiagnosisDate: formattedDate });
  };

  useEffect(() => {
    handleDateSelection(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear]);

  const questions: { question: string; field: keyof typeof patientData }[] = [
    {
      question:
        "Apresenta queixas de alterações musculoesqueléticas após o tratamento?",
      field: "musculoskeletalComplaints",
    },
    {
      question: "Apresenta sintomas de linfedema?",
      field: "lymphedemaSymptoms",
    },
    { question: "Sinal de Cacifo", field: "cacifoSign" },
    {
      question: "Sinal da casca de laranja",
      field: "orangePeelSign",
    },
    { question: "Sinal de Stemmer", field: "stemmerSign" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white-600 mt-8">
      <StatusBar barStyle="dark-content" backgroundColor="transparent" />
      <FlatList
        data={[]}
        renderItem={null}
        ListHeaderComponent={
          <View className="flex-1 justify-center items-center">
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
              <View className="flex-row ">
                <Image
                  source={require("../assets/rotate-ccw.png")}
                  className="w-6 h-6 mt-0.5"
                  style={{ marginBottom: 10, marginRight: 10 }}
                />
                <Text className="text-lg font-medium">Dados da paciente</Text>
              </View>

              {/* Data do diagnóstico */}
              <Text className="text-lg font-medium mb-2">
                Data do diagnóstico do câncer
              </Text>
              <View className="flex-row mb-4 ">
                {/* SinglePicker para o mês */}
                <SinglePicker
                  title="Mês"
                  type="month"
                  initialValue={patientData.cancerDiagnosisDate?.split("/")[0]}
                  placeholder="Mês"
                  onConfirm={(value) =>
                    handleDateSelection(
                      value,
                      patientData.cancerDiagnosisDate?.split("/")[1]
                    )
                  }
                />

                <SinglePicker
                  title="Ano"
                  type="year"
                  initialValue={patientData.cancerDiagnosisDate?.split("/")[1]}
                  placeholder="Ano"
                  onConfirm={(value) =>
                    handleDateSelection(
                      patientData.cancerDiagnosisDate?.split("/")[0],
                      value
                    )
                  }
                />
              </View>

              {/* Procedimentos realizados */}
              <Text className="text-lg font-medium mb-2">
                Procedimentos realizados
              </Text>
              <View className="flex-row flex-wrap mb-4">
                {[
                  "Quimioterapia",
                  "Radioterapia",
                  "Cirurgia",
                  "Esvaziamento axilar",
                  "Hormonoterapia",
                ].map((procedure) => (
                  <TouchableOpacity
                    key={procedure}
                    onPress={() =>
                      handleToggleSelection(
                        procedure,
                        patientData.procedures,
                        "procedures"
                      )
                    }
                    className={`px-4 py-2 rounded-full mr-2 mb-2 ${
                      patientData.procedures.includes(procedure)
                        ? "bg-primary-500"
                        : "bg-white-500 border border-gray-300"
                    }`}
                  >
                    <Text
                      className={`font-medium ${
                        patientData.procedures.includes(procedure)
                          ? "text-white-500"
                          : "text-black-100"
                      }`}
                    >
                      {procedure}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Alterações cutâneas */}
              <Text className="text-lg font-medium mb-2">
                Já teve alterações cutâneas?
              </Text>
              <View className="flex-row flex-wrap mb-4">
                {[
                  "Edema",
                  "Retração cutânea",
                  "Dor",
                  "Inversão de Mamilo",
                  "Hiperemia",
                  "Descamação mamilar",
                  "Radiodermite",
                  "Ulceração mamilar",
                  "Infecção",
                  "Outra(s)",
                ].map((change) => (
                  <TouchableOpacity
                    key={change}
                    onPress={() =>
                      handleToggleSelection(
                        change,
                        patientData.skinChanges,
                        "skinChanges"
                      )
                    }
                    className={`px-4 py-2 rounded-full mr-2 mb-2 ${
                      patientData.skinChanges.includes(change)
                        ? "bg-primary-500"
                        : "bg-white-500 border border-gray-300"
                    }`}
                  >
                    <Text
                      className={`font-medium ${
                        patientData.skinChanges.includes(change)
                          ? "text-white-500"
                          : "text-black-100"
                      }`}
                    >
                      {change}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Complementares */}
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
                  source={require("../assets/folder-plus.png")}
                  className="w-6 h-6 mt-0.5"
                  style={{ marginBottom: 10, marginRight: 10 }}
                />
                <Text className="text-lg font-medium mb-2">Complementares</Text>
              </View>
              {questions.map(({ question, field }, index) => (
                <View key={index} className="mb-4">
                  <Text className="text-lg font-medium mb-2">{question}</Text>
                  <View className="flex-row">
                    <TouchableOpacity
                      className="flex-row items-center mr-4"
                      onPress={() => handleInputChange(field, "Sim")}
                    >
                      <View className="w-5 h-5 rounded-full border border-primary-500 mr-2 flex items-center justify-center">
                        {patientData[field] === "Sim" && (
                          <View className="w-3.5 h-3.5 rounded-full bg-primary-500" />
                        )}
                      </View>
                      <Text>Sim</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="flex-row items-center"
                      onPress={() => handleInputChange(field, "Não")}
                    >
                      <View className="w-5 h-5 rounded-full border border-black-100 mr-2 flex items-center justify-center">
                        {patientData[field] === "Não" && (
                          <View className="w-3.5 h-3.5 rounded-full bg-black-100" />
                        )}
                      </View>
                      <Text className="text-black-100">Não</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>

            <View
              style={{
                width: 360,
                borderRadius: 40,
                backgroundColor: "#FFF",
                padding: 16,
                marginTop: 16,
              }}
            >
              <View className="flex-row items-center mb-4">
                <Feather
                  name="list"
                  size={20}
                  color="black"
                  style={{ marginRight: 10, marginBottom: 4, marginLeft: 2 }}
                />
                <Text className="text-lg font-medium mb-2">Detalhes</Text>
              </View>

              {/* Radioterapia */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start", // Alinha os elementos pelo topo
                  marginBottom: 16,
                }}
              >
                {/* Bloco Radioterapia + Dropdown */}
                <View style={{ flex: 1, marginRight: 12 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  >
                    Radioterapia
                  </Text>
                  <Dropdown
                    title="Selecione o tipo"
                    items={[
                      { label: "Neoadjuvante", value: "Neoadjuvante" },
                      { label: "Adjuvante", value: "Adjuvante" },
                      { label: "Neo + Adjuvante", value: "Neo + Adjuvante" },
                    ]}
                    selectedValue={patientData.radiotherapy.type}
                    setSelectedValue={(value) =>
                      handleDropdownChange("radiotherapy", {
                        ...patientData.radiotherapy,
                        type: value,
                      })
                    }
                  />
                </View>

                {/* Bloco "Há quanto tempo?" + input + label Meses */}
                <View style={{ alignItems: "center" }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                      marginBottom: 10,
                    }}
                  >
                    Há quanto tempo?
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TextInput
                      placeholder="___"
                      keyboardType="numeric"
                      value={patientData.radiotherapy.duration}
                      onChangeText={(value) =>
                        handleDurationChange("radiotherapy", value)
                      }
                      style={{
                        width: 50,
                        height: 30,
                        backgroundColor: "#f8f8f8",
                        borderRadius: 8,
                        textAlign: "center",
                        marginRight: 6,
                        paddingVertical: 4,
                      }}
                    />
                    <Text>Meses</Text>
                  </View>
                </View>
              </View>

              {/* Cirurgia */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start", // Alinha os elementos pelo topo
                  marginBottom: 16,
                }}
              >
                {/* Bloco Cirurgia + Dropdown */}
                <View style={{ flex: 1, marginRight: 12 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  >
                    Cirurgia
                  </Text>
                  <Dropdown
                    title="Selecione o tipo"
                    items={[
                      {
                        label: "Mastectomia simples",
                        value: "Mastectomia simples",
                      },
                      {
                        label: "Mastectomia modificada",
                        value: "Mastectomia modificada",
                      },
                      {
                        label: "Mastectomia radical",
                        value: "Mastectomia radical",
                      },
                      { label: "Quadrantectomia", value: "Quadrantectomia" },
                    ]}
                    selectedValue={patientData.surgery.type}
                    setSelectedValue={(value) =>
                      handleDropdownChange("surgery", {
                        ...patientData.surgery,
                        type: value,
                      })
                    }
                  />
                </View>

                {/* Bloco "Há quanto tempo?" + input + label Meses */}
                <View style={{ alignItems: "center" }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                      marginBottom: 10,
                    }}
                  >
                    Há quanto tempo?
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TextInput
                      placeholder="___"
                      keyboardType="numeric"
                      value={patientData.surgery.duration}
                      onChangeText={(value) =>
                        handleDurationChange("surgery", value)
                      }
                      style={{
                        width: 50,
                        height: 30,
                        backgroundColor: "#f8f8f8",
                        borderRadius: 8,
                        textAlign: "center",
                        marginRight: 6,
                        paddingVertical: 4,
                      }}
                    />
                    <Text>Meses</Text>
                  </View>
                </View>
              </View>

              {/* Esvaziamento Axilar */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start", // Alinha os elementos pelo topo
                  marginBottom: 16,
                }}
              >
                {/* Bloco Esvaziamento Axilar + Dropdown */}
                <View style={{ flex: 1, marginRight: 12 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  >
                    Esvaziamento Axilar
                  </Text>
                  <Dropdown
                    title="Selecione o tipo"
                    items={[
                      { label: "Total", value: "Total" },
                      { label: "Seletivo", value: "Seletivo" },
                      {
                        label: "Não sabe informar",
                        value: "Não sabe informar",
                      },
                    ]}
                    selectedValue={patientData.axillaryDissection.type}
                    setSelectedValue={(value) =>
                      handleDropdownChange("axillaryDissection", {
                        ...patientData.axillaryDissection,
                        type: value,
                      })
                    }
                  />
                </View>

                {/* Bloco "Há quanto tempo?" + input + label Meses */}
                <View style={{ alignItems: "center" }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                      marginBottom: 10,
                    }}
                  >
                    Há quanto tempo?
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TextInput
                      placeholder="___"
                      keyboardType="numeric"
                      value={patientData.axillaryDissection.duration}
                      onChangeText={(value) =>
                        handleDurationChange("axillaryDissection", value)
                      }
                      style={{
                        width: 50,
                        height: 30,
                        backgroundColor: "#f8f8f8",
                        borderRadius: 8,
                        textAlign: "center",
                        marginRight: 6,
                        paddingVertical: 4,
                      }}
                    />
                    <Text>Meses</Text>
                  </View>
                </View>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 20,
                paddingHorizontal: 20,
                width: 300,
              }}
            >
              <TouchableOpacity
                onPress={savePatient}
                style={{
                  width: 120,
                  // marginTop: 20,
                  marginBottom: 20,
                  backgroundColor: "#fff",
                  paddingVertical: 12,
                  borderRadius: 8,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ color: "#b41976", fontSize: 16, fontWeight: "bold" }}
                >
                  Salvar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={goToMensuration}
                style={{
                  width: 120,
                  // marginTop: 20,
                  marginBottom: 20,
                  backgroundColor: "#b41976",
                  paddingVertical: 12,
                  borderRadius: 8,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}
                >
                  Prosseguir
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
}
