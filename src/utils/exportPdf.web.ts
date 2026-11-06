import * as Print from "expo-print";

// Web: printToFileAsync/shareAsync não existem no navegador. Abrimos o diálogo
// de impressão com o HTML do relatório; o usuário escolhe "Salvar como PDF".
export async function exportHtmlAsPdf(html: string): Promise<boolean> {
  await Print.printAsync({ html });
  return true;
}
