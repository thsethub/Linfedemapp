import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  RefreshControl,
  Linking,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "../context/LanguageContext";
import { useLanguage } from "../context/LanguageContext";
import {
  getNews,
  refreshNews,
  filterByTopic,
  NewsArticle,
  TOPICS,
} from "../utils/newsService";

const ITEMS_PER_PAGE = 10;

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr.slice(0, 10);
  }
}

function getFaviconUri(sourceUrl: string, link: string): string | null {
  const url = sourceUrl || link;
  if (!url) return null;
  try {
    const domain = new URL(url).hostname;
    if (!domain || domain === "news.google.com") return null;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  } catch {
    return null;
  }
}

function NewsCard({
  article,
  onPress,
}: {
  article: NewsArticle;
  onPress: () => void;
}) {
  const faviconUri = getFaviconUri(article.sourceUrl, article.link);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={{
        backgroundColor: "#fff",
        borderRadius: 16,
        marginBottom: 14,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOpacity: 0.07,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 3,
      }}
    >
      {article.thumbnail ? (
        <Image
          source={{ uri: article.thumbnail }}
          style={{ width: "100%", height: 150 }}
          resizeMode="cover"
        />
      ) : (
        <View
          style={{
            width: "100%",
            height: 72,
            backgroundColor: "#F9E8F4",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 16,
          }}
        >
          {faviconUri ? (
            <>
              <Image
                source={{ uri: faviconUri }}
                style={{ width: 40, height: 40, borderRadius: 8, marginRight: 10 }}
                resizeMode="contain"
              />
              {article.source ? (
                <Text
                  style={{ fontSize: 13, color: "#B91C7C", fontWeight: "600", flexShrink: 1 }}
                  numberOfLines={1}
                >
                  {article.source}
                </Text>
              ) : null}
            </>
          ) : (
            <Feather name="file-text" size={28} color="#B91C7C" />
          )}
        </View>
      )}

      <View style={{ padding: 14 }}>
        <Text
          style={{
            fontSize: 15,
            fontWeight: "700",
            color: "#111827",
            marginBottom: 6,
            lineHeight: 21,
          }}
          numberOfLines={3}
        >
          {article.title}
        </Text>

        {article.description ? (
          <Text
            style={{ fontSize: 13, color: "#6B7280", lineHeight: 19, marginBottom: 10 }}
            numberOfLines={2}
          >
            {article.description}
          </Text>
        ) : null}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            <Feather name="calendar" size={11} color="#9CA3AF" />
            <Text style={{ fontSize: 11, color: "#9CA3AF", marginLeft: 4 }}>
              {formatDate(article.pubDate)}
            </Text>
            {article.author ? (
              <>
                <Text style={{ fontSize: 11, color: "#D1D5DB", marginHorizontal: 5 }}>•</Text>
                <Text style={{ fontSize: 11, color: "#9CA3AF" }} numberOfLines={1}>
                  {article.author}
                </Text>
              </>
            ) : null}
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#F9E8F4",
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 20,
            }}
          >
            <Text style={{ fontSize: 12, color: "#B91C7C", fontWeight: "600", marginRight: 4 }}>
              Ler
            </Text>
            <Feather name="external-link" size={11} color="#B91C7C" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function Pagination({
  page,
  totalPages,
  onPrev,
  onNext,
}: {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 16,
      }}
    >
      <TouchableOpacity
        onPress={onPrev}
        disabled={page === 1}
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: page === 1 ? "#F3F4F6" : "#F9E8F4",
        }}
      >
        <Feather name="chevron-left" size={20} color={page === 1 ? "#D1D5DB" : "#B91C7C"} />
      </TouchableOpacity>

      <View
        style={{
          marginHorizontal: 20,
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 14, fontWeight: "700", color: "#374151" }}>
          {page} / {totalPages}
        </Text>
      </View>

      <TouchableOpacity
        onPress={onNext}
        disabled={page === totalPages}
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: page === totalPages ? "#F3F4F6" : "#F9E8F4",
        }}
      >
        <Feather name="chevron-right" size={20} color={page === totalPages ? "#D1D5DB" : "#B91C7C"} />
      </TouchableOpacity>
    </View>
  );
}

export default function News() {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);

  const [allArticles, setAllArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [page, setPage] = useState(1);

  const topicLabel = (key: string): string => {
    const topic = TOPICS[key];
    if (!topic) return key;
    if (currentLanguage === "en-US") return topic.enUS;
    if (currentLanguage === "es-ES") return topic.esES;
    return topic.ptBR;
  };

  const filtered = filterByTopic(allArticles, selectedTopic);
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const pageItems = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const loadNews = useCallback(async () => {
    setError(false);
    try {
      const data = await getNews(currentLanguage);
      setAllArticles(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [currentLanguage]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setError(false);
    try {
      const data = await refreshNews(currentLanguage);
      setAllArticles(data);
    } catch {
      setError(true);
    } finally {
      setRefreshing(false);
    }
  }, [currentLanguage]);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  // Reset to page 1 when topic or articles change
  useEffect(() => {
    setPage(1);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [selectedTopic, allArticles]);

  const goToPage = (newPage: number) => {
    setPage(newPage);
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const openArticle = (url: string) => {
    if (!url) return;
    Linking.openURL(url).catch(() =>
      Alert.alert(
        t("common.error"),
        t("news.cantOpen") || "Não foi possível abrir o artigo."
      )
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <StatusBar style="dark" />

      {/* Header */}
      <View
        style={{
          backgroundColor: "#fff",
          paddingTop: insets.top + 4,
          borderBottomWidth: 1,
          borderBottomColor: "#F3F4F6",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingBottom: 12,
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              alignItems: "center",
              justifyContent: "center",
              marginRight: 8,
            }}
          >
            <Feather name="arrow-left" size={24} color="#374151" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 18, fontWeight: "700", color: "#111827" }}>
              {t("news.title") || "Notícias"}
            </Text>
            <Text style={{ fontSize: 12, color: "#9CA3AF" }}>
              {t("news.subtitle") || "Linfedema & Linfologia"}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleRefresh}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#F9E8F4",
            }}
          >
            <Feather name="refresh-cw" size={16} color="#B91C7C" />
          </TouchableOpacity>
        </View>

        {/* Filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 12, gap: 8 }}
        >
          {Object.keys(TOPICS).map((key) => {
            const active = selectedTopic === key;
            return (
              <TouchableOpacity
                key={key}
                onPress={() => setSelectedTopic(key)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 7,
                  borderRadius: 20,
                  backgroundColor: active ? "#B91C7C" : "#F3F4F6",
                  borderWidth: active ? 0 : 1,
                  borderColor: "#E5E7EB",
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "600",
                    color: active ? "#fff" : "#6B7280",
                  }}
                >
                  {topicLabel(key)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Content */}
      {loading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color="#B91C7C" />
          <Text style={{ color: "#9CA3AF", marginTop: 12, fontSize: 14 }}>
            {t("news.loading") || "Buscando notícias..."}
          </Text>
        </View>
      ) : error ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 32 }}
        >
          <Feather name="wifi-off" size={48} color="#D1D5DB" />
          <Text
            style={{
              color: "#6B7280",
              marginTop: 16,
              fontSize: 16,
              fontWeight: "600",
              textAlign: "center",
            }}
          >
            {t("news.error") || "Não foi possível carregar as notícias."}
          </Text>
          <TouchableOpacity
            onPress={loadNews}
            style={{
              marginTop: 20,
              backgroundColor: "#B91C7C",
              borderRadius: 12,
              paddingHorizontal: 24,
              paddingVertical: 12,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "700" }}>
              {t("news.retry") || "Tentar novamente"}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={{
            padding: 16,
            paddingBottom: insets.bottom + 80,
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={["#B91C7C"]}
              tintColor="#B91C7C"
            />
          }
        >
          {/* RSS badge */}
          <View
            style={{
              backgroundColor: "#B91C7C",
              borderRadius: 12,
              padding: 14,
              marginBottom: 16,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Feather name="rss" size={18} color="#fff" style={{ marginRight: 10 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 13 }}>
                {t("news.feedTitle") || "Feed de Notícias"}
              </Text>
              <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 11, marginTop: 1 }}>
                {t("news.feedSubtitle") || "Atualizado diariamente • Google News"}
              </Text>
            </View>
            <View
              style={{
                backgroundColor: "rgba(255,255,255,0.2)",
                borderRadius: 12,
                paddingHorizontal: 10,
                paddingVertical: 4,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}>
                {filtered.length}
              </Text>
            </View>
          </View>

          {filtered.length === 0 ? (
            <View style={{ alignItems: "center", paddingTop: 40 }}>
              <Feather name="inbox" size={48} color="#D1D5DB" />
              <Text style={{ color: "#9CA3AF", marginTop: 12, fontSize: 15 }}>
                {t("news.empty") || "Nenhuma notícia encontrada."}
              </Text>
              <TouchableOpacity onPress={() => setSelectedTopic("all")} style={{ marginTop: 12 }}>
                <Text style={{ color: "#B91C7C", fontWeight: "600", fontSize: 14 }}>
                  Ver todos os artigos
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {pageItems.map((article, i) => (
                <NewsCard
                  key={`${article.link}-${i}`}
                  article={article}
                  onPress={() => openArticle(article.link)}
                />
              ))}

              <Pagination
                page={page}
                totalPages={totalPages}
                onPrev={() => goToPage(page - 1)}
                onNext={() => goToPage(page + 1)}
              />
            </>
          )}

          <Text
            style={{
              textAlign: "center",
              color: "#D1D5DB",
              fontSize: 11,
              marginTop: 4,
            }}
          >
            {t("news.source") || "Fonte: Google News via RSS"}
          </Text>
        </ScrollView>
      )}
    </View>
  );
}
