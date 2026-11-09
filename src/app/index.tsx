import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  LogBox,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import Svg, { Rect, Defs, LinearGradient, Stop } from "react-native-svg";
import { router } from "expo-router";
import * as SecureStore from "../utils/secureStorage";
import { useLanguage, useTranslation } from "../context/LanguageContext";

LogBox.ignoreLogs([
  "VirtualizedLists should never be nested", // Ignore nested VirtualizedLists warning
]);
export default function Index() {
  const { isLanguageSelected } = useLanguage();
  const { t } = useTranslation();
  // Tamanho real da área da colagem; as fotos escalam a partir dele (desenho base 390x410)
  const [box, setBox] = useState({ w: 0, h: 0 });
  const u = Math.min(box.w / 390, box.h / 410);

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
      {/* Top Section */}
      <View
        className="flex-1 bg-white-500 relative mt-28"
        onLayout={(e) =>
          setBox({
            w: e.nativeEvent.layout.width,
            h: e.nativeEvent.layout.height,
          })
        }
      >
        {/* SVG with Gradient */}
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

        {u > 0 && (
          <>
            <Image
              source={require("../assets/Frame 238284.png")}
              style={{
                position: "absolute",
                top: -25 * u,
                left: 20 * u,
                width: 156 * u,
                height: 156 * u,
                borderRadius: 58 * u,
                zIndex: 1,
              }}
            />
            <Image
              source={require("../assets/Frame 238283.png")}
              style={{
                position: "absolute",
                top: 8 * u,
                // recorte que sangra pela borda direita da tela
                left: box.w - 172 * u,
                width: 172 * u,
                height: 195 * u,
                zIndex: 1,
              }}
            />
            <Image
              source={require("../assets/Frame 238285.png")}
              style={{
                position: "absolute",
                top: 160 * u,
                left: 40 * u,
                width: 125 * u,
                height: 125 * u,
                borderRadius: 58 * u,
                zIndex: 1,
              }}
            />
            <Image
              source={require("../assets/Frame 238286.png")}
              style={{
                position: "absolute",
                top: 235 * u,
                left: 195 * u,
                width: 160 * u,
                height: 160 * u,
                borderRadius: 58 * u,
                zIndex: 1,
              }}
            />
          </>
        )}
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
    </SafeAreaView>
  );
}
