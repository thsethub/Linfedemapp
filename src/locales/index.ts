import ptBR from "./pt-BR.json";
import esES from "./es-ES.json";

export type Language = "pt-BR" | "es-ES";

export interface CountryInfo {
  code: Language;
  name: string;
  flag: string;
  country: string;
}

export const languages: Record<Language, any> = {
  "pt-BR": ptBR,
  "es-ES": esES,
};

export const countries: CountryInfo[] = [
  {
    code: "pt-BR",
    name: "Português",
    flag: "🇧🇷",
    country: "Brasil",
  },
  {
    code: "es-ES",
    name: "Español",
    flag: "🌐",
    country: "Español",
  },
];

export default languages;
