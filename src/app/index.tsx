import React, { use, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  LogBox,
} from "react-native";
// import { StatusBar } from "expo-status-bar";
import Svg, { Rect, Defs, LinearGradient, Stop } from "react-native-svg";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useLanguage, useTranslation } from "../context/LanguageContext";

LogBox.ignoreLogs([
  "VirtualizedLists should never be nested", // Ignore nested VirtualizedLists warning
]);
const { width, height } = Dimensions.get("window");

export default function Index() {
  const { isLanguageSelected } = useLanguage();
  const { t } = useTranslation();

  // useEffect(() => {
  //   const clearToken = async () => {
  //     await SecureStore.deleteItemAsync("access_token");
  //     console.log("Token limpo para testes.");
  //   };
  //   clearToken(); // Chama a função para limpar o token
  // }, []);

  // Função para limpar o idioma manualmente para facilitar testes
  const handleClearLanguage = async () => {
    await SecureStore.deleteItemAsync("appLanguage");
    console.log("Idioma limpo para testes.");
    router.replace("/select-language");
  };

  // useEffect(() => {
  //   handleClearLanguage();
  // }, []);

  // Verificar se o idioma foi selecionado e redirecionar conforme necessário
  useEffect(() => {
    if (!isLanguageSelected) {
      router.replace("/select-language");
    }
  }, [isLanguageSelected]);

  // Se o idioma não foi selecionado, não renderizar nada (vai para a tela de seleção)
  if (!isLanguageSelected) {
    return null;
  }

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
        <Text className="text-black-500 font-regular mb-4">
          {t("welcome.appName")}
        </Text>
        <Text className="text-black-500 text-4xl font-semibold mb-2">
          {t("welcome.title")}
        </Text>
        <Text className="text-black-500 text-4xl font-semibold mb-2">
          {t("welcome.subtitle")}
        </Text>
        <Text className="text-black-500 font-regular">
          {t("welcome.description")}
        </Text>

        <TouchableOpacity
          className="bg-primary-500 px-4 py-2 mt-10 rounded-lg justify-center items-center w-full"
          onPress={() => {
            // clearToken(); // Chama a função para limpar o token
            router.navigate("/sing-in");
          }}
        >
          <Text className="text-white-500 font-bold text-center text-xl">
            {t("buttons.enter")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="mt-2"
          onPress={() => {
            router.push("/sing-up");
          }}
        >
          <Text className="text-center">
            <Text className="text-black-500">{t("buttons.noAccount")}</Text>
            <Text className="text-primary-500">{t("buttons.register")}</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="mt-16"
          onPress={() => {
            router.push("/faq");
          }}
        >
          <Text className="text-center">
            <Text className="text-primary-500">{t("buttons.help")}</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
