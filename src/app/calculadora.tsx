import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Calculadora() {
  const [selectedOption, setSelectedOption] = useState<
    "Referência" | "Afetado"
  >("Referência");

  // Estados separados para Referência e Afetado
  const [pontosRef, setPontosRef] = useState<"5cm" | "7cm" | "10cm">("5cm");
  const [pontosAf, setPontosAf] = useState<"5cm" | "7cm" | "10cm">("5cm");

  const [numPontosRef, setNumPontosRef] = useState<number>(0);
  const [numPontosAf, setNumPontosAf] = useState<number>(0);

  const [valoresPontosRef, setValoresPontosRef] = useState<string[]>([]);
  const [medicoesRef, setMedicoesRef] = useState<string[]>([]);

  const [valoresPontosAf, setValoresPontosAf] = useState<string[]>([]);
  const [medicoesAf, setMedicoesAf] = useState<string[]>([]);

  // Estados para comprimento dos membros
  const [comprimentoRef, setComprimentoRef] = useState<string>("");
  const [comprimentoAf, setComprimentoAf] = useState<string>("");

  // Função para alterar o número de pontos na aba selecionada
  const handleNumPontosChange = (valor: string) => {
    const numero = parseInt(valor) || 0;
    if (selectedOption === "Referência") {
      setNumPontosRef(numero);

      const distanciaRef = parseInt(pontosRef.replace("cm", ""));
      const novosValoresRef = Array.from(
        { length: numero },
        (_, index) => `${index * distanciaRef}cm`
      );
      setValoresPontosRef(novosValoresRef);
      setMedicoesRef(new Array(numero).fill("")); // Resetando medições da referência
    } else {
      setNumPontosAf(numero);

      const distanciaAf = parseInt(pontosAf.replace("cm", ""));
      const novosValoresAf = Array.from(
        { length: numero },
        (_, index) => `${index * distanciaAf}cm`
      );
      setValoresPontosAf(novosValoresAf);
      setMedicoesAf(new Array(numero).fill("")); // Resetando medições do afetado
    }
  };

  // Função para mudar o valor da medição no índice selecionado
  const handlePontoChange = (index: number, valor: string) => {
    if (selectedOption === "Referência") {
      const novosValores = [...medicoesRef];
      novosValores[index] = valor;
      setMedicoesRef(novosValores);
    } else {
      const novosValores = [...medicoesAf];
      novosValores[index] = valor;
      setMedicoesAf(novosValores);
    }
  };

  // Função para exibir os valores inseridos
  const exibirValoresPontos = () => {
    Alert.alert(
      "Valores dos pontos",
      JSON.stringify(selectedOption === "Referência" ? medicoesRef : medicoesAf)
    );
  };

  // Função para navegar para a tela de "Afetado" ao clicar em Próximo
  const handleProximo = () => {
    if (selectedOption === "Referência") {
      setSelectedOption("Afetado");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white-600">
      <StatusBar style="dark" backgroundColor="transparent" translucent />

      {selectedOption === "Referência" ? (
        <Image
          source={require("../assets/esquerdo.png")}
          style={{ width: 250, height: 250, alignSelf: "center" }}
        />
      ) : (
        <Image
          source={require("../assets/direito.png")}
          style={{ width: 250, height: 250, alignSelf: "center" }}
        />
      )}

      <View className="flex-row justify-center items-center bg-white-500">
        <TouchableOpacity
          className="flex-1 items-center"
          onPress={() => setSelectedOption("Referência")}
          style={{
            height: 50,
            justifyContent: "center",
            alignItems: "center",
            borderBottomWidth: 3,
            borderBottomColor:
              selectedOption === "Referência" ? "#b41976" : "transparent",
          }}
        >
          <Text
            className={`text-lg font-medium ${
              selectedOption === "Referência"
                ? "text-primary-500"
                : "text-black-400"
            }`}
          >
            Referência
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 items-center"
          onPress={() => setSelectedOption("Afetado")}
          style={{
            height: 50,
            justifyContent: "center",
            alignItems: "center",
            borderBottomWidth: 3,
            borderBottomColor:
              selectedOption === "Afetado" ? "#b41976" : "transparent",
          }}
        >
          <Text
            className={`text-lg font-medium ${
              selectedOption === "Afetado"
                ? "text-primary-500"
                : "text-black-400"
            }`}
          >
            Afetado
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="flex-1 justify-center items-center mt-4">
          {selectedOption === "Referência" ? (
            <>
              {/* Número de Pontos e Distância */}
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
                    Número de pontos
                  </Text>
                </View>

                {/* Comprimento do Membro para Referência */}
                <Text className="text-lg font-medium mb-4">
                  Comprimento do membro
                </Text>
                <View className="text-lg flex-row items-center justify-center mb-6">
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
                  <Image
                    source={require("../assets/Group2.png")}
                    style={{
                      width: 18,
                      height: 18,
                      marginRight: 10,
                      marginTop: 4.5,
                    }}
                  />
                  <Text className="text-lg font-medium text-black-500">
                    Calculadora
                  </Text>
                </View>

                <View className="flex-row items-center mb-4">
                  <Text className="text-lg">Número de pontos:</Text>
                  <View className="text-lg flex-row items-center justify-center ml-2">
                    <View
                      className="flex-row items-center justify-center"
                      style={{
                        marginRight: 10,
                        width: 60,
                        height: 32,
                        backgroundColor: "#f8e8f1",
                        borderRadius: 8,
                      }}
                    >
                      <TextInput
                        style={{
                          textAlign: "center",
                          width: 60,
                          height: 56,
                          fontSize: 20,
                          fontWeight: "bold",
                        }}
                        keyboardType="numeric"
                        value={numPontosRef.toString()}
                        onChangeText={handleNumPontosChange}
                      />
                    </View>
                  </View>
                </View>

                {valoresPontosRef.map((valor, index) => (
                  <View
                    key={index}
                    className="text-lg flex-row items-center mb-6"
                    style={{ position: "relative" }}
                  >
                    <Text>{valor}</Text>
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
                        value={medicoesRef[index]}
                        onChangeText={(text) => handlePontoChange(index, text)}
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

              <TouchableOpacity
                onPress={handleProximo}
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
            </>
          ) : (
            <>
              {/* Número de Pontos e Distância */}
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
                    Número de pontos
                  </Text>
                </View>
                {/* Comprimento do Membro para Afetado */}
                <Text className="text-lg font-medium mb-4">
                  Comprimento do membro
                </Text>
                <View className="text-lg flex-row items-center justify-center mb-6">
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
                      value={comprimentoAf}
                      onChangeText={setComprimentoAf}
                    />
                  </View>
                  <Text className="font-bold text-black-500">cm</Text>
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
                      onPress={() => setPontosAf(value as typeof pontosAf)}
                      style={{
                        height: 50,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 40,
                        backgroundColor:
                          pontosAf === value ? "#E8B8D5" : "transparent",
                      }}
                    >
                      <Text
                        className={`text-lg font-medium ${
                          pontosAf === value
                            ? "text-primary-500"
                            : "text-black-400"
                        }`}
                      >
                        {value}
                      </Text>
                    </TouchableOpacity>
                  ))}
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
                  <Image
                    source={require("../assets/Group2.png")}
                    style={{
                      width: 18,
                      height: 18,
                      marginRight: 10,
                      marginTop: 4.5,
                    }}
                  />
                  <Text className="text-lg font-medium text-black-500">
                    Calculadora
                  </Text>
                </View>

                <View className="flex-row items-center mb-4">
                  <Text className="text-lg">Número de pontos:</Text>
                  <View className="text-lg flex-row items-center justify-center ml-2">
                    <View
                      className="flex-row items-center justify-center"
                      style={{
                        marginRight: 10,
                        width: 60,
                        height: 32,
                        backgroundColor: "#f8e8f1",
                        borderRadius: 8,
                      }}
                    >
                      <TextInput
                        style={{
                          textAlign: "center",
                          width: 60,
                          height: 56,
                          fontSize: 20,
                          fontWeight: "bold",
                        }}
                        keyboardType="numeric"
                        value={numPontosAf.toString()}
                        onChangeText={handleNumPontosChange}
                      />
                    </View>
                  </View>
                </View>

                {valoresPontosAf.map((valor, index) => (
                  <View
                    key={index}
                    className="text-lg flex-row items-center mb-6"
                    style={{ position: "relative" }}
                  >
                    <Text>{valor}</Text>
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
                        value={medicoesAf[index]}
                        onChangeText={(text) => handlePontoChange(index, text)}
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

              <TouchableOpacity
                onPress={handleProximo}
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
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
