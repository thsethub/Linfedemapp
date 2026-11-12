// Estrutura e regras da ficha do paciente (ficha simplificada + ficha detalhada).

export type Side = "right" | "left";
export type YesNo = "Sim" | "Não" | "";

export interface ProcedureDetail {
  type: string;
  duration: string; // meses
}

export interface DetailedForm {
  // Etapa 1: dados da paciente (o diagnóstico oncológico fica para uma próxima versão)
  comorbidities: string;
  // Etapa 2: tratamento
  procedureObservation: string;
  // Etapa 3: sinais e sintomas
  painScore: string; // EVA 0–10
  painNotes: string;
  skinOther: string;
  sensoryArm: string[];
  sensoryChest: string[];
  sensoryNotes: string;
  // Etapa 4: função e impacto
  romRestricted: Record<string, YesNo>; // ombro, cotovelo, antebraço, punho
  romMovements: Record<string, string[]>;
  goniometry: string;
  strengthDeficit: Record<string, YesNo>;
  strengthGroups: Record<string, string[]>;
  strengthTest: string;
  impact: string[];
  impactNotes: string;
  musculoskeletalChanges: YesNo;
  otherClinical: string;
  // Etapa 5: contexto clínico e conduta
  islStage: string; // subclinical | I | II | III
  physioDiagnosis: string;
  previousTreatments: string;
  currentConduct: string;
  compression: string[];
  compressionOther: string;
}

export const JOINTS = ["shoulder", "elbow", "forearm", "wrist"] as const;

export const ROM_MOVEMENTS: Record<string, string[]> = {
  shoulder: ["flexion", "extension", "abduction", "adduction", "internalRotation", "externalRotation"],
  elbow: ["flexion", "extension"],
  forearm: ["pronation", "supination"],
  wrist: ["flexion", "extension", "radialDeviation", "ulnarDeviation"],
};

export const STRENGTH_GROUPS: Record<string, string[]> = {
  shoulder: ["flexors", "extensors", "abductors", "adductors", "internalRotators", "externalRotators"],
  elbow: ["flexors", "extensors"],
  forearm: ["pronators", "supinators"],
  wrist: ["flexors", "extensors", "radialDeviators", "ulnarDeviators"],
};

export const emptyDetailed = (): DetailedForm => ({
  comorbidities: "",
  procedureObservation: "",
  painScore: "",
  painNotes: "",
  skinOther: "",
  sensoryArm: [],
  sensoryChest: [],
  sensoryNotes: "",
  romRestricted: {},
  romMovements: {},
  goniometry: "",
  strengthDeficit: {},
  strengthGroups: {},
  strengthTest: "",
  impact: [],
  impactNotes: "",
  musculoskeletalChanges: "",
  otherClinical: "",
  islStage: "",
  physioDiagnosis: "",
  previousTreatments: "",
  currentConduct: "",
  compression: [],
  compressionOther: "",
});

// ---------- Regras da ficha simplificada ----------

export const onlyDigits = (value: string) => value.replace(/\D/g, "");

export const formatPhone = (value: string) => {
  const d = onlyDigits(value).slice(0, 11);
  if (d.length === 0) return "";
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
};

// Telefone válido: DDD + 8 ou 9 dígitos.
export const isPhoneValid = (value: string) => {
  const n = onlyDigits(value).length;
  return n === 10 || n === 11;
};

export interface EssentialInput {
  fullName?: string;
  birthDate?: string;
  phone?: string;
  side?: Side | null;
}

// Obrigatórios: nome, data de nascimento, telefone e lado acometido.
export const isEssentialComplete = (d: EssentialInput) =>
  !!d.fullName?.trim() &&
  !!d.birthDate?.trim() &&
  isPhoneValid(d.phone ?? "") &&
  (d.side === "right" || d.side === "left");

// "dd/mm/aaaa" -> idade em anos (null se inválida)
export const ageFromBirthDate = (birthDate?: string): number | null => {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(birthDate ?? "");
  if (!m) return null;
  const [, dd, mm, yyyy] = m;
  const birth = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
  if (Number.isNaN(birth.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const beforeBirthday =
    now.getMonth() < birth.getMonth() ||
    (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate());
  if (beforeBirthday) age -= 1;
  return age >= 0 && age < 130 ? age : null;
};

// ---------- IMC ----------

const toNumber = (v: string) => {
  const n = parseFloat(v.replace(",", "."));
  return Number.isFinite(n) ? n : NaN;
};

export type BmiClass = "underweight" | "normal" | "overweight" | "obesity1" | "obesity2" | "obesity3";

export const computeBmi = (weightKg: string, heightCm: string) => {
  const w = toNumber(weightKg);
  const h = toNumber(heightCm);
  if (!(w > 0) || !(h > 0)) return null;
  const meters = h / 100;
  const value = w / (meters * meters);
  let cls: BmiClass;
  if (value < 18.5) cls = "underweight";
  else if (value < 25) cls = "normal";
  else if (value < 30) cls = "overweight";
  else if (value < 35) cls = "obesity1";
  else if (value < 40) cls = "obesity2";
  else cls = "obesity3";
  return { value, cls };
};
