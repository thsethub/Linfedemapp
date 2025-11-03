import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "../context/LanguageContext";

export default function Home() {
  const { t } = useTranslation();

  return (
    <SafeAreaView className="flex-1 bg-white-500 mt-8">
      <StatusBar style="dark" translucent />
      <View className="justify-center items-center">
        <View
          className="bg-primary-500 px-6 mt-8"
          style={{
            width: 330,
            height: 130,
            borderRadius: 20,
          }}
        >
          <Image
            source={require("../assets/image 8.png")}
            style={{
              position: "absolute",
              top: -20,
              left: 220,
              width: 100,
              height: 150,
              zIndex: 1,
            }}
          />
          <Text className="text-white-500 font-semibold mt-10">
            <Text>{t("home.banner.title1") || "Fique por dentro das"}</Text>
          </Text>
          <Text className="text-white-500 font-semibold mb-4">
            <Text>{t("home.banner.title2") || "novidades do app!"}</Text>
          </Text>
          <TouchableOpacity activeOpacity={0.6} className="flex-row mr-2">
            <Text className="text-white-500 font-medium">
              {t("home.banner.seeMore") || "Veja mais"}
            </Text>
            <Entypo name="chevron-small-right" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Nova Seção: Perfil e Configurações */}
      <View
        style={{
          marginLeft: 40,
          marginTop: 30,
        }}
      >
        <Text className="text-black-500 font-bold text-xl mb-2">
          {t("home.profile.title") || "Minha Conta"}
        </Text>
        <View
          style={{
            marginRight: 20,
          }}
        >
          <View className="flex-row bg-white-500 rounded-lg py-4">
            {/* <TouchableOpacity
              onPress={() => {
                router.push("/profile");
              }}
            >
              <View className="items-center" style={{ marginRight: 10 }}>
                <View
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 40,
                    backgroundColor: "#f8e8f1",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <Feather name="user" size={24} color="#B91C7C" />
                </View>
                <Text className="font-semibold text-primary-500 text-center text-sm">
                  {t("home.profile.professional") || "Perfil"}
                </Text>
                <Text className="font-semibold text-primary-500 text-center text-sm">
                  {t("home.profile.professionalSub") || "Profissional"}
                </Text>
              </View>
            </TouchableOpacity> */}

            <TouchableOpacity
              onPress={() => {
                router.push("/settings");
              }}
            >
              <View
                className="items-center"
                style={{
                  // marginLeft: 10,
                }}
              >
                <View
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 40,
                    backgroundColor: "#f8e8f1",
                    justifyContent: "center",
                    alignItems: "center",
                    // marginBottom: 8,
                  }}
                >
                  <Entypo name="cog" size={24} color="#B91C7C" />
                </View>
                <Text className="font-semibold text-primary-500 text-center text-sm">
                  {t("home.settings.title") || "Ajustes"}
                </Text>
                <Text className="font-semibold text-primary-500 text-center text-sm">
                  {t("home.settings.subtitle") || "do App"}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View
        style={{
          marginLeft: 40,
          marginTop: 30,
        }}
      >
        <Text className="text-black-500 font-bold text-xl ">
          {t("home.exams.performTitle") || "Realizar exames"}
        </Text>
        <View
          style={{
            marginRight: 20, // Espaço entre o ícone e o texto
          }}
        >
          <View className="flex-row bg-white-500 rounded-lg items-center py-4">
            <TouchableOpacity
              onPress={() => {
                router.push("/fichaExame");
              }}
            >
              <View className="items-center" style={{ marginRight: 10 }}>
                <View
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 40,
                    backgroundColor: "#f8e8f1",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <Image
                    source={require("../assets/file-text.png")}
                    style={{
                      width: 24,
                      height: 24,
                    }}
                  />
                </View>
                <Text className="font-semibold text-primary-500 text-center text-sm">
                  {t("home.exams.examForm") || "Ficha de"}
                </Text>
                <Text className="font-semibold text-primary-500 text-center text-sm">
                  {t("home.exams.examFormSub") || "Exame"}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                router.push("/calculadora");
              }}
            >
              <View className="items-center" style={{ marginLeft: 10 }}>
                <View
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 40,
                    backgroundColor: "#f8e8f1",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <Image
                    source={require("../assets/Group.png")}
                    style={{
                      width: 23,
                      height: 23,
                    }}
                  />
                </View>
                <Text className="font-semibold text-primary-500 text-center text-sm">
                  {t("home.exams.calculator") || "Calculadora"}
                </Text>
                <Text className="font-semibold text-primary-500 text-center text-sm">
                  {t("home.exams.calculatorSub") || "Linfedema"}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View
        style={{
          marginLeft: 40,
          marginTop: 30,
        }}
      >
        <Text className="text-black-500 font-bold text-xl ">
          {t("home.exams.completedTitle") || "Exames concluídos"}
        </Text>
        <View
          style={{
            marginRight: 20,
          }}
        >
          <View className="flex-row bg-white-500 rounded-lg items-center py-4">
            <TouchableOpacity
              onPress={() => {
                router.push("/historicoExames");
              }}
            >
              <View className="items-center">
                <View
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 40,
                    backgroundColor: "#f8e8f1",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <Image
                    source={require("../assets/file-text.png")}
                    style={{
                      width: 24,
                      height: 24,
                    }}
                  />
                </View>
                <Text className="font-semibold text-primary-500 text-center text-sm">
                  {t("home.exams.history") || "Histórico"}
                </Text>
                <Text className="font-semibold text-primary-500 text-center text-sm">
                  {t("home.exams.historySub") || "Exames"}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => {
          router.navigate("/faq");
        }}
        style={{
          position: "absolute",
          bottom: 25,
          alignSelf: "center",
        }}
      >
        <Text className="text-center">
          <Text className="text-primary-500">
            {t("buttons.help") || "Preciso de ajuda"}
          </Text>
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 60,
          right: 30,
          width: 50,
          height: 50,
          backgroundColor: "#b41976",
          borderRadius: 30,
          justifyContent: "center",
          alignItems: "center",
          // Adicionando sombra
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
          elevation: 5,
        }}
        onPress={() => {
          router.navigate("/faq");
        }}
      >
        <Entypo name="help" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
