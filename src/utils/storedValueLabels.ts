import { languages, Language } from "../locales";

// O app grava alguns valores JÁ TRADUZIDOS no idioma ativo no momento do exame
// (ex.: "Left", "Ulnar Styloid Process", "Esquerdo"). Para exibir no idioma atual
// reconhecemos o valor em qualquer um dos idiomas e voltamos à chave canônica.

export type ArmKey = "left" | "right";
export type ReferenceKey = "styloidProcess" | "articularLine" | "acromion";

const allLanguages = Object.values(languages);
const norm = (s?: string | null) => (s ?? "").trim().toLowerCase();

const REFERENCE_ALIASES: Record<ReferenceKey, string> = {
  styloidProcess: "opcao1",
  articularLine: "opcao2",
  acromion: "opcao3",
};

export function armKey(stored?: string | null): ArmKey | null {
  const v = norm(stored);
  if (!v) return null;
  for (const key of ["left", "right"] as ArmKey[]) {
    if (v === key) return key;
    const names = allLanguages.flatMap((l) => [
      l.arms[key],
      l.arms[key === "left" ? "leftArm" : "rightArm"],
    ]);
    if (names.some((n) => norm(n) === v)) return key;
  }
  return null;
}

export function referenceKey(stored?: string | null): ReferenceKey | null {
  const v = norm(stored);
  if (!v) return null;
  for (const key of Object.keys(REFERENCE_ALIASES) as ReferenceKey[]) {
    if (v === REFERENCE_ALIASES[key]) return key;
    if (allLanguages.some((l) => norm(l.arms.references[key]) === v)) return key;
  }
  return null;
}

/** Nome do tipo de referência no idioma pedido (ou o valor original se desconhecido). */
export function referenceLabel(stored: string | null | undefined, lang: Language) {
  const key = referenceKey(stored);
  return key ? languages[lang].arms.references[key] : stored || "";
}
