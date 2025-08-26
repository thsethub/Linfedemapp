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
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import Header from "@/components/headerExames1";

// const API_URL = "http://192.168.15.108:8081";
const API_URL = "https://3f276be13750.ngrok-free.app";

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
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPatients = async () => {
    try {
      // Recupera o token armazenado
      const token = await SecureStore.getItemAsync("access_token");

      if (!token) {
        Alert.alert("Erro", "Token de autenticação não encontrado.");
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
      Alert.alert("Erro", "Não foi possível carregar os pacientes.");
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
        Alert.alert("Erro", "Token de autenticação não encontrado.");
        return;
      }

      // Confirmação antes de deletar
      Alert.alert("Confirmação", "Tem certeza que deseja deletar o paciente?", [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Deletar",
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

              Alert.alert("Sucesso", "Paciente deletado com sucesso!");
            } catch (error) {
              // console.error("Erro ao deletar paciente:", error);
              Alert.alert("Erro", "Não foi possível deletar o paciente.");
            }
          },
        },
      ]);
    } catch (error) {
      // console.error("Erro ao deletar paciente:", error);
      Alert.alert("Erro", "Não foi possível deletar o paciente.");
    }
  };

  // Filtra os pacientes com base na pesquisa
  const filteredPatients = patients.filter((item) =>
    item.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#b41976" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" translucent />
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Header title="Histórico Clínico" />
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
          placeholder="Pesquisar paciente"
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
                Data de Nascimento: {item.birthDate || "Não informado"}
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
                  Abrir Histórico Clínico
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deletePatient(item.id)}
              >
                <Ionicons name="trash-outline" size={16} color="#ff0000" />
                <Text style={styles.deleteButtonText}>Deletar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text className="text-black-500 text-center">
            Nenhum paciente encontrado.
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
