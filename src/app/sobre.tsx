import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Share,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";

const appData = {
  name: "Linfedemapp",
  version: "1.0.0",
  build: "2025.09",
  city: "Recife, PE — Brasil",
  institution: "Universidade Federal de Pernambuco (UFPE)",
  department: "Programa de Pós-Graduação em Fisioterapia — PPGFISIO",
  context: "Desenvolvido durante o Mestrado em Fisioterapia da autora principal.",
  inpi: {
    processo: "BR512025005856-0",
    publicacao: "15/09/2025",
    expedicao: "25/11/2025",
    validade: "50 anos (a partir de 01/01/2026)",
    titular: "Universidade Federal de Pernambuco",
  },
  authors: [
    { name: "Naiany Tenório de Jesus", role: "Autora", email: "naiany.tenorio@ufpe.br" },
    { name: "Diego de Sousa Dantas", role: "Orientador", email: "diego.sdantas@ufpe.br" },
    { name: "Herbert Albérico de Sá Leitão", role: "Orientador", email: null },
    { name: "Thiago Augusto Santana Pereira", role: "Iniciação Científica", email: null },
    { name: "Vinicius Roberto Medeiros de Souza", role: "Colaborador", email: null },
  ],
  contacts: [
    { label: "Naiany Tenório de Jesus", email: "naiany.tenorio@ufpe.br" },
    { label: "Diego de Sousa Dantas", email: "diego.sdantas@ufpe.br" },
  ],
  citations: [
    {
      id: "abnt",
      label: "ABNT NBR 6023:2025",
      sublabel: "Padrão obrigatório em universidades brasileiras",
      lang: "pt",
      buildText: (datePtBR: string) =>
        `TENÓRIO, Naiany; DANTAS, Diego de Sousa; LEITÃO, Herbert Albérico de Sá; PEREIRA, Thiago Augusto Santana; SOUZA, Vinicius Roberto Medeiros de. Linfedemapp. Recife, PE: UFPE, 2025. Disponível em: https://linfedemapp.ufpe.br. Acesso em: ${datePtBR}.`,
    },
    {
      id: "apa",
      label: "APA 7ª Edição",
      sublabel: "Padrão internacional — inglês e espanhol",
      lang: "en",
      buildText: () =>
        `Tenório, N., Dantas, D. S., Leitão, H. A. S., Pereira, T. A. S., & Souza, V. R. M. (2025). Linfedemapp [Mobile application]. UFPE. https://linfedemapp.ufpe.br`,
    },
    {
      id: "vancouver",
      label: "Vancouver",
      sublabel: "Padrão biomédico — saúde e fisioterapia",
      lang: "en",
      buildText: (datePtBR: string, dateEN: string) =>
        `Tenório N, Dantas DS, Leitão HAS, Pereira TAS, Souza VRM. Linfedemapp [mobile application]. Recife: UFPE; 2025 [cited ${dateEN}]. Available from: https://linfedemapp.ufpe.br`,
    },
  ],
};

const PRIMARY = "#B91C7C";
const PRIMARY_DARK = "#880E4F";
const PRIMARY_LIGHT = "#f8e8f1";
const PRIMARY_BORDER = "#F8BBD0";
const PRIMARY_BORDER_DARK = "#F48FB1";

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
        alignItems: "flex-start",
      }}
    >
      <Text style={{ color: "#999", fontSize: 12, flexShrink: 0 }}>{label}</Text>
      <Text
        style={{
          color: PRIMARY_DARK,
          fontWeight: "700",
          fontSize: 12,
          textAlign: "right",
          fontFamily: "monospace",
          flexShrink: 1,
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
  children,
  expanded,
  onToggle,
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <View style={{ marginBottom: 10 }}>
      <TouchableOpacity
        onPress={onToggle}
        activeOpacity={0.7}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: expanded ? "#FCE4EC" : PRIMARY_LIGHT,
          borderWidth: 1.5,
          borderColor: expanded ? PRIMARY_BORDER_DARK : PRIMARY_BORDER,
          borderRadius: expanded ? 14 : 14,
          borderBottomLeftRadius: expanded ? 0 : 14,
          borderBottomRightRadius: expanded ? 0 : 14,
          padding: 14,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: expanded ? PRIMARY : PRIMARY_LIGHT,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Feather name={icon as any} size={18} color={expanded ? "#fff" : PRIMARY} />
          </View>
          <Text style={{ fontSize: 14, fontWeight: "700", color: PRIMARY_DARK }}>
            {title}
          </Text>
        </View>
        <Feather
          name={expanded ? "chevron-up" : "chevron-down"}
          size={20}
          color={PRIMARY}
        />
      </TouchableOpacity>

      {expanded && (
        <View
          style={{
            backgroundColor: "#FFF5F8",
            borderWidth: 1.5,
            borderTopWidth: 0,
            borderColor: PRIMARY_BORDER_DARK,
            borderBottomLeftRadius: 14,
            borderBottomRightRadius: 14,
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

  const toggle = (id: string) =>
    setActiveSection((prev) => (prev === id ? null : id));

  const handleShare = async (text: string, label: string) => {
    try {
      await Share.share({ message: text, title: `Citação ${label}` });
    } catch {}
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar style="light" translucent />

      {/* Header */}
      <View
        style={{
          backgroundColor: PRIMARY,
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: 24,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Feather name="arrow-left" size={20} color="#fff" />
          <Text style={{ color: "#fff", marginLeft: 8, fontSize: 14 }}>Voltar</Text>
        </TouchableOpacity>

        <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, marginBottom: 2 }}>
          Aplicativo
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <View>
            <Text style={{ color: "#fff", fontSize: 26, fontWeight: "700" }}>
              {appData.name}
            </Text>
            <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: 12 }}>
              {appData.institution}
            </Text>
          </View>
          <View style={{ marginLeft: "auto" }}>
            <Feather name="info" size={32} color="rgba(255,255,255,0.5)" />
          </View>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick info */}
        <View style={{ flexDirection: "row", gap: 10, marginBottom: 20 }}>
          {[
            { icon: "map-pin" as const, label: "Cidade", value: "Recife, PE" },
            { icon: "tag" as const, label: "Versão", value: `v${appData.version}` },
            { icon: "calendar" as const, label: "Publicação", value: "Set/2025" },
          ].map((item) => (
            <View
              key={item.label}
              style={{
                flex: 1,
                backgroundColor: PRIMARY_LIGHT,
                borderRadius: 14,
                padding: 12,
                alignItems: "center",
              }}
            >
              <Feather name={item.icon} size={18} color={PRIMARY} style={{ marginBottom: 4 }} />
              <Text style={{ fontSize: 10, color: PRIMARY, marginBottom: 2 }}>{item.label}</Text>
              <Text style={{ fontSize: 12, color: PRIMARY_DARK, fontWeight: "700" }}>
                {item.value}
              </Text>
            </View>
          ))}
        </View>

        {/* App description */}
        <View
          style={{
            backgroundColor: PRIMARY_LIGHT,
            borderRadius: 14,
            padding: 16,
            marginBottom: 20,
          }}
        >
          <Text style={{ color: PRIMARY_DARK, fontSize: 13, lineHeight: 20 }}>
            {appData.context}
          </Text>
          <Text style={{ color: "#888", fontSize: 11, marginTop: 6 }}>
            {appData.department}
          </Text>
        </View>

        {/* Sections label */}
        <Text
          style={{
            color: "#999",
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: 0.5,
            marginBottom: 12,
          }}
        >
          Informações do Aplicativo
        </Text>

        {/* INPI */}
        <SectionCard
          icon="shield"
          title="Registro & Proteção (INPI)"
          expanded={activeSection === "inpi"}
          onToggle={() => toggle("inpi")}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 12,
              padding: 14,
              borderWidth: 1,
              borderColor: PRIMARY_BORDER,
              marginBottom: 12,
            }}
          >
            <InfoRow label="Nº do Processo" value={appData.inpi.processo} />
            <InfoRow label="Titular" value={appData.inpi.titular} />
            <InfoRow label="Data de publicação" value={appData.inpi.publicacao} />
            <InfoRow label="Expedido em" value={appData.inpi.expedicao} />
            <InfoRow label="Validade" value={appData.inpi.validade} />
          </View>
          <View
            style={{
              backgroundColor: "#FCE4EC",
              borderRadius: 10,
              padding: 12,
              flexDirection: "row",
              gap: 10,
              alignItems: "flex-start",
            }}
          >
            <Feather name="shield" size={18} color={PRIMARY_DARK} style={{ marginTop: 1 }} />
            <Text style={{ color: PRIMARY_DARK, fontSize: 12, lineHeight: 18, flex: 1 }}>
              Este aplicativo possui{" "}
              <Text style={{ fontWeight: "700" }}>registro oficial no INPI</Text> — Programa de
              Computador nº {appData.inpi.processo}.
            </Text>
          </View>
        </SectionCard>

        {/* Citação */}
        <SectionCard
          icon="book-open"
          title="Citação Científica"
          expanded={activeSection === "citation"}
          onToggle={() => toggle("citation")}
        >
          <View
            style={{
              backgroundColor: "#FCE4EC",
              borderRadius: 10,
              padding: 10,
              marginBottom: 14,
              flexDirection: "row",
              gap: 8,
              alignItems: "flex-start",
            }}
          >
            <Feather name="info" size={14} color={PRIMARY} style={{ marginTop: 1 }} />
            <Text style={{ color: PRIMARY_DARK, fontSize: 11, flex: 1, lineHeight: 16 }}>
              A data de acesso é inserida automaticamente com a data de hoje ao compartilhar.
            </Text>
          </View>

          {appData.citations.map((cite) => {
            const text = cite.buildText(todayPtBR, todayEN);
            return (
              <View key={cite.id} style={{ marginBottom: 14 }}>
                <View style={{ marginBottom: 8 }}>
                  <Text style={{ fontWeight: "700", color: PRIMARY_DARK, fontSize: 13 }}>
                    {cite.label}
                  </Text>
                  <Text style={{ color: "#bbb", fontSize: 11 }}>{cite.sublabel}</Text>
                </View>
                <View
                  style={{
                    backgroundColor: "#fff",
                    borderWidth: 1.5,
                    borderColor: PRIMARY_BORDER,
                    borderRadius: 12,
                    padding: 14,
                  }}
                >
                  <Text
                    style={{
                      color: "#333",
                      fontSize: 12,
                      lineHeight: 20,
                      fontStyle: "italic",
                    }}
                  >
                    {text}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleShare(text, cite.label)}
                  activeOpacity={0.7}
                  style={{
                    marginTop: 8,
                    backgroundColor: PRIMARY,
                    borderRadius: 20,
                    paddingVertical: 8,
                    paddingHorizontal: 20,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                    alignSelf: "flex-start",
                  }}
                >
                  <Feather name="share-2" size={14} color="#fff" />
                  <Text style={{ color: "#fff", fontWeight: "700", fontSize: 13 }}>
                    Compartilhar
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </SectionCard>

        {/* Equipe */}
        <SectionCard
          icon="users"
          title="Equipe de Autores"
          expanded={activeSection === "team"}
          onToggle={() => toggle("team")}
        >
          {appData.authors.map((author, i) => (
            <View
              key={i}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                paddingVertical: 10,
                borderBottomWidth: i < appData.authors.length - 1 ? 1 : 0,
                borderBottomColor: "#FCE4EC",
              }}
            >
              <View
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 19,
                  backgroundColor: i === 0 ? PRIMARY : PRIMARY_LIGHT,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    color: i === 0 ? "#fff" : PRIMARY,
                    fontWeight: "700",
                    fontSize: i === 0 ? 16 : 14,
                  }}
                >
                  {i === 0 ? "★" : `${i + 1}`}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "700", color: PRIMARY_DARK, fontSize: 13 }}>
                  {author.name}
                </Text>
                <Text style={{ color: "#999", fontSize: 11 }}>{author.role}</Text>
                {author.email && (
                  <TouchableOpacity onPress={() => Linking.openURL(`mailto:${author.email}`)}>
                    <Text style={{ color: PRIMARY, fontSize: 11, marginTop: 2 }}>
                      {author.email}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
          <View
            style={{
              marginTop: 12,
              backgroundColor: "#FCE4EC",
              borderRadius: 10,
              padding: 12,
            }}
          >
            <Text style={{ color: PRIMARY_DARK, fontSize: 11, lineHeight: 17 }}>
              🏛 {appData.institution}{"\n"}{appData.department}
            </Text>
          </View>
        </SectionCard>

        {/* Contato */}
        <SectionCard
          icon="mail"
          title="Contato"
          expanded={activeSection === "contact"}
          onToggle={() => toggle("contact")}
        >
          {appData.contacts.map((c, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => Linking.openURL(`mailto:${c.email}`)}
              style={{
                backgroundColor: "#fff",
                borderWidth: 1.5,
                borderColor: PRIMARY_BORDER,
                borderRadius: 12,
                padding: 14,
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                marginBottom: 10,
              }}
            >
              <Feather name="mail" size={20} color={PRIMARY} />
              <View>
                <Text style={{ color: "#999", fontSize: 11 }}>Contato</Text>
                <Text style={{ color: PRIMARY, fontWeight: "700", fontSize: 13 }}>
                  {c.email}
                </Text>
                <Text style={{ color: "#555", fontSize: 11 }}>{c.label}</Text>
              </View>
            </TouchableOpacity>
          ))}
          <Text style={{ color: "#aaa", fontSize: 12, lineHeight: 18, marginTop: 4 }}>
            Para dúvidas, sugestões ou colaborações científicas, entre em contato com os
            responsáveis pelo projeto.
          </Text>
        </SectionCard>

        {/* Footer */}
        <View style={{ marginTop: 24, alignItems: "center" }}>
          <Text style={{ color: "#ddd", fontSize: 12 }}>
            © 2025 {appData.institution}
          </Text>
          <Text style={{ color: "#ddd", fontSize: 11, marginTop: 4 }}>
            Todos os direitos reservados · INPI {appData.inpi.processo}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
