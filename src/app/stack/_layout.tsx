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
        }}
      />
      <Stack.Screen name="bracoAfetado" options={{ title: "Braço Afetado" }} />
      <Stack.Screen name="bracoRef" options={{ title: "Braço Não Afetado" }} />
      <Stack.Screen
        name="calculadora"
        options={{
          headerTitle: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image className="w-6 h-6" source={require("../../assets/maximize.png")} />
              <Text style={{ marginLeft: 8, fontSize: 18, fontWeight: "bold" }}>
                Calculadora
              </Text>
            </View>
          ),
          headerBackTitle: "Voltar",
        }}
      />
    </Stack>
  );
}
