import React, { useCallback, useEffect, useState } from "react";
import {
  Alert as NativeAlert,
  Modal,
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "@/context/LanguageContext";

/**
 * Substituto do Alert.alert do React Native (que não faz nada na web).
 * Mesma assinatura: appAlert(título, mensagem?, botões?, opções?).
 * Precisa de <AppAlertHost /> montado uma vez na raiz do app (app/_layout.tsx).
 */

export type AppAlertButton = {
  text?: string;
  onPress?: () => void;
  style?: "default" | "cancel" | "destructive";
};

export type AppAlertOptions = {
  /** Permite fechar tocando fora (ou no botão voltar do Android). Padrão: só se houver botão "cancel". */
  cancelable?: boolean;
};

type AlertRequest = {
  id: number;
  title: string;
  message?: string;
  buttons: AppAlertButton[];
  options?: AppAlertOptions;
};

const PRIMARY = "#b41976";
const DANGER = "#c0262d";

let nextId = 1;
let enqueue: ((req: AlertRequest) => void) | null = null;

export function appAlert(
  title: string,
  message?: string,
  buttons?: AppAlertButton[],
  options?: AppAlertOptions
) {
  const list = buttons && buttons.length > 0 ? buttons : [{ text: "OK" }];
  // Sem o host montado (ex.: antes do layout), cai no alerta nativo.
  if (!enqueue) {
    NativeAlert.alert(title, message, list as any, options as any);
    return;
  }
  enqueue({ id: nextId++, title, message, buttons: list, options });
}

type Tone = "info" | "success" | "error";

// O ícone acompanha o tipo do aviso, que é deduzido do conteúdo dos botões:
// destrutivo => alerta; senão, padrão informativo.
function toneOf(req: AlertRequest, t: (k: string) => string): Tone {
  const title = req.title.trim().toLowerCase();
  if (title === t("common.error").toLowerCase()) return "error";
  if (title === t("common.success").toLowerCase()) return "success";
  return "info";
}

const TONES: Record<
  Tone | "danger",
  { icon: keyof typeof Feather.glyphMap; color: string; bg: string }
> = {
  info: { icon: "info", color: PRIMARY, bg: "#fbe8f2" },
  success: { icon: "check-circle", color: "#1f8a4c", bg: "#e4f5ec" },
  error: { icon: "alert-circle", color: DANGER, bg: "#fde9ea" },
  danger: { icon: "alert-triangle", color: DANGER, bg: "#fde9ea" },
};

export function AppAlertHost() {
  const { t } = useTranslation();
  const [queue, setQueue] = useState<AlertRequest[]>([]);
  const current = queue[0];

  useEffect(() => {
    enqueue = (req) => setQueue((q) => [...q, req]);
    return () => {
      enqueue = null;
    };
  }, []);

  const close = useCallback((button?: AppAlertButton) => {
    setQueue((q) => q.slice(1));
    // Executa depois de fechar, como o Alert nativo.
    if (button?.onPress) setTimeout(button.onPress, 0);
  }, []);

  if (!current) return null;

  const { buttons } = current;
  const cancelButton = buttons.find((b) => b.style === "cancel");
  const cancelable = current.options?.cancelable ?? !!cancelButton;
  const hasDestructive = buttons.some((b) => b.style === "destructive");
  const tone = toneOf(current, t);
  const visual = TONES[hasDestructive ? "danger" : tone];
  // Até 2 botões lado a lado; mais que isso, empilhados.
  const stacked = buttons.length > 2;

  const dismiss = () => {
    // Só fecha, sem rodar nenhum botão: um toque fora nunca deve confirmar nem descartar nada.
    if (cancelable) close();
  };

  return (
    <Modal
      key={current.id}
      transparent
      animationType="fade"
      visible
      onRequestClose={dismiss}
      statusBarTranslucent
    >
      <Pressable
        accessible={false}
        onPress={dismiss}
        style={{
          flex: 1,
          backgroundColor: "rgba(17,17,20,0.55)",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        {/* Pressable interno impede que o toque no cartão feche o aviso */}
        <Pressable
          accessibilityRole={"alertdialog" as any}
          accessibilityViewIsModal
          accessibilityLabel={current.title}
          onPress={() => {}}
          style={{
            width: "100%",
            maxWidth: 340,
            backgroundColor: "#fff",
            borderRadius: 24,
            paddingHorizontal: 22,
            paddingTop: 24,
            paddingBottom: 18,
            alignItems: "center",
            ...(Platform.OS === "web"
              ? ({ boxShadow: "0 12px 40px rgba(0,0,0,0.25)" } as any)
              : { elevation: 12 }),
          }}
        >
          <View
            style={{
              width: 52,
              height: 52,
              borderRadius: 26,
              backgroundColor: visual.bg,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 14,
            }}
          >
            <Feather name={visual.icon} size={26} color={visual.color} />
          </View>

          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: "#111",
              textAlign: "center",
            }}
          >
            {current.title}
          </Text>
          {!!current.message && (
            <Text
              style={{
                fontSize: 15,
                lineHeight: 21,
                color: "#555",
                textAlign: "center",
                marginTop: 8,
              }}
            >
              {current.message}
            </Text>
          )}

          <View
            style={{
              flexDirection: stacked ? "column" : "row",
              width: "100%",
              marginTop: 20,
            }}
          >
            {buttons.map((b, i) => {
              const isCancel = b.style === "cancel";
              const isDestructive = b.style === "destructive";
              // O botão de ação (não-cancelar) ganha destaque.
              const filled = !isCancel;
              const bg = isDestructive ? DANGER : PRIMARY;
              return (
                <TouchableOpacity
                  key={`${b.text}-${i}`}
                  accessibilityRole="button"
                  activeOpacity={0.8}
                  onPress={() => close(b)}
                  style={{
                    flex: stacked ? undefined : 1,
                    minWidth: 0,
                    paddingVertical: 13,
                    borderRadius: 12,
                    alignItems: "center",
                    backgroundColor: filled ? bg : "#fff",
                    borderWidth: filled ? 0 : 1.5,
                    borderColor: "#d0d0d6",
                    marginLeft: !stacked && i > 0 ? 10 : 0,
                    marginTop: stacked && i > 0 ? 10 : 0,
                  }}
                >
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: 15.5,
                      fontWeight: "700",
                      color: filled ? "#fff" : "#444",
                    }}
                  >
                    {b.text ?? "OK"}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
