import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { getReports, deleteReport } from "@/utils/storage";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Ionicons } from "@expo/vector-icons";

export default function ReportList() {
  const [reports, setReports] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      const savedReports = await getReports();
      setReports(savedReports);
    };
    fetchReports();
  }, []);

  const handleDelete = async (id: number, path: string) => {
    try {
      await FileSystem.deleteAsync(path, { idempotent: true });
      await deleteReport(id);
      setReports((prev) => prev.filter((report) => report.id !== id));
    } catch (error) {
      console.error("Erro ao excluir arquivo:", error);
    }
  };

  const filteredReports = reports.filter((report) =>
    report.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Ionicons name="time-outline" size={20} color="#000" />
        <Text style={styles.headerTitle} className="font-semibold">Histórico de Exames</Text>
      </View>

      {/* Barra de Pesquisa */}
      <View style={styles.searchContainer} className="bg-white-600">
        <Ionicons name="search-sharp" size={18} color="#B0B0B0" style={styles.searchIcon} />
        <TextInput
        className="font-semibold"
          style={styles.searchBar}
          placeholder="Pesquisar"
          placeholderTextColor="#aaa"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Lista de Relatórios */}
      <FlatList
        data={filteredReports}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardDate}>{item.date}</Text>
            </View>
            <View style={styles.cardActions}>
              <TouchableOpacity
                onPress={() => Sharing.shareAsync(item.path)}
                style={styles.openButton}
              >
                <Ionicons name="download-outline" size={16} color="#b41976" />
                <Text style={styles.openButtonText}>Fazer Download</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDelete(item.id, item.path)}
                style={styles.deleteButton}
              >
                <Ionicons name="trash-outline" size={16} color="#fff" />
                <Text style={styles.deleteButtonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
    // fontWeight: "bold",
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
    backgroundColor: "#b41976",
    padding: 8,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 12,
    marginLeft: 5,
  },
});