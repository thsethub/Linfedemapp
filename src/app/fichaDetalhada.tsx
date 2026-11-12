import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";

import Dropdown from "@/components/dropdown";
import {
  Button,
  Card,
  ChipGroup,
  Field,
  FaqButton,
  Label,
  PRIMARY,
  SectionTitle,
  SegmentedChoice,
  Stepper,
  toggleIn,
  YesNoRow,
} from "@/components/fichaUi";
import { useMeasurementContext } from "@/context/context";
import { useTranslation } from "@/context/LanguageContext";
import {
  ageFromBirthDate,
  computeBmi,
  DetailedForm,
  emptyDetailed,
  isEssentialComplete,
  JOINTS,
  ROM_MOVEMENTS,
  Side,
  STRENGTH_GROUPS,
} from "@/utils/fichaDetalhada";
import { AuthTokenMissingError, savePatient } from "@/utils/savePatient";
import { useAppWindow } from "@/utils/layout";

const TOTAL_STEPS = 5;

const PROCEDURES = [
  "chemotherapy",
  "radiotherapy",
  "surgery",
  "axillaryDissection",
  "sentinelBiopsy",
  "hormoneTherapy",
  "targetTherapy",
  "immunotherapy",
];

// Procedimentos que têm detalhe (tipo + tempo) na etapa 2
const PROCEDURES_WITH_DETAILS: Record<string, string[]> = {
  chemotherapy: ["neoadjuvant", "adjuvant", "neoAdjuvant"],
  radiotherapy: ["neoadjuvant", "adjuvant", "neoAdjuvant"],
  surgery: ["simpleMastectomy", "modifiedMastectomy", "radicalMastectomy", "quadrantectomy"],
  axillaryDissection: ["total", "selective", "dontKnow"],
};

const SKIN_CHANGES = [
  "edema",
  "skinRetraction",
  "nippleDesquamation",
  "nippleInversion",
  "hyperemia",
  "radiodermatitis",
  "nippleUlceration",
  "infection",
  "others",
];

const SENSORY = ["paresthesia", "hypoesthesia", "hyperesthesia"];
const IMPACTS = ["sleep", "adl", "selfCare", "professional", "none"];
const COMPRESSION = ["bandaging", "glove", "sleeve", "none", "other"];
const ISL_STAGES = ["subclinical", "I", "II", "III"];

export default function FichaDetalhada() {
  const { t } = useTranslation();
  const { width } = useAppWindow();
  const { patientData, setPatientData, clearAllData, setAffectedArm } =
    useMeasurementContext();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const f = (key: string) => t(`ficha.${key}`);
  const innerWidth = Math.min(width, 360) - 40; // largura útil dentro do cartão

  const side: Side | null = patientData.side ?? null;
  const age = ageFromBirthDate(patientData.birthDate);
  const d: DetailedForm = { ...emptyDetailed(), ...(patientData.detailed ?? {}) };

  const setTop = (patch: Record<string, any>) =>
    setPatientData({ ...patientData, ...patch });
  const setD = (patch: Partial<DetailedForm>) =>
    setPatientData({ ...patientData, detailed: { ...d, ...patch } });

  const yes = t("patient.common.yes");
  const no = t("patient.common.no");

  // ---------- navegação ----------
  const goBack = () => {
    if (step > 1) setStep(step - 1);
    else router.back();
  };

  const finish = async (destination: "home" | "calculator") => {
    if (saving) return;
    if (!isEssentialComplete({ ...patientData, side })) {
      setError(f("fillRequired"));
      return;
    }
    setSaving(true);
    setError("");
    try {
      await savePatient(patientData);
      clearAllData();
      if (destination === "calculator") {
        setAffectedArm(side as Side);
        router.push("/calculadora");
      } else {
        router.push("/home");
      }
    } catch (e) {
      setError(
        e instanceof AuthTokenMissingError
          ? t("common.authTokenNotFound")
          : t("patient.saveError")
      );
    } finally {
      setSaving(false);
    }
  };

  // ---------- etapa 1: dados da paciente ----------
  const bmi = computeBmi(patientData.weight ?? "", patientData.height ?? "");

  const renderStep1 = () => (
    <Card>
      <SectionTitle icon="user" title={t("patient.patientData")} />

      <Dropdown
        title={t("patient.maritalStatus")}
        width={innerWidth}
        items={[
          { label: t("patient.maritalStatuses.single"), value: "single" },
          { label: t("patient.maritalStatuses.married"), value: "married" },
          { label: t("patient.maritalStatuses.widowed"), value: "widowed" },
          { label: t("patient.maritalStatuses.divorced"), value: "divorced" },
        ]}
        selectedValue={patientData.maritalStatus || null}
        setSelectedValue={(v) => setTop({ maritalStatus: v ?? "" })}
      />

      <Label>{t("patient.occupation")}</Label>
      <Field
        placeholder={t("patient.occupationPlaceholder")}
        value={patientData.occupation}
        onChangeText={(v) => setTop({ occupation: v })}
      />

      <View style={{ flexDirection: "row" }}>
        <View style={{ flex: 1, marginRight: 12 }}>
          <Label>{`${t("patient.weight")} (kg)`}</Label>
          <Field
            keyboardType="numeric"
            placeholder={t("patient.weightPlaceholder")}
            value={patientData.weight}
            onChangeText={(v) => setTop({ weight: v })}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Label>{`${t("patient.height")} (cm)`}</Label>
          <Field
            keyboardType="numeric"
            placeholder={t("patient.heightPlaceholder")}
            value={patientData.height}
            onChangeText={(v) => setTop({ height: v })}
          />
        </View>
      </View>

      {bmi && (
        <View
          style={{
            backgroundColor: "#fbe8f2",
            borderRadius: 12,
            padding: 14,
            marginBottom: 14,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexShrink: 1, marginRight: 8 }}>
            <Text style={{ fontSize: 12.5, color: "#555" }}>{f("bmiAuto")}</Text>
            <Text style={{ fontSize: 15, fontWeight: "700", color: PRIMARY }}>
              {f(`bmi.${bmi.cls}`)}
            </Text>
          </View>
          <Text style={{ fontSize: 28, fontWeight: "800", color: PRIMARY }}>
            {bmi.value.toFixed(1).replace(".", ",")}
          </Text>
        </View>
      )}

      <Label>{f("comorbidities")}</Label>
      <Field
        multiline
        placeholder={f("comorbiditiesPlaceholder")}
        value={d.comorbidities}
        onChangeText={(v) => setD({ comorbidities: v })}
      />
      <Text style={{ fontSize: 12.5, color: "#777" }}>{f("oncologyLater")}</Text>
    </Card>
  );

  // ---------- etapa 2: tratamento ----------
  const procedures: string[] = patientData.procedures ?? [];

  const renderStep2 = () => (
    <>
      <Card>
        <SectionTitle icon="check-square" title={t("patient.proceduresPerformed")} />
        <ChipGroup
          options={PROCEDURES.map((p) => ({
            value: p,
            label: t(`ficha.procedures.${p}`),
          }))}
          selected={procedures}
          onToggle={(v) => setTop({ procedures: toggleIn(procedures, v) })}
        />
        <Text style={{ fontSize: 12.5, color: "#666" }}>{f("detailsAppear")}</Text>
      </Card>

      <Card>
        <SectionTitle icon="list" title={t("patient.details")} />
        {procedures.filter((p) => PROCEDURES_WITH_DETAILS[p]).length === 0 && (
          <Text style={{ color: "#666", marginBottom: 10 }}>{f("noDetails")}</Text>
        )}
        {PROCEDURES.filter(
          (p) => procedures.includes(p) && PROCEDURES_WITH_DETAILS[p]
        ).map((p) => {
          const value = patientData[p] ?? { type: "", duration: "" };
          return (
            <View key={p} style={{ marginBottom: 6 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 15, fontWeight: "700" }}>
                  {t(`ficha.procedures.${p}`)}
                </Text>
                <Text style={{ fontSize: 12, color: "#666" }}>{f("howLong")}</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "flex-start", marginTop: 6 }}>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Dropdown
                    width={Math.max(innerWidth - 120, 120)}
                    items={PROCEDURES_WITH_DETAILS[p].map((k) => ({
                      label: t(`patient.procedureTypes.${k}`),
                      value: k,
                    }))}
                    selectedValue={value.type || null}
                    setSelectedValue={(v) =>
                      setTop({ [p]: { ...value, type: v ?? "" } })
                    }
                  />
                </View>
                <Field
                  keyboardType="numeric"
                  placeholder="0"
                  value={value.duration}
                  onChangeText={(v) =>
                    setTop({ [p]: { ...value, duration: v.replace(/\D/g, "") } })
                  }
                  style={{ width: 56, textAlign: "center", marginHorizontal: 8, marginBottom: 0, marginTop: 20 }}
                />
                <Text style={{ marginTop: 32, fontSize: 14 }}>{f("months")}</Text>
              </View>
            </View>
          );
        })}

        <Label>{t("patient.observation")}</Label>
        <Field
          multiline
          placeholder={f("treatmentObsPlaceholder")}
          value={d.procedureObservation}
          onChangeText={(v) => setD({ procedureObservation: v })}
        />
      </Card>
    </>
  );

  // ---------- etapa 3: sinais e sintomas ----------
  const skinChanges: string[] = patientData.skinChanges ?? [];

  const renderStep3 = () => (
    <>
      <Card>
        <SectionTitle icon="droplet" title={f("lymphedema")} />
        <Text style={{ fontSize: 12.5, color: "#666", marginBottom: 12 }}>
          {f("optionalSigns")}
        </Text>
        <YesNoRow
          label={t("patient.questions.lymphedemaSymptoms")}
          value={patientData.lymphedemaSymptoms}
          onChange={(v) => setTop({ lymphedemaSymptoms: v })}
          yes={yes}
          no={no}
        />
        <YesNoRow
          label={t("patient.questions.cacifoSign")}
          value={patientData.cacifoSign}
          onChange={(v) => setTop({ cacifoSign: v })}
          yes={yes}
          no={no}
        />
        <YesNoRow
          label={t("patient.questions.orangePeelSign")}
          value={patientData.orangePeelSign}
          onChange={(v) => setTop({ orangePeelSign: v })}
          yes={yes}
          no={no}
        />
        <YesNoRow
          label={t("patient.questions.stemmerSign")}
          value={patientData.stemmerSign}
          onChange={(v) => setTop({ stemmerSign: v })}
          yes={yes}
          no={no}
        />
      </Card>

      <Card>
        <SectionTitle icon="zap" title={f("pain")} />
        <Label hint={f("painScale")}>{f("painIntensity")}</Label>
        <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 8 }}>
          {Array.from({ length: 11 }, (_, i) => String(i)).map((n) => {
            const selected = d.painScore === n;
            return (
              <TouchableOpacity
                key={n}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => setD({ painScore: selected ? "" : n })}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  marginRight: 8,
                  marginBottom: 8,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: selected ? PRIMARY : "#fff",
                  borderWidth: 1,
                  borderColor: selected ? PRIMARY : "#d0d0d6",
                }}
              >
                <Text style={{ color: selected ? "#fff" : "#444", fontWeight: "600" }}>{n}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <Label>{f("painNotes")}</Label>
        <Field
          placeholder={f("openOptional")}
          value={d.painNotes}
          onChangeText={(v) => setD({ painNotes: v })}
        />
      </Card>

      <Card>
        <SectionTitle icon="plus-square" title={f("skinChanges")} />
        <Label>{f("hadSkinChanges")}</Label>
        <ChipGroup
          options={SKIN_CHANGES.map((k) => ({
            value: k,
            label: t(`patient.skinChangeTypes.${k}`),
          }))}
          selected={skinChanges}
          onToggle={(v) => setTop({ skinChanges: toggleIn(skinChanges, v) })}
        />
        <Label>{f("skinOther")}</Label>
        <Field
          multiline
          placeholder={f("skinOtherPlaceholder")}
          value={d.skinOther}
          onChangeText={(v) => setD({ skinOther: v })}
        />
      </Card>

      <Card>
        <SectionTitle icon="activity" title={f("sensory")} />
        <Label>{f("arm")}</Label>
        <ChipGroup
          options={SENSORY.map((k) => ({ value: k, label: f(`sensoryTypes.${k}`) }))}
          selected={d.sensoryArm}
          onToggle={(v) => setD({ sensoryArm: toggleIn(d.sensoryArm, v) })}
        />
        <Label>{f("chest")}</Label>
        <ChipGroup
          options={SENSORY.map((k) => ({ value: k, label: f(`sensoryTypes.${k}`) }))}
          selected={d.sensoryChest}
          onToggle={(v) => setD({ sensoryChest: toggleIn(d.sensoryChest, v) })}
        />
        <Label>{f("sensoryNotes")}</Label>
        <Field
          multiline
          placeholder={f("sensoryNotesPlaceholder")}
          value={d.sensoryNotes}
          onChangeText={(v) => setD({ sensoryNotes: v })}
        />
      </Card>
    </>
  );

  // ---------- etapa 4: função e impacto ----------
  const renderJointBlock = (
    kind: "rom" | "strength",
    restricted: Record<string, "Sim" | "Não" | "">,
    selected: Record<string, string[]>,
    options: Record<string, string[]>
  ) =>
    JOINTS.map((j, idx) => {
      const answer = restricted[j] ?? "";
      const patchKey = kind === "rom" ? "romRestricted" : "strengthDeficit";
      const listKey = kind === "rom" ? "romMovements" : "strengthGroups";
      return (
        <View
          key={j}
          style={{
            paddingTop: idx === 0 ? 0 : 12,
            marginTop: idx === 0 ? 0 : 4,
            borderTopWidth: idx === 0 ? 0 : 1,
            borderTopColor: "#ececf0",
          }}
        >
          <YesNoRow
            bold
            label={f(`joints.${j}`)}
            value={answer}
            onChange={(v) => setD({ [patchKey]: { ...restricted, [j]: v } } as any)}
            yes={yes}
            no={no}
          />
          {answer === "Sim" && (
            <>
              <Text style={{ fontSize: 12.5, color: "#666", marginBottom: 8 }}>
                {f(kind === "rom" ? "markMovements" : "markGroups")}
              </Text>
              <ChipGroup
                options={options[j].map((k) => ({
                  value: k,
                  label: f(`${kind === "rom" ? "movements" : "groups"}.${k}`),
                }))}
                selected={selected[j] ?? []}
                onToggle={(v) =>
                  setD({
                    [listKey]: { ...selected, [j]: toggleIn(selected[j] ?? [], v) },
                  } as any)
                }
              />
            </>
          )}
        </View>
      );
    });

  const renderStep4 = () => (
    <>
      <Card>
        <SectionTitle icon="arrow-right-circle" title={f("rom")} />
        <Text style={{ fontSize: 12.5, color: "#666", marginBottom: 12 }}>{f("romHint")}</Text>
        {renderJointBlock("rom", d.romRestricted, d.romMovements, ROM_MOVEMENTS)}
        <Label>{f("goniometry")}</Label>
        <Field
          multiline
          placeholder={f("goniometryPlaceholder")}
          value={d.goniometry}
          onChangeText={(v) => setD({ goniometry: v })}
        />
      </Card>

      <Card>
        <SectionTitle icon="trending-up" title={f("strength")} />
        <Text style={{ fontSize: 12.5, color: "#666", marginBottom: 12 }}>{f("strengthHint")}</Text>
        {renderJointBlock("strength", d.strengthDeficit, d.strengthGroups, STRENGTH_GROUPS)}
        <Label>{f("strengthTest")}</Label>
        <Field
          multiline
          placeholder={f("strengthTestPlaceholder")}
          value={d.strengthTest}
          onChangeText={(v) => setD({ strengthTest: v })}
        />
      </Card>

      <Card>
        <SectionTitle icon="heart" title={f("impact")} />
        <Label>{f("impactQuestion")}</Label>
        <ChipGroup
          options={IMPACTS.map((k) => ({ value: k, label: f(`impacts.${k}`) }))}
          selected={d.impact}
          onToggle={(v) =>
            // "Nenhum" é exclusivo
            setD({
              impact:
                v === "none"
                  ? d.impact.includes("none") ? [] : ["none"]
                  : toggleIn(d.impact.filter((x) => x !== "none"), v),
            })
          }
        />
        <Label>{f("impactNotes")}</Label>
        <Field
          multiline
          placeholder={f("impactNotesPlaceholder")}
          value={d.impactNotes}
          onChangeText={(v) => setD({ impactNotes: v })}
        />
      </Card>

      <Card>
        <SectionTitle icon="folder-plus" title={t("patient.complementary")} />
        <YesNoRow
          label={t("patient.questions.musculoskeletalComplaints")}
          value={d.musculoskeletalChanges}
          onChange={(v) => setD({ musculoskeletalChanges: v })}
          yes={yes}
          no={no}
        />
        <Label>{f("otherClinical")}</Label>
        <Field
          multiline
          placeholder={f("otherClinicalPlaceholder")}
          value={d.otherClinical}
          onChangeText={(v) => setD({ otherClinical: v })}
        />
      </Card>
    </>
  );

  // ---------- etapa 5: contexto clínico e conduta ----------
  const renderStep5 = () => (
    <>
      <Card>
        <SectionTitle icon="clipboard" title={f("clinicalContext")} />
        <Label hint={f("islHint")}>{f("islStage")}</Label>
        <SegmentedChoice
          value={d.islStage}
          onChange={(v) => setD({ islStage: d.islStage === v ? "" : v })}
          options={ISL_STAGES.map((k) => ({ value: k, label: k === "subclinical" ? f("subclinical") : k }))}
        />
        <Label>{f("physioDiagnosis")}</Label>
        <Field
          multiline
          minHeight={110}
          placeholder={f("openField")}
          value={d.physioDiagnosis}
          onChangeText={(v) => setD({ physioDiagnosis: v })}
        />
      </Card>

      <Card>
        <SectionTitle icon="list" title={f("lymphedemaTreatment")} />
        <Label>{f("previousTreatments")}</Label>
        <Field
          multiline
          minHeight={110}
          placeholder={f("openField")}
          value={d.previousTreatments}
          onChangeText={(v) => setD({ previousTreatments: v })}
        />
        <Label>{f("currentConduct")}</Label>
        <Field
          multiline
          minHeight={110}
          placeholder={f("openField")}
          value={d.currentConduct}
          onChangeText={(v) => setD({ currentConduct: v })}
        />
        <Label>{f("compression")}</Label>
        <ChipGroup
          options={COMPRESSION.map((k) => ({ value: k, label: f(`compressionTypes.${k}`) }))}
          selected={d.compression}
          onToggle={(v) =>
            setD({
              compression:
                v === "none"
                  ? d.compression.includes("none") ? [] : ["none"]
                  : toggleIn(d.compression.filter((x) => x !== "none"), v),
            })
          }
        />
        {d.compression.includes("other") && (
          <>
            <Label>{f("compressionOther")}</Label>
            <Field
              placeholder={f("compressionOtherPlaceholder")}
              value={d.compressionOther}
              onChangeText={(v) => setD({ compressionOther: v })}
            />
          </>
        )}
      </Card>
    </>
  );

  const stepNames = ["patientData", "treatment", "signs", "function", "context"];

  return (
    <SafeAreaView className="flex-1 bg-white-600 mt-8">
      <StatusBar style="dark" />
      <KeyboardAwareScrollView
        key={step} // volta ao topo a cada etapa
        contentContainerStyle={{ flexGrow: 1, alignItems: "center", paddingBottom: 24 }}
        enableOnAndroid
        extraScrollHeight={120}
        keyboardShouldPersistTaps="handled"
      >
        {/* Cabeçalho */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            paddingHorizontal: 16,
            marginTop: 32,
          }}
        >
          <TouchableOpacity
            accessibilityLabel={t("common.back")}
            onPress={goBack}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={{ width: 40, height: 40, justifyContent: "center", alignItems: "flex-start" }}
          >
            <Feather name="arrow-left" size={28} color="#000" />
          </TouchableOpacity>
          <Text
            style={{ flex: 1, textAlign: "center", fontSize: 20, fontWeight: "600" }}
          >
            {f("detailedTitle")}
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={{ width: "100%", maxWidth: 360, paddingHorizontal: 16, marginTop: 14 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ color: PRIMARY, fontWeight: "700", fontSize: 13 }}>
              {`${f("step")} ${step} ${f("of")} ${TOTAL_STEPS}`}
            </Text>
            <Text style={{ color: "#666", fontSize: 13, flexShrink: 1, textAlign: "right" }}>
              {f(`stepNames.${stepNames[step - 1]}`)}
            </Text>
          </View>
          <Stepper step={step} total={TOTAL_STEPS} />
        </View>

        <View
          style={{
            alignSelf: "flex-start",
            marginLeft: 16,
            marginTop: 12,
            backgroundColor: "#fff",
            borderRadius: 999,
            paddingHorizontal: 14,
            paddingVertical: 7,
          }}
        >
          <Text style={{ fontSize: 13, color: "#333" }}>
            {f("patientOf")} <Text style={{ fontWeight: "700" }}>{patientData.fullName}</Text>
            {age !== null ? ` · ${age} ${f("years")}` : ""}
            {side ? ` · ${f(side === "right" ? "limbRight" : "limbLeft")}` : ""}
          </Text>
        </View>

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
        {step === 5 && renderStep5()}

        {!!error && (
          <Text style={{ color: "#c0262d", marginTop: 12, textAlign: "center", paddingHorizontal: 16 }}>
            {error}
          </Text>
        )}

        {/* Rodapé: o FAQ fica numa linha própria para os botões terem largura para o texto em uma linha só */}
        <View style={{ width: "100%", maxWidth: 360, paddingHorizontal: 16, marginTop: 16 }}>
          <View style={{ alignItems: "flex-end", marginBottom: 12 }}>
            <FaqButton onPress={() => router.navigate("/faq")} />
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Button
              label={t("patient.save")}
              variant="ghost"
              onPress={() => finish("home")}
              disabled={saving}
              style={{ marginRight: 10, paddingHorizontal: 18 }}
            />
            <Button
              label={step < TOTAL_STEPS ? t("patient.proceed") : f("goCalculator")}
              onPress={() => (step < TOTAL_STEPS ? setStep(step + 1) : finish("calculator"))}
              disabled={saving}
              style={{ flex: 1, minWidth: 0 }}
            />
          </View>
        </View>
        {saving && <ActivityIndicator color={PRIMARY} style={{ marginTop: 10 }} />}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
