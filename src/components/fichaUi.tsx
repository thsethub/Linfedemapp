import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TextInputProps,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Feather } from "@expo/vector-icons";

export const PRIMARY = "#b41976";
const FIELD_BG = "#f1f1f4";

export const Card: React.FC<{ children: React.ReactNode; style?: StyleProp<ViewStyle> }> = ({
  children,
  style,
}) => (
  <View
    style={[
      {
        width: "100%",
        maxWidth: 360,
        backgroundColor: "#fff",
        borderRadius: 32,
        padding: 20,
        marginTop: 16,
      },
      style,
    ]}
  >
    {children}
  </View>
);

export const SectionTitle: React.FC<{
  icon: keyof typeof Feather.glyphMap;
  title: string;
}> = ({ icon, title }) => (
  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 14 }}>
    <Feather name={icon} size={20} color="#111" style={{ marginRight: 10 }} />
    <Text style={{ fontSize: 17, fontWeight: "600", flexShrink: 1 }}>{title}</Text>
  </View>
);

export const Label: React.FC<{
  children: React.ReactNode;
  required?: boolean;
  hint?: string;
}> = ({ children, required, hint }) => (
  <View style={{ marginBottom: 6, marginTop: 4 }}>
    <Text style={{ fontSize: 15, fontWeight: "500", color: "#111" }}>
      {children}
      {required ? <Text style={{ color: PRIMARY }}> *</Text> : null}
    </Text>
    {!!hint && <Text style={{ fontSize: 12, color: "#666", marginTop: 1 }}>{hint}</Text>}
  </View>
);

export const Field: React.FC<TextInputProps & { multiline?: boolean; minHeight?: number }> = ({
  style,
  multiline,
  minHeight,
  ...rest
}) => (
  <TextInput
    placeholderTextColor="#9a9aa2"
    multiline={multiline}
    style={[
      {
        backgroundColor: FIELD_BG,
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        color: "#111",
        marginBottom: 14,
        minWidth: 0, // permite encolher dentro de linhas flex na web
      },
      multiline && { minHeight: minHeight ?? 96, textAlignVertical: "top" },
      style,
    ]}
    {...rest}
  />
);

export const Chip: React.FC<{
  label: string;
  selected: boolean;
  onPress: () => void;
}> = ({ label, selected, onPress }) => (
  <TouchableOpacity
    accessibilityRole="button"
    accessibilityState={{ selected }}
    onPress={onPress}
    activeOpacity={0.8}
    style={{
      paddingHorizontal: 16,
      paddingVertical: 9,
      borderRadius: 999,
      marginRight: 8,
      marginBottom: 8,
      backgroundColor: selected ? PRIMARY : "#fff",
      borderWidth: 1,
      borderColor: selected ? PRIMARY : "#d0d0d6",
    }}
  >
    <Text style={{ color: selected ? "#fff" : "#444", fontWeight: "500", fontSize: 14 }}>
      {label}
    </Text>
  </TouchableOpacity>
);

export const ChipGroup: React.FC<{
  options: { value: string; label: string }[];
  selected: string[];
  onToggle: (value: string) => void;
}> = ({ options, selected, onToggle }) => (
  <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 6 }}>
    {options.map((o) => (
      <Chip
        key={o.value}
        label={o.label}
        selected={selected.includes(o.value)}
        onPress={() => onToggle(o.value)}
      />
    ))}
  </View>
);

export const toggleIn = (list: string[], value: string) =>
  list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

// Escolha única (ex.: Direito/Esquerdo, estágio ISL)
export const SegmentedChoice: React.FC<{
  options: { value: string; label: string }[];
  value: string | null | undefined;
  onChange: (value: string) => void;
  fill?: boolean;
}> = ({ options, value, onChange, fill }) => (
  <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 6 }}>
    {options.map((o) => {
      const selected = value === o.value;
      return (
        <TouchableOpacity
          key={o.value}
          accessibilityRole="radio"
          accessibilityState={{ selected }}
          onPress={() => onChange(o.value)}
          activeOpacity={0.8}
          style={[
            {
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderRadius: fill ? 12 : 999,
              marginRight: 8,
              marginBottom: 8,
              alignItems: "center",
              backgroundColor: selected ? PRIMARY : "#fff",
              borderWidth: 1,
              borderColor: selected ? PRIMARY : "#d0d0d6",
            },
            fill && { flex: 1 },
          ]}
        >
          <Text style={{ color: selected ? "#fff" : "#555", fontWeight: "600", fontSize: 15 }}>
            {o.label}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

export const YesNoRow: React.FC<{
  label?: string;
  value: string | undefined;
  onChange: (v: "Sim" | "Não") => void;
  yes: string;
  no: string;
  bold?: boolean;
}> = ({ label, value, onChange, yes, no, bold }) => (
  <View style={{ marginBottom: 12 }}>
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {!!label && (
        <Text
          style={{
            fontSize: 15,
            fontWeight: bold ? "600" : "500",
            flex: 1,
            marginRight: 8,
          }}
        >
          {label}
        </Text>
      )}
      <View style={{ flexDirection: "row" }}>
        {(["Sim", "Não"] as const).map((v) => {
          const selected = value === v;
          return (
            <TouchableOpacity
              key={v}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              onPress={() => onChange(v)}
              style={{ flexDirection: "row", alignItems: "center", marginLeft: 14 }}
            >
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: selected ? PRIMARY : "#b5b5bd",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 6,
                }}
              >
                {selected && (
                  <View
                    style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: PRIMARY }}
                  />
                )}
              </View>
              <Text style={{ fontSize: 15 }}>{v === "Sim" ? yes : no}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  </View>
);

export const Stepper: React.FC<{ step: number; total: number }> = ({ step, total }) => (
  <View style={{ flexDirection: "row", width: "100%", maxWidth: 360, marginTop: 8 }}>
    {Array.from({ length: total }, (_, i) => (
      <View
        key={i}
        style={{
          flex: 1,
          height: 4,
          borderRadius: 2,
          marginRight: i === total - 1 ? 0 : 6,
          backgroundColor: i < step ? PRIMARY : "#dcdce2",
        }}
      />
    ))}
  </View>
);

export const Button: React.FC<{
  label: string;
  onPress: () => void;
  variant?: "primary" | "outline" | "ghost";
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}> = ({ label, onPress, variant = "primary", disabled, style }) => {
  const primary = variant === "primary";
  const outline = variant === "outline";
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      onPress={disabled ? undefined : onPress}
      activeOpacity={disabled ? 1 : 0.8}
      style={[
        {
          paddingVertical: 14,
          paddingHorizontal: 16,
          borderRadius: 12,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: primary ? (disabled ? "#dcb3cd" : PRIMARY) : "#fff",
          borderWidth: outline ? 1.5 : 0,
          borderColor: disabled ? "#e4c6d8" : PRIMARY,
          opacity: disabled && !primary ? 0.55 : 1,
        },
        style,
      ]}
    >
      <Text
        numberOfLines={1}
        style={{
          fontSize: 16,
          fontWeight: "700",
          color: primary ? "#fff" : PRIMARY,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export const FaqButton: React.FC<{ onPress: () => void }> = ({ onPress }) => (
  <TouchableOpacity
    accessibilityLabel="FAQ"
    onPress={onPress}
    style={{
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: PRIMARY,
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Feather name="help-circle" size={24} color="#fff" />
  </TouchableOpacity>
);
