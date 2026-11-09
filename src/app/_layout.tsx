import "../style/global.css";
import { Slot, usePathname, useRouter } from "expo-router";
import React from "react";
import { Platform, TouchableOpacity, View } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { MeasurementProvider } from "./../context/context";
import { LanguageProvider } from "../context/LanguageContext";
import { MAX_APP_WIDTH } from "../utils/layout";

// Na web o app é uma moldura de celular centralizada (evita telas esticadas no desktop).
function WebFrame({ children }: { children: React.ReactNode }) {
  if (Platform.OS !== "web") return <>{children}</>;
  return (
    <View style={{ flex: 1, alignItems: "center", backgroundColor: "#e5e7eb" }}>
      <View
        style={{
          flex: 1,
          width: "100%",
          maxWidth: MAX_APP_WIDTH,
          backgroundColor: "#ffffff",
          overflow: "hidden",
        }}
      >
        {children}
      </View>
    </View>
  );
}

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
        <WebFrame>
          <View style={{ flex: 1 }}>
            <Slot />
            <GlobalFAQButton />
          </View>
        </WebFrame>
      </MeasurementProvider>
    </LanguageProvider>
  );
}
