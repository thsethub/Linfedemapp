import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import Svg, { Rect, Defs, LinearGradient, Stop } from "react-native-svg";
import { router } from "expo-router";


const { width, height } = Dimensions.get("window");

export default function Index() {

  // const clearToken = async () => {
  //   try {
  //     await SecureStore.deleteItemAsync("access_token"); // Remove o token armazenado
  //     alert("Token removido com sucesso!");
  //   } catch (error) {
  //     console.error("Erro ao remover o token:", error);
  //     alert("Erro ao remover o token.");
  //   }
  // };

  return (
    <SafeAreaView className="flex-1 bg-primary-500">
      {/* Top Section */}
      <View className="flex-1 bg-white-500 relative mt-28">
        {/* SVG with Gradient */}
        <Svg
          width="100%"
          height="100%"
          viewBox="0 0 374 406"
          fill="none"
          className="absolute left-[-50]"
        >
          <Rect
            width={880}
            height={880}
            x={-252}
            y={-474}
            fill="url(#a)"
            rx={440}
          />
          <Defs>
            <LinearGradient
              id="a"
              x1={452.847}
              x2={-271.222}
              y1={-474}
              y2={-263.911}
              gradientUnits="userSpaceOnUse"
            >
              <Stop stopColor="#B41976" />
              <Stop offset={1} stopColor="#B41976" />
            </LinearGradient>
          </Defs>
        </Svg>

        <Image
          source={require("../assets/Frame 238284.png")}
          style={{
            position: "absolute",
            top: height * -0.03,
            left: width * 0.05,
            width: width * 0.4,
            height: width * 0.4,
            borderRadius: width * 0.15,
            zIndex: 1,
          }}
        />
        <Image
          source={require("../assets/Frame 238283.png")}
          style={{
            position: "absolute",
            top: height * 0.01,
            left: width * 0.6,
            width: width * 0.4405,
            height: width * 0.5,
            zIndex: 1,
          }}
        />
        <Image
          source={require("../assets/Frame 238285.png")}
          style={{
            position: "absolute",
            top: height * 0.2,
            left: width * 0.1,
            width: width * 0.33,
            height: width * 0.33,
            borderRadius: width * 0.15,
            zIndex: 1,
          }}
        />
        <Image
          source={require("../assets/Frame 238286.png")}
          style={{
            position: "absolute",
            top: height * 0.3,
            left: width * 0.5,
            width: width * 0.45,
            height: width * 0.45,
            borderRadius: width * 0.15,
            zIndex: 1,
          }}
        />
      </View>

      <View className="flex-1 bg-white-500 px-6 py-10">
        <Text className="text-black-500 font-regular mb-4">LINFEDEMAPP</Text>
        <Text className="text-black-500 text-4xl font-semibold mb-2">
          Tecnologia a
        </Text>
        <Text className="text-black-500 text-4xl font-semibold mb-2">
          serviço da saúde
        </Text>
        <Text className="text-black-500 font-regular">
          Avaliação automatizada do linfedema com precisão e segurança
        </Text>

        <TouchableOpacity
          className="bg-primary-500 px-4 py-2 mt-10 rounded-lg justify-center items-center w-full"
          onPress={() => {
            // clearToken(); // Chama a função para limpar o token
            router.navigate("/sing-in");
          }}
        >
          <Text className="text-white-500 font-bold text-center text-xl">
            Entrar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="mt-2"
          onPress={() => {
            router.push("/sing-up");
          }}
        >
          <Text className="text-center">
            <Text className="text-black-500">Não tem uma conta? </Text>
            <Text className="text-primary-500">Registrar agora</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity className="mt-16">
          <Text className="text-center">
            <Text className="text-primary-500">Preciso de ajuda</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
