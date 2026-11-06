import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

// Nativo: gera o PDF em arquivo e abre o menu de compartilhamento.
// Retorna false se o compartilhamento não estiver disponível.
export async function exportHtmlAsPdf(html: string): Promise<boolean> {
  const { uri } = await Print.printToFileAsync({ html, base64: false });
  if (uri && (await Sharing.isAvailableAsync())) {
    await Sharing.shareAsync(uri);
    return true;
  }
  return false;
}
