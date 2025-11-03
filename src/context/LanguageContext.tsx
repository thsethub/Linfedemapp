import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import * as SecureStore from "expo-secure-store";
import { languages, Language } from "../locales";

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => Promise<void>;
  isLanguageSelected: boolean;
  translations: (typeof languages)[Language];
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

interface LanguageProviderProps {
  children: ReactNode;
}

const LANGUAGE_STORAGE_KEY = "selected_language";

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>("pt-BR");
  const [isLanguageSelected, setIsLanguageSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar idioma salvo no início
  useEffect(() => {
    loadSavedLanguage();
  }, []);

  const loadSavedLanguage = async () => {
    try {
      const savedLanguage = await SecureStore.getItemAsync(
        LANGUAGE_STORAGE_KEY
      );
      if (
        savedLanguage &&
        (savedLanguage === "pt-BR" || savedLanguage === "es-ES")
      ) {
        setCurrentLanguage(savedLanguage as Language);
        setIsLanguageSelected(true);
      }
    } catch (error) {
      console.error("Erro ao carregar idioma salvo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const setLanguage = async (language: Language) => {
    try {
      await SecureStore.setItemAsync(LANGUAGE_STORAGE_KEY, language);
      setCurrentLanguage(language);
      setIsLanguageSelected(true);
    } catch (error) {
      console.error("Erro ao salvar idioma:", error);
    }
  };

  // Função para buscar tradução aninhada
  const getNestedTranslation = (obj: any, path: string): string => {
    return (
      path.split(".").reduce((current, key) => current?.[key], obj) || path
    );
  };

  const t = (key: string): string => {
    const translations = languages[currentLanguage];
    return getNestedTranslation(translations, key);
  };

  const value: LanguageContextType = {
    currentLanguage,
    setLanguage,
    isLanguageSelected,
    translations: languages[currentLanguage],
    t,
  };

  // Mostrar loading enquanto carrega o idioma
  if (isLoading) {
    return null; // ou um componente de loading
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage deve ser usado dentro de um LanguageProvider");
  }
  return context;
}

// Hook simplificado para tradução
export function useTranslation() {
  const { t } = useLanguage();
  return { t };
}
