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
    <View className="flex-row items-center w-full px-4 mt-8">
      {/* Botão de Voltar */}
      <TouchableOpacity
        onPress={() => {
          if (hasPatientData) {
            router.push("/fichaExame2");
          } else {
            router.push("/home");
          }
        }}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        style={{
          width: 40,
          height: 40,
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <Feather name="arrow-left" size={28} color="#000" />
      </TouchableOpacity>

      {/* Ícone + Título Centralizado */}
      <View className="flex-1 flex-row items-center justify-center">
        <Image className="w-6 h-6" source={require("../assets/maximize.png")} />
        <Text style={{ marginLeft: 8, fontSize: 18, fontWeight: "bold" }}>
          {title}
        </Text>
      </View>

      {/* Espaçador para manter o título centralizado */}
      <View style={{ width: 40 }} />
    </View>
  );
};

export default Header;
