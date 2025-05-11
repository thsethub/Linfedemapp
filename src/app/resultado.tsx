import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
  FlatList,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useMeasurementContext } from "@/context/context";
import { useRouter } from "expo-router";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import Header from "@/components/headerResultado";

const API_URL = "http://15.228.154.120:8083"

export default function Resultado() {
  const {
    differences,
    pontosRef,
    selectedValue,
    leftArmInputs,
    rightArmInputs,
    leftArmComprimento,
    rightArmComprimento,
    affectedArm,
    setAffectedArm,
    referenceArm,
    // setReferenceArm,
    patientData,
    setPatientData,
    setDifferences,
    setLeftArmInputs,
    setRightArmInputs,
    setLeftArmComprimento,
    setRightArmComprimento,
    setPontosRef,
    setSelectedValue,
    clearAllData,
  } = useMeasurementContext();
  const router = useRouter();
  const [modalVisible, setModalVisible] = React.useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  interface Patient {
    id: string;
    fullName: string;
    birthDate?: string;
  }

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const handleFinalize = () => {
    Alert.alert(
      "Finalizar Medição",
      "Deseja associar esta medição a um paciente?",
      [
        {
          text: "Não",
          onPress: () => {
            // Limpa os dados de medição e navega para a tela inicial
            clearMeasurementData();
            router.push("/home");
          },
          style: "cancel",
        },
        {
          text: "Sim",
          onPress: () => {
            // Exibe o modal para selecionar um paciente
            fetchPatients();
            setModalVisible(true);
          },
        },
      ]
    );
  };

  const clearMeasurementData = () => {
    // Limpa os dados de medição no contexto
    clearAllData();
    setDifferences([]);
    setLeftArmInputs([]);
    setRightArmInputs([]);
    setLeftArmComprimento("0");
    setRightArmComprimento("0");
    setPontosRef("5cm");
    setSelectedValue("opcao1");
    setAffectedArm("right");
  };

  const fetchPatients = async () => {
    try {
      setLoadingPatients(true);
      const token = await SecureStore.getItemAsync("access_token");
      if (!token) {
        Alert.alert("Erro", "Token de autenticação não encontrado.");
        return;
      }

      const userResponse = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userId = userResponse.data.id;

      const patientsResponse = await axios.get(
        `${API_URL}/api/pacientes/usuario/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPatients(patientsResponse.data);
    } catch (error) {
      // console.error("Erro ao buscar pacientes:", error);
      Alert.alert("Erro", "Não foi possível carregar os pacientes.");
    } finally {
      setLoadingPatients(false);
    }
  };

  const handleAssociateMeasurement = async () => {
    if (!selectedPatient) {
      Alert.alert("Erro", "Selecione um paciente para associar a medição.");
      return;
    }

    try {
      const token = await SecureStore.getItemAsync("access_token");
      if (!token) {
        Alert.alert("Erro", "Token de autenticação não encontrado.");
        return;
      }

      const convertArmValue = (value: string) => {
        if (value === "left") return "Esquerdo";
        if (value === "right") return "Direito";
        return value; // Retorna o valor original se não for "left" ou "right"
      };

      const convertedReferenceArm = convertArmValue(referenceArm);
      const convertedAffectedArm = convertArmValue(affectedArm);

      const measurementData = {
        volumetry: {
          referenceArm: convertedReferenceArm,
          affectedArm: convertedAffectedArm,
          volumesReferencia,
          volumesAfetado,
          volumeDifference: volumeDifferencePercentage,
        },
        perimetry: {
          pontosRef,
          leftArmInputs,
          rightArmInputs,
          leftArmComprimento,
          rightArmComprimento,
          differences,
        },
      };

      await axios.post(
        `${API_URL}/api/pacientes/${selectedPatient.id}/mensuracao`,
        measurementData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Alert.alert("Sucesso", "Medição associada ao paciente com sucesso!");
      setModalVisible(false);
      clearMeasurementData();
      router.push("/home");
    } catch (error) {
      // console.error("Erro ao associar medição:", error);
      Alert.alert("Erro", "Não foi possível associar a medição.");
    }
  };

  const filteredPatients = patients.filter((patient) =>
    patient.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Verifica se a ficha de exame foi preenchida
  const hasPatientData = !!(
    patientData.fullName ||
    patientData.address ||
    patientData.phone ||
    patientData.birthDate
  );

  const getClassNames = (difference: number) => {
    if (difference < 0) {
      return "";
    } else if (difference <= 2) {
      return "bg-green-50 text-green-500 font-semibold";
    } else if (difference <= 3) {
      return "bg-yellow-50 text-yellow-500 font-semibold";
    } else if (difference <= 5) {
      return "bg-orange-50 text-orange-500 font-semibold";
    } else {
      return "bg-red-50 text-red-500 font-semibold";
    }
  };

  const getVolumeDifferenceText = (percentage: number) => {
    if (percentage < 5) {
      return "O membro não apresenta alterações volumétricas.";
    } else if (percentage >= 5 && percentage < 10) {
      return `O membro apresenta alterações de volume de ${percentage.toFixed(
        2
      )}%, o que pode sugerir um estágio 0 ou subclínico.`;
    } else if (percentage >= 10 && percentage < 20) {
      return `O membro apresenta alterações de volume de ${percentage.toFixed(
        2
      )}%, sugerindo linfedema estágio I ou leve.`;
    } else if (percentage >= 20 && percentage < 40) {
      return `O membro apresenta alterações de volume de ${percentage.toFixed(
        2
      )}%, sugerindo linfedema estágio II ou moderado.`;
    } else {
      return `O membro apresenta alterações de volume de ${percentage.toFixed(
        2
      )}%, sugerindo linfedema estágio III ou avançado.`;
    }
  };

  const getVolumeDifferenceClasses = (percentage: number) => {
    if (percentage < 5) {
      return { bgClass: "bg-green-50", textClass: "text-green-500" };
    } else if (percentage >= 5 && percentage < 10) {
      return { bgClass: "bg-lime-50", textClass: "text-lime-500" };
    } else if (percentage >= 10 && percentage < 20) {
      return { bgClass: "bg-yellow-50", textClass: "text-yellow-500" };
    } else if (percentage >= 20 && percentage < 40) {
      return { bgClass: "bg-orange-50", textClass: "text-orange-500" };
    } else {
      return { bgClass: "bg-red-50", textClass: "text-red-500" };
    }
  };

  const getVolumeDifferenceText2 = (percentage: number) => {
    if (percentage < 5) {
      return "Alerta!";
    } else if (percentage >= 5 && percentage < 10) {
      return "Alerta!";
    } else if (percentage >= 10 && percentage < 20) {
      return "Alerta!";
    } else if (percentage >= 20 && percentage < 40) {
      return "Alerta!";
    } else {
      return "Alerta!";
    }
  };

  const formatDifference = (difference: number) => {
    return difference >= 0 ? `+${difference}` : `${difference}`;
  };

  const calculateVolume = (comprimentoRef: string, inputs: string[]) => {
    const h = parseFloat(pontosRef); // distância entre os pontos
    if (isNaN(h)) {
      // console.error("Invalid pontosRef value:", pontosRef);
      return NaN;
    }

    const CA = parseFloat(comprimentoRef);
    if (isNaN(CA)) {
      // console.error("Invalid comprimentoRef value:", comprimentoRef);
      return NaN;
    }

    const validInputs = inputs.filter(
      (input) => input !== "" && input !== null
    );
    const volumes = validInputs.map((input, index) => {
      const Ci = parseFloat(input);
      if (isNaN(Ci)) {
        // console.error(`Invalid input value at index ${index}:`, input);
        return NaN;
      }
      const previousCA = index === 0 ? CA : parseFloat(validInputs[index - 1]);
      return (
        (h * (previousCA ** 2 + previousCA * Ci + Ci ** 2)) / (12 * Math.PI)
      );
    });

    if (volumes.some((volume) => isNaN(volume))) {
      // console.error("One or more volumes are NaN");
      return NaN;
    }

    return volumes;
  };

  const volumesReferencia = calculateVolume(
    referenceArm === "right" ? rightArmComprimento : leftArmComprimento,
    referenceArm === "right" ? rightArmInputs : leftArmInputs
  );
  const affectedInputs =
    affectedArm === "right" ? rightArmInputs : leftArmInputs;

  const volumesAfetado = calculateVolume(
    affectedArm === "right" ? rightArmComprimento : leftArmComprimento,
    affectedInputs
  );

  const volumeReferenciaTotal = Array.isArray(volumesReferencia)
    ? volumesReferencia.reduce((acc, volume) => acc + volume, 0)
    : 0;
  const volumeAfetadoTotal = Array.isArray(volumesAfetado)
    ? volumesAfetado.reduce((acc, volume) => acc + volume, 0)
    : 0;

  // console.log("Volumes de Referência:", volumesReferencia);
  // console.log("Volumes do Membro Afetado:", volumesAfetado);
  // Calculate the volume difference percentage
  const volumeDifferencePercentage =
    ((volumeAfetadoTotal - volumeReferenciaTotal) / volumeReferenciaTotal) *
    100;

  // console.log("Diferença de Volume em %:", volumeDifferencePercentage);

  useEffect(() => {
    const currentVolumesReferencia = patientData.volumesReferencia || [];
    const currentVolumesAfetado = patientData.volumesAfetado || [];

    // Verifica se os volumes mudaram antes de atualizar o contexto
    const hasVolumesChanged =
      JSON.stringify(currentVolumesReferencia) !==
        JSON.stringify(volumesReferencia) ||
      JSON.stringify(currentVolumesAfetado) !== JSON.stringify(volumesAfetado);

    if (hasVolumesChanged) {
      setPatientData({
        ...patientData,
        volumesReferencia: Array.isArray(volumesReferencia)
          ? volumesReferencia
          : undefined,
        volumesAfetado: Array.isArray(volumesAfetado)
          ? volumesAfetado
          : undefined,
      });
    }
  }, [volumesReferencia, volumesAfetado]);

  const volumeDifferenceText = getVolumeDifferenceText(
    volumeDifferencePercentage
  );
  const volumeDifferenceText2 = getVolumeDifferenceText2(
    volumeDifferencePercentage
  );
  const { bgClass, textClass } = getVolumeDifferenceClasses(
    volumeDifferencePercentage
  );

  const renderPoints = (startIndex: number, endIndex: number) => {
    return (
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {Array.from({ length: endIndex - startIndex }, (_, index) => (
          <View
            key={index + startIndex}
            style={{ alignItems: "center", margin: 1, width: 60 }}
          >
            <Text style={{ fontSize: 12, fontWeight: "bold" }}>
              {`P${index + startIndex}`}
            </Text>
            <Text style={{ fontSize: 12 }}>
              {`(${index * parseInt(pontosRef)}cm)`}
            </Text>
            <View
              className={getClassNames(differences[index + startIndex])}
              style={{
                width: 50,
                height: 30,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 5,
              }}
            >
              <Text
                className={getClassNames(differences[index + startIndex])}
                style={{ fontSize: 10 }}
              >
                {differences[index + startIndex] !== undefined
                  ? formatDifference(
                      parseFloat(differences[index + startIndex].toFixed(2))
                    )
                  : "N/A"}{" "}
                cm
              </Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderDifferences = () => {
    let numInputs = 0;
    let label = "";

    if (selectedValue === "opcao1") {
      if (pontosRef === "5cm") {
        numInputs = 9;
        label = "Pontos acima da referência";
      } else if (pontosRef === "7cm") {
        numInputs = 7;
        label = "Pontos acima da referência";
      } else if (pontosRef === "10cm") {
        numInputs = 4;
        label = "Pontos acima da referência";
      }
    } else if (selectedValue === "opcao2") {
      if (pontosRef === "5cm") {
        numInputs = 8; // 2 acima e 2 abaixo
      } else if (pontosRef === "7cm") {
        numInputs = 6; // 3 acima e 3 abaixo
      } else if (pontosRef === "10cm") {
        numInputs = 4; // 4 acima e 4 abaixo
      }
    } else if (selectedValue === "opcao3") {
      if (pontosRef === "5cm") {
        numInputs = 9;
        label = "Pontos abaixo da referência";
      } else if (pontosRef === "7cm") {
        numInputs = 7;
        label = "Pontos abaixo da referência";
      } else if (pontosRef === "10cm") {
        numInputs = 4;
        label = "Pontos abaixo da referência";
      }
    }

    return (
      <View>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {renderPoints(0, numInputs + 1)}
        </View>
      </View>
    );
  };

  const renderVolumes = (volumes: number[]) => {
    return volumes.map((volume, index) => (
      <Text
        key={index}
        className="text-primary-500 font-semibold"
        style={{ fontSize: 12, padding: 5 }}
      >
        {`V${index + 1}: ${volume.toFixed(2)} mL`}
      </Text>
    ));
  };

  const hasComplementaryData = Object.keys(patientData).some(
    (key) =>
      key === "musculoskeletalComplaints" ||
      key === "lymphedemaSymptoms" ||
      key === "cacifoSign" ||
      key === "orangePeelSign" ||
      key === "stemmerSign"
  );

  const renderComplementaryData = () => {
    return (
      <View
        className="p-6 bg-white-500 mt-4"
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

        {/* Dados Complementares */}
        {[
          {
            label: "Apresenta sintomas de linfedema?",
            value: patientData.lymphedemaSymptoms,
          },
          { label: "Sinal de Cacifo", value: patientData.cacifoSign },
          {
            label: "Sinal da casca de laranja",
            value: patientData.orangePeelSign,
          },
          { label: "Sinal de Stemmer", value: patientData.stemmerSign },
        ].map(({ label, value }, index) => (
          <View
            key={index}
            style={{
              marginBottom: 8,
              // alignItems: "center", // Centraliza o texto e o valor
            }}
          >
            {/* Texto principal */}
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                marginBottom: 8,
              }}
            >
              {label}
            </Text>

            {/* Valor estilizado */}
            <View
              style={{
                width: 100,
                height: 35,
                borderRadius: 10,
                backgroundColor:
                  value === "Sim" || value === "Positivo"
                    ? "#fde9f0" // Rosa claro para positivo
                    : "#fde9f0", // Rosa claro para negativo
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#b41976", // Rosa escuro para o texto
                  fontWeight: "bold",
                }}
              >
                {value === "Sim"
                  ? "Positivo"
                  : value === "Não"
                  ? "Negativo"
                  : "Não informado"}
              </Text>
            </View>
          </View>
        ))}

        {/* Seção para Nota */}
        <View style={{ marginTop: 16 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              marginBottom: 8,
            }}
          >
            Nota
          </Text>
          <TextInput
            placeholder="Deixe um comentário"
            value={patientData.note || ""}
            onChangeText={(text) =>
              setPatientData({ ...patientData, note: text })
            }
            style={{
              width: "100%",
              height: 40,
              backgroundColor: "#f8f8f8",
              borderRadius: 10,
              padding: 10,
              textAlignVertical: "top",
              fontWeight: "400",
              // borderWidth: 1,
              // borderColor: "#ccc",
            }}
            multiline
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white-600">
      <StatusBar barStyle="dark-content" backgroundColor="transparent" />
      <ScrollView
        contentContainerStyle={{
          padding: 20,
          alignItems: "center",
        }}
      >
        <Header title="Diagnóstico" />
        <View
          className="p-6 bg-white-500 mt-4"
          style={{
            width: 360,
            borderRadius: 40,
            backgroundColor: "#FFF",
          }}
        >
          <View className="flex-row mb-4">
            <Feather
              name="list"
              size={18}
              color="black"
              style={{ marginRight: 10, marginTop: 5 }}
            />
            <Text className="text-lg font-medium text-black-500">
              Resultados
            </Text>
          </View>
          <View>{renderDifferences()}</View>
          <View
            className="mt-4 items-center justify-center"
            style={{
              width: 330,
              height: 70,
              right: 5,
              borderRadius: 10,
              backgroundColor: "#f8e8f1",
            }}
          >
            <Text
              className="text-primary-500"
              style={{ fontSize: 12, padding: 10 }}
            >
              Atente-se para realizar as medições no membro da paciente a partir
              da posição de referência escolhida acima durante o exame.
            </Text>
          </View>
        </View>
        {/* Perimetria */}
        <View
          className="p-6 bg-white-500 mt-4"
          style={{
            width: 360,
            borderRadius: 40,
            backgroundColor: "#FFF",
          }}
        >
          <View className="flex-row items-center">
            <Feather
              name="box"
              size={18}
              color="black"
              className="mt-1.5"
              style={{ marginRight: 10 }}
            />
            <Text className="text-lg font-medium text-black-500 mt-1">
              Volumetria
            </Text>
            <TouchableOpacity>
              <Image
                source={require("../assets/help-circle.png")}
                style={{
                  width: 18,
                  height: 18,
                  marginLeft: 10,
                  marginTop: 4.5,
                }}
              />
            </TouchableOpacity>
          </View>
          <View
            className="flex-row items-center mt-4"
            style={{ justifyContent: "space-between" }}
          >
            <Text className="text-lg font-medium">
              Vol.{" "}
              {referenceArm === "right" ? "Braço Direito" : "Braço Esquerdo"}{" "}
            </Text>
            <View
              className="items-center justify-center"
              style={{
                width: 100,
                height: 35,
                borderRadius: 10,
                backgroundColor: "#f8e8f1",
              }}
            >
              <Text
                className="text-primary-500 font-semibold"
                style={{ fontSize: 12, padding: 10 }}
              >
                {volumeReferenciaTotal.toFixed(2)} mL
              </Text>
            </View>
          </View>
          {/* <View>
            {Array.isArray(volumesReferencia) &&
              renderVolumes(volumesReferencia)}
          </View> */}
          <View
            className="flex-row justify-center items-center bg-white-600"
            style={{ width: 300, borderRadius: 40 }}
          ></View>
          <View
            className="flex-row items-center mt-4"
            style={{ justifyContent: "space-between" }}
          >
            <Text className="text-lg font-medium">
              Vol.{" "}
              {affectedArm === "right" ? "Braço Direito" : "Braço Esquerdo"}{" "}
            </Text>
            <View
              className="items-center justify-center"
              style={{
                width: 100,
                height: 35,
                borderRadius: 10,
                backgroundColor: "#f8e8f1",
              }}
            >
              <Text
                className="text-primary-500 font-semibold"
                style={{ fontSize: 12, padding: 10 }}
              >
                {volumeAfetadoTotal.toFixed(2)} mL
              </Text>
            </View>
          </View>
          <View>
            {/* {Array.isArray(volumesAfetado) && renderVolumes(volumesAfetado)} */}
          </View>
          <View
            className="flex-row justify-center items-center bg-white-600"
            style={{ width: 300, borderRadius: 40 }}
          ></View>
          <View
            className="flex-row items-center mt-4 mb-4"
            style={{ justifyContent: "space-between" }} // Adicionado para separar os itens
          >
            <Text className="text-lg font-medium">Diferença de Volume</Text>
            <View
              className={`items-center justify-center ${bgClass}`}
              style={{
                width: 75,
                height: 35,
                borderRadius: 10,
              }}
            >
              <Text
                className={`font-semibold ${textClass}`}
                style={{ fontSize: 12, padding: 10 }}
              >
                {volumeDifferenceText2}
              </Text>
            </View>
          </View>
          <View
            className={`flex-row justify-center items-center ${bgClass}`}
            style={{ width: 300, borderRadius: 40 }}
          ></View>

          <View
            className={`items-center justify-center ${bgClass}`}
            style={{
              width: 330,
              height: 60,
              right: 5,
              borderRadius: 10,
            }}
          >
            <Text
              className={`${textClass}`}
              style={{ fontSize: 12, padding: 5 }}
            >
              {
                volumeDifferenceText.split(
                  `${volumeDifferencePercentage.toFixed(2)}%`
                )[0]
              }
              <Text className="font-semibold">
                {volumeDifferencePercentage.toFixed(2)}%
              </Text>
              {
                volumeDifferenceText.split(
                  `${volumeDifferencePercentage.toFixed(2)}%`
                )[1]
              }
            </Text>
          </View>
        </View>
        {hasPatientData ? renderComplementaryData() : null}
        <TouchableOpacity
          onPress={handleFinalize}
          style={{
            backgroundColor: "#b41976",
            width: "100%",
            height: 50,
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
            marginTop: 20,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
            Finalizar
          </Text>
        </TouchableOpacity>

        {/* Modal para Seleção de Paciente */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                backgroundColor: "#fff",
                width: "90%",
                borderRadius: 10,
                padding: 20,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "#b41976",
                  marginBottom: 10,
                }}
              >
                Selecione um Paciente
              </Text>

              {/* Barra de Pesquisa */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 10,
                  paddingHorizontal: 10,
                  marginBottom: 10,
                }}
              >
                <TextInput
                  placeholder="Pesquisar paciente"
                  placeholderTextColor="#aaa"
                  style={{ flex: 1, fontSize: 16 }}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>

              {/* Lista de Pacientes */}
              {loadingPatients ? (
                <ActivityIndicator size="large" color="#b41976" />
              ) : (
                <FlatList
                  data={filteredPatients}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => setSelectedPatient(item)}
                      style={{
                        padding: 10,
                        backgroundColor:
                          selectedPatient?.id === item.id
                            ? "#ffe0f0"
                            : "#f7f7f7",
                        borderRadius: 5,
                        marginBottom: 5,
                      }}
                    >
                      <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                        {item.fullName}
                      </Text>
                      <Text style={{ fontSize: 14, color: "#777" }}>
                        Data de Nascimento: {item.birthDate || "Não informado"}
                      </Text>
                    </TouchableOpacity>
                  )}
                  ListEmptyComponent={
                    <Text style={{ textAlign: "center", color: "#777" }}>
                      Nenhum paciente encontrado.
                    </Text>
                  }
                />
              )}

              {/* Botão Confirmar */}
              <TouchableOpacity
                onPress={handleAssociateMeasurement}
                style={{
                  backgroundColor: "#b41976",
                  width: "100%",
                  height: 50,
                  borderRadius: 10,
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 10,
                }}
              >
                <Text
                  style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}
                >
                  Confirmar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}
