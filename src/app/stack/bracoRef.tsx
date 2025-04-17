import { StatusBar } from "expo-status-bar";
import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import Dropdown1 from "../../components/dropdown1";
import { useMeasurementContext } from "../../context/context";


export default function bracoRef() {
  const {
    pontosRef,
    setPontosRef,
    comprimentoRef,
    setComprimentoRef,
    selectedValue,
    setSelectedValue,
    inputs,
    setInputs,
  } = useMeasurementContext();

  const handleValueChange = (value: string | null) => {
    setSelectedValue(value);
    console.log("Valor selecionado:", value); // Mostra o valor selecionado no console
  };

  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
  };

  const renderInputs = () => {
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
        {numInputs > 0 && selectedValue !== "opcao2" && (
          <Text className="text-lg font-medium mb-4">{label}</Text>
        )}
        {selectedValue === "opcao2" && (
          <>
            <Text className="text-lg font-medium mb-4">
              Pontos acima da referência
            </Text>
            {Array.from({ length: numInputs / 2 }, (_, index) => (
              <View
                key={`acima-${index}`}
                className="text-lg flex-row items-center mb-6"
                style={{ position: "relative" }}
              >
                <Text>{`Ponto ${index + 1} (${
                  (index + 1) * parseInt(pontosRef)
                }cm)`}</Text>
                <View
                  className="flex-row items-center justify-center"
                  style={{
                    position: "absolute",
                    right: 25,
                    width: 60,
                    height: 32,
                    backgroundColor: "#f8e8f1",
                    borderRadius: 8,
                  }}
                >
                  <TextInput
                    keyboardType="numeric"
                    style={{
                      textAlign: "center",
                      width: 60,
                      height: 56,
                      fontSize: 16,
                    }}
                    value={inputs[index]}
                    onChangeText={(value) => handleInputChange(index, value)}
                  />
                </View>
                <Text
                  className="font-bold text-black-500"
                  style={{ position: "absolute", right: 0 }}
                >
                  cm
                </Text>
              </View>
            ))}
            <Text className="text-lg font-medium mb-4">
              Pontos abaixo da referência
            </Text>
            {Array.from({ length: numInputs / 2 }, (_, index) => (
              <View
                key={`abaixo-${index}`}
                className="text-lg flex-row items-center mb-6"
                style={{ position: "relative" }}
              >
                <Text>{`Ponto ${index + 1} (${
                  (index + 1) * parseInt(pontosRef)
                }cm)`}</Text>
                <View
                  className="flex-row items-center justify-center"
                  style={{
                    position: "absolute",
                    right: 25,
                    width: 60,
                    height: 32,
                    backgroundColor: "#f8e8f1",
                    borderRadius: 8,
                  }}
                >
                  <TextInput
                    keyboardType="numeric"
                    style={{
                      textAlign: "center",
                      width: 60,
                      height: 56,
                      fontSize: 16,
                    }}
                    value={inputs[index + numInputs / 2]}
                    onChangeText={(value) =>
                      handleInputChange(index + numInputs / 2, value)
                    }
                  />
                </View>
                <Text
                  className="font-bold text-black-500"
                  style={{ position: "absolute", right: 0 }}
                >
                  cm
                </Text>
              </View>
            ))}
          </>
        )}
        {selectedValue !== "opcao2" &&
          Array.from({ length: numInputs }, (_, index) => (
            <View
              key={index}
              className="text-lg flex-row items-center mb-6"
              style={{ position: "relative" }}
            >
              <Text>{`Ponto ${index + 1} (${
                (index + 1) * parseInt(pontosRef)
              }cm)`}</Text>
              <View
                className="flex-row items-center justify-center"
                style={{
                  position: "absolute",
                  right: 25,
                  width: 60,
                  height: 32,
                  backgroundColor: "#f8e8f1",
                  borderRadius: 8,
                }}
              >
                <TextInput
                  keyboardType="numeric"
                  style={{
                    textAlign: "center",
                    width: 60,
                    height: 56,
                    fontSize: 16,
                  }}
                  value={inputs[index]}
                  onChangeText={(value) => handleInputChange(index, value)}
                />
              </View>
              <Text
                className="font-bold text-black-500"
                style={{ position: "absolute", right: 0 }}
              >
                cm
              </Text>
            </View>
          ))}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white-600">
      <StatusBar style="dark" backgroundColor="transparent" translucent />
      <Image
        source={require("../../assets/busto-fem-esquerdo.png")}
        style={{ width: 200, height: 200, alignSelf: "center" }}
      />

      {/* Barra de navegação */}
      <View className="flex-row justify-center items-center bg-white-500">
        <TouchableOpacity
          className="flex-1 items-center"
          onPress={() => router.navigate("/stack/bracoRef")}
          style={{
            height: 50,
            justifyContent: "center",
            alignItems: "center",
            borderBottomWidth: 3,
            borderBottomColor: "#b41976",
          }}
        >
          <Text className="text-lg font-medium text-primary-500">Direito</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 items-center"
          onPress={() => router.navigate("/stack/bracoAfetado")}
          style={{
            height: 50,
            justifyContent: "center",
            alignItems: "center",
            borderBottomWidth: 3,
            borderBottomColor: "transparent",
          }}
        >
          <Text className="text-lg font-medium text-black-400">Esquerdo</Text>
        </TouchableOpacity>
      </View>
      {/* Fim da barra de navegação */}

      {/* FlatList dos componentes */}
      <FlatList
        data={[]}
        renderItem={null}
        ListHeaderComponent={
          <View className="flex-1 justify-center items-center mt-4">
            {/* Container dos pontos */}
            <View
              className="flex-1 p-6 bg-white-500"
              style={{
                width: 360,
                borderRadius: 40,
                backgroundColor: "#FFF",
              }}
            >
              <View className="flex-row mb-4">
                <Image
                  source={require("../../assets/plus-circle.png")}
                  style={{
                    width: 18,
                    height: 18,
                    marginRight: 10,
                    marginTop: 4.5,
                  }}
                />
                <Text className="text-lg font-medium text-black-500">
                  Número de pontos
                </Text>
              </View>
              <Text className="text-lg font-medium mb-4">
                Distância dos pontos
              </Text>
              <View
                className="flex-row justify-center items-center bg-white-600"
                style={{ width: 300, borderRadius: 40 }}
              >
                {["5cm", "7cm", "10cm"].map((value) => (
                  <TouchableOpacity
                    key={value}
                    className="flex-1 items-center"
                    onPress={() => setPontosRef(value as typeof pontosRef)}
                    style={{
                      height: 50,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 40,
                      backgroundColor:
                        pontosRef === value ? "#E8B8D5" : "transparent",
                    }}
                  >
                    <Text
                      className={`text-lg font-medium ${
                        pontosRef === value
                          ? "text-primary-500"
                          : "text-black-400"
                      }`}
                    >
                      {value}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View
                className="mt-4 items-center justify-center"
                style={{
                  width: 330,
                  height: 60,
                  right: 5,
                  borderRadius: 10,
                  backgroundColor: "#f8e8f1",
                }}
              >
                <Text
                  className="text-primary-500"
                  style={{ fontSize: 12, padding: 10 }}
                >
                  Realize as medições no membro da paciente com um total de
                  <Text className="font-semibold"> [n] pontos </Text>
                  para o exame.
                </Text>
              </View>
            </View>
            {/* Fim Container dos Pontos */}

            {/* Container dos dados do membro de referência */}
            <View
              className="flex-1 p-6 bg-white-500 mt-4"
              style={{
                width: 360,
                borderRadius: 40,
                backgroundColor: "#FFF",
              }}
            >
              <View className="flex-row mb-4">
                <Feather
                  name="map-pin"
                  size={18}
                  color="black"
                  style={{ marginRight: 10, marginTop: 4.5 }}
                />
                <Text className="text-lg font-medium text-black-500">
                  Referência
                </Text>
              </View>
              {/* Dropdown */}
              <Dropdown1 />

              {/* Perímetro do Membro para Referência */}
              <Text className="text-lg font-medium mb-4">
                Perímetro do ponto de referência (0cm)
              </Text>
              <View className="text-lg flex-row items-center justify-center">
                <View
                  className="flex-row items-center justify-center"
                  style={{
                    marginRight: 10,
                    width: 120,
                    height: 56,
                    backgroundColor: "#f8e8f1",
                    borderRadius: 8,
                  }}
                >
                  <TextInput
                    style={{
                      textAlign: "center",
                      width: 100,
                      height: 56,
                      fontSize: 20,
                      fontWeight: "bold",
                    }}
                    keyboardType="numeric"
                    value={comprimentoRef}
                    onChangeText={setComprimentoRef}
                  />
                </View>
                <Text className="font-bold text-black-500">cm</Text>
              </View>
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
                  Atente-se para realizar as medições no membro da paciente a
                  partir da posição de referência escolhida acima durante o
                  exame.
                </Text>
              </View>
            </View>

            {/* Perimetria */}
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
                  source={require("../../assets/maximize.png")}
                  style={{
                    width: 18,
                    height: 18,
                    marginRight: 10,
                    marginTop: 4.5,
                  }}
                />
                <Text className="text-lg font-medium text-black-500">
                  Perimetria
                </Text>
                <TouchableOpacity>
                  <Image
                    source={require("../../assets/help-circle.png")}
                    style={{
                      width: 18,
                      height: 18,
                      marginLeft: 10,
                      marginTop: 4.5,
                    }}
                  />
                </TouchableOpacity>
              </View>
              {renderInputs()}
            </View>
            <TouchableOpacity
              onPress={() => router.navigate("/stack/bracoAfetado")}
              style={{
                width: 300,
                marginTop: 20,
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
                Próximo
              </Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}
