import AsyncStorage from "@react-native-async-storage/async-storage";

const CACHE_KEY = "news_cache_v4";
const CACHE_DATE_KEY = "news_cache_date_v4";

export interface NewsArticle {
  title: string;
  link: string;
  pubDate: string;
  author: string;
  thumbnail: string;
  description: string;
  source: string;
  sourceUrl: string;
}

const BASE_QUERIES: Record<string, string> = {
  "pt-BR": "linfedema OR linfologia OR linfático OR linfonodo",
  "en-US": "lymphedema OR lymphology OR lymphatic OR lymph+node",
  "es-ES": "linfedema OR linfología OR linfático OR ganglio",
};

export const TOPICS: Record<string, { ptBR: string; enUS: string; esES: string; query: string }> = {
  all: { ptBR: "Todos", enUS: "All", esES: "Todos", query: "" },
  lymphedema: {
    ptBR: "Linfedema",
    enUS: "Lymphedema",
    esES: "Linfedema",
    query: "linfedema OR lymphedema OR linfologia OR lymphology",
  },
  treatment: {
    ptBR: "Tratamento",
    enUS: "Treatment",
    esES: "Tratamiento",
    query: "tratamento OR treatment OR terapia OR therapy OR drenagem OR drainage OR fisioterapia",
  },
  diagnosis: {
    ptBR: "Diagnóstico",
    enUS: "Diagnosis",
    esES: "Diagnóstico",
    query: "diagnóstico OR diagnosis OR avaliação OR assessment OR estadio OR staging",
  },
  research: {
    ptBR: "Pesquisa",
    enUS: "Research",
    esES: "Investigación",
    query: "pesquisa OR research OR estudo OR study OR ensaio OR trial OR ciência OR science",
  },
  prevention: {
    ptBR: "Prevenção",
    enUS: "Prevention",
    esES: "Prevención",
    query: "prevenção OR prevention OR risco OR risk OR cuidados OR care",
  },
};

function buildRssUrl(lang: string): string {
  const q = encodeURIComponent(BASE_QUERIES[lang] ?? BASE_QUERIES["pt-BR"]);
  const hl = lang === "pt-BR" ? "pt-BR" : lang === "es-ES" ? "es" : "en-US";
  const gl = lang === "pt-BR" ? "BR" : lang === "es-ES" ? "ES" : "US";
  const ceid = lang === "pt-BR" ? "BR:pt-BR" : lang === "es-ES" ? "ES:es" : "US:en";
  return `https://news.google.com/rss/search?q=${q}&hl=${hl}&gl=${gl}&ceid=${ceid}`;
}

// Decode entities FIRST, then strip tags — fixes "&lt;a href...&gt;" showing as text
function stripHtml(html: string): string {
  const decoded = html
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
  return decoded.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function extractXmlTag(block: string, tag: string): string {
  const t = tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const cdataRe = new RegExp(`<${t}(?:\\s[^>]*)?><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${t}>`, "i");
  const cm = cdataRe.exec(block);
  if (cm) return cm[1].trim();
  const re = new RegExp(`<${t}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${t}>`, "i");
  const m = re.exec(block);
  if (m) return m[1].trim();
  return "";
}

// Extract an attribute value from an XML tag, e.g. <source url="...">
function extractAttr(block: string, tag: string, attr: string): string {
  const t = tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`<${t}[^>]*\\s${attr}="([^"]*)"`, "i");
  const m = re.exec(block);
  return m ? m[1] : "";
}

function extractThumbnail(rawDescription: string): string {
  const m = /<img[^>]*src="([^"]+)"/i.exec(rawDescription);
  return m ? m[1] : "";
}

function parseRssItems(xml: string): NewsArticle[] {
  const items: NewsArticle[] = [];
  const itemRe = /<item>([\s\S]*?)<\/item>/g;
  let m: RegExpExecArray | null;

  while ((m = itemRe.exec(xml)) !== null) {
    const block = m[1];
    const title = stripHtml(extractXmlTag(block, "title"));
    const link = extractXmlTag(block, "link") || extractXmlTag(block, "guid");
    const pubDate = extractXmlTag(block, "pubDate");
    const rawDescription = extractXmlTag(block, "description");
    const thumbnail = extractThumbnail(rawDescription);
    const description = stripHtml(rawDescription).slice(0, 200);
    const source = stripHtml(extractXmlTag(block, "source"));
    const sourceUrl = extractAttr(block, "source", "url");

    if (title) {
      items.push({ title, link, pubDate, author: source || "", thumbnail, description, source, sourceUrl });
    }
  }

  return items;
}

async function fetchFromRSS(lang: string): Promise<NewsArticle[]> {
  const rssUrl = buildRssUrl(lang);

  try {
    const res = await fetch(rssUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36",
        Accept: "application/rss+xml, application/xml, text/xml, */*",
      },
    });
    if (res.ok) {
      const xml = await res.text();
      if (xml.includes("<item>")) {
        const articles = parseRssItems(xml);
        if (articles.length > 0) return articles;
      }
    }
  } catch {
    // fall through to rss2json fallback
  }

  // Fallback: rss2json.com
  const fallbackUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}&count=50`;
  const res = await fetch(fallbackUrl, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`RSS fetch failed: ${res.status}`);
  const json = await res.json();
  if (json.status !== "ok") throw new Error("RSS2JSON error");

  return (json.items ?? []).map((item: any) => ({
    title: stripHtml(item.title ?? ""),
    link: item.link ?? "",
    pubDate: item.pubDate ?? "",
    author: item.author ? stripHtml(item.author) : "",
    thumbnail: item.thumbnail ?? item.enclosure?.link ?? "",
    description: stripHtml(item.description ?? item.content ?? "").slice(0, 200),
    source: item.source ?? "",
    sourceUrl: "",
  }));
}

export async function getNews(lang: string): Promise<NewsArticle[]> {
  const today = new Date().toDateString();
  try {
    const cachedDate = await AsyncStorage.getItem(CACHE_DATE_KEY);
    if (cachedDate === today) {
      const raw = await AsyncStorage.getItem(CACHE_KEY);
      if (raw) {
        const parsed: NewsArticle[] = JSON.parse(raw);
        if (parsed.length > 0) return parsed;
      }
    }
  } catch {
    // cache miss
  }

  const articles = await fetchFromRSS(lang);
  try {
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(articles));
    await AsyncStorage.setItem(CACHE_DATE_KEY, today);
  } catch {
    // ignore
  }
  return articles;
}

export async function refreshNews(lang: string): Promise<NewsArticle[]> {
  const articles = await fetchFromRSS(lang);
  try {
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(articles));
    await AsyncStorage.setItem(CACHE_DATE_KEY, new Date().toDateString());
  } catch {
    // ignore
  }
  return articles;
}

export function filterByTopic(articles: NewsArticle[], topicKey: string): NewsArticle[] {
  if (topicKey === "all" || !TOPICS[topicKey]) return articles;
  const keywords = TOPICS[topicKey].query
    .split(/\s+OR\s+/i)
    .map((k) => k.toLowerCase().trim());
  return articles.filter((a) => {
    const text = (a.title + " " + a.description).toLowerCase();
    return keywords.some((kw) => text.includes(kw));
  });
}
