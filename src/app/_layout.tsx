import "../style/global.css";
import { Slot, usePathname, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { MeasurementProvider } from "./../context/context";
import { LanguageProvider } from "../context/LanguageContext";

// Routes where the global FAQ button must NOT appear
const HIDE_FAQ_ROUTES = [
  "/",
  "/sing-in",
  "/sing-up",
  "/recuperar_senha",
  "/select-language",
  "/faq",
  "/fichaExame",
  "/fichaExame2",
];

function GlobalFAQButton() {
  const pathname = usePathname();
  const router = useRouter();

  const hide = HIDE_FAQ_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(r + "?")
  );
  if (hide) return null;

  return (
    <TouchableOpacity
      onPress={() => router.push("/faq")}
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
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
        zIndex: 999,
      }}
    >
      <Entypo name="help" size={24} color="white" />
    </TouchableOpacity>
  );
}

export default function Layout() {
  return (
    <LanguageProvider>
      <MeasurementProvider>
        <StatusBar style="light" translucent />
        <View style={{ flex: 1 }}>
          <Slot />
          <GlobalFAQButton />
        </View>
      </MeasurementProvider>
    </LanguageProvider>
  );
}
