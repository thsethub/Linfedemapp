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

export default function FichaExame2() {
  const { patientData, setPatientData } = useMeasurementContext();

  const [selectedMonth, setSelectedMonth] = useState<string | null>(
    patientData.cancerDiagnosisDate?.split("/")[0] || null
  );
  const [selectedYear, setSelectedYear] = useState<string | null>(
    patientData.cancerDiagnosisDate?.split("/")[1] || null
  );

  const handleDateSelection2 = (month: string | null, year: string | null) => {
    const formattedDate = `${month || ""}/${year || ""}`;
    setPatientData({ ...patientData, cancerDiagnosisDate: formattedDate });
  };

  useEffect(() => {
    handleDateSelection2(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear]);

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
    <SafeAreaView className="flex-1 bg-white-600">
      <StatusBar barStyle="dark-content" backgroundColor="transparent" />
      <FlatList
        data={[]}
        renderItem={null}
        ListHeaderComponent={
          <View className="flex-1 justify-center items-center">
            <View className="flex-row justify-center mt-8">
              <Image
                source={require("../assets/file-text2.png")}
                className="w-7 h-7"
              />
              <Text className=" font-semibold text-center text-xl ml-2">
                Ficha do Paciente
              </Text>
            </View>

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

            {/* Botões de Navegação */}
            <TouchableOpacity
              onPress={() => {
                router.navigate("/stack/calculadora");
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
                Salvar
              </Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}
