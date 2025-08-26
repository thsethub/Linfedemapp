import React, { useContext } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  // ScrollView,
  useWindowDimensions,
} from "react-native";
import { useMeasurementContext } from "../context/context";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Feather from "@expo/vector-icons/Feather";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Entypo } from "@expo/vector-icons";

export default function bracoAfetado() {
  const { width } = useWindowDimensions(); // Obtém a largura da tela
  const {
    pontosRef,
    affectedArm,
    referenceArm,
    leftArmComprimento,
    selectedValue,
    leftArmInputs,
    rightArmInputs,
    setRightArmInputs,
    rightArmComprimento,
    setRightArmComprimento,
    setDifferences,
  } = useMeasurementContext();

  const handleAffectedInputChange = (index: number, value: string) => {
    const valorFormatado = value.includes(",")
      ? value.replace(",", ".")
      : value;
    const novosValores = [...rightArmInputs];
    novosValores[index] = valorFormatado;
    setRightArmInputs(novosValores);
  };

  const handleAffectedComprimentoRefChange = (value: string) => {
    const valorFormatado = value.includes(",")
      ? value.replace(",", ".")
      : value;
    setRightArmComprimento(valorFormatado);
  };

  const calculateDifference = () => {
    const acometidoInputs =
      affectedArm === "left" ? leftArmInputs : rightArmInputs;
    const referenciaInputs =
      referenceArm === "left" ? leftArmInputs : rightArmInputs;

    const acometidoComprimento =
      affectedArm === "left" ? leftArmComprimento : rightArmComprimento;
    const referenciaComprimento =
      referenceArm === "left" ? leftArmComprimento : rightArmComprimento;

    // Inclui os comprimentos de referência como o primeiro par de diferenças
    const differences = [
      parseFloat(
        (
          parseFloat(acometidoComprimento) - parseFloat(referenciaComprimento)
        ).toFixed(2)
      ),
      ...acometidoInputs.map((acometidoValue, index) => {
        const refValue = parseFloat(referenciaInputs[index]) || 0;
        const parsedAcometidoValue = parseFloat(acometidoValue) || 0;
        return parseFloat((parsedAcometidoValue - refValue).toFixed(2)); // Formata com duas casas decimais
      }),
    ];

    setDifferences(differences); // Atualiza o contexto com os valores numéricos
    return differences;
  };

  const getReferenceName = () => {
    switch (selectedValue) {
      case "opcao1":
        return "Processo Estilóide da Ulna";
      case "opcao2":
        return "Linha Articular do Cotovelo";
      case "opcao3":
        return "Acrômio";
      default:
        return "";
    }
  };

  const handleInputChange = (index: number, value: string) => {
    const valorFormatado = value.includes(",")
      ? value.replace(",", ".")
      : value;
    const newInputs = [...rightArmInputs];
    newInputs[index] = valorFormatado;
    setRightArmInputs(newInputs);
  };

  const renderAffectedInputs = () => {
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
                    value={rightArmInputs[index]}
                    onChangeText={(value) =>
                      handleAffectedInputChange(index, value)
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
                    value={rightArmInputs[index + numInputs / 2]}
                    onChangeText={(value) =>
                      handleAffectedInputChange(index + numInputs / 2, value)
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
                  value={rightArmInputs[index]}
                  onChangeText={(value) =>
                    handleAffectedInputChange(index, value)
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
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white-600 ">
      <StatusBar style="dark" translucent />

      {/* Botão de Voltar */}
      <TouchableOpacity
        onPress={() => {
          router.push("/calculadora");
        }}
        style={{
          position: "absolute",
          width: 40,
          height: 40,
          justifyContent: "center",
          alignItems: "center",
          ...(width > 768 ? { left: 100, top: 50 } : { right: 340, top: 50 }), // Responsivo: tablet ou celular
        }}
      >
        <Feather name="arrow-left" size={28} color="#000" />
      </TouchableOpacity>

      <Image
        source={require("../assets/busto-fem-esquerdo.png")}
        style={{ width: 200, height: 200, marginTop: 30, alignSelf: "center" }}
      />
      {/* Barra de navegação */}
      <View className="flex-row justify-center items-center bg-white-500">
        <TouchableOpacity
          className="flex-1 items-center"
          onPress={() => router.push("/bracoEsquerdo")}
          style={{
            height: 50,
            justifyContent: "center",
            alignItems: "center",
            borderBottomWidth: 3,
            borderBottomColor: "transparent",
          }}
        >
          <Text className=" text-lg font-medium text-black-400">Esquerdo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 items-center"
          onPress={() => router.push("/bracoDireito")}
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
      </View>
      {/* Fim da barra de navegação */}

      <KeyboardAwareScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
        enableOnAndroid
        extraScrollHeight={160}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center items-center mt-4">
          {/* Container do processo de medição */}
          <View className="flex-1 justify-center items-center">
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
                  source={require("../assets/plus-circle.png")}
                  style={{
                    width: 18,
                    height: 18,
                    marginRight: 10,
                    marginTop: 4.5,
                  }}
                />
                <Text className="text-lg font-medium text-black-500">
                  Processo de medição
                </Text>
              </View>
              <Text className="text-lg font-medium">
                Distância entre os pontos
              </Text>
              <View
                className="flex-row justify-center items-center bg-white-600"
                style={{ width: 300, borderRadius: 40 }}
              ></View>
              <View
                className="items-center justify-center"
                style={{
                  width: 69,
                  height: 35,
                  right: 5,
                  borderRadius: 10,
                  backgroundColor: "#f8e8f1",
                }}
              >
                <Text
                  className="text-primary-500 font-semibold"
                  style={{ fontSize: 12, padding: 10 }}
                >
                  {pontosRef}
                </Text>
              </View>
              <Text className="text-lg font-medium">Referência</Text>
              <View
                className="flex-row justify-center items-center bg-white-600"
                style={{ width: 300, borderRadius: 40 }}
              ></View>
              <View
                className="items-center justify-center"
                style={{
                  width: 200,
                  height: 35,
                  right: 5,
                  borderRadius: 10,
                  backgroundColor: "#f8e8f1",
                }}
              >
                <Text
                  className="text-primary-500 font-semibold"
                  style={{ fontSize: 12, padding: 10 }}
                >
                  {getReferenceName()}
                </Text>
              </View>
              <Text className="text-lg font-medium">Membro de Referência</Text>
              <View
                className="flex-row justify-center items-center bg-white-600"
                style={{ width: 300, borderRadius: 40 }}
              ></View>
              <View
                className="items-center justify-center"
                style={{
                  width: 150,
                  height: 35,
                  right: 5,
                  borderRadius: 10,
                  backgroundColor: "#f8e8f1",
                }}
              >
                <Text
                  className="text-primary-500 font-semibold"
                  style={{ fontSize: 12, padding: 10 }}
                >
                  {referenceArm === "left" ? "Braço Esquerdo" : "Braço Direito"}
                </Text>
              </View>
              <Text className="text-lg font-medium">Membro Acometido</Text>
              <View
                className="flex-row justify-center items-center bg-white-600"
                style={{ width: 300, borderRadius: 40 }}
              ></View>
              <View
                className="items-center justify-center"
                style={{
                  width: 150,
                  height: 35,
                  right: 5,
                  borderRadius: 10,
                  backgroundColor: "#f8e8f1",
                }}
              >
                <Text
                  className="text-primary-500 font-semibold"
                  style={{ fontSize: 12, padding: 10 }}
                >
                  {affectedArm === "left" ? "Braço Esquerdo" : "Braço Direito"}
                </Text>
              </View>
            </View>
          </View>

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
                  value={rightArmComprimento}
                  onChangeText={handleAffectedComprimentoRefChange}
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
                partir da posição de referência escolhida acima durante o exame.
              </Text>
            </View>
          </View>
          {/* Fim Container dos Pontos */}
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
                source={require("../assets/maximize.png")}
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
            {renderAffectedInputs()}
          </View>
          <TouchableOpacity
            onPress={() => {
              // Verifica se há valores válidos par a par
              const hasValidInput =
                (parseFloat(leftArmComprimento) > 0 &&
                  parseFloat(rightArmComprimento) > 0) ||
                leftArmInputs.some(
                  (input, index) =>
                    parseFloat(input) > 0 &&
                    parseFloat(rightArmInputs[index] || "0") > 0
                );

              if (!hasValidInput) {
                alert(
                  "Por favor, preencha ao menos uma medição válida para ambos os membros antes de continuar."
                );
                return;
              }

              // Calcula as diferenças e navega para a tela de resultado
              const differences = calculateDifference();
              // console.log("Diferenças:", differences);
              router.push("/resultado");
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
              Calcular
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
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
