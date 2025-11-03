import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  FlatList,
  KeyboardAvoidingView,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native";
import { Entypo, Feather } from "@expo/vector-icons";
import { useMeasurementContext } from "@/context/context";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import SinglePicker from "@/components/singlepicker";
import Header from "@/components/headerFicha2";
import axios from "axios";
import ProcedureDetails from "@/components/procedimentosEcapsulados";
import { Alert } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useTranslation } from "@/context/LanguageContext";

const API_URL = "http://10.103.242.236:8083";
// const API_URL = "https://ac8b5f7d0939.ngrok-free.app";

// Define or import the PatientData type
type PatientData = {
  cancerDiagnosisDate?: string;
  procedures: string[];
  skinChanges: string[];
  musculoskeletalComplaints?: string;
  lymphedemaSymptoms?: string;
  cacifoSign?: string;
  orangePeelSign?: string;
  stemmerSign?: string;
  [key: string]: any;
};

export default function FichaExame2() {
  const { t } = useTranslation();
  const { patientData, setPatientData, clearAllData } = useMeasurementContext();
  const [loading, setLoading] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(
    null
  );

  // Função para salvar o paciente no banco de dados
  const savePatient = async () => {
    if (loading) return; // Evita múltiplos cliques enquanto está carregando

    setLoading(true);
    // Valida os dados do paciente
    if (!validatePatientData(patientData)) return;
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
      // console.log(
      //   "Estado atual de patientData antes de envio:",
      //   updatedPatientData
      // );

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
        radioterapia: updatedPatientData.procedures.includes("Radioterapia")
          ? {
              tipo: updatedPatientData.radiotherapy?.type || null,
              duracao: updatedPatientData.radiotherapy?.duration || null,
            }
          : null,
        cirurgia: updatedPatientData.procedures.includes("Cirurgia")
          ? {
              tipo: updatedPatientData.surgery?.type || null,
              duracao: updatedPatientData.surgery?.duration || null,
            }
          : null,
        disseccaoAxilar: updatedPatientData.procedures.includes(
          "Esvaziamento axilar"
        )
          ? {
              tipo: updatedPatientData.axillaryDissection?.type || null,
              duracao: updatedPatientData.axillaryDissection?.duration || null,
            }
          : null,
        hormonoterapia: updatedPatientData.procedures.includes("Hormonoterapia")
          ? {
              tipo: updatedPatientData.hormoneTherapy?.type || null,
              duracao: updatedPatientData.hormoneTherapy?.duration || null,
            }
          : null,
        detalhesHormonoterapia:
          updatedPatientData.hormoneTherapyDetails || null,
        quimioterapia: updatedPatientData.procedures.includes("Quimioterapia")
          ? {
              tipo: updatedPatientData.chemotherapy?.type || null,
              duracao: updatedPatientData.chemotherapy?.duration || null,
            }
          : null,
        observacaoPaciente: updatedPatientData.observacaoPaciente || null,
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

      // console.log("Paciente salvo com sucesso:", response.data);

      // Limpa os dados do paciente e navega para a home
      clearAllData();
      Alert.alert("Sucesso", "Paciente salvo com sucesso!", [
        {
          text: "OK",
          onPress: () => {
            router.push("/home"), setLoading(false);
          },
        },
      ]);
    } catch (error) {
      setLoading(false);
      // console.error("Erro ao salvar o paciente:", error);
      Alert.alert("Erro", "Não foi possível salvar o paciente.");
    }
  };

  const nextPatient = async () => {
    if (loading) return;

    setLoading(true);
    // Valida os dados do paciente
    if (!validatePatientData(patientData)) return;
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
      // console.log(
      //   "Estado atual de patientData antes de envio:",
      //   updatedPatientData
      // );

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
        radioterapia: updatedPatientData.procedures.includes("Radioterapia")
          ? {
              tipo: updatedPatientData.radiotherapy?.type || null,
              duracao: updatedPatientData.radiotherapy?.duration || null,
            }
          : null,
        cirurgia: updatedPatientData.procedures.includes("Cirurgia")
          ? {
              tipo: updatedPatientData.surgery?.type || null,
              duracao: updatedPatientData.surgery?.duration || null,
            }
          : null,
        disseccaoAxilar: updatedPatientData.procedures.includes(
          "Esvaziamento axilar"
        )
          ? {
              tipo: updatedPatientData.axillaryDissection?.type || null,
              duracao: updatedPatientData.axillaryDissection?.duration || null,
            }
          : null,
        hormonoterapia: updatedPatientData.procedures.includes("Hormonoterapia")
          ? {
              tipo: updatedPatientData.hormoneTherapy?.type || null,
              duracao: updatedPatientData.hormoneTherapy?.duration || null,
            }
          : null,
        detalhesHormonoterapia:
          updatedPatientData.hormoneTherapyDetails || null,
        quimioterapia: updatedPatientData.procedures.includes("Quimioterapia")
          ? {
              tipo: updatedPatientData.chemotherapy?.type || null,
              duracao: updatedPatientData.chemotherapy?.duration || null,
            }
          : null,
        observacaoPaciente: updatedPatientData.observacaoPaciente || null,
      };

      // console.log("Dados formatados para envio:", dataToSend);

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

      // console.log("Paciente salvo com sucesso:", response.data);

      // Limpa os dados do paciente e navega para a home
      clearAllData();
      Alert.alert("Sucesso", "Paciente salvo com sucesso!", [
        {
          text: "OK",
          onPress: () => {
            router.push("/calculadora"), setLoading(false);
          },
        },
      ]);
    } catch (error) {
      setLoading(false);
      // console.error("Erro ao salvar o paciente:", error);
      Alert.alert("Erro", "Não foi possível salvar o paciente.");
    }
  };

  const [selectedMonth, setSelectedMonth] = useState<string | null>(
    patientData.cancerDiagnosisDate?.split("/")[0] || null
  );
  const [selectedYear, setSelectedYear] = useState<string | null>(
    patientData.cancerDiagnosisDate?.split("/")[1] || null
  );

  function validatePatientData(data: typeof patientData) {
    // Campos obrigatórios básicos
    const requiredFields = [
      "fullName",
      "birthDate",
      "address",
      "phone",
      "weight",
      "height",
      "activityLevel",
      "maritalStatus",
      "occupation",
      "cancerDiagnosisDate",
    ];

    for (const field of requiredFields) {
      if (!data[field] || data[field].toString().trim() === "") {
        Alert.alert("Atenção", "Preencha todos os campos obrigatórios.");
        setLoading(false);
        return false;
      }
    }

    // Procedimentos obrigatórios
    if (!data.procedures || data.procedures.length === 0) {
      setLoading(false);
      Alert.alert("Atenção", "Selecione pelo menos um procedimento realizado.");
      return false;
    }

    // Para cada procedimento selecionado, verifique se tipo e duração estão preenchidos
    for (const proc of data.procedures) {
      let key = "";
      switch (proc) {
        case "Quimioterapia":
          key = "chemotherapy";
          break;
        case "Radioterapia":
          key = "radiotherapy";
          break;
        case "Hormonoterapia":
          key = "hormoneTherapy";
          break;
        case "Cirurgia":
          key = "surgery";
          break;
        case "Esvaziamento axilar":
          key = "axillaryDissection";
          break;
      }
      if (key && (!data[key] || !data[key].type || !data[key].duration)) {
        setLoading(false);
        Alert.alert(
          "Atenção",
          `Preencha o tipo e a duração para o procedimento: ${proc}.`
        );
        return false;
      }
    }

    // Alterações cutâneas obrigatórias
    if (!data.skinChanges || data.skinChanges.length === 0) {
      setLoading(false);
      Alert.alert("Atenção", "Selecione pelo menos uma alteração cutânea.");
      return false;
    }

    // Perguntas complementares obrigatórias
    const questionsRequired = [
      "musculoskeletalComplaints",
      "lymphedemaSymptoms",
      "cacifoSign",
      "orangePeelSign",
      "stemmerSign",
    ];
    for (const field of questionsRequired) {
      if (!data[field] || data[field].toString().trim() === "") {
        Alert.alert("Atenção", "Responda todas as perguntas complementares.");
        return false;
      }
    }

    return true;
  }

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
    // console.log(`Campo atualizado: ${field}, Novo valor: ${value}`); // Log para debug
    setPatientData({ ...patientData, [field]: value });
  };

  const handleDurationChange = (
    procedure: string,
    field: keyof PatientData,
    value: string
  ) => {
    setPatientData({
      ...patientData,
      [field]: {
        ...patientData[field],
        duration: value,
      },
    });
  };

  const handleDropdownChange = (
    procedure: string,
    field: keyof PatientData,
    value: string
  ) => {
    setPatientData({
      ...patientData,
      [field]: {
        ...patientData[field],
        type: value,
      },
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
      question: t("patient.questions.musculoskeletalComplaints"),
      field: "musculoskeletalComplaints",
    },
    {
      question: t("patient.questions.lymphedemaSymptoms"),
      field: "lymphedemaSymptoms",
    },
    { question: t("patient.questions.cacifoSign"), field: "cacifoSign" },
    {
      question: t("patient.questions.orangePeelSign"),
      field: "orangePeelSign",
    },
    { question: t("patient.questions.stemmerSign"), field: "stemmerSign" },
  ];

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#b41976" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white-600 mt-8">
      <StatusBar style="dark" translucent />
      {/* <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid
        extraScrollHeight={210}
        keyboardShouldPersistTaps="handled"
      > */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0} // ajuste conforme seu header/statusbar
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 justify-center items-center">
            <Header title={t("patient.title")} />

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
                <Text className="text-lg font-medium">
                  {t("patient.patientData")}
                </Text>
              </View>

              {/* Data do diagnóstico */}
              <Text className="text-lg font-medium mb-2">
                {t("patient.cancerDiagnosisDate")}
              </Text>
              <View className="flex-row mb-4 ">
                {/* SinglePicker para o mês */}
                <SinglePicker
                  title={t("patient.month")}
                  type="month"
                  initialValue={patientData.cancerDiagnosisDate?.split("/")[0]}
                  placeholder={t("patient.month")}
                  onConfirm={(value) =>
                    handleDateSelection(
                      value,
                      patientData.cancerDiagnosisDate?.split("/")[1]
                    )
                  }
                />

                <SinglePicker
                  title={t("patient.year")}
                  type="year"
                  initialValue={patientData.cancerDiagnosisDate?.split("/")[1]}
                  placeholder={t("patient.year")}
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
                {t("patient.proceduresPerformed")}
              </Text>
              <View className="flex-row flex-wrap mb-4">
                {[
                  t("patient.procedures.chemotherapy"),
                  t("patient.procedures.radiotherapy"),
                  t("patient.procedures.surgery"),
                  t("patient.procedures.axillaryDissection"),
                  t("patient.procedures.hormoneTherapy"),
                ].map((procedure, index) => {
                  const originalProcedures = [
                    "chemotherapy",
                    "radiotherapy",
                    "surgery",
                    "axillaryDissection",
                    "hormoneTherapy",
                  ];
                  const originalProcedure = originalProcedures[index];
                  return (
                    <TouchableOpacity
                      key={originalProcedure}
                      onPress={() =>
                        handleToggleSelection(
                          originalProcedure,
                          patientData.procedures,
                          "procedures"
                        )
                      }
                      className={`px-4 py-2 rounded-full mr-2 mb-2 ${
                        patientData.procedures.includes(originalProcedure)
                          ? "bg-primary-500"
                          : "bg-white-500 border border-gray-300"
                      }`}
                    >
                      <Text
                        className={`font-medium ${
                          patientData.procedures.includes(originalProcedure)
                            ? "text-white-500"
                            : "text-black-100"
                        }`}
                      >
                        {procedure}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Alterações cutâneas */}
              <Text className="text-lg font-medium mb-2">
                {t("patient.skinChanges")}
              </Text>
              <View className="flex-row flex-wrap mb-4">
                {[
                  t("patient.skinChangeTypes.edema"),
                  t("patient.skinChangeTypes.skinRetraction"),
                  t("patient.skinChangeTypes.pain"),
                  t("patient.skinChangeTypes.nippleInversion"),
                  t("patient.skinChangeTypes.hyperemia"),
                  t("patient.skinChangeTypes.nippleDesquamation"),
                  t("patient.skinChangeTypes.radiodermatitis"),
                  t("patient.skinChangeTypes.nippleUlceration"),
                  t("patient.skinChangeTypes.infection"),
                  t("patient.skinChangeTypes.others"),
                ].map((change, index) => {
                  const originalChanges = [
                    "edema",
                    "skinRetraction",
                    "pain",
                    "nippleInversion",
                    "hyperemia",
                    "nippleDesquamation",
                    "radiodermatitis",
                    "nippleUlceration",
                    "infection",
                    "others",
                  ];
                  const originalChange = originalChanges[index];
                  return (
                    <TouchableOpacity
                      key={originalChange}
                      onPress={() =>
                        handleToggleSelection(
                          originalChange,
                          patientData.skinChanges,
                          "skinChanges"
                        )
                      }
                      className={`px-4 py-2 rounded-full mr-2 mb-2 ${
                        patientData.skinChanges.includes(originalChange)
                          ? "bg-primary-500"
                          : "bg-white-500 border border-gray-300"
                      }`}
                    >
                      <Text
                        className={`font-medium ${
                          patientData.skinChanges.includes(originalChange)
                            ? "text-white-500"
                            : "text-black-100"
                        }`}
                      >
                        {change}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
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
                <Text className="text-lg font-medium mb-2">
                  {t("patient.complementary")}
                </Text>
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
                      <Text>{t("patient.common.yes")}</Text>
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
                      <Text className="text-black-100">
                        {t("patient.common.no")}
                      </Text>
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
                <Text className="text-lg font-medium mb-2">
                  {t("patient.details")}
                </Text>
              </View>

              {/* Renderização dinâmica dos procedimentos selecionados */}
              {patientData.procedures.map((procedure, index) => {
                const totalProcedures = patientData.procedures.length;
                const zIndex = patientData.procedures.length - index; // zIndex dinâmico
                let dropdownItems: { label: string; value: string }[] = [];
                let selectedValue = "";
                let duration = "";
                let field: keyof typeof patientData = "radiotherapy"; // Campo padrão

                // Configurações específicas para cada procedimento
                switch (procedure) {
                  case "chemotherapy":
                    dropdownItems = [
                      {
                        label: t("patient.procedureTypes.neoadjuvant"),
                        value: "neoadjuvant",
                      },
                      {
                        label: t("patient.procedureTypes.adjuvant"),
                        value: "adjuvant",
                      },
                      {
                        label: t("patient.procedureTypes.neoAdjuvant"),
                        value: "neoAdjuvant",
                      },
                    ];
                    selectedValue = patientData.chemotherapy?.type || "";
                    duration = patientData.chemotherapy?.duration || "";
                    field = "chemotherapy";
                    break;

                  case "radiotherapy":
                    dropdownItems = [
                      {
                        label: t("patient.procedureTypes.neoadjuvant"),
                        value: "neoadjuvant",
                      },
                      {
                        label: t("patient.procedureTypes.adjuvant"),
                        value: "adjuvant",
                      },
                      {
                        label: t("patient.procedureTypes.neoAdjuvant"),
                        value: "neoAdjuvant",
                      },
                    ];
                    selectedValue = patientData.radiotherapy?.type || "";
                    duration = patientData.radiotherapy?.duration || "";
                    field = "radiotherapy";
                    break;

                  case "hormoneTherapy":
                    dropdownItems = [
                      {
                        label: t("patient.procedureTypes.neoadjuvant"),
                        value: "neoadjuvant",
                      },
                      {
                        label: t("patient.procedureTypes.adjuvant"),
                        value: "adjuvant",
                      },
                      {
                        label: t("patient.procedureTypes.neoAdjuvant"),
                        value: "neoAdjuvant",
                      },
                    ];
                    selectedValue = patientData.hormoneTherapy?.type || "";
                    duration = patientData.hormoneTherapy?.duration || "";
                    field = "hormoneTherapy";
                    break;

                  case "surgery":
                    dropdownItems = [
                      {
                        label: t("patient.procedureTypes.simpleMastectomy"),
                        value: "simpleMastectomy",
                      },
                      {
                        label: t("patient.procedureTypes.modifiedMastectomy"),
                        value: "modifiedMastectomy",
                      },
                      {
                        label: t("patient.procedureTypes.radicalMastectomy"),
                        value: "radicalMastectomy",
                      },
                      {
                        label: t("patient.procedureTypes.quadrantectomy"),
                        value: "quadrantectomy",
                      },
                    ];
                    selectedValue = patientData.surgery?.type || "";
                    duration = patientData.surgery?.duration || "";
                    field = "surgery";
                    break;

                  case "axillaryDissection":
                    dropdownItems = [
                      {
                        label: t("patient.procedureTypes.total"),
                        value: "total",
                      },
                      {
                        label: t("patient.procedureTypes.selective"),
                        value: "selective",
                      },
                      {
                        label: t("patient.procedureTypes.dontKnow"),
                        value: "dontKnow",
                      },
                    ];
                    selectedValue = patientData.axillaryDissection?.type || "";
                    duration = patientData.axillaryDissection?.duration || "";
                    field = "axillaryDissection";
                    break;

                  default:
                    break;
                }

                // Traduzir título do procedimento
                const procedureTitles: Record<string, string> = {
                  chemotherapy: t("patient.procedures.chemotherapy"),
                  radiotherapy: t("patient.procedures.radiotherapy"),
                  surgery: t("patient.procedures.surgery"),
                  axillaryDissection: t(
                    "patient.procedures.axillaryDissection"
                  ),
                  hormoneTherapy: t("patient.procedures.hormoneTherapy"),
                };

                return (
                  <View key={procedure} style={{ zIndex }}>
                    <ProcedureDetails
                      title={procedureTitles[procedure] || procedure}
                      dropdownItems={dropdownItems}
                      selectedValue={selectedValue}
                      onDropdownChange={(value) =>
                        handleDropdownChange(procedure, field, value || "")
                      }
                      duration={duration}
                      onDurationChange={(value) =>
                        handleDurationChange(procedure, field, value)
                      }
                      zIndex={totalProcedures - index}
                      open={openDropdownIndex === index}
                      setOpen={(isOpen: boolean) =>
                        setOpenDropdownIndex(isOpen ? index : null)
                      }
                    />
                  </View>
                );
              })}
              <View className="mb-4 bottom-4">
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    marginBottom: 8,
                  }}
                >
                  {t("patient.observation")}
                </Text>
                <TextInput
                  placeholder={t("patient.observationPlaceholder")}
                  value={patientData.observacaoPaciente || ""}
                  onChangeText={(text) =>
                    setPatientData({ ...patientData, observacaoPaciente: text })
                  }
                  style={{
                    width: "100%",
                    height: 40,
                    backgroundColor: "#f8f8f8",
                    borderRadius: 10,
                    padding: 10,
                    textAlignVertical: "top",
                    fontWeight: "400",
                  }}
                  multiline
                />
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
                  {t("patient.save")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={nextPatient}
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
                  {t("patient.proceed")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

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
