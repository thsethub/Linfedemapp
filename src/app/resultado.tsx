import React, { useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useMeasurementContext } from "@/context/context";
import { router } from "expo-router";
// import { generatePatientReport } from "@/utils/generateReport";
import { generatePatientReport } from "../utils/generatePatientReport";
import { parse } from "@babel/core";

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
    setReferenceArm,
    patientData,
    setPatientData,
    setDifferences,
    setLeftArmInputs,
    setRightArmInputs,
    setLeftArmComprimento,
    setRightArmComprimento,
    setPontosRef,
    setSelectedValue,
  } = useMeasurementContext();

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

  const calculateVolume = (
    comprimentoRef: string,
    inputs: string[]
  ): number[] => {
    const h = parseFloat(pontosRef); // distância entre os pontos
    if (isNaN(h)) {
      console.error("Invalid pontosRef value:", pontosRef);
      return [];
    }

    const CA = parseFloat(comprimentoRef);
    if (isNaN(CA)) {
      console.error("Invalid comprimentoRef value:", comprimentoRef);
      return [];
    }

    // Inclui o comprimento de referência como o primeiro valor no array de inputs
    const validInputs = [
      comprimentoRef,
      ...inputs.filter((input) => input !== "" && input !== null),
    ];
    const volumes = validInputs.map((input, index) => {
      const Ci = parseFloat(input);
      if (isNaN(Ci)) {
        console.error(`Invalid input value at index ${index}:`, input);
        return 0;
      }
      const previousCA = index === 0 ? CA : parseFloat(validInputs[index - 1]);
      return (
        (h * (previousCA ** 2 + previousCA * Ci + Ci ** 2)) / (12 * Math.PI)
      );
    });

    return volumes;
  };

  const volumesReferencia =
    referenceArm === "left"
      ? calculateVolume(leftArmComprimento, leftArmInputs)
      : calculateVolume(rightArmComprimento, rightArmInputs);

  const volumesAfetado =
    affectedArm === "left"
      ? calculateVolume(leftArmComprimento, leftArmInputs)
      : calculateVolume(rightArmComprimento, rightArmInputs);

  const volumeReferenciaTotal = Array.isArray(volumesReferencia)
    ? volumesReferencia.reduce((acc, volume) => acc + volume, 0)
    : 0;
  const volumeAfetadoTotal = Array.isArray(volumesAfetado)
    ? volumesAfetado.reduce((acc, volume) => acc + volume, 0)
    : 0;

  console.log("Volumes de Referência:", volumesReferencia);
  console.log("Volumes do Membro Afetado:", volumesAfetado);

  const volumeDifferencePercentage =
    ((volumeAfetadoTotal - volumeReferenciaTotal) / volumeReferenciaTotal) *
    100;

  console.log("Diferença de Volume em %:", volumeDifferencePercentage);

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
        volumesReferencia,
        volumesAfetado,
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
        <View className="flex-row justify-center mt-12">
          {/* <TouchableOpacity
            style={{ width: 25, height: 25 }}
            onPress={() => router.navigate("/stack/bracoAfetado")}
          >
            <Ionicons
              name="chevron-back"
              size={28}
              color="#b41976"
              style={{ position: "absolute", right: 100}}
            />
          </TouchableOpacity> */}
          <Image
            source={require("../assets/file-text2.png")}
            className="w-7 h-7"
          />
          <Text className="font-semibold text-center mt-1 ml-2">
            Diagnóstico
          </Text>
        </View>
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
          onPress={async () => {
            try {
              if (hasPatientData) {
                // Se o usuário vem de uma ficha de exame, gera o relatório
                await generatePatientReport(
                  patientData,
                  {
                    volumesReferencia,
                    volumesAfetado,
                    volumeReferenciaTotal: parseFloat(volumeReferenciaTotal.toFixed(2)),
                    volumeAfetadoTotal: parseFloat(volumeAfetadoTotal.toFixed(2)),
                    volumeDifferencePercentage: parseFloat(volumeDifferencePercentage.toFixed(2)),
                  },
                  {
                    leftArmInputs,
                    rightArmInputs,
                    affectedArm,
                    referenceArm,
                    differences: differences.map((diff) => parseFloat(diff.toFixed(2))),
                    leftArmComprimento,
                    rightArmComprimento,
                    pontosRef,
                  }
                );
                alert("Relatório gerado com sucesso!");
              } else {
                // Caso contrário, é um cálculo avulso
                alert("Cálculo realizado com sucesso!");
              }

              // Limpa os dados de medição e ficha de exame
              setAffectedArm("right");
              setDifferences([]);
              setLeftArmInputs([]);
              setRightArmInputs([]);
              setLeftArmComprimento("0");
              setRightArmComprimento("0");
              setPontosRef("5cm");
              setSelectedValue("opcao1");
              setPatientData({
                fullName: "",
                birthDate: "",
                address: "",
                phone: "",
                weight: "",
                height: "",
                activityLevel: "",
                maritalStatus: "",
                occupation: "",
                cancerDiagnosisDate: "",
                procedures: [],
                skinChanges: [],
                musculoskeletalComplaints: "",
                lymphedemaSymptoms: "",
                cacifoSign: "",
                orangePeelSign: "",
                stemmerSign: "",
                radiotherapy: {
                  type: "",
                  duration: "",
                },
                surgery: {
                  type: "",
                  duration: "",
                },
                axillaryDissection: {
                  type: "",
                  duration: "",
                },
                musculoskeletalChanges: "",
                lymphedemaSymptomsDetails: "",
              }); // Limpa os dados do paciente

              // Redireciona para a tela inicial
              router.push("/stack/home");
            } catch (error) {
              console.error("Erro ao processar a ação:", error);
              alert("Ocorreu um erro ao processar a ação.");
            }
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
            Finalizar
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
