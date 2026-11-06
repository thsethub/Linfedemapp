// Nativo (iOS/Android): armazenamento seguro do sistema.
// Na web o Metro usa automaticamente secureStorage.web.ts.
export {
  getItemAsync,
  setItemAsync,
  deleteItemAsync,
} from "expo-secure-store";
