import Dropdown from "@/components/dropdown";
import Header from "@/components/headerCalculadora";
import ReferenceSelector from "@/components/selectorReference";
import { useMeasurementContext } from "@/context/context";
import Feather from "@expo/vector-icons/Feather";
import { Link, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import { SafeAreaView } from "react-native";

export default function Calculadora() {
  const {
    pontosRef,
    setPontosRef,
    selectedValue,
    setSelectedValue,
    referenceArm,
    setReferenceArm,
    affectedArm,
    setAffectedArm,
  } = useMeasurementContext();

  return (
    <SafeAreaView className="flex-1 bg-white-600 mt-8">
      <StatusBar style="dark" backgroundColor="transparent" translucent />

      <Header title="Calculadora" />

      <FlatList
        data={[]}
        renderItem={null}
        ListHeaderComponent={
          <View className="flex-1 justify-center items-center">
            {/* Container dos dados do membro de referência */}
            <View
              className="flex-1 p-6 bg-white-500 mt-8"
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

              {/* Seleção de referência */}
              <ReferenceSelector
                title="Tipo de Referência"
                items={[
                  {
                    label: "Processo Estilóide da Ulna",
                    value: "opcao1",
                    image: require("../assets/busto-fem-esquerdo.png"),
                  },
                  {
                    label: "Linha Articular do Cotovelo",
                    value: "opcao2",
                    image: require("../assets/busto-fem-esquerdo.png"),
                  },
                  {
                    label: "Acrômio",
                    value: "opcao3",
                    image: require("../assets/busto-fem-esquerdo.png"),
                  },
                ]}
                selectedValue={selectedValue}
                setSelectedValue={setSelectedValue}
              />

              {/* Dropdown para selecionar o membro acometido */}
              <Dropdown
                title="Membro Acometido"
                items={[
                  { label: "Braço Direito", value: "right" },
                  { label: "Braço Esquerdo", value: "left" },
                ]}
                selectedValue={affectedArm}
                setSelectedValue={(value) => {
                  setAffectedArm(value as "right" | "left");
                  setReferenceArm(value === "right" ? "left" : "right");
                }}
              />
            </View>
            {/* Container dos pontos */}
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
                  <Text className="font-semibold"> [{pontosRef}] pontos </Text>
                  para o exame.
                </Text>
              </View>
            </View>

            {/* Fim Container dos dados do membro de referência */}
            <TouchableOpacity
              onPress={() => router.push("/bracoEsquerdo")}
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
