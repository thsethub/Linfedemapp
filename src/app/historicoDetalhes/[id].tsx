import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { generatePatientReport } from "@/utils/generatePatientReport";
import Header from "@/components/headerId";
import { useMeasurementContext } from "../../context/context";

const API_URL = "http://150.161.61.1:8083";
// const API_URL = "http://192.168.15.108:8081";

export default function PatientProfileScreen() {
  const { id } = useLocalSearchParams();

  const { affectedArm, pontosRef } = useMeasurementContext();
  const [patient, setPatient] = useState<any>(null);
  const [measurements, setMeasurements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        if (!id) {
          Alert.alert("Erro", "ID do paciente não encontrado.");
          return;
        }

        const token = await SecureStore.getItemAsync("access_token");
        if (!token) {
          Alert.alert("Erro", "Token de autenticação não encontrado.");
          return;
        }

        const userResponse = await axios.get(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userId = userResponse.data.id;

        const patientResponse = await axios.get(
          `${API_URL}/api/pacientes/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setPatient(patientResponse.data);
        console.log("Dados do paciente:", patientResponse.data);

        const measurementsResponse = await axios.get(
          `${API_URL}/api/pacientes/usuario/${userId}/${id}/mensuracoes`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setMeasurements(measurementsResponse.data);
      } catch (error) {
        // console.error("Erro ao buscar os dados do paciente:", error);
        Alert.alert("Erro", "Não foi possível carregar os dados do paciente.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatientDetails();
  }, [id]);

  const handleGeneratePDF = async () => {
    setLoading(true);
    if (!patient || measurements.length === 0) {
      Alert.alert("Erro", "Não há dados suficientes para gerar o relatório.");
      return;
    }

    try {
      // Obter a última mensuração
      const lastMeasurement = measurements[measurements.length - 1];

      // Chamar a função de geração do PDF com os dados do paciente e a última mensuração
      await generatePatientReport(patient, lastMeasurement);
    } catch (error) {
      // console.error("Erro ao gerar o PDF:", error);
      Alert.alert("Erro", "Não foi possível gerar o relatório.");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const getVolumeDifferenceText = (percentage: number, difference: number) => {
    if (percentage < 5) {
      return `O membro apresenta uma diferença de volume de ${Math.abs(
        difference
      ).toFixed(2)} mL, mas não apresenta alterações volumétricas.`;
    } else if (percentage >= 5 && percentage < 10) {
      return `O membro apresenta uma diferença de volume de ${Math.abs(
        difference
      ).toFixed(2)} mL e alterações de volume de ${percentage.toFixed(
        2
      )}%, o que pode sugerir um estágio 0 ou subclínico.`;
    } else if (percentage >= 10 && percentage < 20) {
      return `O membro apresenta uma diferença de volume de ${Math.abs(
        difference
      ).toFixed(2)} mL e alterações de volume de ${percentage.toFixed(
        2
      )}%, sugerindo linfedema estágio I ou leve.`;
    } else if (percentage >= 20 && percentage < 40) {
      return `O membro apresenta uma diferença de volume de ${Math.abs(
        difference
      ).toFixed(2)} mL e alterações de volume de ${percentage.toFixed(
        2
      )}%, sugerindo linfedema estágio II ou moderado.`;
    } else {
      return `O membro apresenta uma diferença de volume de ${Math.abs(
        difference
      ).toFixed(2)} mL e alterações de volume de ${percentage.toFixed(
        2
      )}%, sugerindo linfedema estágio III ou avançado.`;
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#b41976" />
      </View>
    );
  }

  if (!patient) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-gray-500">
          Nenhum dado encontrado para este paciente.
        </Text>
      </View>
    );
  }

  const formatDate = (date: string): string => {
    console.log("Data recebida:", date);
    if (!date) return "Não informado"; // Caso a data seja inválida ou não exista
    const [year, month, day] = date.split("-");
    return `${day}-${month}-${year}`;
  };

  const calculateVolume = (comprimentoRef: string, inputs: string[]) => {
    const h = parseFloat(pontosRef); // distância entre os pontos
    if (isNaN(h)) {
      // console.error("Invalid pontosRef value:", pontosRef);
      return NaN;
    }

    const CA = parseFloat(comprimentoRef);
    if (isNaN(CA)) {
      // console.error("Invalid comprimentoRef value:", comprimentoRef);
      return NaN;
    }

    const validInputs = inputs.filter(
      (input) => input !== "" && input !== null
    );
    const volumes = validInputs.map((input, index) => {
      const Ci = parseFloat(input);
      if (isNaN(Ci)) {
        // console.error(`Invalid input value at index ${index}:`, input);
        return NaN;
      }
      const previousCA = index === 0 ? CA : parseFloat(validInputs[index - 1]);
      return (
        (h * (previousCA ** 2 + previousCA * Ci + Ci ** 2)) / (12 * Math.PI)
      );
    });

    if (volumes.some((volume) => isNaN(volume))) {
      // console.error("One or more volumes are NaN");
      return NaN;
    }

    return volumes;
  };

  return (
    <ScrollView className="flex-1 bg-[#f7f7f7]">
      <StatusBar style="dark" translucent />
      {/* Cabeçalho */}
      <Header
        title="Histórico Clínico"
        name={patient.nome}
        dataDiagnostiCancer={patient.dataDiagnostiCancer}
      />
      {/* Ações */}
      <View className="flex-row justify-center mt-4 space-x-4">
        <TouchableOpacity
          onPress={handleGeneratePDF}
          className="border border-[#b41976] px-5 py-2 rounded-xl"
        >
          <Text className="text-[#b41976] font-semibold">Gerar PDF</Text>
        </TouchableOpacity>
      </View>

      {/* Seções */}
      <Section title="Informações Pessoais">
        <Field label="Data de Nascimento" value={patient.dataNascimento} />
        <Field label="Endereço" value={patient.endereco} />
        <Field label="Telefone" value={patient.telefone} />
        <Field label="Estado Civil" value={patient.estadoCivil} />
        <Field label="Ocupação" value={patient.ocupacao} />
        <Field label="Observação" value={`${patient.observacaoPaciente || "Não informado"}`}/>
      </Section>

      <Section title="Dados Físicos">
        <Field
          label="Peso Corporal"
          value={`${patient.pesoCorporal || "N/A"} kg`}
        />
        <Field label="Altura" value={`${patient.altura || "N/A"} cm`} />
        <Field
          label="Nível de Atividade Física"
          value={patient.nivelAtividadeFisica || "N/A"}
        />
      </Section>

      <Section title="Procedimentos">
        <Field
          label="Procedimentos Realizados"
          value={
            patient.procedimentos?.length
              ? patient.procedimentos.join(", ")
              : "Nenhum procedimento informado"
          }
        />

        {/* Renderização dinâmica dos detalhes dos procedimentos */}
        {[
          { label: "Radioterapia", field: "radioterapia" },
          { label: "Quimioterapia", field: "quimioterapia" },
          { label: "Hormonoterapia", field: "hormonoterapia" },
          { label: "Cirurgia", field: "cirurgia" },
          { label: "Dissecção Axilar", field: "disseccaoAxilar" },
        ].map(({ label, field }) =>
          patient[field] ? (
            <Field
              key={field}
              label={label}
              value={
                patient[field].tipo && patient[field].duracao
                  ? `${patient[field].tipo} - ${patient[field].duracao} meses`
                  : "Informação incompleta"
              }
            />
          ) : null
        )}

        {/* Detalhes extras de hormonoterapia, se houver */}
        {patient.detalhesHormonoterapia && (
          <Field
            label="Detalhes Hormonoterapia"
            value={patient.detalhesHormonoterapia}
          />
        )}
      </Section>

      <Section title="Alterações Cutâneas">
        {patient.alteracoesCutaneas?.length ? (
          patient.alteracoesCutaneas.map((alteracao: string, index: number) => (
            <Field key={index} label="•" value={alteracao} />
          ))
        ) : (
          <Field label="•" value="Nenhuma alteração cutânea informada" />
        )}
      </Section>

      <Section title="Sinais e Sintomas">
        <Field
          label="Queixas Musculoesqueléticas"
          value={patient.queixasMusculoesqueleticas || "Não informado"}
        />
        <Field
          label="Sintomas de Linfedema"
          value={patient.sintomasLinfedema || "Não informado"}
        />
        <Field
          label="Sinal do Cacifo"
          value={patient.sinalCacifo || "Não informado"}
        />
        <Field
          label="Sinal de Casca de Laranja"
          value={patient.sinalCascaLaranja || "Não informado"}
        />
        <Field
          label="Sinal de Stemmer"
          value={patient.sinalStemmer || "Não informado"}
        />
      </Section>

      <Section title="Histórico Evolutivo" bottom>
        {measurements.length > 0 ? (
          measurements.map((item, index) => {
            // Calcula os volumes totais
            const totalVolumesReferencia = item.volumesReferencia
              ? item.volumesReferencia.reduce(
                  (acc: number, v: number) => acc + v,
                  0
                )
              : 0;
            const totalVolumesAfetado = item.volumesAfetado
              ? item.volumesAfetado.reduce(
                  (acc: number, v: number) => acc + v,
                  0
                )
              : 0;

            const volumeDifference =
              totalVolumesAfetado - totalVolumesReferencia;
              
            // Calcula a diferença entre os comprimentos dos braços
            const comprimentoDiff =
              item.leftArmComprimento && item.rightArmComprimento
                ? Math.abs(
                    parseFloat(item.leftArmComprimento) -
                      parseFloat(item.rightArmComprimento)
                  ).toFixed(2)
                : "Não informado";

            // Calcula as diferenças entre os pontos dos braços esquerdo e direito
            const differences =
              item.leftArmInputs && item.rightArmInputs
                ? item.leftArmInputs.map((left: string, i: number) => {
                    const right = item.rightArmInputs[i];
                    if (
                      left !== undefined &&
                      right !== undefined &&
                      left !== "" &&
                      right !== ""
                    ) {
                      const diff = parseFloat(left) - parseFloat(right);
                      return diff.toFixed(2) + " cm";
                    }
                    return "N/A";
                  })
                : [];

            // Texto de caracterização do linfedema
            const linfedemaText =
              item.volumeDifference != null
                ? getVolumeDifferenceText(
                    item.volumeDifference,
                    volumeDifference
                  )
                : "Não informado";

            return (
              <View
                key={index}
                className="bg-white rounded-xl px-4 py-3 mb-2 border border-gray-200 "
              >
                {/* Data da Avaliação */}
                <Text className="font-medium text-[#b41976]">
                  📅 Data da Avaliação:{" "}
                  {formatDate(item.dataAvaliacao) || "Não informado"}
                </Text>

                {/* Processo de Medição */}
                <View className="mt-4">
                  <Text className="font-medium text-[#b41976]">
                    Processo de Medição
                  </Text>
                  <Text className="text-gray-700">
                    Distância entre os pontos:{" "}
                    {item.pontosRef || "Não informado"}
                  </Text>
                  <Text className="text-gray-700">
                    Braço de Referência: {item.referenceArm || "Não informado"}
                  </Text>
                  <Text className="text-gray-700">
                    Braço Afetado: {item.affectedArm || "Não informado"}
                  </Text>
                  <Text className="text-gray-700">
                    Referência: {item.tipoReferencia || "Não informado"}
                  </Text>
                </View>
                <View className="mt-4">
                  <Text className="font-medium text-[#b41976]">Perimetria</Text>
                  <Text className="text-gray-700">
                    Pontos do Braço Esquerdo:{" "}
                    {item.leftArmInputs
                      ? [
                          `P1: ${
                            item.leftArmComprimento || "Não informado"
                          } cm`,
                          ...item.leftArmInputs
                            .filter((input: string) => input !== "") // Define o tipo de 'input' como string
                            .map(
                              (input: string, index: number) =>
                                `P${index + 2}: ${input} cm`
                            ),
                        ].join(", ")
                      : "Não informado"}
                  </Text>
                  <Text className="text-gray-700">
                    Pontos do Braço Direito:{" "}
                    {item.rightArmInputs
                      ? [
                          `P1: ${
                            item.rightArmComprimento || "Não informado"
                          } cm`,
                          ...item.rightArmInputs
                            .filter((input: string) => input !== "") // Define o tipo de 'input' como string
                            .map(
                              (input: string, index: number) =>
                                `P${index + 2}: ${input} cm`
                            ),
                        ].join(", ")
                      : "Não informado"}
                  </Text>
                  <Text className="text-gray-700">
                    Diferenças:{" "}
                    {differences && differences.length > 0
                      ? [
                          // P1: diferença entre entrada de referência do braço afetado e de referência
                          `P1: ${
                            affectedArm === "left"
                              ? (
                                  parseFloat(item.leftArmComprimento || "0") -
                                  parseFloat(item.rightArmComprimento || "0")
                                ).toFixed(2)
                              : (
                                  parseFloat(item.rightArmComprimento || "0") -
                                  parseFloat(item.leftArmComprimento || "0")
                                ).toFixed(2)
                          }`,
                          // P2, P3, etc.: diferenças subsequentes, filtrando valores "N/A" ou inexistentes
                          ...differences
                            .filter(
                              (difference: string) =>
                                difference !== "N/A" && difference !== ""
                            )
                            .map(
                              (difference: string, index: number) =>
                                `P${index + 2}: ${difference}`
                            ),
                        ].join(", ")
                      : "Não informado"}
                  </Text>
                </View>

                {/* Volumetria */}
                <View className="mt-4">
                  <Text className="font-medium text-[#b41976]">Volumetria</Text>
                  <Text className="text-gray-700">
                    Diferença de Volume:{" "}
                    {item.volumeDifference != null
                      ? `${item.volumeDifference.toFixed(2)}%`
                      : "Não informado"}
                  </Text>
                  <Text className="text-gray-700">
                    Volumes de Referência:{" "}
                    {item.volumesReferencia
                      ? item.volumesReferencia
                          .map((v: number) =>
                            v != null ? v.toFixed(2) : "N/A"
                          )
                          .join(", ")
                      : "Não informado"}
                  </Text>
                  <Text className="text-gray-700">
                    Volumes Afetados:{" "}
                    {item.volumesAfetado
                      ? item.volumesAfetado
                          .map((v: number) =>
                            v != null ? v.toFixed(2) : "N/A"
                          )
                          .join(", ")
                      : "Não informado"}
                  </Text>
                  <Text className="text-gray-700 font-semibold">
                    Volume Total de Referência:{" "}
                    {totalVolumesReferencia.toFixed(2)} mL
                  </Text>
                  <Text className="text-gray-700 font-semibold">
                    Volume Total Afetado: {totalVolumesAfetado.toFixed(2)} mL
                  </Text>
                  <Text className="text-gray-700 font-semibold mt-2">
                    📝 {linfedemaText}
                  </Text>
                </View>
                {/* Observações */}
                <View className="mt-4">
                  <Text className="font-medium text-[#b41976]">
                    Observações:
                  </Text>
                  <Text className="text-gray-700">
                    {item.observacaoMedicao || "Nenhuma observação informada."}
                  </Text>
                </View>
              </View>
            );
          })
        ) : (
          <Text className="text-gray-500">Nenhuma medição encontrada.</Text>
        )}
      </Section>
    </ScrollView>
  );
}
// Componente reutilizável de seção
const Section = ({
  title,
  children,
  bottom = false,
}: {
  title: string;
  children: React.ReactNode;
  bottom?: boolean;
}) => (
  <View className={`mt-6 px-4 ${bottom ? "mb-10" : ""}`}>
    <Text className="text-lg font-semibold mb-2 text-[#b41976]">{title}</Text>
    <View className="bg-white-600 w-full rounded-xl px-4 py-3 shadow-sm border border-gray-200">
      {children}
    </View>
  </View>
);

// Componente reutilizável de campo
const Field = ({ label, value }: { label: string; value: string }) => (
  <Text>
    <Text className="font-semibold">{label}:</Text> {value}
  </Text>
);
