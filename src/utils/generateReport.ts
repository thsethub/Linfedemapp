import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

export async function generatePatientReport(
  patientData: any,
  volumeData: any,
  perimetryData: any
) {
  const {
    volumesReferencia,
    volumesAfetado,
    volumeReferenciaTotal,
    volumeAfetadoTotal,
    volumeDifferencePercentage,
  } = volumeData;
  const {
    leftArmInputs,
    rightArmInputs,
    affectedArm,
    referenceArm,
    differences,
  } = perimetryData;

  const htmlContent = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; font-size: 14px; color: #333; }
          h1, h2, h3 { color: #2C3E50; border-bottom: 1px solid #ccc; padding-bottom: 4px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
          th { background-color: #f5f5f5; }
          .section { margin-bottom: 30px; }
        </style>
      </head>
      <body>

        <h1>Relatório de Avaliação - Linfedema</h1>

        <div class="section">
          <h2>Dados do Paciente</h2>
          <table>
            <tr><th>Nome Completo</th><td>${patientData.fullName || "Não informado"}</td></tr>
            <tr><th>Endereço</th><td>${patientData.address || "Não informado"}</td></tr>
            <tr><th>Telefone</th><td>${patientData.phone || "Não informado"}</td></tr>
            <tr><th>Data de Nascimento</th><td>${patientData.birthDate || "Não informado"}</td></tr>
          </table>
        </div>

        <div class="section">
          <h2>Histórico Clínico</h2>
          <table>
            <tr><th>Data do Diagnóstico</th><td>${patientData.cancerDiagnosisDate || "Não informado"}</td></tr>
            <tr><th>Procedimentos</th><td>${patientData.procedures?.join(", ") || "Não informado"}</td></tr>
            <tr><th>Radioterapia</th><td>${patientData.radiotherapy?.type || "Não informado"} (${patientData.radiotherapy?.duration || "0"} meses)</td></tr>
            <tr><th>Cirurgia</th><td>${patientData.surgery?.type || "Não informado"} (${patientData.surgery?.duration || "0"} meses)</td></tr>
            <tr><th>Esvaziamento Axilar</th><td>${patientData.axillaryDissection?.type || "Não informado"} (${patientData.axillaryDissection?.duration || "0"} meses)</td></tr>
          </table>
        </div>

        <div class="section">
          <h2>Exame Físico</h2>
          <table>
            <tr><th>Queixas Musculoesqueléticas</th><td>${patientData.musculoskeletalComplaints || "Não informado"}</td></tr>
            <tr><th>Sintomas de Linfedema</th><td>${patientData.lymphedemaSymptoms || "Não informado"}</td></tr>
            <tr><th>Sinal de Cacifo</th><td>${patientData.cacifoSign || "Não informado"}</td></tr>
            <tr><th>Sinal da Casca de Laranja</th><td>${patientData.orangePeelSign || "Não informado"}</td></tr>
            <tr><th>Sinal de Stemmer</th><td>${patientData.stemmerSign || "Não informado"}</td></tr>
            <tr><th>Observações</th><td>${patientData.note || "Não informado"}</td></tr>
          </table>
        </div>

        <div class="section">
          <h2>Resultados de Medição</h2>

          <h3>Volumes</h3>
          <table>
            <tr>
              <th>Seção</th>
              <th>Referência (mL)</th>
              <th>Afetado (mL)</th>
            </tr>
            ${volumesReferencia.map((v: number, i: number) => `
              <tr>
                <td>V${i + 1}</td>
                <td>${v.toFixed(2)}</td>
                <td>${volumesAfetado[i]?.toFixed(2) || "-"}</td>
              </tr>
            `).join('')}
          </table>

          <table>
            <tr><th>Total Referência</th><td>${volumeReferenciaTotal.toFixed(2)} mL</td></tr>
            <tr><th>Total Afetado</th><td>${volumeAfetadoTotal.toFixed(2)} mL</td></tr>
            <tr><th>Diferença (%)</th><td>${volumeDifferencePercentage.toFixed(2)}%</td></tr>
          </table>

          <h3>Perimetria</h3>
          <table>
            <tr>
              <th>Ponto</th>
              <th>Referência (cm)</th>
              <th>Afetado (cm)</th>
              <th>Diferença (cm)</th>
            </tr>
            ${(referenceArm === "left" ? leftArmInputs : rightArmInputs).map((input: number, i: number) => `
              <tr>
                <td>P${i + 1}</td>
                <td>${input}</td>
                <td>${(affectedArm === "left" ? leftArmInputs : rightArmInputs)[i]}</td>
                <td>${differences[i]?.toFixed(2) || "-"}</td>
              </tr>
            `).join('')}
          </table>

        </div>

        <div class="section">
          <h2>Conclusão</h2>
          <p><strong>Paciente apresenta uma diferença volumétrica de ${volumeDifferencePercentage.toFixed(2)}% entre os membros, indicando ${volumeDifferencePercentage > 10 ? 'possível linfedema' : 'ausência de linfedema significativo'}.</strong></p>
        </div>

      </body>
    </html>
  `;

  try {
    // Gera o PDF
    const { uri } = await Print.printToFileAsync({
      html: htmlContent,
      base64: false,
    });

    // Compartilha o arquivo
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri);
    } else {
      console.log("Compartilhamento não disponível.");
    }
  } catch (error) {
    console.error("Erro ao gerar ou compartilhar o PDF:", error);
  }
}