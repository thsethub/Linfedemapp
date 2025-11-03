import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import Header from "@/components/headerExames1";
import { useTranslation } from "@/context/LanguageContext";

const API_URL = "http://192.168.0.105:8083";
// const API_URL = "https://ac8b5f7d0939.ngrok-free.app";

// Interface para os pacientes
interface Patient {
  id: string;
  fullName: string;
  birthDate: string;
}

interface PatientData {
  id: string;
  birthDate: string;
  fullName: any;
  patient: Patient;
  measurements: {
    volumetry: any;
    perimetry: any;
  };
}

export default function HistoricoExames() {
  const { t } = useTranslation();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPatients = async () => {
    try {
      // Recupera o token armazenado
      const token = await SecureStore.getItemAsync("access_token");

      if (!token) {
        Alert.alert(t("common.error"), t("results.authTokenNotFound"));
        return;
      }

      // Faz a requisição para obter os dados do usuário autenticado
      const userResponse = await axios.get(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userId = userResponse.data.id;

      // Faz a requisição para listar os pacientes associados ao usuário
      const patientsResponse = await axios.get(
        `${API_URL}/api/pacientes/usuario/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPatients(patientsResponse.data);
    } catch (error) {
      // console.error("Erro ao buscar pacientes:", error);
      Alert.alert(t("common.error"), t("examHistory.loadError"));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPatients();
  }, []);

  // Função para deletar um paciente
  const deletePatient = async (patientId: string) => {
    try {
      // Recupera o token armazenado
      const token = await SecureStore.getItemAsync("access_token");

      if (!token) {
        Alert.alert(t("common.error"), t("results.authTokenNotFound"));
        return;
      }

      // Confirmação antes de deletar
      Alert.alert(
        t("examHistory.confirmDelete"),
        t("examHistory.confirmDeleteMessage"),
        [
          {
            text: t("common.cancel"),
            style: "cancel",
          },
          {
            text: t("examHistory.delete"),
            style: "destructive",
            onPress: async () => {
              try {
                await axios.delete(`${API_URL}/api/pacientes/${patientId}`, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                });

                // Recarrega a lista de pacientes após a exclusão
                fetchPatients();

                Alert.alert(
                  t("common.success"),
                  t("examHistory.deleteSuccess")
                );
              } catch (error) {
                // console.error("Erro ao deletar paciente:", error);
                Alert.alert(t("common.error"), t("examHistory.deleteError"));
              }
            },
          },
        ]
      );
    } catch (error) {
      // console.error("Erro ao deletar paciente:", error);
      Alert.alert(t("common.error"), t("examHistory.deleteError"));
    }
  };

  // Filtra os pacientes com base na pesquisa
  const filteredPatients = patients.filter((item) =>
    item.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // if (loading) {
  //   return (
  //     <View style={styles.container}>
  //       <ActivityIndicator size="large" color="#b41976" />
  //     </View>
  //   );
  // }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white-500">
        <ActivityIndicator size="large" color="#b41976" />
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" translucent />
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Header title={t("examHistory.title")} />
      </View>

      {/* Barra de Pesquisa */}
      <View style={styles.searchContainer} className="bg-white-600">
        <Ionicons
          name="search-sharp"
          size={18}
          color="#B0B0B0"
          style={styles.searchIcon}
        />
        <TextInput
          className="font-semibold"
          style={styles.searchBar}
          placeholder={t("examHistory.searchPlaceholder")}
          placeholderTextColor="#aaa"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Lista de Pacientes */}
      <FlatList
        data={filteredPatients}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.fullName}</Text>
              <Text style={styles.cardDate}>
                {t("examHistory.birthDate")}:{" "}
                {item.birthDate || t("common.notProvided")}
              </Text>
            </View>
            <View style={styles.cardActions}>
              <TouchableOpacity
                style={styles.openButton}
                onPress={() =>
                  router.push({
                    pathname: "/historicoDetalhes/[id]",
                    params: { id: item.id },
                  })
                }
              >
                <Ionicons
                  name="folder-open-outline"
                  size={16}
                  color="#b41976"
                />
                <Text style={styles.openButtonText}>
                  {t("examHistory.openHistory")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deletePatient(item.id)}
              >
                <Ionicons name="trash-outline" size={16} color="#ff0000" />
                <Text style={styles.deleteButtonText}>
                  {t("examHistory.delete")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text className="text-black-500 text-center">
            {t("examHistory.noPatients")}
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  headerTitle: {
    fontSize: 16,
    color: "#000",
    marginLeft: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 5,
  },
  searchBar: {
    flex: 1,
    fontSize: 16,
    color: "#B0B0B0",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardContent: {
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  cardDate: {
    fontSize: 12,
    color: "#777",
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  openButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff2f7",
    padding: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#b41976",
  },
  openButtonText: {
    color: "#b41976",
    fontSize: 12,
    marginLeft: 5,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffe6e6",
    padding: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ff0000",
  },
  deleteButtonText: {
    color: "#ff0000",
    fontSize: 12,
    marginLeft: 5,
  },
});
