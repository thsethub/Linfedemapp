import ptBR from "./pt-BR.json";
import esES from "./es-ES.json";
import enUS from "./en-US.json";

export type Language = "pt-BR" | "es-ES" | "en-US";

export interface CountryInfo {
  code: Language;
  name: string;
  flag: string;
  country: string;
}

export const languages: Record<Language, any> = {
  "pt-BR": ptBR,
  "es-ES": esES,
  "en-US": enUS,
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
  {
    code: "en-US",
    name: "English",
    flag: "🇺🇸",
    country: "United States",
  },
];

export default languages;
