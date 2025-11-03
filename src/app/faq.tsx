import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import FaqAccordion from "@/components/FaqAccordion";
import { Linking } from "react-native";
import { useTranslation } from "@/context/LanguageContext";

// const API_URL = "https://ac8b5f7d0939.ngrok-free.app";
const API_URL = "http://10.103.242.236:8083";

export default function Faq() {
  const { t } = useTranslation();
  const [user, setUser] = useState<any>(null);

  const faqData = [
    {
      title: t("faq.questions.q1.question"),
      content: t("faq.questions.q1.answer"),
    },
    {
      title: t("faq.questions.q2.question"),
      content: t("faq.questions.q2.answer"),
    },
    {
      title: t("faq.questions.q3.question"),
      content: t("faq.questions.q3.answer"),
    },
    {
      title: t("faq.questions.q4.question"),
      content: t("faq.questions.q4.answer"),
    },
    {
      title: t("faq.questions.q5.question"),
      content: t("faq.questions.q5.answer"),
    },
    {
      title: t("faq.questions.q6.question"),
      content: t("faq.questions.q6.answer"),
    },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      const token = await SecureStore.getItemAsync("access_token");
      if (!token) {
        // Alert.alert("Erro", "Token de autenticação não encontrado.");
        return;
      }
      try {
        const response = await axios.get(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
        console.log("User data:", response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white-500 mt-8">
      <StatusBar style="dark" translucent />

      {/* Header */}
      <View className="px-4 py-3 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-2 p-2">
          <Feather name="arrow-left" size={26} color="#000" />
        </TouchableOpacity>
        <View className="flex-row items-center flex-1 justify-center mr-10">
          <Feather name="help-circle" size={20} color="#000" />
          <Text className="text-xl font-semibold ml-3">{t("faq.title")}</Text>
        </View>
      </View>

      <ScrollView className="mt-2">
        <View className="justify-center items-center mt-10">
          <View
            className="bg-primary-500 px-6 flex-row items-center"
            style={{
              width: 330,
              height: 130,
              borderRadius: 20,
            }}
          >
            <Image
              source={require("../assets/faq.png")}
              style={{
                position: "absolute",
                top: -50,
                width: 130,
                height: 180,
                zIndex: 1,
              }}
            />
            <View
              className="flex-1 justify-center items-center"
              style={{ marginLeft: 120, marginBottom: 30 }}
            >
              <Text className="text-white-500 font-semibold mt-10 text-center">
                {user
                  ? `${t("common.hello")}, ${user.name.split(" ")[0]}!`
                  : `${t("common.hello")}!`}
              </Text>
              <Text className="text-white-500 font-semibold mb-4 text-center">
                {t("faq.needHelp")}
              </Text>
              <Text className="text-white-500 text-xs font-semibold text-center">
                {t("faq.supportText")}
              </Text>
            </View>
          </View>
        </View>
        <FaqAccordion items={faqData} />
      </ScrollView>
    </SafeAreaView>
  );
}
