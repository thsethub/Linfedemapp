import axios from "axios";
import * as SecureStore from "./secureStorage";
import { API_URL } from "@/config/api";
import { DetailedForm } from "./fichaDetalhada";

export class AuthTokenMissingError extends Error {}

const proc = (data: any, key: string) =>
  data.procedures?.includes(key)
    ? {
        tipo: data[key]?.type || null,
        duracao: data[key]?.duration || null,
      }
    : null;

// Envia a ficha (simplificada e, se houver, a detalhada) ao backend.
// Campos opcionais não preenchidos seguem como null/vazio.
export async function savePatient(patientData: any): Promise<void> {
  const token = await SecureStore.getItemAsync("access_token");
  if (!token) throw new AuthTokenMissingError();

  const me = await axios.get(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const detailed: DetailedForm | undefined = patientData.detailed;

  const body = {
    usuarioId: me.data.id,
    nome: patientData.fullName,
    dataNascimento: patientData.birthDate,
    endereco: patientData.address || null,
    telefone: patientData.phone,
    ladoAcometido: patientData.side ?? null,
    pesoCorporal: patientData.weight || null,
    altura: patientData.height || null,
    nivelAtividadeFisica: patientData.activityLevel || null,
    estadoCivil: patientData.maritalStatus || null,
    ocupacao: patientData.occupation || null,
    dataDiagnostiCancer: patientData.cancerDiagnosisDate || null,
    procedimentos: patientData.procedures ?? [],
    alteracoesCutaneas: patientData.skinChanges ?? [],
    queixasMusculoesqueleticas: detailed?.musculoskeletalChanges || null,
    sintomasLinfedema: patientData.lymphedemaSymptoms || null,
    sinalCacifo: patientData.cacifoSign || null,
    sinalCascaLaranja: patientData.orangePeelSign || null,
    sinalStemmer: patientData.stemmerSign || null,
    radioterapia: proc(patientData, "radiotherapy"),
    cirurgia: proc(patientData, "surgery"),
    disseccaoAxilar: proc(patientData, "axillaryDissection"),
    hormonoterapia: proc(patientData, "hormoneTherapy"),
    quimioterapia: proc(patientData, "chemotherapy"),
    observacaoPaciente: detailed?.procedureObservation || null,
    // Tudo o que não tem coluna própria (dor, ADM, força, impacto, conduta...)
    fichaDetalhada: detailed ? JSON.stringify(detailed) : null,
  };

  await axios.post(`${API_URL}/api/pacientes`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
}
