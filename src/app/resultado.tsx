import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { router } from "expo-router";

export default function Resultado() {
  return (
    <SafeAreaView className="flex-1 bg-white-600">
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      <View className="flex-row justify-center mt-10">
        <Image
          source={require("../assets/file-text2.png")}
          className="w-7 h-7"
        />
        <Text className="font-semibold text-center mt-1 ml-2">Diagnóstico</Text>
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
        ></View>
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
          Atente-se para realizar as medições no membro da paciente a partir da
          posição de referência escolhida acima durante o exame.
        </Text>
      </View>
      {/* Fim Container dos Pontos */}
    </SafeAreaView>
  );
}
