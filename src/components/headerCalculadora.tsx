import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons"; // Ícone ArrowLeft
import { useMeasurementContext } from "@/context/context";

type HeaderProps = {
  title: string;
};

const Header = ({ title }: HeaderProps) => {
  const router = useRouter();
  const { patientData } = useMeasurementContext();
  const { width } = useWindowDimensions(); // Obtém a largura da tela

  const hasPatientData = !!(
    patientData.fullName ||
    patientData.address ||
    patientData.phone ||
    patientData.birthDate
  );

  // Define o estilo do botão de forma responsiva

  return (
    <View
      className="flex-row items-center justify-center px-6 mt-8"
      style={{ position: "relative" }}
    >
      {/* Botão de Voltar */}
      <TouchableOpacity
        onPress={() => {
          if (hasPatientData) {
            router.push("/fichaExame2");
          } else {
            router.push("/home");
          }
        }}
        style={{
          position: "absolute",
          width: 40,
          height: 40,
          justifyContent: "center",
          alignItems: "center",
          ...(width > 768 ? { left: 250 } : { right: 330 }), // Responsivo: tablet ou celular
        }} // Aplica o estilo responsivo
      >
        <Feather name="arrow-left" size={28} color="#000" />
      </TouchableOpacity>

      {/* Ícone + Título Centralizado */}
      <View className="flex-row items-center">
        <Image className="w-6 h-6" source={require("../assets/maximize.png")} />
        <Text style={{ marginLeft: 8, fontSize: 18, fontWeight: "bold" }}>
          {title}
        </Text>
      </View>
    </View>
  );
};

export default Header;
