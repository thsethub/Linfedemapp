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

const API_URL = "http://150.161.61.1:8083";

const faqData = [
  {
    title: "Como funciona o aplicativo?",
    content:
      "O Linfedemapp é uma ferramenta desenvolvida para profissionais de saúde otimizarem o acompanhamento de pacientes com linfedema. Ele permite registrar dados de anamnese, realizar medições de perimetria, calcular o volume do membro e acompanhar a evolução do tratamento através de um histórico detalhado.",
  },
  {
    title: "Como a volumetria é calculada no aplicativo?",
    content: (
      <>
        O cálculo de volume no aplicativo é realizado por meio de medidas de circunferência
        obtidas pela perimetria, utilizando o método da volumetria indireta. Nesse processo, o
        membro é dividido em segmentos sucessivos de aproximadamente 10 cm, cada qual
        considerado como um tronco de cone. O volume de cada segmento é calculado pela fórmula:
        {"\n\n"}
        V = (h / 12π) × (C1² + C1 × C2 + C2²)
        {"\n\n"}
        em que h corresponde à altura do segmento (distância entre os pontos de medida), e C₁ e C₂
        às circunferências proximal e distal, respectivamente. A soma dos volumes de todos os
        segmentos fornece o volume total do membro.
        {"\n\n"}
        Esse método, descrito nas diretrizes clínicas da American Physical Therapy Association, é
        reconhecido como uma técnica válida e confiável para a estimativa do volume de membros
        em pacientes com linfedema (Levenhagen et al., 2017).
        {"\n\n"}
        Referência:
        {"\n"}
        LEVENHAGEN, Kimberly et al. Diagnosis of upper quadrant lymphedema secondary to
        cancer: clinical practice guideline from the Oncology Section of the American Physical
        Therapy Association. Physical Therapy, v. 97, n. 7, p. 729-745, 2017.
        {"\n"}
        <Text
          style={{ color: "#1e40af", textDecorationLine: "underline" }}
          onPress={() =>
            Linking.openURL("https://doi.org/10.1093/ptj/pzx050")
          }
        >
          https://doi.org/10.1093/ptj/pzx050
        </Text>
      </>
    ),
  },
  {
    title: "É possível comparar a evolução do paciente?",
    content:
      "Sim. A seção 'Histórico de Exames' armazena todas as avaliações. Ao selecionar um paciente, você pode visualizar a progressão do volume do membro, a diferença percentual entre avaliações e comparar dados de perimetria ao longo do tempo, facilitando a análise da eficácia do tratamento.",
  },
  {
    title: "Como os dados dos pacientes são protegidos?",
    content:
      "A segurança é nossa prioridade. Todos os dados são transmitidos via HTTPS e armazenados com criptografia. O acesso é restrito e segue as diretrizes da Lei Geral de Proteção de Dados (LGPD), garantindo a confidencialidade das informações clínicas.",
  },
  {
    title: "Como funciona a exportação de relatórios?",
    content:
      "A partir do histórico, qualquer exame pode ser exportado como um relatório em formato PDF. O documento inclui os dados do paciente, as medidas de perimetria, o volume calculado e a data da avaliação, pronto para ser anexado ao prontuário eletrônico ou compartilhado.",
  },
  {
    title: "Como posso redefinir minha senha?",
    content:
      "Na tela de login, clique na opção 'Esqueceu a senha?'. Você precisará informar seu e-mail de cadastro para receber um código de verificação e as instruções para criar uma nova senha de acesso.",
  },
];

export default function Faq() {
  const [user, setUser] = useState<any>(null);

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
          <Text className="text-xl font-semibold ml-3">
            Perguntas frequentes
          </Text>
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
                {user ? `Olá, ${user.name.split(" ")[0]}!` : "Olá!"}
              </Text>
              <Text className="text-white-500 font-semibold mb-4 text-center">
                Como posso ajudar?
              </Text>
              <Text className="text-white-500 text-xs font-semibold text-center">
                Na tela de suporte, você poderá encontrar as respostas de todas
                as suas dúvidas do app.
              </Text>
            </View>
          </View>
        </View>
        <FaqAccordion items={faqData} />
      </ScrollView>
    </SafeAreaView>
  );
}
