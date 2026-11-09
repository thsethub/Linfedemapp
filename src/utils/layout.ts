import { useWindowDimensions } from "react-native";

// Largura máxima do app. Na web o conteúdo fica numa moldura de celular
// centralizada (ver app/_layout.tsx); no nativo a tela já tem esse tamanho.
export const MAX_APP_WIDTH = 480;

// Substitui Dimensions/useWindowDimensions nas telas: a largura nunca passa de
// MAX_APP_WIDTH, para os tamanhos calculados a partir dela não crescerem no desktop.
export function useAppWindow() {
  const { width, height } = useWindowDimensions();
  return { width: Math.min(width, MAX_APP_WIDTH), height };
}
