import { appAlert } from "@/components/AppAlert";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useMeasurementContext } from "@/context/context";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import axios from "axios";
import * as SecureStore from "../utils/secureStorage";
import Header from "@/components/headerResultado";
import { Button, Card, FaqButton, Field, Label, PRIMARY, SectionTitle, SegmentedChoice } from "@/components/fichaUi";
import { useLanguage, useTranslation } from "@/context/LanguageContext";
import { API_URL } from "@/config/api";

export default function Resultado() {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const {
    differences,
    pontosRef,
    selectedValue,
    leftArmInputs,
    rightArmInputs,
    leftArmComprimento,
    rightArmComprimento,
    affectedArm,
    setAffectedArm,
    referenceArm,
    // setReferenceArm,
    patientData,
    setPatientData,
    setDifferences,
    setLeftArmInputs,
    setRightArmInputs,
    setLeftArmComprimento,
    setRightArmComprimento,
    setPontosRef,
    setSelectedValue,
    clearAllData,
    currentPatient,
    setCurrentPatient,
  } = useMeasurementContext();
  const router = useRouter();
  const [modalVisible, setModalVisible] = React.useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingAssociation, setLoadingAssociation] = useState(false);
  // Avaliação clínica do fisioterapeuta (opcional)
  const [clinicalStage, setClinicalStage] = useState("");
  const [clinicalNotes, setClinicalNotes] = useState("");
  const [saveError, setSaveError] = useState("");

  interface Patient {
    id: string;
    fullName: string;
    birthDate?: string;
  }

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const handleFinalize = () => {
    appAlert(
      t("results.finalizeMeasurement"),
      t("results.associateToPatient"),
      [
        {
          text: t("common.no"),
          onPress: () => {
            // Limpa os dados de medição e navega para a tela inicial
            clearMeasurementData();
            router.push("/home");
          },
          style: "cancel",
        },
        {
          text: t("common.yes"),
          onPress: () => {
            // Exibe o modal para selecionar um paciente
            fetchPatients();
            setModalVisible(true);
          },
        },
      ]
    );
  };

  const getReferenceName = () => {
    switch (selectedValue) {
      case "opcao1":
        return t("arms.references.styloidProcess");
      case "opcao2":
        return t("arms.references.articularLine");
      case "opcao3":
        return t("arms.references.acromion");
      default:
        return "";
    }
  };

  const clearMeasurementData = () => {
    // Limpa os dados de medição no contexto
    clearAllData();
    setDifferences([]);
    setLeftArmInputs([]);
    setRightArmInputs([]);
    setLeftArmComprimento("0");
    setRightArmComprimento("0");
    setPontosRef("5cm");
    setSelectedValue("opcao1");
    setAffectedArm("right");
    setCurrentPatient(null);
  };

  const fetchPatients = async () => {
    try {
      setLoadingPatients(true);
      const token = await SecureStore.getItemAsync("access_token");
      if (!token) {
        appAlert(t("common.error"), t("common.authTokenNotFound"));
        return;
      }

      const userResponse = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userId = userResponse.data.id;

      const patientsResponse = await axios.get(
        `${API_URL}/api/pacientes/usuario/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPatients(patientsResponse.data);
    } catch (error) {
      // console.error("Erro ao buscar pacientes:", error);
      appAlert(t("common.error"), t("results.errorLoadingPatients"));
    } finally {
      setLoadingPatients(false);
    }
  };

  // Envia a medição (volumetria, perimetria e avaliação clínica) para a paciente indicada.
  const saveMeasurementTo = async (patientId: string, patientName?: string) => {
    if (loadingAssociation) return;
    setLoadingAssociation(true);
    setSaveError("");
    try {
      const token = await SecureStore.getItemAsync("access_token");
      if (!token) {
        appAlert(t("common.error"), t("common.authTokenNotFound"));
        return;
      }

      const convertArmValue = (value: string) => {
        if (value === "left") return t("arms.left");
        if (value === "right") return t("arms.right");
        return value;
      };

      const measurementData = {
        volumetry: {
          referenceArm: convertArmValue(referenceArm),
          affectedArm: convertArmValue(affectedArm),
          volumesReferencia,
          volumesAfetado,
          volumeDifference: volumeDifferencePercentage,
        },
        perimetry: {
          pontosRef,
          leftArmInputs,
          rightArmInputs,
          leftArmComprimento,
          rightArmComprimento,
          differences,
        },
        tipoReferencia: getReferenceName(),
        observacaoMedicao: patientData.note || "",
        estagioClinico: clinicalStage || null,
        observacaoClinica: clinicalNotes.trim() || null,
      };

      await axios.post(
        `${API_URL}/api/pacientes/${patientId}/mensuracao`,
        measurementData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setModalVisible(false);
      clearMeasurementData();
      appAlert(
        t("common.success"),
        patientName
          ? `${t("results.savedTo")} ${patientName}.`
          : t("results.measurementAssociated"),
        [{ text: "OK", onPress: () => router.push("/home") }]
      );
    } catch (error) {
      setSaveError(t("results.errorAssociatingMeasurement"));
    } finally {
      setLoadingAssociation(false);
    }
  };

  // Escolhida na lista (medição avulsa)
  const handleAssociateMeasurement = async () => {
    if (!selectedPatient) {
      appAlert(t("common.error"), t("results.selectPatientError"));
      return;
    }
    await saveMeasurementTo(selectedPatient.id, selectedPatient.fullName);
  };

  // "Salvar na ficha": com paciente já ligada ao cálculo salva direto; senão pergunta se associa
  const handleSave = () => {
    if (currentPatient) {
      saveMeasurementTo(currentPatient.id, currentPatient.name);
    } else {
      handleFinalize();
    }
  };

  const filteredPatients = patients.filter((patient) =>
    patient.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Verifica se a ficha de exame foi preenchida
  const hasPatientData = !!(
    patientData.fullName ||
    patientData.address ||
    patientData.phone ||
    patientData.birthDate
  );

  const getClassNames = (difference: number) => {
    if (difference < 0) {
      return "";
    } else if (difference <= 2) {
      return "bg-green-50 text-green-500 font-semibold";
    } else if (difference <= 3) {
      return "bg-yellow-50 text-yellow-500 font-semibold";
    } else if (difference <= 5) {
      return "bg-orange-50 text-orange-500 font-semibold";
    } else {
      return "bg-red-50 text-red-500 font-semibold";
    }
  };

  const getVolumeDifferenceText = (percentage: number, difference: number) => {
    const localeNum = (n: number) =>
      n.toLocaleString(currentLanguage, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    const formattedDifference = localeNum(Math.abs(difference));
    const formattedPercentage = localeNum(percentage);

    // Função auxiliar para renderizar texto com partes em negrito
    const renderTextWithBold = (text: string, boldParts: string[]) => {
      let result = text;
      let components: (string | React.ReactElement)[] = [result];

      boldParts.forEach((boldPart, index) => {
        const newComponents: (string | React.ReactElement)[] = [];
        components.forEach((component) => {
          if (typeof component === "string") {
            const parts = component.split(boldPart);
            parts.forEach((part, i) => {
              if (i > 0) {
                newComponents.push(
                  <Text
                    key={`bold-${index}-${i}`}
                    style={{ fontWeight: "bold" }}
                  >
                    {boldPart}
                  </Text>
                );
              }
              if (part) newComponents.push(part);
            });
          } else {
            newComponents.push(component);
          }
        });
        components = newComponents;
      });

      return <Text>{components}</Text>;
    };

    if (percentage < 5) {
      const text = t("results.volumeAnalysis.noChanges").replace(
        "{difference}",
        `${formattedDifference}`
      );
      return renderTextWithBold(text, [`${formattedDifference} cm³`]);
    } else if (percentage >= 5 && percentage < 10) {
      const text = t("results.volumeAnalysis.stage0")
        .replace("{difference}", `${formattedDifference}`)
        .replace("{percentage}", `${formattedPercentage}`);
      const stage = text.includes("estágio") ? "estágio 0" : "estadio 0";
      return renderTextWithBold(text, [
        `${formattedDifference} cm³`,
        `${formattedPercentage}%`,
        stage,
      ]);
    } else if (percentage >= 10 && percentage < 20) {
      const text = t("results.volumeAnalysis.stage1")
        .replace("{difference}", `${formattedDifference}`)
        .replace("{percentage}", `${formattedPercentage}`);
      const stage = text.includes("estágio") ? "estágio I" : "estadio I";
      return renderTextWithBold(text, [
        `${formattedDifference} cm³`,
        `${formattedPercentage}%`,
        stage,
      ]);
    } else if (percentage >= 20 && percentage < 40) {
      const text = t("results.volumeAnalysis.stage2")
        .replace("{difference}", `${formattedDifference}`)
        .replace("{percentage}", `${formattedPercentage}`);
      const stage = text.includes("estágio") ? "estágio II" : "estadio II";
      return renderTextWithBold(text, [
        `${formattedDifference} cm³`,
        `${formattedPercentage}%`,
        stage,
      ]);
    } else {
      const text = t("results.volumeAnalysis.stage3")
        .replace("{difference}", `${formattedDifference}`)
        .replace("{percentage}", `${formattedPercentage}`);
      const stage = text.includes("estágio") ? "estágio III" : "estadio III";
      return renderTextWithBold(text, [
        `${formattedDifference} cm³`,
        `${formattedPercentage}%`,
        stage,
      ]);
    }
  };

  const getVolumeDifferenceClasses = (percentage: number) => {
    if (percentage < 5) {
      return { bgClass: "bg-green-50", textClass: "text-green-500" };
    } else if (percentage >= 5 && percentage < 10) {
      return { bgClass: "bg-lime-50", textClass: "text-lime-500" };
    } else if (percentage >= 10 && percentage < 20) {
      return { bgClass: "bg-yellow-50", textClass: "text-yellow-500" };
    } else if (percentage >= 20 && percentage < 40) {
      return { bgClass: "bg-orange-50", textClass: "text-orange-500" };
    } else {
      return { bgClass: "bg-red-50", textClass: "text-red-500" };
    }
  };

  const getVolumeDifferenceText2 = (percentage: number) => {
    return t("results.alert");
  };

  const formatDifference = (difference: number) => {
    return difference >= 0 ? `+${difference}` : `${difference}`;
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

  const volumesReferencia = calculateVolume(
    referenceArm === "right" ? rightArmComprimento : leftArmComprimento,
    referenceArm === "right" ? rightArmInputs : leftArmInputs
  );
  const affectedInputs =
    affectedArm === "right" ? rightArmInputs : leftArmInputs;

  const volumesAfetado = calculateVolume(
    affectedArm === "right" ? rightArmComprimento : leftArmComprimento,
    affectedInputs
  );

  const volumeReferenciaTotal = Array.isArray(volumesReferencia)
    ? volumesReferencia.reduce((acc, volume) => acc + volume, 0)
    : 0;
  const volumeAfetadoTotal = Array.isArray(volumesAfetado)
    ? volumesAfetado.reduce((acc, volume) => acc + volume, 0)
    : 0;

  // console.log("Volumes de Referência:", volumesReferencia);
  // console.log("Volumes do Membro Afetado:", volumesAfetado);
  // Calculate the volume difference percentage
  const volumeDifferencePercentage =
    ((volumeAfetadoTotal - volumeReferenciaTotal) / volumeReferenciaTotal) *
    100;

  const volumeDifference = volumeAfetadoTotal - volumeReferenciaTotal;

  // console.log("Diferença de Volume em %:", volumeDifferencePercentage);

  useEffect(() => {
    const currentVolumesReferencia = patientData.volumesReferencia || [];
    const currentVolumesAfetado = patientData.volumesAfetado || [];

    // Verifica se os volumes mudaram antes de atualizar o contexto
    const hasVolumesChanged =
      JSON.stringify(currentVolumesReferencia) !==
        JSON.stringify(volumesReferencia) ||
      JSON.stringify(currentVolumesAfetado) !== JSON.stringify(volumesAfetado);

    if (hasVolumesChanged) {
      setPatientData({
        ...patientData,
        volumesReferencia: Array.isArray(volumesReferencia)
          ? volumesReferencia
          : undefined,
        volumesAfetado: Array.isArray(volumesAfetado)
          ? volumesAfetado
          : undefined,
      });
    }
  }, [volumesReferencia, volumesAfetado]);

  const volumeDifferenceText = getVolumeDifferenceText(
    volumeDifferencePercentage,
    volumeDifference
  );
  const volumeDifferenceText2 = getVolumeDifferenceText2(
    volumeDifferencePercentage
  );
  const { bgClass, textClass } = getVolumeDifferenceClasses(
    volumeDifferencePercentage
  );

  // ---------- cores por faixa ----------
  type Tone = { bg: string; fg: string };
  const NEUTRAL: Tone = { bg: "#eeeef2", fg: "#6b6b75" };
  const GREEN: Tone = { bg: "#e4f5ec", fg: "#1f8a4c" };
  const YELLOW: Tone = { bg: "#fdf0cc", fg: "#9a6b00" };
  const ORANGE: Tone = { bg: "#ffe6d2", fg: "#b4520a" };
  const RED: Tone = { bg: "#fde2e2", fg: "#b3261e" };

  // Diferença de perímetro por ponto (Panobianco; Mamede, 2002)
  const perimetryTone = (diff?: number): Tone => {
    if (diff === undefined || Number.isNaN(diff) || diff < 0) return NEUTRAL;
    if (diff <= 2) return GREEN;
    if (diff <= 3) return YELLOW;
    if (diff <= 5) return ORANGE;
    return RED;
  };

  // Diferença percentual de volume (ISL 2023)
  const volumeTone = (pct: number): Tone => {
    if (!Number.isFinite(pct) || pct < 5) return GREEN;
    if (pct < 10) return { bg: "#eef6d8", fg: "#5f8a0e" };
    if (pct < 20) return YELLOW;
    if (pct < 40) return ORANGE;
    return RED;
  };

  const fmt = (n: number, digits = 2) =>
    Number.isFinite(n)
      ? n.toLocaleString(currentLanguage, {
          minimumFractionDigits: digits,
          maximumFractionDigits: digits,
        })
      : "—";

  // Quantidade de pontos medidos (mesma regra de antes)
  const numPoints = (() => {
    const table: Record<string, Record<string, number>> = {
      opcao1: { "5cm": 9, "7cm": 7, "10cm": 4 },
      opcao2: { "5cm": 8, "7cm": 6, "10cm": 4 },
      opcao3: { "5cm": 9, "7cm": 7, "10cm": 4 },
    };
    return (table[selectedValue ?? ""]?.[pontosRef] ?? 0) + 1;
  })();

  const armName = (arm: "right" | "left") =>
    arm === "right" ? t("arms.rightArm") : t("arms.leftArm");

  const volTone = volumeTone(volumeDifferencePercentage);
  const stageOptions = [
    { value: "subclinical", label: t("ficha.subclinical") },
    { value: "I", label: "I" },
    { value: "II", label: "II" },
    { value: "III", label: "III" },
  ];

  const levels: { key: string; range: string; tone: Tone }[] = [
    { key: "noChanges", range: "1–2cm", tone: GREEN },
    { key: "mild", range: "2–3cm", tone: YELLOW },
    { key: "moderate", range: "3–5cm", tone: ORANGE },
    { key: "severe", range: ">5cm", tone: RED },
  ];

  const VolumeRow = ({
    label,
    sub,
    value,
  }: {
    label: string;
    sub?: string;
    value: string;
  }) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
      }}
    >
      <View style={{ flexShrink: 1, marginRight: 8 }}>
        <Text style={{ fontSize: 15.5, fontWeight: "500", color: "#111" }}>{label}</Text>
        {!!sub && <Text style={{ fontSize: 14, color: "#666" }}>{sub}</Text>}
      </View>
      <View
        style={{
          backgroundColor: "#f4e4ef",
          borderRadius: 10,
          paddingHorizontal: 12,
          paddingVertical: 8,
        }}
      >
        <Text style={{ fontSize: 14, fontWeight: "700", color: PRIMARY }}>{value}</Text>
      </View>
    </View>
  );

  if (loadingAssociation) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#b41976" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white-600">
      <StatusBar style="dark" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
      >
        <ScrollView
          contentContainerStyle={{ padding: 20, alignItems: "center" }}
          keyboardShouldPersistTaps="handled"
        >
          <Header title={t("results.diagnosis")} />

          {/* Resultados da perimetria */}
          <Card>
            <SectionTitle icon="list" title={t("results.results")} />
            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
              {Array.from({ length: numPoints }, (_, i) => {
                const diff = differences[i];
                const tone = perimetryTone(diff);
                return (
                  <View key={i} style={{ alignItems: "center", margin: 3, width: 60 }}>
                    <Text style={{ fontSize: 13, fontWeight: "700" }}>{`P${i}`}</Text>
                    <Text style={{ fontSize: 11.5, color: "#555", marginBottom: 4 }}>
                      {`(${i * parseInt(pontosRef)}cm)`}
                    </Text>
                    <View
                      style={{
                        backgroundColor: tone.bg,
                        borderRadius: 8,
                        paddingVertical: 6,
                        width: "100%",
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ fontSize: 12, fontWeight: "700", color: tone.fg }}>
                        {diff !== undefined && !Number.isNaN(diff)
                          ? `${formatDifference(parseFloat(diff.toFixed(2)))} cm`
                          : "N/A"}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>

            <Text style={{ color: PRIMARY, fontSize: 14, marginTop: 18, marginBottom: 8 }}>
              {t("results.perimetryExplanation")}
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", marginHorizontal: -4 }}>
              {levels.map((l) => (
                <View key={l.key} style={{ width: "50%", padding: 4 }}>
                  <View
                    style={{
                      backgroundColor: l.tone.bg,
                      borderRadius: 10,
                      paddingHorizontal: 10,
                      paddingVertical: 9,
                      minHeight: 44,
                      justifyContent: "center",
                    }}
                  >
                    <Text style={{ fontSize: 12.5, fontWeight: "600", color: l.tone.fg }}>
                      {`${t(`results.levels.${l.key}`)} (${l.range})`}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
            <Text style={{ color: PRIMARY, fontSize: 12.5, fontWeight: "700", marginTop: 12 }}>
              {`${t("results.referenceLabel")}: ${t("results.references.panobianco")}`}
            </Text>
          </Card>

          {/* Volumetria */}
          <Card>
            <SectionTitle icon="box" title={t("results.volumetry")} />
            <VolumeRow
              label={`${t("results.volume")} ${armName(affectedArm)}`}
              sub={`(${t("results.affected")})`}
              value={`${fmt(volumeAfetadoTotal)} cm³`}
            />
            <VolumeRow
              label={`${t("results.volume")} ${armName(referenceArm)}`}
              value={`${fmt(volumeReferenciaTotal)} cm³`}
            />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <Text style={{ fontSize: 15.5, fontWeight: "500", flexShrink: 1, marginRight: 8 }}>
                {t("results.volumeDifference")}
              </Text>
              <View
                style={{
                  backgroundColor: volTone.bg,
                  borderRadius: 10,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                }}
              >
                <Text style={{ fontSize: 13.5, fontWeight: "700", color: volTone.fg }}>
                  {`${fmt(Math.abs(volumeDifference))} cm³ · ${fmt(volumeDifferencePercentage, 1)}%`}
                </Text>
              </View>
            </View>
            <View
              style={{
                backgroundColor: volTone.bg,
                borderRadius: 12,
                padding: 14,
                marginBottom: 10,
              }}
            >
              <Text style={{ fontSize: 13.5, lineHeight: 19, color: volTone.fg }}>
                {volumeDifferenceText}
              </Text>
            </View>
            <Text style={{ color: PRIMARY, fontSize: 12.5, fontWeight: "700" }}>
              {t("results.references.lymphologyConsensus")}
            </Text>
          </Card>

          {/* Avaliação clínica (definida pelo fisioterapeuta) */}
          <Card>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 14,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", flexShrink: 1 }}>
                <Feather name="clipboard" size={20} color="#111" style={{ marginRight: 10 }} />
                <Text style={{ fontSize: 17, fontWeight: "600", flexShrink: 1 }}>
                  {t("results.clinicalAssessment")}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: "#f4e4ef",
                  borderRadius: 999,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  marginLeft: 8,
                }}
              >
                <Text style={{ fontSize: 11.5, fontWeight: "700", color: PRIMARY }}>
                  {t("results.physiotherapist")}
                </Text>
              </View>
            </View>

            <Text style={{ fontSize: 15, color: "#111", marginBottom: 12 }}>
              {t("results.clinicalPrompt")}
            </Text>
            <SegmentedChoice
              value={clinicalStage}
              onChange={(v) => setClinicalStage(clinicalStage === v ? "" : v)}
              options={stageOptions}
            />
            <Text style={{ fontSize: 12, color: "#777", marginBottom: 14 }}>
              {t("results.islNote")}
            </Text>
            <Label>{t("results.clinicalNotes")}</Label>
            <Field
              multiline
              minHeight={110}
              placeholder={t("results.clinicalNotesPlaceholder")}
              value={clinicalNotes}
              onChangeText={setClinicalNotes}
              style={{ marginBottom: 0 }}
            />
          </Card>

          {/* Complementares */}
          <Card>
            <SectionTitle icon="folder-plus" title={t("results.complementary")} />
            <Label>{t("results.note")}</Label>
            <Field
              multiline
              minHeight={96}
              placeholder={t("results.noteExamPlaceholder")}
              value={patientData.note || ""}
              onChangeText={(text) => setPatientData({ ...patientData, note: text })}
              style={{ marginBottom: 0 }}
            />
          </Card>

          {!!saveError && (
            <Text style={{ color: "#c0262d", marginTop: 14, textAlign: "center" }}>{saveError}</Text>
          )}

          {/* Rodapé */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              maxWidth: 360,
              marginTop: 24,
            }}
          >
            <Button
              label={t("results.saveToRecord")}
              onPress={handleSave}
              style={{ flex: 1, minWidth: 0, marginRight: 10 }}
            />
            <FaqButton onPress={() => router.navigate("/faq")} />
          </View>

          {/* Modal para Seleção de Paciente */}
          <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setModalVisible(false)}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "#fff",
                  width: "90%",
                  borderRadius: 10,
                  padding: 20,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "#b41976",
                    marginBottom: 10,
                  }}
                >
                  {t("results.selectPatient")}
                </Text>

                {/* Barra de Pesquisa */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: "#ccc",
                    borderRadius: 10,
                    paddingHorizontal: 10,
                    marginBottom: 10,
                  }}
                >
                  <TextInput
                    placeholder={t("results.searchPatient")}
                    placeholderTextColor="#aaa"
                    style={{ flex: 1, fontSize: 16 }}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                </View>

                {/* Lista de Pacientes */}
                {loadingPatients ? (
                  <ActivityIndicator size="large" color="#b41976" />
                ) : (
                  <FlatList
                    data={filteredPatients}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => setSelectedPatient(item)}
                        style={{
                          padding: 10,
                          backgroundColor:
                            selectedPatient?.id === item.id
                              ? "#ffe0f0"
                              : "#f7f7f7",
                          borderRadius: 5,
                          marginBottom: 5,
                        }}
                      >
                        <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                          {item.fullName}
                        </Text>
                        <Text style={{ fontSize: 14, color: "#777" }}>
                          {t("results.birthDate")}:{" "}
                          {item.birthDate || t("common.notProvided")}
                        </Text>
                      </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                      <Text style={{ textAlign: "center", color: "#777" }}>
                        {t("results.noPatientFound")}
                      </Text>
                    }
                  />
                )}

                {/* Botões Confirmar e Fechar */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 10,
                  }}
                >
                  {/* Botão Fechar */}
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={{
                      backgroundColor: "#ccc",
                      width: "48%",
                      height: 50,
                      borderRadius: 10,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "#333",
                        fontSize: 16,
                        fontWeight: "bold",
                      }}
                    >
                      {t("common.close")}
                    </Text>
                  </TouchableOpacity>

                  {/* Botão Confirmar */}
                  <TouchableOpacity
                    onPress={() => {
                      if (!selectedPatient) {
                        appAlert(
                          t("common.validation"),
                          t("results.associatePatientBeforeConfirm")
                        );
                      } else {
                        handleAssociateMeasurement();
                      }
                    }}
                    style={{
                      backgroundColor: "#b41976",
                      width: "48%",
                      height: 50,
                      borderRadius: 10,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: 16,
                        fontWeight: "bold",
                      }}
                    >
                      {t("common.confirm")}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
