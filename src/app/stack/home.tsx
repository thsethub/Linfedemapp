import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";

const { width, height } = Dimensions.get("window");

export default function Home() {
  return (
    <SafeAreaView className="flex-1 bg-white-500">
      <StatusBar style="dark" backgroundColor="transparent" translucent />
      <View className="justify-center items-center">
        <View
          className="bg-primary-500 px-6 mt-16"
          style={{
            width: 330,
            height: 130,
            borderRadius: 20,
          }}
        >
          <Image
            source={require("../../assets/image 8.png")}
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
            <Text>Fique por dentro das</Text>
          </Text>
          <Text className="text-white-500 font-semibold mb-4">
            <Text>novidades do app!</Text>
          </Text>
          <TouchableOpacity activeOpacity={0.6} className="flex-row mr-2">
            <Text className="text-white-500 font-medium">Veja mais</Text>
            <Entypo name="chevron-small-right" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          marginLeft: 40,
          marginTop: 40,
        }}
      >
        <Text className="text-black-500 font-bold text-xl ">
          Realizar exames
        </Text>
        <View
          style={{
            marginRight: 20, // Espaço entre o ícone e o texto
          }}
        >
          <View className="flex-row bg-white-500 rounded-lg items-center">
            <TouchableOpacity
              onPress={() => {
                router.navigate("/fichaExame");
              }}
            >
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 40,
                  backgroundColor: "#f8e8f1", // bg-white-600
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 10,
                  marginRight: 30, // Espaço entre o ícone e o texto
                }}
              >
                <Image
                  source={require("../../assets/file-text.png")}
                  style={{
                    width: 24,
                    height: 24,
                  }}
                />
              </View>
              <Text className="font-semibold text-primary-500">Ficha de</Text>
              <Text className="font-semibold text-primary-500"> Exame</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                router.navigate("/stack/calculadora");
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
                  marginTop: 10,
                  marginLeft: 14,
                }}
              >
                <Image
                  source={require("../../assets/Group.png")}
                  style={{
                    width: 23,
                    height: 23,
                  }}
                />
              </View>
              <Text className="font-semibold text-primary-500">
                Calculadora
              </Text>
              <Text
                className="font-semibold text-primary-500"
                style={{
                  left: 4.5,
                }}
              >
                Linfedema
              </Text>
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
          Exames concluídos
        </Text>
        <View
          style={{
            marginRight: 20,
          }}
        >
          <View className="flex-row bg-white-500 rounded-lg items-center">
            <TouchableOpacity
              onPress={() => {
                router.navigate("/historicoExames");
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
                  marginTop: 10,
                  marginRight: 30,
                }}
              >
                <Image
                  source={require("../../assets/file-text.png")}
                  style={{
                    width: 24,
                    height: 24,
                  }}
                />
              </View>
              <Text
                className="font-semibold text-primary-500"
                style={{
                  right: 11,
                }}
              >
                Histórico de
              </Text>
              <Text
                className="font-semibold text-primary-500"
                style={{
                  left: 2,
                }}
              >
                Exames
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => {
          router.navigate("/");
        }}
        style={{
          position: "absolute",
          bottom: 25,
          alignSelf: "center",
        }}
      >
        <Text className="text-center">
          <Text className="text-primary-500">Preciso de ajuda</Text>
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
          // router.navigate("/faq");
        }}
      >
        <Entypo name="help" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
