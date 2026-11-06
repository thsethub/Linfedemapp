// Web: expo-secure-store não existe no navegador, então usamos localStorage.
// Mesma interface do expo-secure-store para os chamadores não precisarem mudar.
const storage = (): Storage | null => {
  try {
    return typeof window !== "undefined" ? window.localStorage : null;
  } catch {
    return null; // acesso bloqueado (modo privado restrito etc.)
  }
};

export async function getItemAsync(key: string): Promise<string | null> {
  return storage()?.getItem(key) ?? null;
}

export async function setItemAsync(key: string, value: string): Promise<void> {
  storage()?.setItem(key, value);
}

export async function deleteItemAsync(key: string): Promise<void> {
  storage()?.removeItem(key);
}
