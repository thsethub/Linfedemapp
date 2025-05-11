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
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { generatePatientReport } from "@/utils/generatePatientReport";
import Header from "@/components/headerId";

const API_URL = "http://15.228.154.120:8083";

export default function PatientProfileScreen() {
  const { id } = useLocalSearchParams();

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
    }
  };

  const getVolumeDifferenceText = (percentage: number) => {
    if (percentage < 5) {
      return "O membro não apresenta alterações volumétricas.";
    } else if (percentage >= 5 && percentage < 10) {
      return `O membro apresenta alterações de volume de ${percentage.toFixed(
        2
      )}%, o que pode sugerir um estágio 0 ou subclínico.`;
    } else if (percentage >= 10 && percentage < 20) {
      return `O membro apresenta alterações de volume de ${percentage.toFixed(
        2
      )}%, sugerindo linfedema estágio I ou leve.`;
    } else if (percentage >= 20 && percentage < 40) {
      return `O membro apresenta alterações de volume de ${percentage.toFixed(
        2
      )}%, sugerindo linfedema estágio II ou moderado.`;
    } else {
      return `O membro apresenta alterações de volume de ${percentage.toFixed(
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

  return (
    <ScrollView className="flex-1 bg-[#f7f7f7]">
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

            // Calcula a diferença entre os comprimentos dos braços
            const comprimentoDiff =
              item.leftArmComprimento && item.rightArmComprimento
                ? Math.abs(
                    parseFloat(item.leftArmComprimento) -
                      parseFloat(item.rightArmComprimento)
                  ).toFixed(2)
                : "Não informado";

            // Texto de caracterização do linfedema
            const linfedemaText =
              item.volumeDifference != null
                ? getVolumeDifferenceText(item.volumeDifference)
                : "Não informado";

            return (
              <View
                key={index}
                className="bg-white rounded-xl px-4 py-3 mb-2 border border-gray-200 "
              >
                {/* Data da Avaliação */}
                <Text className="font-medium text-[#b41976]">
                  📅 Data da Avaliação: {item.dataAvaliacao || "Não informado"}
                </Text>

                {/* Perimetria */}
                <View className="mt-4">
                  <Text className="font-medium text-[#b41976]">Perimetria</Text>
                  <Text className="text-gray-700">
                    Entradas do Braço Esquerdo:{" "}
                    {item.leftArmInputs
                      ? item.leftArmInputs
                          .filter((input: string) => input !== "")
                          .join(", ")
                      : "Não informado"}
                  </Text>
                  <Text className="text-gray-700">
                    Entradas do Braço Direito:{" "}
                    {item.rightArmInputs
                      ? item.rightArmInputs
                          .filter((input: string) => input !== "")
                          .join(", ")
                      : "Não informado"}
                  </Text>
                  <Text className="text-gray-700">
                    Comprimento do Braço Esquerdo:{" "}
                    {item.leftArmComprimento || "Não informado"} cm
                  </Text>
                  <Text className="text-gray-700">
                    Comprimento do Braço Direito:{" "}
                    {item.rightArmComprimento || "Não informado"} cm
                  </Text>
                  <Text className="text-gray-700">
                    Diferenças:{" "}
                    {[`${comprimentoDiff} cm`]
                      .concat(
                        item.differences
                          ? item.differences
                              .filter((diff: number) => diff !== 0)
                              .map((diff: number) => `${diff.toFixed(2)} cm`)
                          : ["Não informado"]
                      )
                      .join(", ")}
                  </Text>
                </View>

                {/* Volumetria */}
                <View className="mt-4">
                  <Text className="font-medium text-[#b41976]">Volumetria</Text>
                  <Text className="text-gray-700">
                    Braço de Referência: {item.referenceArm || "Não informado"}
                  </Text>
                  <Text className="text-gray-700">
                    Braço Afetado: {item.affectedArm || "Não informado"}
                  </Text>
                  <Text className="text-gray-700">
                    Diferença de Volume:{" "}
                    {item.volumeDifference != null
                      ? `${item.volumeDifference.toFixed(2)}%`
                      : "Não informado"}
                  </Text>
                  <Text className="text-gray-700">
                    Pontos de Referência: {item.pontosRef || "Não informado"}
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
