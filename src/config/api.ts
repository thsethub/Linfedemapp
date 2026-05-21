import Constants from "expo-constants";

// Obtém a URL da API das variáveis de ambiente
export const API_URL =
  Constants.expoConfig?.extra?.apiUrl ||
  process.env.EXPO_PUBLIC_API_URL ||
  "http://192.168.0.105:8083";

console.log("API URL configurada:", API_URL);
