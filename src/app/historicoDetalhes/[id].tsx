import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { generatePatientReport } from "@/utils/generatePatientReport";
import Header from "@/components/headerId";
import { useMeasurementContext } from "../../context/context";
import { useTranslation } from "@/context/LanguageContext";
import {
  translateActivityLevel,
  translateMaritalStatus,
  translateProcedure,
  translateProcedureType,
  translateSkinChangeType,
} from "@/utils/translatePatientData";
import { Feather } from "@expo/vector-icons";

// const API_URL = "https://ac8b5f7d0939.ngrok-free.app";
const API_URL = "http://192.168.0.105:8083";

export default function PatientProfileScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams();

  const { affectedArm, pontosRef } = useMeasurementContext();
  const [patient, setPatient] = useState<any>(null);
  const [measurements, setMeasurements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"chart" | "details">("chart");
  const [expandedMeasurements, setExpandedMeasurements] = useState<number[]>(
    []
  );

  const toggleMeasurement = (index: number) => {
    setExpandedMeasurements((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        if (!id) {
          Alert.alert(
            t("common.error"),
            t("patientDetails.errors.patientIdNotFound")
          );
          return;
        }

        const token = await SecureStore.getItemAsync("access_token");
        if (!token) {
          Alert.alert(t("common.error"), t("results.authTokenNotFound"));
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
        Alert.alert(t("common.error"), t("patientDetails.errors.loadError"));
      } finally {
        setLoading(false);
      }
    };

    fetchPatientDetails();
  }, [id]);

  const handleGeneratePDF = async () => {
    setLoading(true);
    if (!patient || measurements.length === 0) {
      Alert.alert(
        t("common.error"),
        t("patientDetails.errors.insufficientData")
      );
      return;
    }

    try {
      // Obter a última mensuração
      const lastMeasurement = measurements[measurements.length - 1];

      // Chamar a função de geração do PDF com os dados do paciente e a última mensuração
      await generatePatientReport(patient, lastMeasurement);
    } catch (error) {
      // console.error("Erro ao gerar o PDF:", error);
      Alert.alert(t("common.error"), t("patientDetails.errors.pdfError"));
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const getVolumeDifferenceText = (percentage: number, difference: number) => {
    const formattedDifference = Math.abs(difference).toFixed(2);
    const formattedPercentage = percentage.toFixed(2);

    if (percentage < 5) {
      return t("results.volumeAnalysis.noChanges").replace(
        "{difference}",
        formattedDifference
      );
    } else if (percentage >= 5 && percentage < 10) {
      return t("results.volumeAnalysis.stage0")
        .replace("{difference}", formattedDifference)
        .replace("{percentage}", formattedPercentage);
    } else if (percentage >= 10 && percentage < 20) {
      return t("results.volumeAnalysis.stage1")
        .replace("{difference}", formattedDifference)
        .replace("{percentage}", formattedPercentage);
    } else if (percentage >= 20 && percentage < 40) {
      return t("results.volumeAnalysis.stage2")
        .replace("{difference}", formattedDifference)
        .replace("{percentage}", formattedPercentage);
    } else {
      return t("results.volumeAnalysis.stage3")
        .replace("{difference}", formattedDifference)
        .replace("{percentage}", formattedPercentage);
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
        <Text className="text-gray-500">{t("patientDetails.noDataFound")}</Text>
      </View>
    );
  }

  const formatDate = (date: string): string => {
    console.log("Data recebida:", date);
    if (!date) return t("patientDetails.values.notProvided"); // Caso a data seja inválida ou não exista
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
        title={t("patientDetails.title")}
        name={patient.nome}
        dataDiagnostiCancer={patient.dataDiagnostiCancer}
      />
      {/* Ações */}
      <View className="flex-row justify-center mt-4 space-x-4">
        <TouchableOpacity
          onPress={handleGeneratePDF}
          className="border border-[#b41976] px-5 py-2 rounded-xl"
        >
          <Text className="text-[#b41976] font-semibold">
            {t("patientDetails.generatePDF")}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Seções */}
      <Section title={t("patientDetails.sections.personalInfo")}>
        <Field
          label={t("patientDetails.fields.birthDate")}
          value={patient.dataNascimento}
        />
        <Field
          label={t("patientDetails.fields.address")}
          value={patient.endereco}
        />
        <Field
          label={t("patientDetails.fields.phone")}
          value={patient.telefone}
        />
        <Field
          label={t("patientDetails.fields.maritalStatus")}
          value={
            patient.estadoCivil
              ? translateMaritalStatus(patient.estadoCivil, t)
              : t("patientDetails.values.notProvided")
          }
        />
        <Field
          label={t("patientDetails.fields.occupation")}
          value={patient.ocupacao}
        />
        <Field
          label={t("patientDetails.fields.observation")}
          value={`${
            patient.observacaoPaciente || t("patientDetails.values.notProvided")
          }`}
        />
      </Section>

      <Section title={t("patientDetails.sections.physicalData")}>
        <Field
          label={t("patientDetails.fields.bodyWeight")}
          value={`${
            patient.pesoCorporal || t("patientDetails.values.notApplicable")
          } ${t("patientDetails.values.kg")}`}
        />
        <Field
          label={t("patientDetails.fields.height")}
          value={`${
            patient.altura || t("patientDetails.values.notApplicable")
          } ${t("patientDetails.values.cm")}`}
        />
        <Field
          label={t("patientDetails.fields.activityLevel")}
          value={
            patient.nivelAtividadeFisica
              ? translateActivityLevel(patient.nivelAtividadeFisica, t)
              : t("patientDetails.values.notApplicable")
          }
        />
      </Section>

      <Section title={t("patientDetails.sections.procedures")}>
        <Field
          label={t("patientDetails.fields.proceduresPerformed")}
          value={
            patient.procedimentos?.length
              ? patient.procedimentos
                  .map((proc: string) => translateProcedure(proc, t))
                  .join(", ")
              : t("patientDetails.values.noProcedures")
          }
        />

        {/* Renderização dinâmica dos detalhes dos procedimentos */}
        {[
          {
            label: t("patientDetails.fields.radiotherapy"),
            field: "radioterapia",
          },
          {
            label: t("patientDetails.fields.chemotherapy"),
            field: "quimioterapia",
          },
          {
            label: t("patientDetails.fields.hormonotherapy"),
            field: "hormonoterapia",
          },
          { label: t("patientDetails.fields.surgery"), field: "cirurgia" },
          {
            label: t("patientDetails.fields.axillaryDissection"),
            field: "disseccaoAxilar",
          },
        ].map(({ label, field }) =>
          patient[field] ? (
            <Field
              key={field}
              label={label}
              value={
                patient[field].tipo && patient[field].duracao
                  ? `${translateProcedureType(patient[field].tipo, t)} - ${
                      patient[field].duracao
                    } ${t("patientDetails.values.months")}`
                  : t("patientDetails.values.incompleteInfo")
              }
            />
          ) : null
        )}

        {/* Detalhes extras de hormonoterapia, se houver */}
        {patient.detalhesHormonoterapia && (
          <Field
            label={t("patientDetails.fields.hormonotherapyDetails")}
            value={patient.detalhesHormonoterapia}
          />
        )}
      </Section>

      <Section title={t("patientDetails.sections.skinChanges")}>
        {patient.alteracoesCutaneas?.length ? (
          patient.alteracoesCutaneas.map((alteracao: string, index: number) => (
            <Field
              key={index}
              label="•"
              value={translateSkinChangeType(alteracao, t)}
            />
          ))
        ) : (
          <Field label="•" value={t("patientDetails.values.noSkinChanges")} />
        )}
      </Section>

      <Section title={t("patientDetails.sections.signsSymptoms")}>
        <Field
          label={t("patientDetails.fields.musculoskeletalComplaints")}
          value={
            patient.queixasMusculoesqueleticas ||
            t("patientDetails.values.notProvided")
          }
        />
        <Field
          label={t("patientDetails.fields.lymphedemaSymptoms")}
          value={
            patient.sintomasLinfedema || t("patientDetails.values.notProvided")
          }
        />
        <Field
          label={t("patientDetails.fields.pittingSign")}
          value={patient.sinalCacifo || t("patientDetails.values.notProvided")}
        />
        <Field
          label={t("patientDetails.fields.orangePeelSign")}
          value={
            patient.sinalCascaLaranja || t("patientDetails.values.notProvided")
          }
        />
        <Field
          label={t("patientDetails.fields.stemmerSign")}
          value={patient.sinalStemmer || t("patientDetails.values.notProvided")}
        />
      </Section>

      {/* Histórico Evolutivo com Abas */}
      <View className="mt-6 px-4 mb-10">
        <Text className="text-lg font-semibold mb-2 text-[#b41976]">
          {t("patientDetails.sections.evolutionHistory")}
        </Text>

        {/* Abas de Navegação */}
        <View className="flex-row bg-white rounded-t-xl border border-gray-200 overflow-hidden">
          <TouchableOpacity
            onPress={() => setActiveTab("chart")}
            className={`flex-1 py-3 items-center ${
              activeTab === "chart" ? "bg-[#b41976]" : "bg-white"
            }`}
          >
            <Text
              style={{
                color: activeTab === "chart" ? "#ffffff" : "#4b5563",
                fontWeight: activeTab === "chart" ? "bold" : "600",
              }}
            >
              📊 {t("patientDetails.tabs.chart")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("details")}
            className={`flex-1 py-3 items-center ${
              activeTab === "details" ? "bg-[#b41976]" : "bg-white"
            }`}
          >
            <Text
              style={{
                color: activeTab === "details" ? "#ffffff" : "#4b5563",
                fontWeight: activeTab === "details" ? "bold" : "600",
              }}
            >
              📋 {t("patientDetails.tabs.details")}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Conteúdo das Abas */}
        <View className="bg-white rounded-b-xl border-x border-b border-gray-200 p-4">
          {activeTab === "chart" ? (
            /* ABA 1: GRÁFICO */
            <View>
              {measurements.length > 0 ? (
                <View>
                  {/* Gráfico de Linhas */}
                  <View className="h-72 bg-gray-50 rounded-xl p-4 mb-4">
                    <Text className="text-center font-semibold text-gray-700 mb-4">
                      {t("patientDetails.chart.title")}
                    </Text>

                    <View className="flex-1 relative flex-row">
                      {/* Preparar dados para o gráfico */}
                      {(() => {
                        const chartData = measurements.map((item) => {
                          const totalRef = item.volumesReferencia
                            ? item.volumesReferencia.reduce(
                                (acc: number, v: number) => acc + v,
                                0
                              )
                            : 0;
                          const totalAfet = item.volumesAfetado
                            ? item.volumesAfetado.reduce(
                                (acc: number, v: number) => acc + v,
                                0
                              )
                            : 0;

                          // Formatar data de YYYY-MM-DD para DD/MM/YYYY
                          const dateParts = item.dataAvaliacao.split("-");
                          const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;

                          return {
                            date: formattedDate,
                            reference: totalRef,
                            affected: totalAfet,
                          };
                        });

                        const maxVolume = Math.max(
                          ...chartData.map((d) =>
                            Math.max(d.reference, d.affected)
                          ),
                          1
                        );
                        const minVolume = Math.min(
                          ...chartData.map((d) =>
                            Math.min(d.reference, d.affected)
                          ),
                          0
                        );

                        const chartHeight = 160;
                        const chartWidth = Dimensions.get("window").width - 140; // Espaço para eixo Y
                        const pointSpacing =
                          chartWidth / Math.max(chartData.length - 1, 1);

                        // Calcular valores para eixo Y (5 marcações)
                        const yAxisValues = [];
                        const step = (maxVolume - minVolume) / 4;
                        for (let i = 0; i <= 4; i++) {
                          yAxisValues.push(Math.round(minVolume + step * i));
                        }

                        return (
                          <>
                            {/* Eixo Y - Volumes */}
                            <View
                              className="justify-between mr-2"
                              style={{ height: chartHeight + 20 }}
                            >
                              {yAxisValues.reverse().map((value, index) => (
                                <Text
                                  key={`y-${index}`}
                                  className="text-xs text-gray-600"
                                >
                                  {value} mL
                                </Text>
                              ))}
                            </View>

                            {/* Área do gráfico e eixo X */}
                            <View className="flex-1">
                              {/* Área do gráfico */}
                              <View
                                className="relative"
                                style={{ height: chartHeight }}
                              >
                                {/* Linhas de grade horizontais */}
                                {yAxisValues.map((value, index) => (
                                  <View
                                    key={`grid-${index}`}
                                    className="absolute left-0 right-0 border-t border-gray-300"
                                    style={{
                                      top: (index * chartHeight) / 4,
                                    }}
                                  />
                                ))}

                                {/* Linha de referência (azul) */}
                                <View
                                  className="absolute bottom-0 left-0 right-0"
                                  style={{ height: chartHeight }}
                                >
                                  {chartData.map((point, index) => {
                                    const y =
                                      chartHeight -
                                      ((point.reference - minVolume) /
                                        (maxVolume - minVolume)) *
                                        chartHeight;
                                    const x = index * pointSpacing;
                                    const nextPoint = chartData[index + 1];

                                    return (
                                      <View key={`ref-${index}`}>
                                        {/* Ponto */}
                                        <View
                                          className="absolute bg-blue-500 rounded-full"
                                          style={{
                                            width: 8,
                                            height: 8,
                                            left: x - 4,
                                            top: y - 4,
                                          }}
                                        />
                                        {/* Linha conectando ao próximo ponto */}
                                        {nextPoint && (
                                          <View
                                            className="absolute bg-blue-500"
                                            style={{
                                              height: 2,
                                              width: Math.sqrt(
                                                Math.pow(pointSpacing, 2) +
                                                  Math.pow(
                                                    chartHeight -
                                                      ((nextPoint.reference -
                                                        minVolume) /
                                                        (maxVolume -
                                                          minVolume)) *
                                                        chartHeight -
                                                      y,
                                                    2
                                                  )
                                              ),
                                              left: x,
                                              top: y,
                                              transform: [
                                                {
                                                  rotate: `${Math.atan2(
                                                    chartHeight -
                                                      ((nextPoint.reference -
                                                        minVolume) /
                                                        (maxVolume -
                                                          minVolume)) *
                                                        chartHeight -
                                                      y,
                                                    pointSpacing
                                                  )}rad`,
                                                },
                                              ],
                                              transformOrigin: "left center",
                                            }}
                                          />
                                        )}
                                      </View>
                                    );
                                  })}
                                </View>

                                {/* Linha afetada (rosa) */}
                                <View
                                  className="absolute bottom-0 left-0 right-0"
                                  style={{ height: chartHeight }}
                                >
                                  {chartData.map((point, index) => {
                                    const y =
                                      chartHeight -
                                      ((point.affected - minVolume) /
                                        (maxVolume - minVolume)) *
                                        chartHeight;
                                    const x = index * pointSpacing;
                                    const nextPoint = chartData[index + 1];

                                    return (
                                      <View key={`afet-${index}`}>
                                        {/* Ponto */}
                                        <View
                                          className="absolute bg-[#b41976] rounded-full"
                                          style={{
                                            width: 8,
                                            height: 8,
                                            left: x - 4,
                                            top: y - 4,
                                          }}
                                        />
                                        {/* Linha conectando ao próximo ponto */}
                                        {nextPoint && (
                                          <View
                                            className="absolute bg-[#b41976]"
                                            style={{
                                              height: 2,
                                              width: Math.sqrt(
                                                Math.pow(pointSpacing, 2) +
                                                  Math.pow(
                                                    chartHeight -
                                                      ((nextPoint.affected -
                                                        minVolume) /
                                                        (maxVolume -
                                                          minVolume)) *
                                                        chartHeight -
                                                      y,
                                                    2
                                                  )
                                              ),
                                              left: x,
                                              top: y,
                                              transform: [
                                                {
                                                  rotate: `${Math.atan2(
                                                    chartHeight -
                                                      ((nextPoint.affected -
                                                        minVolume) /
                                                        (maxVolume -
                                                          minVolume)) *
                                                        chartHeight -
                                                      y,
                                                    pointSpacing
                                                  )}rad`,
                                                },
                                              ],
                                              transformOrigin: "left center",
                                            }}
                                          />
                                        )}
                                      </View>
                                    );
                                  })}
                                </View>
                              </View>

                              {/* Eixo X - Datas */}
                              <View
                                className="flex-row justify-between mt-3"
                                style={{ paddingHorizontal: 4 }}
                              >
                                {chartData.map((point, index) => (
                                  <View
                                    key={`date-${index}`}
                                    style={{ width: 70, alignItems: "center" }}
                                  >
                                    <Text
                                      className="text-xs text-gray-600"
                                      numberOfLines={1}
                                      adjustsFontSizeToFit
                                    >
                                      {point.date}
                                    </Text>
                                  </View>
                                ))}
                              </View>
                            </View>
                          </>
                        );
                      })()}
                    </View>
                  </View>

                  {/* Legenda */}
                  <View className="flex-row justify-center items-center gap-6">
                    <View className="flex-row items-center">
                      <View className="w-4 h-4 bg-blue-500 rounded mr-2" />
                      <Text className="text-gray-700">
                        {t("patientDetails.chart.referenceLimb")}
                      </Text>
                    </View>
                    <View className="flex-row items-center ml-4">
                      <View className="w-4 h-4 bg-[#b41976] rounded mr-2" />
                      <Text className="text-gray-700">
                        {t("patientDetails.chart.affectedLimb")}
                      </Text>
                    </View>
                  </View>
                </View>
              ) : (
                <Text className="text-gray-500 text-center">
                  {t("patientDetails.values.noMeasurements")}
                </Text>
              )}
            </View>
          ) : (
            /* ABA 2: DETALHES */
            <View>
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
                            return (
                              diff.toFixed(2) +
                              " " +
                              t("patientDetails.values.cm")
                            );
                          }
                          return t("patientDetails.values.notApplicable");
                        })
                      : [];

                  const linfedemaText =
                    item.volumeDifference != null
                      ? getVolumeDifferenceText(
                          item.volumeDifference,
                          volumeDifference
                        )
                      : t("patientDetails.values.notProvided");

                  const isExpanded = expandedMeasurements.includes(index);

                  return (
                    <View
                      key={index}
                      className="bg-gray-50 rounded-xl mb-3 border border-gray-200 overflow-hidden"
                    >
                      {/* Header do Dropdown */}
                      <TouchableOpacity
                        onPress={() => toggleMeasurement(index)}
                        className="flex-row justify-between items-center p-4 bg-white"
                      >
                        <View className="flex-1">
                          <Text className="font-semibold text-[#b41976]">
                            📅 {formatDate(item.dataAvaliacao)}
                          </Text>
                          <Text className="text-sm text-gray-600 mt-1">
                            Vol. Diferença: {item.volumeDifference?.toFixed(2)}%
                          </Text>
                        </View>
                        <Feather
                          name={isExpanded ? "chevron-up" : "chevron-down"}
                          size={24}
                          color="#b41976"
                        />
                      </TouchableOpacity>

                      {/* Conteúdo Expandido */}
                      {isExpanded && (
                        <View className="p-4 bg-white border-t border-gray-200">
                          {/* Processo de Medição */}
                          <View className="mb-4">
                            <Text className="font-semibold text-[#b41976] mb-2">
                              {t("patientDetails.fields.measurementProcess")}
                            </Text>
                            <Text className="text-gray-700">
                              {t("patientDetails.fields.distanceBetweenPoints")}
                              :{" "}
                              {item.pontosRef ||
                                t("patientDetails.values.notProvided")}
                            </Text>
                            <Text className="text-gray-700">
                              {t("patientDetails.fields.referenceArm")}:{" "}
                              {item.referenceArm ||
                                t("patientDetails.values.notProvided")}
                            </Text>
                            <Text className="text-gray-700">
                              {t("patientDetails.fields.affectedArm")}:{" "}
                              {item.affectedArm ||
                                t("patientDetails.values.notProvided")}
                            </Text>
                            <Text className="text-gray-700">
                              {t("patientDetails.fields.reference")}:{" "}
                              {item.tipoReferencia ||
                                t("patientDetails.values.notProvided")}
                            </Text>
                          </View>

                          {/* Perimetria */}
                          <View className="mb-4">
                            <Text className="font-semibold text-[#b41976] mb-2">
                              {t("patientDetails.fields.perimetry")}
                            </Text>
                            <Text className="text-gray-700 text-sm">
                              {t("patientDetails.fields.leftArmPoints")}:{" "}
                              {item.leftArmInputs
                                ? [
                                    `P1: ${
                                      item.leftArmComprimento ||
                                      t("patientDetails.values.notProvided")
                                    } ${t("patientDetails.values.cm")}`,
                                    ...item.leftArmInputs
                                      .filter((input: string) => input !== "")
                                      .map(
                                        (input: string, index: number) =>
                                          `P${index + 2}: ${input} ${t(
                                            "patientDetails.values.cm"
                                          )}`
                                      ),
                                  ].join(", ")
                                : t("patientDetails.values.notProvided")}
                            </Text>
                            <Text className="text-gray-700 text-sm">
                              {t("patientDetails.fields.rightArmPoints")}:{" "}
                              {item.rightArmInputs
                                ? [
                                    `P1: ${
                                      item.rightArmComprimento ||
                                      t("patientDetails.values.notProvided")
                                    } ${t("patientDetails.values.cm")}`,
                                    ...item.rightArmInputs
                                      .filter((input: string) => input !== "")
                                      .map(
                                        (input: string, index: number) =>
                                          `P${index + 2}: ${input} ${t(
                                            "patientDetails.values.cm"
                                          )}`
                                      ),
                                  ].join(", ")
                                : t("patientDetails.values.notProvided")}
                            </Text>
                            <Text className="text-gray-700 text-sm">
                              {t("patientDetails.fields.differences")}:{" "}
                              {differences && differences.length > 0
                                ? [
                                    `P1: ${
                                      affectedArm === "left"
                                        ? (
                                            parseFloat(
                                              item.leftArmComprimento || "0"
                                            ) -
                                            parseFloat(
                                              item.rightArmComprimento || "0"
                                            )
                                          ).toFixed(2)
                                        : (
                                            parseFloat(
                                              item.rightArmComprimento || "0"
                                            ) -
                                            parseFloat(
                                              item.leftArmComprimento || "0"
                                            )
                                          ).toFixed(2)
                                    }`,
                                    ...differences
                                      .filter(
                                        (difference: string) =>
                                          difference !==
                                            t(
                                              "patientDetails.values.notApplicable"
                                            ) && difference !== ""
                                      )
                                      .map(
                                        (difference: string, index: number) =>
                                          `P${index + 2}: ${difference}`
                                      ),
                                  ].join(", ")
                                : t("patientDetails.values.notProvided")}
                            </Text>
                          </View>

                          {/* Volumetria */}
                          <View className="mb-4">
                            <Text className="font-semibold text-[#b41976] mb-2">
                              {t("patientDetails.fields.volumetry")}
                            </Text>
                            <Text className="text-gray-700">
                              {t("patientDetails.fields.volumeDifference")}:{" "}
                              {item.volumeDifference != null
                                ? `${item.volumeDifference.toFixed(2)}%`
                                : t("patientDetails.values.notProvided")}
                            </Text>
                            <Text className="text-gray-700 font-semibold">
                              {t("patientDetails.fields.totalReferenceVolume")}:{" "}
                              {totalVolumesReferencia.toFixed(2)}{" "}
                              {t("patientDetails.values.ml")}
                            </Text>
                            <Text className="text-gray-700 font-semibold">
                              {t("patientDetails.fields.totalAffectedVolume")}:{" "}
                              {totalVolumesAfetado.toFixed(2)}{" "}
                              {t("patientDetails.values.ml")}
                            </Text>
                            <Text className="text-gray-700 font-semibold mt-2 text-sm">
                              📝 {linfedemaText}
                            </Text>
                          </View>

                          {/* Observações */}
                          <View>
                            <Text className="font-semibold text-[#b41976] mb-2">
                              {t("patientDetails.fields.observations")}:
                            </Text>
                            <Text className="text-gray-700">
                              {item.observacaoMedicao ||
                                t("patientDetails.values.noObservations")}
                            </Text>
                          </View>
                        </View>
                      )}
                    </View>
                  );
                })
              ) : (
                <Text className="text-gray-500 text-center">
                  {t("patientDetails.values.noMeasurements")}
                </Text>
              )}
            </View>
          )}
        </View>
      </View>
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
