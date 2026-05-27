import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Share,
  Linking,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "../context/LanguageContext";

const appData = {
  name: "Linfedemapp",
  version: "1.0.0",
  city: "Recife, PE",
  institution: "Universidade Federal de Pernambuco (UFPE)",
  inpi: {
    processo: "BR512025005856-0",
    publicacao: "15/09/2025",
    expedicao: "25/11/2025",
    titular: "Universidade Federal de Pernambuco",
  },
  authors: [
    { name: "Naiany Tenório de Jesus", role: "author", email: "naiany.tenorio@ufpe.br" },
    { name: "Diego de Sousa Dantas", role: "advisor", email: "diego.sdantas@ufpe.br" },
    { name: "Herbert Albérico de Sá Leitão", role: "advisor", email: null },
    { name: "Thiago Augusto Santana Pereira", role: "scientificInitiation", email: null },
    { name: "Vinicius Roberto Medeiros de Souza", role: "collaborator", email: null },
  ],
  contacts: [
    { label: "Naiany Tenório de Jesus", email: "naiany.tenorio@ufpe.br" },
    { label: "Diego de Sousa Dantas", email: "diego.sdantas@ufpe.br" },
  ],
};

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#FCE4EC",
        gap: 12,
      }}
    >
      <Text style={{ color: "#9CA3AF", fontSize: 12 }}>{label}</Text>
      <Text
        style={{
          color: "#880E4F",
          fontWeight: "700",
          fontSize: 12,
          textAlign: "right",
          maxWidth: "60%",
        }}
      >
        {value}
      </Text>
    </View>
  );
}

function SectionCard({
  icon,
  title,
  expanded,
  onToggle,
  children,
}: {
  icon: string;
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <View style={{ marginBottom: 10 }}>
      <TouchableOpacity
        onPress={onToggle}
        activeOpacity={0.7}
        style={{
          backgroundColor: "#fff",
          borderWidth: 1,
          borderColor: expanded ? "#F48FB1" : "#E5E7EB",
          borderRadius: 12,
          borderBottomLeftRadius: expanded ? 0 : 12,
          borderBottomRightRadius: expanded ? 0 : 12,
          padding: 14,
          flexDirection: "row",
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 3,
        }}
      >
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: expanded ? "#B91C7C" : "#FDF2F8",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
          }}
        >
          <Feather name={icon as any} size={20} color={expanded ? "#fff" : "#B91C7C"} />
        </View>
        <Text style={{ flex: 1, fontSize: 15, fontWeight: "600", color: "#111827" }}>
          {title}
        </Text>
        <Feather name={expanded ? "chevron-up" : "chevron-down"} size={20} color="#9CA3AF" />
      </TouchableOpacity>

      {expanded && (
        <View
          style={{
            backgroundColor: "#FFF5F8",
            borderWidth: 1,
            borderTopWidth: 0,
            borderColor: "#F48FB1",
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
            padding: 16,
          }}
        >
          {children}
        </View>
      )}
    </View>
  );
}

export default function Sobre() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const todayPtBR = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const todayEN = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const citations = [
    {
      id: "abnt",
      label: "ABNT NBR 6023:2025",
      text: `TENÓRIO, Naiany; DANTAS, Diego de Sousa; LEITÃO, Herbert Albérico de Sá; PEREIRA, Thiago Augusto Santana; SOUZA, Vinicius Roberto Medeiros de. Linfedemapp. Recife, PE: UFPE, 2025. Acesso em: ${todayPtBR}.`,
    },
    {
      id: "apa",
      label: "APA 7ª Edição",
      text: `Tenório, N., Dantas, D. S., Leitão, H. A. S., Pereira, T. A. S., & Souza, V. R. M. (2025). Linfedemapp [Mobile application]. UFPE.`,
    },
    {
      id: "vancouver",
      label: "Vancouver",
      text: `Tenório N, Dantas DS, Leitão HAS, Pereira TAS, Souza VRM. Linfedemapp [mobile application]. Recife: UFPE; 2025 [cited ${todayEN}].`,
    },
  ];

  const toggle = (id: string) =>
    setActiveSection((prev) => (prev === id ? null : id));

  const handleShare = async (text: string) => {
    try {
      await Share.share({ message: text });
    } catch {}
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <StatusBar style="light" />

      {/* Header rosa — cobre safe area + banner */}
      <View style={{ backgroundColor: "#B91C7C", paddingTop: insets.top }}>
        {/* Nav */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingVertical: 12,
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "rgba(255,255,255,0.3)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Feather name="arrow-left" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700", marginLeft: 12 }}>
            {t("sobre.title")}
          </Text>
        </View>

        {/* Banner info */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 28, paddingTop: 4 }}>
          <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, marginBottom: 4 }}>
            {t("sobre.appLabel")}
          </Text>
          <Text style={{ color: "#fff", fontSize: 24, fontWeight: "bold", marginBottom: 4 }}>
            {appData.name}
          </Text>
          <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: 12 }}>
            {appData.institution}
          </Text>

          {/* Quick chips */}
          <View style={{ flexDirection: "row", gap: 8, marginTop: 14 }}>
            {[
              { label: `v${appData.version}` },
              { label: appData.city },
              { label: t("sobre.publishedLabel") },
            ].map((chip) => (
              <View
                key={chip.label}
                style={{
                  backgroundColor: "rgba(255,255,255,0.2)",
                  borderRadius: 20,
                  paddingHorizontal: 12,
                  paddingVertical: 4,
                }}
              >
                <Text style={{ color: "#fff", fontSize: 12, fontWeight: "600" }}>
                  {chip.label}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Descrição */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: 16,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: "#E5E7EB",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 3,
          }}
        >
          <Text style={{ color: "#374151", fontSize: 13, lineHeight: 20 }}>
            {t("sobre.description")}
          </Text>
          <Text style={{ color: "#9CA3AF", fontSize: 11, marginTop: 6 }}>
            {t("sobre.department")}
          </Text>
        </View>

        <Text
          style={{
            color: "#9CA3AF",
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: 0.5,
            marginBottom: 12,
          }}
        >
          {t("sobre.infoLabel")}
        </Text>

        {/* INPI */}
        <SectionCard
          icon="shield"
          title={t("sobre.inpi.title")}
          expanded={activeSection === "inpi"}
          onToggle={() => toggle("inpi")}
        >
          <InfoRow label={t("sobre.inpi.process")} value={appData.inpi.processo} />
          <InfoRow label={t("sobre.inpi.holder")} value={appData.inpi.titular} />
          <InfoRow label={t("sobre.inpi.publishedDate")} value={appData.inpi.publicacao} />
          <InfoRow label={t("sobre.inpi.issued")} value={appData.inpi.expedicao} />
          <InfoRow label={t("sobre.inpi.validity")} value={t("sobre.inpi.validityValue")} />
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 8,
              padding: 12,
              marginTop: 12,
              borderWidth: 1,
              borderColor: "#F8BBD0",
            }}
          >
            <Text style={{ color: "#6B7280", fontSize: 12, lineHeight: 18 }}>
              {t("sobre.inpi.note")} {appData.inpi.processo}.
            </Text>
          </View>
        </SectionCard>

        {/* Citações */}
        <SectionCard
          icon="book-open"
          title={t("sobre.citation.title")}
          expanded={activeSection === "citation"}
          onToggle={() => toggle("citation")}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 8,
              padding: 10,
              marginBottom: 16,
              borderWidth: 1,
              borderColor: "#F8BBD0",
              flexDirection: "row",
              gap: 8,
            }}
          >
            <Feather name="info" size={13} color="#B91C7C" style={{ marginTop: 1 }} />
            <Text style={{ color: "#6B7280", fontSize: 11, flex: 1, lineHeight: 17 }}>
              {t("sobre.citation.dateNote")}
            </Text>
          </View>

          {citations.map((cite, i) => (
            <View
              key={cite.id}
              style={{ marginBottom: i < citations.length - 1 ? 18 : 0 }}
            >
              <Text style={{ fontWeight: "700", color: "#880E4F", fontSize: 13, marginBottom: 8 }}>
                {cite.label}
              </Text>
              <View
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 8,
                  padding: 12,
                  borderWidth: 1,
                  borderColor: "#F8BBD0",
                }}
              >
                <Text style={{ color: "#374151", fontSize: 12, lineHeight: 20, fontStyle: "italic" }}>
                  {cite.text}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => handleShare(cite.text)}
                activeOpacity={0.7}
                style={{ flexDirection: "row", alignItems: "center", marginTop: 8, alignSelf: "flex-start" }}
              >
                <Feather name="share-2" size={14} color="#B91C7C" />
                <Text style={{ color: "#B91C7C", fontWeight: "700", fontSize: 13, marginLeft: 6 }}>
                  {t("sobre.citation.share")}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </SectionCard>

        {/* Equipe */}
        <SectionCard
          icon="users"
          title={t("sobre.team.title")}
          expanded={activeSection === "team"}
          onToggle={() => toggle("team")}
        >
          {appData.authors.map((author, i) => (
            <View
              key={i}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 10,
                borderBottomWidth: i < appData.authors.length - 1 ? 1 : 0,
                borderBottomColor: "#FCE4EC",
                gap: 12,
              }}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: i === 0 ? "#B91C7C" : "#fff",
                  borderWidth: i === 0 ? 0 : 1,
                  borderColor: "#F48FB1",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    color: i === 0 ? "#fff" : "#B91C7C",
                    fontWeight: "700",
                    fontSize: i === 0 ? 15 : 13,
                  }}
                >
                  {i === 0 ? "★" : `${i + 1}`}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "700", color: "#111827", fontSize: 13 }}>
                  {author.name}
                </Text>
                <Text style={{ color: "#9CA3AF", fontSize: 11 }}>{t(`sobre.team.roles.${author.role}`)}</Text>
                {author.email && (
                  <TouchableOpacity onPress={() => Linking.openURL(`mailto:${author.email}`)}>
                    <Text style={{ color: "#B91C7C", fontSize: 11, marginTop: 2 }}>
                      {author.email}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 8,
              padding: 12,
              marginTop: 12,
              borderWidth: 1,
              borderColor: "#F8BBD0",
            }}
          >
            <Text style={{ color: "#6B7280", fontSize: 12 }}>
              {t("sobre.department")}
            </Text>
          </View>
        </SectionCard>

        {/* Contato */}
        <SectionCard
          icon="mail"
          title={t("sobre.contact.title")}
          expanded={activeSection === "contact"}
          onToggle={() => toggle("contact")}
        >
          {appData.contacts.map((c, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => Linking.openURL(`mailto:${c.email}`)}
              activeOpacity={0.7}
              style={{
                backgroundColor: "#fff",
                borderRadius: 10,
                padding: 14,
                borderWidth: 1,
                borderColor: "#F8BBD0",
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                marginBottom: i < appData.contacts.length - 1 ? 10 : 0,
              }}
            >
              <View
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 19,
                  backgroundColor: "#FDF2F8",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Feather name="mail" size={18} color="#B91C7C" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "600", color: "#111827", fontSize: 13 }}>{c.label}</Text>
                <Text style={{ color: "#B91C7C", fontSize: 12, marginTop: 2 }}>{c.email}</Text>
              </View>
              <Feather name="chevron-right" size={16} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
          <Text style={{ color: "#9CA3AF", fontSize: 12, lineHeight: 18, marginTop: 12 }}>
            {t("sobre.contact.description")}
          </Text>
        </SectionCard>

        <View style={{ alignItems: "center", marginTop: 24 }}>
          <Text style={{ color: "#D1D5DB", fontSize: 11 }}>
            © 2025 {appData.institution}
          </Text>
          <Text style={{ color: "#D1D5DB", fontSize: 11, marginTop: 4 }}>
            {t("sobre.footer")} · INPI {appData.inpi.processo}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
