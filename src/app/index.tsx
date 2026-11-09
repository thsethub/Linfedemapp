import React, { useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  LogBox,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import Svg, { Rect, Defs, LinearGradient, Stop } from "react-native-svg";
import { router } from "expo-router";
import * as SecureStore from "../utils/secureStorage";
import { useLanguage, useTranslation } from "../context/LanguageContext";
import { useAppWindow } from "../utils/layout";

// Colagem desenhada numa caixa de proporção fixa (a do projeto, 390x328) e escalada
// de forma uniforme: a composição das fotos é a mesma em qualquer tamanho de tela.
const DESIGN_W = 390;
const DESIGN_H = 328;
const TOP_BAND = 112; // faixa rosa acima da colagem

LogBox.ignoreLogs([
  "VirtualizedLists should never be nested", // Ignore nested VirtualizedLists warning
]);
export default function Index() {
  const { isLanguageSelected } = useLanguage();
  const { t } = useTranslation();
  const { width } = useAppWindow();
  const u = Math.min(width / DESIGN_W, 1.25);
  const offsetX = (width - DESIGN_W * u) / 2;
  // Posiciona uma foto em coordenadas do desenho (390x328)
  const place = (left: number, top: number, w: number, h: number, radius = 0) => ({
    position: "absolute" as const,
    left: offsetX + left * u,
    top: top * u,
    width: w * u,
    height: h * u,
    borderRadius: radius * u,
    zIndex: 1,
  });

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
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Faixa rosa superior */}
        <View className="bg-primary-500" style={{ height: TOP_BAND }} />

        {/* Colagem (proporção fixa) */}
        <View
          className="bg-white-500"
          style={{ height: DESIGN_H * u, position: "relative" }}
        >
          <Svg
            width="100%"
            height="100%"
            viewBox="0 0 374 406"
            preserveAspectRatio="none"
            fill="none"
            style={{ position: "absolute", left: 0, top: 0 }}
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
            style={place(16, -20, 125, 125, 46)}
          />
          {/* recorte que sangra pela borda direita do desenho */}
          <Image
            source={require("../assets/Frame 238283.png")}
            style={place(DESIGN_W - 138, 6, 138, 156)}
          />
          <Image
            source={require("../assets/Frame 238285.png")}
            style={place(32, 128, 100, 100, 46)}
          />
          <Image
            source={require("../assets/Frame 238286.png")}
            style={place(156, 188, 128, 128, 46)}
          />
        </View>

      <View className="bg-white-500 px-6 py-10" style={{ flexGrow: 1 }}>
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
          className="mt-10"
          onPress={() => {
            router.push("/faq");
          }}
        >
          <Text className="text-center">
            <Text className="text-primary-500">{t("buttons.help")}</Text>
          </Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}
