import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "../context/LanguageContext";

const ICON_SIZE = 50;
const ITEM_WIDTH = 82; // wide enough for longest English label ("Lymphedema\nCalculator")

function ShortcutItem({
  onPress,
  icon,
  iconImage,
  label,
  subLabel,
  customIcon,
}: {
  onPress: () => void;
  icon?: string;
  iconImage?: any;
  label: string;
  subLabel: string;
  customIcon?: React.ReactNode;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ width: ITEM_WIDTH, alignItems: "center", marginRight: 14 }}
    >
      <View
        style={{
          width: ICON_SIZE,
          height: ICON_SIZE,
          borderRadius: ICON_SIZE / 2,
          backgroundColor: "#f8e8f1",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        {customIcon ?? (iconImage ? (
          <Image source={iconImage} style={{ width: 24, height: 24 }} />
        ) : icon ? (
          <Feather name={icon as any} size={24} color="#B91C7C" />
        ) : null)}
      </View>
      <Text
        style={{
          color: "#B91C7C",
          fontWeight: "600",
          fontSize: 12,
          textAlign: "center",
          lineHeight: 16,
        }}
        numberOfLines={2}
        adjustsFontSizeToFit
        minimumFontScale={0.75}
      >
        {`${label}\n${subLabel}`}
      </Text>
    </TouchableOpacity>
  );
}

export default function Home() {
  const { t } = useTranslation();

  return (
    <SafeAreaView className="flex-1 bg-white-500 mt-8">
      <StatusBar style="dark" translucent />

      {/* Banner */}
      <View className="justify-center items-center">
        <View
          className="bg-primary-500 px-6 mt-8"
          style={{ width: 330, height: 130, borderRadius: 20 }}
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
            {t("home.banner.title1") || "Fique por dentro das"}
          </Text>
          <Text className="text-white-500 font-semibold mb-4">
            {t("home.banner.title2") || "novidades do app!"}
          </Text>
          <TouchableOpacity
            activeOpacity={0.6}
            className="flex-row mr-2"
            onPress={() => router.push("/news")}
          >
            <Text className="text-white-500 font-medium">
              {t("home.banner.seeMore") || "Veja mais"}
            </Text>
            <Entypo name="chevron-small-right" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Minha Conta */}
      <View style={{ marginLeft: 40, marginTop: 30 }}>
        <Text className="text-black-500 font-bold text-xl mb-2">
          {t("home.profile.title") || "Minha Conta"}
        </Text>
        <View style={{ marginRight: 20 }}>
          <View className="flex-row bg-white-500 rounded-lg py-4">
            <ShortcutItem
              onPress={() => router.push("/profile")}
              icon="user"
              label={t("home.profile.professional") || "Perfil"}
              subLabel={t("home.profile.professionalSub") || "Profissional"}
            />
            <ShortcutItem
              onPress={() => router.push("/settings")}
              customIcon={<Entypo name="cog" size={24} color="#B91C7C" />}
              label={t("home.settings.title") || "Ajustes"}
              subLabel={t("home.settings.subtitle") || "do App"}
            />
          </View>
        </View>
      </View>

      {/* Realizar Exames */}
      <View style={{ marginLeft: 40, marginTop: 30 }}>
        <Text className="text-black-500 font-bold text-xl mb-0">
          {t("home.exams.performTitle") || "Realizar exames"}
        </Text>
        <View style={{ marginRight: 20 }}>
          <View className="flex-row bg-white-500 rounded-lg items-center py-4">
            <ShortcutItem
              onPress={() => router.push("/fichaExame")}
              iconImage={require("../assets/file-text.png")}
              label={t("home.exams.examForm") || "Ficha de"}
              subLabel={t("home.exams.examFormSub") || "Exame"}
            />
            <ShortcutItem
              onPress={() => router.push("/calculadora")}
              iconImage={require("../assets/Group.png")}
              label={t("home.exams.calculator") || "Calculadora"}
              subLabel={t("home.exams.calculatorSub") || "Linfedema"}
            />
          </View>
        </View>
      </View>

      {/* Exames concluídos */}
      <View style={{ marginLeft: 40, marginTop: 30 }}>
        <Text className="text-black-500 font-bold text-xl mb-0">
          {t("home.exams.completedTitle") || "Exames concluídos"}
        </Text>
        <View style={{ marginRight: 20 }}>
          <View className="flex-row bg-white-500 rounded-lg items-center py-4">
            <ShortcutItem
              onPress={() => router.push("/historicoExames")}
              iconImage={require("../assets/file-text.png")}
              label={t("home.exams.history") || "Histórico de"}
              subLabel={t("home.exams.historySub") || "Exames"}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
