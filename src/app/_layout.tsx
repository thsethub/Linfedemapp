import "../style/global.css";

import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";

export default function Layout() {
  return (
    <>
      <StatusBar style="auto" backgroundColor="transparent" translucent />
      <Slot />
    </>
  );
}
