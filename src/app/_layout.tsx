import "../style/global.css";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { MeasurementProvider } from "./../context/context";

export default function Layout() {
  return (
    <MeasurementProvider>
      <StatusBar style="auto" backgroundColor="transparent" translucent />
      <Slot />
    </MeasurementProvider>
  );
}