import React, { useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useMeasurementContext } from "@/context/context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";

export default function Resultado() {
  const {
    differences,
    pontosRef,
    selectedValue,
    comprimentoRef,
    affectedComprimentoRef,
    inputs,
    affectedInputs,
  } = useMeasurementContext();

  useEffect(() => {
    console.log("Comprimento de Referência:", comprimentoRef);
    console.log("Comprimento do Membro Afetado:", affectedComprimentoRef);
    console.log("Entradas de Referência:", inputs);
    console.log("Entradas do Membro Afetado:", affectedInputs);
  }, [comprimentoRef, affectedComprimentoRef, inputs, affectedInputs]);

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
      return "Muito Bom";
    } else if (percentage >= 5 && percentage < 10) {
      return "Bom";
    } else if (percentage >= 10 && percentage < 20) {
      return "Atenção!";
    } else if (percentage >= 20 && percentage < 40) {
      return "Cuidado!";
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
      console.error("Invalid pontosRef value:", pontosRef);
      return NaN;
    }

    const CA = parseFloat(comprimentoRef);
    if (isNaN(CA)) {
      console.error("Invalid comprimentoRef value:", comprimentoRef);
      return NaN;
    }

    const validInputs = inputs.filter(
      (input) => input !== "" && input !== null
    );
    const volumes = validInputs.map((input, index) => {
      const Ci = parseFloat(input);
      if (isNaN(Ci)) {
        console.error(`Invalid input value at index ${index}:`, input);
        return NaN;
      }
      const previousCA = index === 0 ? CA : parseFloat(validInputs[index - 1]);
      return (
        (h * (previousCA ** 2 + previousCA * Ci + Ci ** 2)) / (12 * Math.PI)
      );
    });

    if (volumes.some((volume) => isNaN(volume))) {
      console.error("One or more volumes are NaN");
      return NaN;
    }

    return volumes;
  };

  const volumesReferencia = calculateVolume(comprimentoRef, inputs);
  const volumesAfetado = calculateVolume(
    affectedComprimentoRef,
    affectedInputs
  );

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
                style={{ fontSize: 12 }}
              >
                {formatDifference(differences[index + startIndex])} cm
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
          <TouchableOpacity
            style={{ width: 25, height: 25 }}
            onPress={() => router.navigate("/stack/bracoAfetado")}
          >
            <Ionicons
              name="chevron-back"
              size={28}
              color="#b41976"
              style={{ position: "absolute", right: 100}}
            />
          </TouchableOpacity>
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
            <Text className="text-lg font-medium text-black-500">
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
          <View className="flex-row items-center mt-4">
            <Text className="text-lg font-medium">Volume de Referência</Text>
            <View
              className="items-center justify-center"
              style={{
                width: 100,
                height: 35,
                borderRadius: 10,
                backgroundColor: "#f8e8f1",
                left: 57,
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
          <View>
            {Array.isArray(volumesReferencia) &&
              renderVolumes(volumesReferencia)}
          </View>
          <View
            className="flex-row justify-center items-center bg-white-600"
            style={{ width: 300, borderRadius: 40 }}
          ></View>
          <View className="flex-row items-center mt-4">
            <Text className="text-lg font-medium">
              Volume do Membro Afetado
            </Text>
            <View
              className="items-center justify-center"
              style={{
                width: 100,
                height: 35,
                borderRadius: 10,
                backgroundColor: "#f8e8f1",
                left: 7,
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
            {Array.isArray(volumesAfetado) && renderVolumes(volumesAfetado)}
          </View>
          <View
            className="flex-row justify-center items-center bg-white-600"
            style={{ width: 300, borderRadius: 40 }}
          ></View>
          <View className="flex-row items-center mt-4 mb-4">
            <Text className="text-lg font-medium">Diferença de Volume</Text>
            <View
              className={`items-center justify-center ${bgClass}`}
              style={{
                width: 75,
                height: 35,
                borderRadius: 10,
                left: 90,
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
      </ScrollView>
    </SafeAreaView>
  );
}
