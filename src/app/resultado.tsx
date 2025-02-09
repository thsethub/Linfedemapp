import React from "react";
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

export default function Resultado() {
  const { differences, pontosRef, selectedValue } = useMeasurementContext();

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

  const formatDifference = (difference: number) => {
    return difference >= 0 ? `+${difference}` : `${difference}`;
  };

  const renderPoints = (startIndex: number, endIndex: number) => {
    return (
      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
        {Array.from({ length: endIndex - startIndex }, (_, index) => (
          <View key={index + startIndex} style={{ alignItems: "center", margin: 1, width: 60 }}>
            <Text style={{ fontSize: 12, fontWeight: "bold" }}>
              {`P${index + startIndex}`}
            </Text>
            <Text style={{ fontSize: 12 }}>
              {`(${index * parseInt(pontosRef)}cm)`}
            </Text>
            <View className={getClassNames(differences[index + startIndex])} style={{ width: 50, height: 30, justifyContent: "center", alignItems: "center", borderRadius: 5 }}>
              <Text className={getClassNames(differences[index + startIndex])} style={{ fontSize: 12 }}>
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
        <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
          {renderPoints(0, numInputs + 1)}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white-600">
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      <View className="flex-row justify-center mt-12">
        <Image
          source={require("../assets/file-text2.png")}
          className="w-7 h-7"
        />
        <Text className="font-semibold text-center mt-1 ml-2">Diagnóstico</Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: 20,
          alignItems: "center",
        }}
      >
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
            <Text className="text-lg font-medium text-black-500">Resultados</Text>
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
            <View className="bg-red-50"
            style={{
              width: 70,
              height: 35,
              borderRadius: 5,
              marginLeft: 10,
              justifyContent: "center",
              alignItems: "center",
              left: 103,
            }}
            >
              <Text
                className="text-red-500 text-lg font-semibold"
              >
                Alerta
              </Text>
            </View>
          </View>
          <View
            className="mt-4 items-center justify-center bg-red-50"
            style={{
              width: 330,
              height: 70,
              right: 5,
              borderRadius: 10,
            }}
          >
            <Text
              className="font-semibold"
              style={{ fontSize: 12, padding: 10, color: "#ff0000" }}
            >
              Resultado alarmante, com aumento volumétrico de 20% no membro avaliado, reforçando o diagnóstico de linfedema em estágio avançado.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}