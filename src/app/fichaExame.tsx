import React, { useState } from "react";
import { View, Text, TouchableOpacity, SafeAreaView, ActivityIndicator } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";

import DatePicker from "@/components/datepicker";
import Header from "@/components/headerFicha1";
import { Button, Card, Field, FaqButton, Label, PRIMARY, SectionTitle, SegmentedChoice } from "@/components/fichaUi";
import { useMeasurementContext } from "@/context/context";
import { useTranslation } from "@/context/LanguageContext";
import {
  ageFromBirthDate,
  formatPhone,
  isEssentialComplete,
  Side,
} from "@/utils/fichaDetalhada";
import { AuthTokenMissingError, savePatient } from "@/utils/savePatient";

export default function FichaExame1() {
  const { t } = useTranslation();
  const { patientData, setPatientData, clearAllData, setAffectedArm } =
    useMeasurementContext();
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const side: Side | null = patientData.side ?? null;
  const age = ageFromBirthDate(patientData.birthDate);
  const complete = isEssentialComplete({ ...patientData, side });

  const update = (field: string, value: any) =>
    setPatientData({ ...patientData, [field]: value });

  const today = new Date();
  const todayStr = `${String(today.getDate()).padStart(2, "0")}/${String(
    today.getMonth() + 1
  ).padStart(2, "0")}/${today.getFullYear()}`;

  // A ficha simplificada salva a paciente e segue direto para a calculadora.
  // O lado acometido já define o braço afetado.
  const goToCalculator = async () => {
    if (!complete || saving) return;
    setSaving(true);
    setError("");
    try {
      await savePatient(patientData);
      clearAllData();
      setAffectedArm(side as Side);
      router.push("/calculadora");
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

  const goToDetailed = () => {
    if (!complete) return;
    router.push("/fichaDetalhada" as any);
  };

  return (
    <SafeAreaView className="flex-1 bg-white-600 mt-8">
      <StatusBar style="dark" />
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1, alignItems: "center", paddingBottom: 32 }}
        enableOnAndroid
        extraScrollHeight={120}
        keyboardShouldPersistTaps="handled"
      >
        <Header title={t("ficha.newTitle")} />

        <Card>
          <SectionTitle icon="user" title={t("ficha.essentialData")} />

          <Label required>{t("patient.fullName")}</Label>
          <Field
            placeholder={t("patient.fullNamePlaceholder")}
            value={patientData.fullName}
            onChangeText={(v) => update("fullName", v)}
          />

          <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
            <View style={{ flex: 1.5, marginRight: 12 }}>
              <Label required>{t("patient.birthDate")}</Label>
              <TouchableOpacity
                accessibilityRole="button"
                onPress={() => setDatePickerVisible(true)}
                style={{
                  backgroundColor: "#f1f1f4",
                  borderRadius: 10,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  marginBottom: 14,
                }}
              >
                <Text style={{ fontSize: 15, color: patientData.birthDate ? "#111" : "#9a9aa2" }}>
                  {patientData.birthDate || t("patient.selectDate")}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
              <Label>{t("ficha.age")}</Label>
              <View
                style={{
                  backgroundColor: "#fbe8f2",
                  borderRadius: 10,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  marginBottom: 14,
                }}
              >
                <Text style={{ fontSize: 15, fontWeight: "600", color: PRIMARY }}>
                  {age !== null ? `${age} ${t("ficha.years")}` : "—"}
                </Text>
              </View>
            </View>
          </View>

          <DatePicker
            visible={datePickerVisible}
            onClose={() => setDatePickerVisible(false)}
            onConfirm={(date) => update("birthDate", date)}
            initialDate={patientData.birthDate || todayStr}
          />

          <Label required>{t("patient.address")}</Label>
          <Field
            placeholder={t("ficha.addressPlaceholder")}
            value={patientData.address}
            onChangeText={(v) => update("address", v)}
          />

          <Label required>{t("patient.phone")}</Label>
          <Field
            placeholder={t("ficha.phonePlaceholder")}
            keyboardType="phone-pad"
            value={patientData.phone}
            onChangeText={(v) => update("phone", formatPhone(v))}
          />

          <Label required hint={t("ficha.sideHint")}>
            {t("ficha.side")}
          </Label>
          <SegmentedChoice
            fill
            value={side}
            onChange={(v) => update("side", v)}
            options={[
              { value: "right", label: t("ficha.right") },
              { value: "left", label: t("ficha.left") },
            ]}
          />

          <Text style={{ fontSize: 12.5, color: "#666", marginTop: 4 }}>
            <Text style={{ color: PRIMARY }}>* </Text>
            {t("ficha.requiredNote")}
          </Text>
        </Card>

        <View style={{ width: "100%", maxWidth: 360, paddingHorizontal: 16 }}>
          <View style={{ alignItems: "flex-end", marginTop: 12, marginBottom: 12 }}>
            <FaqButton onPress={() => router.navigate("/faq")} />
          </View>

          {!!error && (
            <Text style={{ color: "#c0262d", marginBottom: 10, textAlign: "center" }}>{error}</Text>
          )}

          <Button
            label={t("ficha.goCalculator")}
            onPress={goToCalculator}
            disabled={!complete || saving}
          />
          {saving && <ActivityIndicator color={PRIMARY} style={{ marginTop: 8 }} />}
          <Button
            variant="outline"
            label={t("ficha.fillDetailed")}
            onPress={goToDetailed}
            disabled={!complete || saving}
            style={{ marginTop: 12 }}
          />
          <Text style={{ textAlign: "center", color: "#666", fontSize: 12.5, marginTop: 10 }}>
            {complete ? t("ficha.saveHint") : t("ficha.fillRequired")}
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
