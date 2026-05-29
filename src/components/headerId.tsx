import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons"; // Ícone ArrowLeft
import { useTranslation } from "@/context/LanguageContext";

type HeaderProps = {
  title: string;
  name: string;
  dataDiagnostiCancer: string;
};

const Header = ({ title, name, dataDiagnostiCancer }: HeaderProps) => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <View className="bg-[#b41976] w-full pt-8 pb-8 rounded-b-3xl shadow-md">
      <View className="flex-row items-center w-full px-4">
        {/* Botão de Voltar */}
        <TouchableOpacity
          onPress={() => router.push("/historicoExames")}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={{
            width: 40,
            height: 40,
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <Feather name="arrow-left" size={28} color="#FFF" />
        </TouchableOpacity>

        {/* Nome + Diagnóstico Centralizado */}
        <View className="flex-1 items-center">
          <Text className="text-white-500 text-2xl font-bold text-center">
            {name}
          </Text>
          <Text className="text-[#ffe0f0] text-sm text-center">
            {t("results.diagnosis")}:{" "}
            {dataDiagnostiCancer || t("common.notProvided")}
          </Text>
        </View>

        {/* Espaçador para manter o conteúdo centralizado */}
        <View style={{ width: 40 }} />
      </View>
    </View>
  );
};

export default Header;
