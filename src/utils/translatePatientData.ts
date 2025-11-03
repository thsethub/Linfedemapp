/**
 * Utilidades para traduzir dados de paciente vindos da API
 * Mapeia valores neutros salvos no banco para traduções localizadas
 */

export const translateActivityLevel = (
  value: string,
  t: (key: string) => string
): string => {
  const activityLevelMap: Record<string, string> = {
    sedentary: t("patient.activityLevels.sedentary"),
    irregular: t("patient.activityLevels.irregular"),
    active: t("patient.activityLevels.active"),
    veryActive: t("patient.activityLevels.veryActive"),
    // Manter compatibilidade com valores antigos em português
    Sedentária: t("patient.activityLevels.sedentary"),
    Irregular: t("patient.activityLevels.irregular"),
    Ativa: t("patient.activityLevels.active"),
    "Muito ativa": t("patient.activityLevels.veryActive"),
  };

  return activityLevelMap[value] || value;
};

export const translateMaritalStatus = (
  value: string,
  t: (key: string) => string
): string => {
  const maritalStatusMap: Record<string, string> = {
    single: t("patient.maritalStatuses.single"),
    married: t("patient.maritalStatuses.married"),
    widowed: t("patient.maritalStatuses.widowed"),
    divorced: t("patient.maritalStatuses.divorced"),
    // Manter compatibilidade com valores antigos em português
    Solteira: t("patient.maritalStatuses.single"),
    Casada: t("patient.maritalStatuses.married"),
    Viúva: t("patient.maritalStatuses.widowed"),
    Divorciada: t("patient.maritalStatuses.divorced"),
  };

  return maritalStatusMap[value] || value;
};

export const translateProcedure = (
  procedure: string,
  t: (key: string) => string
): string => {
  const procedureMap: Record<string, string> = {
    chemotherapy: t("patient.procedures.chemotherapy"),
    radiotherapy: t("patient.procedures.radiotherapy"),
    surgery: t("patient.procedures.surgery"),
    axillaryDissection: t("patient.procedures.axillaryDissection"),
    hormoneTherapy: t("patient.procedures.hormoneTherapy"),
    // Manter compatibilidade com valores antigos em português
    Quimioterapia: t("patient.procedures.chemotherapy"),
    Radioterapia: t("patient.procedures.radiotherapy"),
    Cirurgia: t("patient.procedures.surgery"),
    "Esvaziamento axilar": t("patient.procedures.axillaryDissection"),
    Hormonoterapia: t("patient.procedures.hormoneTherapy"),
  };

  return procedureMap[procedure] || procedure;
};

export const translateProcedureType = (
  type: string,
  t: (key: string) => string
): string => {
  const procedureTypeMap: Record<string, string> = {
    neoadjuvant: t("patient.procedureTypes.neoadjuvant"),
    adjuvant: t("patient.procedureTypes.adjuvant"),
    neoAdjuvant: t("patient.procedureTypes.neoAdjuvant"),
    simpleMastectomy: t("patient.procedureTypes.simpleMastectomy"),
    modifiedMastectomy: t("patient.procedureTypes.modifiedMastectomy"),
    radicalMastectomy: t("patient.procedureTypes.radicalMastectomy"),
    quadrantectomy: t("patient.procedureTypes.quadrantectomy"),
    total: t("patient.procedureTypes.total"),
    selective: t("patient.procedureTypes.selective"),
    dontKnow: t("patient.procedureTypes.dontKnow"),
    // Manter compatibilidade com valores antigos em português
    Neoadjuvante: t("patient.procedureTypes.neoadjuvant"),
    Adjuvante: t("patient.procedureTypes.adjuvant"),
    "Neo + Adjuvante": t("patient.procedureTypes.neoAdjuvant"),
    "Mastectomia simples": t("patient.procedureTypes.simpleMastectomy"),
    "Mastectomia modificada": t("patient.procedureTypes.modifiedMastectomy"),
    "Mastectomia radical": t("patient.procedureTypes.radicalMastectomy"),
    Quadrantectomia: t("patient.procedureTypes.quadrantectomy"),
    Total: t("patient.procedureTypes.total"),
    Seletivo: t("patient.procedureTypes.selective"),
    "Não sabe informar": t("patient.procedureTypes.dontKnow"),
  };

  return procedureTypeMap[type] || type;
};

export const translateSkinChangeType = (
  type: string,
  t: (key: string) => string
): string => {
  const skinChangeMap: Record<string, string> = {
    edema: t("patient.skinChangeTypes.edema"),
    skinRetraction: t("patient.skinChangeTypes.skinRetraction"),
    pain: t("patient.skinChangeTypes.pain"),
    nippleInversion: t("patient.skinChangeTypes.nippleInversion"),
    hyperemia: t("patient.skinChangeTypes.hyperemia"),
    nippleDesquamation: t("patient.skinChangeTypes.nippleDesquamation"),
    radiodermatitis: t("patient.skinChangeTypes.radiodermatitis"),
    nippleUlceration: t("patient.skinChangeTypes.nippleUlceration"),
    infection: t("patient.skinChangeTypes.infection"),
    others: t("patient.skinChangeTypes.others"),
    // Manter compatibilidade com valores antigos em português
    Edema: t("patient.skinChangeTypes.edema"),
    "Retração cutânea": t("patient.skinChangeTypes.skinRetraction"),
    Dor: t("patient.skinChangeTypes.pain"),
    "Inversão de Mamilo": t("patient.skinChangeTypes.nippleInversion"),
    Hiperemia: t("patient.skinChangeTypes.hyperemia"),
    "Descamação mamilar": t("patient.skinChangeTypes.nippleDesquamation"),
    Radiodermite: t("patient.skinChangeTypes.radiodermatitis"),
    "Ulceração mamilar": t("patient.skinChangeTypes.nippleUlceration"),
    Infecção: t("patient.skinChangeTypes.infection"),
    "Outra(s)": t("patient.skinChangeTypes.others"),
  };

  return skinChangeMap[type] || type;
};
