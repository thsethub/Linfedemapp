import * as Print from "expo-print";
import * as FileSystem from "expo-file-system";
import { saveReport } from "./storage";

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
    leftArmComprimento,
    rightArmComprimento,
    pontosRef,
  } = perimetryData;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const currentDate = formatDate(new Date());
  const fileName = `${patientData.fullName || "Relatorio"}_${currentDate}.pdf`;

  // Determina o número de pontos com base em pontosRef
  const numPontos = (() => {
    if (pontosRef === "5cm") return 9;
    if (pontosRef === "7cm") return 7;
    if (pontosRef === "10cm") return 4;
    return 5; // Padrão
  })();

  // Define os inputs e diferenças com base no braço de referência e afetado
  const referenceInputs =
    referenceArm === "left" ? leftArmInputs : rightArmInputs;
  const affectedInputs =
    affectedArm === "left" ? leftArmInputs : rightArmInputs;

  const htmlContent = `
    <html>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Poppins', sans-serif;
            background: #f7f7f7;
            margin: 0;
            padding: 20px;
            color: #333;
            font-size: 12px;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
          }
          .header h1 {
            color: #b41976;
            font-size: 26px;
            margin-bottom: 5px;
          }
          .header p {
            font-size: 12px;
            color: #777;
          }
          .section {
            margin-bottom: 20px;
          }
          .section-title {
            font-size: 14px;
            color: #b41976;
            margin-bottom: 10px;
            border-bottom: 2px solid #b41976;
            padding-bottom: 3px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }
          th, td {
            padding: 8px;
            text-align: center;
            font-size: 11px;
          }
          th {
            background: linear-gradient(to right, #ffe0f0, #f9c2dc);
            color: #333;
            font-weight: 600;
          }
          td {
            background: #fafafa;
            border-bottom: 1px solid #eee;
          }
          .highlight {
            font-weight: bold;
            color: #b41976;
          }
          .summary-table td {
            background: #fff2f7;
          }
          .conclusion {
            margin-top: 20px;
            text-align: center;
            font-size: 14px;
            color: #b41976;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Linfedemapp</h1>
          <p>Data: ${currentDate}</p>
        </div>

        <div class="section">
          <div class="section-title">Dados do Paciente</div>
          <table>
            <tr><th>Nome Completo</th><td>${
              patientData.fullName || "Não informado"
            }</td></tr>
            <tr><th>Data de Nascimento</th><td>${
              patientData.birthDate || "Não informado"
            }</td></tr>
            <tr><th>Altura</th><td>${
              patientData.height || "Não informado"
            } cm</td></tr>
            <tr><th>Peso</th><td>${
              patientData.weight || "Não informado"
            } kg</td></tr>
            <tr><th>Nível de Atividade</th><td>${
              patientData.activityLevel || "Não informado"
            }</td></tr>
            <tr><th>Estado Civil</th><td>${
              patientData.maritalStatus || "Não informado"
            }</td></tr>
            <tr><th>Profissão/Ocupação</th><td>${
              patientData.occupation || "Não informado"
            }</td></tr>
            <tr><th>Endereço</th><td>${
              patientData.address || "Não informado"
            }</td></tr>
            <tr><th>Telefone</th><td>${
              patientData.phone || "Não informado"
            }</td></tr>
          </table>
        </div>

        <div class="section">
          <div class="section-title">Histórico Clínico</div>
          <table>
            <tr><th>Data do Diagnóstico</th><td>${
              patientData.cancerDiagnosisDate || "Não informado"
            }</td></tr>
            <tr><th>Procedimentos</th><td>${
              patientData.procedures?.join(", ") || "Não informado"
            }</td></tr>
            <tr><th>Radioterapia</th><td>${
              patientData.radiotherapy?.type || "Não informado"
            } (${patientData.radiotherapy?.duration || "0"} meses)</td></tr>
            <tr><th>Cirurgia</th><td>${
              patientData.surgery?.type || "Não informado"
            } (${patientData.surgery?.duration || "0"} meses)</td></tr>
            <tr><th>Esvaziamento Axilar</th><td>${
              patientData.axillaryDissection?.type || "Não informado"
            } (${
    patientData.axillaryDissection?.duration || "0"
  } meses)</td></tr>
          </table>
        </div>

        <div class="section">
          <div class="section-title">Alterações Cutâneas</div>
          <table>
            <tr><th>Alterações na Pele</th><td>${
              patientData.skinChanges?.join(", ") || "Não informado"
            }</td></tr>
            <tr><th>Sinal do Cacifo</th><td>${
              patientData.cacifoSign || "Não informado"
            }</td></tr>
            <tr><th>Sinal da Casca de Laranja</th><td>${
              patientData.orangePeelSign || "Não informado"
            }</td></tr>
            <tr><th>Sinal de Stemmer</th><td>${
              patientData.stemmerSign || "Não informado"
            }</td></tr>
          </table>
        </div>

        <div class="section">
          <div class="section-title">Resultados de Medição</div>
          <h4>Volumes</h4>
          <table>
            <tr>
              <th>Seção</th>
              <th>Referência (mL)</th>
              <th>Afetado (mL)</th>
            </tr>
            ${volumesReferencia
              .map(
                (v: number, i: number) => `
              <tr>
                <td>V${i + 1}</td>
                <td>${v.toFixed(2)}</td>
                <td>${volumesAfetado[i]?.toFixed(2) || "-"}</td>
              </tr>
            `
              )
              .join("")}
          </table>

          <table class="summary-table">
            <tr><td><b>Total Referência:</b> ${volumeReferenciaTotal.toFixed(
              2
            )} mL</td></tr>
            <tr><td><b>Total Afetado:</b> ${volumeAfetadoTotal.toFixed(
              2
            )} mL</td></tr>
            <tr><td class="highlight"><b>Diferença:</b> ${volumeDifferencePercentage.toFixed(
              2
            )}%</td></tr>
          </table>

          <h4>Perimetria</h4>
          <table>
            <tr>
              <th>Ponto</th>
              <th>Referência (cm)</th>
              <th>Afetado (cm)</th>
              <th>Diferença (cm)</th>
            </tr>
            <tr>
              <td>P1</td>
              <td>${leftArmComprimento}</td>
              <td>${rightArmComprimento}</td>
              <td>${differences[0]?.toFixed(2)}</td>
            </tr>
            ${referenceInputs
              .slice(0, numPontos)
              .map((input: string, i: number) => {
                const affectedValue = affectedInputs[i] || "-";
                const differenceValue = differences[i + 1]?.toFixed(2) || "-";

                return `
                <tr>
                  <td>P${i + 2}</td>
                  <td>${input}</td>
                  <td>${affectedValue}</td>
                  <td>${differenceValue}</td>
                </tr>
              `;
              })
              .join("")}
          </table>
        </div>

        <div class="conclusion">
          Paciente apresenta diferença volumétrica de ${volumeDifferencePercentage.toFixed(
            2
          )}%, indicando ${
    volumeDifferencePercentage > 10
      ? "possível linfedema"
      : "ausência de linfedema significativo"
  }.
        </div>

      </body>
    </html>
  `;

  try {
    const { uri } = await Print.printToFileAsync({ html: htmlContent });

    if (!uri) {
      console.error("Erro ao gerar o PDF.");
      return;
    }

    const newUri = `${FileSystem.documentDirectory}${fileName}`;
    await FileSystem.copyAsync({
      from: uri,
      to: newUri,
    });

    await saveReport(fileName, newUri);

    alert("Relatório salvo com sucesso!");
  } catch (error) {
    console.error("Erro ao gerar ou salvar o PDF:", error);
    alert("Erro ao gerar o relatório.");
  }
}
