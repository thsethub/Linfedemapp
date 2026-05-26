import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { useTranslation } from "../context/LanguageContext";
import { Feather } from "@expo/vector-icons";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { API_URL } from "@/config/api";

interface UserProfile {
  id?: string;
  name?: string;
  fullName?: string;
  email: string;
  telefone?: string;
  titulacao?: string;
  origem?: string;
  idade?: string | number;
}

interface EditableFields {
  titulacao: string;
  telefone: string;
  origem: string;
}

function getDisplayName(user: UserProfile): string {
  return user.fullName || user.name || "";
}

export default function Profile() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editFields, setEditFields] = useState<EditableFields>({
    titulacao: "",
    telefone: "",
    origem: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = await SecureStore.getItemAsync("access_token");
      if (!token) {
        router.replace("/sing-in");
        return;
      }
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data: UserProfile = response.data;
      setUser(data);
      setEditFields({
        titulacao: data.titulacao ?? "",
        telefone: data.telefone ?? "",
        origem: data.origem ?? "",
      });
    } catch {
      Alert.alert(t("common.error"), t("profile.loadError"));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = await SecureStore.getItemAsync("access_token");
      if (!token) return;
      await axios.patch(
        `${API_URL}/auth/me`,
        {
          titulacao: editFields.titulacao,
          telefone: editFields.telefone,
          origem: editFields.origem,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser((prev) => (prev ? { ...prev, ...editFields } : prev));
      setIsEditing(false);
      Alert.alert(t("common.success"), t("profile.saveSuccess"));
    } catch {
      Alert.alert(t("common.error"), t("profile.saveError"));
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditFields({
      titulacao: user?.titulacao ?? "",
      telefone: user?.telefone ?? "",
      origem: user?.origem ?? "",
    });
    setIsEditing(false);
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0].toUpperCase())
      .join("");

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
        <ActivityIndicator size="large" color="#B91C7C" />
      </View>
    );
  }

  const displayName = user ? getDisplayName(user) : "";

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <StatusBar style="light" />

      {/* ===== PINK HEADER (nav + banner) ===== */}
      <View style={{ backgroundColor: "#B91C7C", paddingTop: insets.top }}>

        {/* Nav bar */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 16,
            paddingVertical: 12,
          }}
        >
          {/* Back / Cancel */}
          <TouchableOpacity
            onPress={() => (isEditing ? handleCancelEdit() : router.back())}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "rgba(255,255,255,0.3)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Feather
              name={isEditing ? "x" : "arrow-left"}
              size={22}
              color="#fff"
            />
          </TouchableOpacity>

          {/* Title */}
          <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}>
            {t("profile.title") || "Perfil Profissional"}
          </Text>

          {/* Edit / Save */}
          {saving ? (
            <ActivityIndicator size="small" color="#fff" style={{ width: 40 }} />
          ) : isEditing ? (
            <TouchableOpacity
              onPress={handleSave}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "rgba(255,255,255,0.3)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Feather name="check" size={22} color="#fff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => setIsEditing(true)}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "rgba(255,255,255,0.3)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Feather name="edit-2" size={20} color="#fff" />
            </TouchableOpacity>
          )}
        </View>

        {/* Avatar + name banner */}
        <View style={{ alignItems: "center", paddingBottom: 36, paddingTop: 8 }}>
          <View
            style={{
              width: 88,
              height: 88,
              borderRadius: 44,
              backgroundColor: "rgba(255,255,255,0.25)",
              borderWidth: 3,
              borderColor: "rgba(255,255,255,0.6)",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 12,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 32, fontWeight: "bold" }}>
              {displayName ? getInitials(displayName) : "?"}
            </Text>
          </View>

          <Text
            style={{
              color: "#fff",
              fontSize: 20,
              fontWeight: "bold",
              textAlign: "center",
              paddingHorizontal: 32,
            }}
            numberOfLines={2}
          >
            {displayName || "—"}
          </Text>

          <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, marginTop: 4 }}>
            {user?.email ?? ""}
          </Text>

          {isEditing && (
            <View
              style={{
                marginTop: 10,
                backgroundColor: "rgba(255,255,255,0.2)",
                borderRadius: 20,
                paddingHorizontal: 16,
                paddingVertical: 5,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 12, fontWeight: "600" }}>
                {t("profile.editingMode") || "Modo de edição"}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Curved white section */}
      <View style={{ backgroundColor: "#B91C7C", height: 24 }}>
        <View
          style={{
            flex: 1,
            backgroundColor: "#F9FAFB",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
          }}
        />
      </View>

      {/* ===== CONTENT ===== */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={{ backgroundColor: "#F9FAFB" }}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: insets.bottom + 80, // space for global FAQ FAB
          }}
          showsVerticalScrollIndicator={false}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#374151",
              marginBottom: 12,
              marginTop: 4,
            }}
          >
            {t("profile.information") || "Informações"}
          </Text>

          {/* Email — readonly */}
          <ProfileField
            icon="mail"
            label={t("profile.email") || "E-mail"}
            value={user?.email ?? ""}
            editable={false}
          />

          {/* Titulação — editable */}
          <ProfileField
            icon="briefcase"
            label={t("profile.specialty") || "Titulação / Profissão"}
            value={editFields.titulacao}
            displayValue={user?.titulacao}
            editable={isEditing}
            onChangeText={(v) => setEditFields((p) => ({ ...p, titulacao: v }))}
            placeholder={t("profile.specialtyPlaceholder") || "Ex: Fisioterapeuta, Dr(a)..."}
          />

          {/* Telefone — editable */}
          <ProfileField
            icon="phone"
            label={t("profile.phone") || "Telefone"}
            value={editFields.telefone}
            displayValue={user?.telefone}
            editable={isEditing}
            onChangeText={(v) => setEditFields((p) => ({ ...p, telefone: v }))}
            placeholder="(00) 00000-0000"
            keyboardType="phone-pad"
          />

          {/* Origem — editable */}
          <ProfileField
            icon="map-pin"
            label={t("profile.institution") || "Origem / Instituição"}
            value={editFields.origem}
            displayValue={user?.origem}
            editable={isEditing}
            onChangeText={(v) => setEditFields((p) => ({ ...p, origem: v }))}
            placeholder={t("profile.institutionPlaceholder") || "Ex: UFPE, Hospital..."}
          />

          {/* Save button (visible while editing) */}
          {isEditing && (
            <TouchableOpacity
              onPress={handleSave}
              disabled={saving}
              style={{
                backgroundColor: "#B91C7C",
                borderRadius: 14,
                paddingVertical: 16,
                alignItems: "center",
                marginTop: 8,
                marginBottom: 16,
              }}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
                  {t("profile.save") || "Salvar alterações"}
                </Text>
              )}
            </TouchableOpacity>
          )}

          {/* Sign out */}
          {!isEditing && (
            <TouchableOpacity
              style={{
                borderWidth: 1.5,
                borderColor: "#FECACA",
                borderRadius: 14,
                paddingVertical: 16,
                backgroundColor: "#FEF2F2",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 16,
              }}
              onPress={async () => {
                await SecureStore.deleteItemAsync("access_token");
                router.replace("/sing-in");
              }}
            >
              <Feather name="log-out" size={18} color="#EF4444" />
              <Text
                style={{
                  color: "#EF4444",
                  fontWeight: "700",
                  fontSize: 15,
                  marginLeft: 8,
                }}
              >
                {t("profile.logout") || "Sair da Conta"}
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function ProfileField({
  icon,
  label,
  value,
  displayValue,
  editable,
  onChangeText,
  placeholder,
  keyboardType,
}: {
  icon: string;
  label: string;
  value: string;
  displayValue?: string;
  editable: boolean;
  onChangeText?: (v: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "phone-pad" | "email-address";
}) {
  const shownValue = editable ? value : (displayValue ?? value);

  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 14,
        padding: 14,
        marginBottom: 10,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: editable ? 1.5 : 1,
        borderColor: editable ? "#B91C7C" : "#F3F4F6",
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: editable ? 2 : 1,
      }}
    >
      <View
        style={{
          width: 38,
          height: 38,
          borderRadius: 19,
          backgroundColor: editable ? "#F9E8F4" : "#F3F4F6",
          alignItems: "center",
          justifyContent: "center",
          marginRight: 12,
        }}
      >
        <Feather
          name={icon as any}
          size={17}
          color={editable ? "#B91C7C" : "#9CA3AF"}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 11,
            color: "#9CA3AF",
            marginBottom: 2,
            fontWeight: "500",
          }}
        >
          {label}
        </Text>
        {editable ? (
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#D1D5DB"
            keyboardType={keyboardType ?? "default"}
            style={{ fontSize: 15, color: "#111827", padding: 0 }}
            autoCorrect={false}
          />
        ) : (
          <Text
            style={{
              fontSize: 15,
              color: shownValue ? "#111827" : "#D1D5DB",
              fontWeight: "500",
            }}
          >
            {shownValue || placeholder || "—"}
          </Text>
        )}
      </View>
      {editable && (
        <Feather
          name="edit-3"
          size={14}
          color="#B91C7C"
          style={{ marginLeft: 4 }}
        />
      )}
    </View>
  );
}
