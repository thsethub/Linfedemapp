import { Stack } from "expo-router";
import { View, Text, Image } from "react-native";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitleAlign: "center",
        headerTintColor: "#000",
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="home"
        options={{
          headerShown: false,
          title: "Home",
          headerBackTitle: "", // Remove o texto do botão de voltar
        }}
      />
      <Stack.Screen
        name="bracoDireito"
        options={{
          title: "Braço Direito",
          headerBackTitle: "",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="bracoEsquerdo"
        options={{
          title: "Braço Esquerdo",
          headerBackTitle: "",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="calculadora"
        options={{
          headerTitle: "", // Remove o título completamente
          headerBackTitle: "",
          animation: "fade", // Ajusta a animação para evitar transições bruscas
          headerTransparent: true, // Torna o header transparente
        }}
      />
    </Stack>
  );
}
