import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons"; // Ícone ArrowLeft
import { useMeasurementContext } from "@/context/context";

type HeaderProps = {
  title: string;
};

const Header = ({ title }: HeaderProps) => {
  const router = useRouter();
  const { patientData } = useMeasurementContext();

  const hasPatientData = !!(
    patientData.fullName ||
    patientData.address ||
    patientData.phone ||
    patientData.birthDate
  );

  return (
    <View
      className="flex-row items-center justify-center px-6 mt-8"
      style={{ position: "relative" }}
    >
      {/* Botão de Voltar */}
      <TouchableOpacity
        onPress={() => {
            router.push("/bracoDireito");
        }}
        style={{
          position: "absolute",
          right: 200,
          width: 40,
          height: 40,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Feather name="arrow-left" size={28} color="#000" />
      </TouchableOpacity>

      {/* Ícone + Título Centralizado */}
      <View className="flex-row items-center">
        <Image
          source={require("../assets/file-text2.png")}
          className="w-7 h-7"
        />
        <Text className="font-semibold text-center mt-1 ml-2">{title}</Text>
      </View>
    </View>
  );
};

export default Header;
