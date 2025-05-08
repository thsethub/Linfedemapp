import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { Feather, Ionicons } from "@expo/vector-icons"; // Ícone ArrowLeft
import { useMeasurementContext } from "@/context/context";

type HeaderProps = {
  title: string;
  name: string;
  dataDiagnostiCancer: string;
};

const Header = ({ title, name, dataDiagnostiCancer }: HeaderProps) => {
  const router = useRouter();

  return (
    <View
      className="flex-row items-center justify-center px-6 mt-8 bg-[#b41976] w-full py-8 rounded-b-3xl shadow-md"
      style={{ position: "relative" }}
    >
      {/* Botão de Voltar */}

      {/* Ícone + Título Centralizado */}
      <TouchableOpacity
        onPress={() => {
          router.push("/historicoExames");
        }}
        style={{
          position: "absolute",
          right: 340,
          width: 40,
          height: 40,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Feather name="arrow-left" size={28} color="#FFF" />
      </TouchableOpacity>
      <View className="items-center">
        <Text className="text-white-500 text-2xl font-bold text-center mt-6">
          {name}
        </Text>
        <Text className="text-[#ffe0f0] text-sm">
          Diagnóstico: {dataDiagnostiCancer || "Não informado"}
        </Text>
      </View>
    </View>
  );
};

export default Header;
