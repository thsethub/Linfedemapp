import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

export async function generatePatientReport(
  patient: any,
  lastMeasurement: any
) {
  try {
    // Formatar a data
    const formatDate = (date: string) => {
      const parsedDate = new Date(date);
      return parsedDate.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    };

    const currentDate = formatDate(new Date().toISOString());

    // Função para obter o texto do diagnóstico com base na diferença de volume
    const getVolumeDifferenceText = (percentage: number) => {
      if (percentage < 5) {
        return "O membro não apresenta alterações volumétricas.";
      } else if (percentage >= 5 && percentage < 10) {
        return `O membro apresenta alterações de volume de <b>${percentage.toFixed(
          2
        )}%</b>, o que pode sugerir um estágio <b>0 ou subclínico</b>.`;
      } else if (percentage >= 10 && percentage < 20) {
        return `O membro apresenta alterações de volume de <b>${percentage.toFixed(
          2
        )}%</b>, sugerindo linfedema estágio <b>I ou leve</b>.`;
      } else if (percentage >= 20 && percentage < 40) {
        return `O membro apresenta alterações de volume de <b>${percentage.toFixed(
          2
        )}%</b>, sugerindo linfedema estágio <b>II ou moderado</b>.`;
      } else {
        return `O membro apresenta alterações de volume de <b>${percentage.toFixed(
          2
        )}%</b>, sugerindo linfedema estágio <b>III ou avançado</b>.`;
      }
    };

    // Gerar o conteúdo HTML do PDF
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
              text-align: left;
              font-size: 12px;
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

          <!-- Dados Pessoais -->
          <div class="section">
            <div class="section-title">Dados Pessoais</div>
            <table>
              <tr><th>Nome Completo</th><td>${
                patient.nome || "Não informado"
              }</td></tr>
              <tr><th>Data de Nascimento</th><td>${
                patient.dataNascimento || "Não informado"
              }</td></tr>
              <tr><th>Endereço</th><td>${
                patient.endereco || "Não informado"
              }</td></tr>
              <tr><th>Telefone</th><td>${
                patient.telefone || "Não informado"
              }</td></tr>
              <tr><th>Estado Civil</th><td>${
                patient.estadoCivil || "Não informado"
              }</td></tr>
              <tr><th>Ocupação</th><td>${
                patient.ocupacao || "Não informado"
              }</td></tr>
              <tr><th>Observação</th><td>${
                patient.observacaoPaciente || "Não informado"
              }</td></tr>
            </table>
          </div>

          <!-- Dados de Ficha de Exame -->
          <div class="section">
            <div class="section-title">Dados de Ficha de Exame</div>
            <table>
              <tr><th>Peso Corporal</th><td>${
                patient.pesoCorporal || "Não informado"
              } kg</td></tr>
              <tr><th>Altura</th><td>${
                patient.altura || "Não informado"
              } cm</td></tr>
              <tr><th>Nível de Atividade Física</th><td>${
                patient.nivelAtividadeFisica || "Não informado"
              }</td></tr>
            </table>
          </div>

          <!-- Procedimentos -->
          <div class="section">
            <div class="section-title">Procedimentos</div>
            <table>
              <tr><th>Procedimentos Realizados</th><td>${
                patient.procedimentos?.join(", ") ||
                "Nenhum procedimento informado"
              }</td></tr>
              <tr><th>Radioterapia</th><td>${
                patient.radioterapia
                  ? `${patient.radioterapia.tipo} - ${patient.radioterapia.duracao} meses`
                  : "Não informado"
              }</td></tr>
              <tr><th>Cirurgia</th><td>${
                patient.cirurgia
                  ? `${patient.cirurgia.tipo} - ${patient.cirurgia.duracao} meses`
                  : "Não informado"
              }</td></tr>
              <tr><th>Dissecção Axilar</th><td>${
                patient.disseccaoAxilar
                  ? `${patient.disseccaoAxilar.tipo} - ${patient.disseccaoAxilar.duracao} meses`
                  : "Não informado"
              }</td></tr>
            </table>
          </div>

          <!-- Alterações Cutâneas -->
          <div class="section">
            <div class="section-title">Alterações Cutâneas</div>
            <table>
              <tr><th>Alterações Cutâneas</th><td>${
                patient.alteracoesCutaneas?.join(", ") ||
                "Nenhuma alteração cutânea informada"
              }</td></tr>
            </table>
          </div>

          <!-- Sinais e Sintomas -->
          <div class="section">
            <div class="section-title">Sinais e Sintomas</div>
            <table>
              <tr><th>Queixas Musculoesqueléticas</th><td>${
                patient.queixasMusculoesqueleticas || "Não informado"
              }</td></tr>
              <tr><th>Sintomas de Linfedema</th><td>${
                patient.sintomasLinfedema || "Não informado"
              }</td></tr>
              <tr><th>Sinal do Cacifo</th><td>${
                patient.sinalCacifo || "Não informado"
              }</td></tr>
              <tr><th>Sinal de Casca de Laranja</th><td>${
                patient.sinalCascaLaranja || "Não informado"
              }</td></tr>
              <tr><th>Sinal de Stemmer</th><td>${
                patient.sinalStemmer || "Não informado"
              }</td></tr>
            </table>
          </div>

          <!-- Última avaliação -->
          ${
            lastMeasurement
              ? `
          <div class="section">
            <div class="section-title">Última avaliação</div>
            <p><b>Data da Avaliação:</b> ${
              lastMeasurement.dataAvaliacao || "Não informado"
            }</p>
            <p><b>Distância entre os pontos:</b> ${
              lastMeasurement.pontosRef || "Não informado"
            }</p>
            <p><b>Referência:</b> ${
              lastMeasurement.tipoReferencia || "Não informado"
            }</p>

            <!-- Tabela de Perimetria -->
            <p><b>Perimetria:</b></p>
            <table>
              <tr>
                <th>Ponto</th>
                <th>Braço Esquerdo</th>
                <th>Braço Direito</th>
                <th>Diferença</th>
              </tr>
              <!-- Comprimentos de Referência (P1) -->
              <tr>
                <td>P1 (0cm)</td>
                <td>${lastMeasurement.leftArmComprimento || ""} cm</td>
                <td>${lastMeasurement.rightArmComprimento || ""} cm</td>
                <td>${
                  lastMeasurement.leftArmComprimento &&
                  lastMeasurement.rightArmComprimento
                    ? `${Math.abs(
                        parseFloat(lastMeasurement.leftArmComprimento) -
                          parseFloat(lastMeasurement.rightArmComprimento)
                      ).toFixed(2)} cm`
                    : ""
                }</td>
              </tr>
              ${
                lastMeasurement.leftArmInputs
                  ?.map((leftValue: string, index: number) => {
                    const rightValue = lastMeasurement.rightArmInputs?.[index];
                    if (!leftValue || !rightValue) return ""; // Não renderiza pontos nulos
                    const difference = `${Math.abs(
                      parseFloat(leftValue) - parseFloat(rightValue)
                    ).toFixed(2)} cm`;

                    // Calcula o valor do ponto com base no pontosRef
                    const pontosRef = parseInt(
                      lastMeasurement.pontosRef || "0",
                      10
                    );
                    const pontoAtual = pontosRef * (index + 1);

                    return `
                      <tr>
                        <td>P${index + 2} (${pontoAtual}cm)</td>
                        <td>${leftValue} cm</td>
                        <td>${rightValue} cm</td>
                        <td>${difference}</td>
                      </tr>
                    `;
                  })
                  .join("") ||
                "<tr><td colspan='4'>Nenhuma perimetria informada</td></tr>"
              }
            </table>

            <!-- Tabela de Volumetria -->
            <p><b>Volumetria:</b></p>
            <table>
              <tr>
                <th>Seção</th>
                <th>Volume de Referência (mL)</th>
                <th>Volume Afetado (mL)</th>
              </tr>
              ${
                lastMeasurement.volumesReferencia
                  ?.map((volumeRef: number, index: number) => {
                    const volumeAfetado =
                      lastMeasurement.volumesAfetado?.[index] || 0;
                    return `
                      <tr>
                        <td>Seção ${index + 1}</td>
                        <td>${volumeRef.toFixed(2)}</td>
                        <td>${volumeAfetado.toFixed(2)}</td>
                      </tr>
                    `;
                  })
                  .join("") ||
                "<tr><td colspan='3'>Nenhuma volumetria informada</td></tr>"
              }
              <tr class="highlight">
                <td>Total</td>
                <td>${
                  lastMeasurement.volumesReferencia
                    ?.reduce((acc: number, v: number) => acc + v, 0)
                    .toFixed(2) || "0.00"
                } mL</td>
                <td>${
                  lastMeasurement.volumesAfetado
                    ?.reduce((acc: number, v: number) => acc + v, 0)
                    .toFixed(2) || "0.00"
                } mL</td>
              </tr>
              <tr class="highlight">
                <td>Diferença</td>
                <td colspan="2">${
                  lastMeasurement.volumeDifference?.toFixed(2) || "0.00"
                }%</td>
              </tr>
            </table>

            <!-- Diagnóstico -->
            <p><b>Diagnóstico:</b></p>
            <p class="conclusion">${
              lastMeasurement.volumeDifference != null
                ? getVolumeDifferenceText(lastMeasurement.volumeDifference)
                : "Dados insuficientes para diagnóstico."
            }</p>
          </div>
          `
              : `<p class="text-gray-500">Nenhuma mensuração encontrada.</p>`
          }
        </body>
      </html>
    `;

    // Gerar e compartilhar o PDF
    const { uri } = await Print.printToFileAsync({ html: htmlContent });

    if (uri && (await Sharing.isAvailableAsync())) {
      await Sharing.shareAsync(uri);
    } else {
      alert("Erro ao compartilhar o relatório.");
    }
  } catch (error) {
    console.error("Erro ao gerar ou compartilhar o PDF:", error);
    alert("Erro ao gerar o relatório.");
  }
}
