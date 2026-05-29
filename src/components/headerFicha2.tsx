import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons"; // Ícone ArrowLeft

type HeaderProps = {
  title: string;
};

const Header = ({ title }: HeaderProps) => {
  const router = useRouter();

  return (
    <View className="flex-row items-center w-full px-4 mt-8">
      {/* Botão de Voltar */}
      <TouchableOpacity
        onPress={() => router.push("/fichaExame")}
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
        <Image
          source={require("../assets/file-text2.png")}
          className="w-6 h-6"
        />
        <Text className="ml-2 text-xl font-semibold text-black-500">
          {title}
        </Text>
      </View>

      {/* Espaçador para manter o título centralizado */}
      <View style={{ width: 40 }} />
    </View>
  );
};

export default Header;
