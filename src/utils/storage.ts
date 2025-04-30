import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "reports";

// Salva um novo relatório
export const saveReport = async (name: string, path: string): Promise<void> => {
  try {
    const existingReports = await AsyncStorage.getItem(STORAGE_KEY);
    const reports = existingReports ? JSON.parse(existingReports) : [];
    reports.push({ id: Date.now(), name, path, createdAt: new Date().toISOString() });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
    console.log("Relatório salvo com sucesso.");
  } catch (error) {
    console.error("Erro ao salvar relatório:", error);
  }
};

// Recupera todos os relatórios
export const getReports = async (): Promise<any[]> => {
  try {
    const reports = await AsyncStorage.getItem(STORAGE_KEY);
    return reports ? JSON.parse(reports) : [];
  } catch (error) {
    console.error("Erro ao buscar relatórios:", error);
    return [];
  }
};

// Exclui um relatório pelo ID
export const deleteReport = async (id: number): Promise<void> => {
  try {
    const existingReports = await AsyncStorage.getItem(STORAGE_KEY);
    const reports = existingReports ? JSON.parse(existingReports) : [];
    const updatedReports = reports.filter((report: any) => report.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReports));
    console.log("Relatório excluído com sucesso.");
  } catch (error) {
    console.error("Erro ao excluir relatório:", error);
  }
};