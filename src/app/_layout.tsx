import "../style/global.css";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { MeasurementProvider } from "./../context/context";
import { LanguageProvider } from "../context/LanguageContext";

export default function Layout() {
  return (
    <LanguageProvider>
      <MeasurementProvider>
        <StatusBar style="light" translucent />
        <Slot />
      </MeasurementProvider>
    </LanguageProvider>
  );
}
