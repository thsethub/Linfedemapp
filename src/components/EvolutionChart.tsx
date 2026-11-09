import React, { useMemo, useState } from "react";
import { View, Text, TouchableOpacity, LayoutChangeEvent } from "react-native";
import Svg, {
  Path,
  Line,
  Circle,
  Defs,
  LinearGradient,
  Stop,
  Text as SvgText,
} from "react-native-svg";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "@/context/LanguageContext";

export interface EvolutionMeasurement {
  dataAvaliacao: string; // YYYY-MM-DD
  volumesReferencia?: number[];
  volumesAfetado?: number[];
  volumeDifference?: number | null;
}

type PeriodKey = "all" | "3m" | "6m" | "12m";

const PERIODS: { key: PeriodKey; months: number | null; labelKey: string }[] = [
  { key: "all", months: null, labelKey: "periodAll" },
  { key: "3m", months: 3, labelKey: "period3m" },
  { key: "6m", months: 6, labelKey: "period6m" },
  { key: "12m", months: 12, labelKey: "period12m" },
];

const COLOR_REF = "#3B82F6";
const COLOR_AFF = "#B41976";
const CHART_HEIGHT = 220;
const PAD = { left: 54, right: 18, top: 16, bottom: 30 };
const TOOLTIP_W = 160;
const TOOLTIP_H = 88;

type Point = {
  time: number;
  label: string;
  fullDate: string;
  ref: number;
  aff: number;
  diff: number | null;
};

const sum = (values?: number[]) =>
  (values ?? []).reduce((acc, v) => acc + (Number.isFinite(v) ? v : 0), 0);

const parseDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return Date.UTC(y, (m || 1) - 1, d || 1);
};

const two = (n: number) => String(n).padStart(2, "0");

const formatDate = (time: number, withYear: boolean) => {
  const dt = new Date(time);
  const base = `${two(dt.getUTCDate())}/${two(dt.getUTCMonth() + 1)}`;
  return withYear ? `${base}/${dt.getUTCFullYear()}` : base;
};

const formatVolume = (v: number) => `${Math.round(v).toLocaleString("pt-BR")}`;

/** Escolhe 5 marcações "redondas" cobrindo [min, max]. */
function niceTicks(min: number, max: number, count = 5) {
  if (max - min < 1e-6) {
    const pad = Math.max(1, Math.abs(max) * 0.1);
    min -= pad;
    max += pad;
  }
  const rawStep = (max - min) / (count - 1);
  const mag = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const norm = rawStep / mag;
  const step = (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10) * mag;
  const start = Math.floor(min / step) * step;
  const ticks: number[] = [];
  for (let v = start; v < max + step; v += step) ticks.push(v);
  return ticks;
}

/**
 * Curva suave por interpolação cúbica monotônica (Fritsch–Carlson): passa por
 * todos os pontos e nunca "estoura" além deles, ao contrário de splines comuns.
 */
function monotonePath(pts: { x: number; y: number }[]) {
  const n = pts.length;
  if (n === 0) return "";
  if (n === 1) return `M${pts[0].x},${pts[0].y}`;
  const dx: number[] = [];
  const slope: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    dx[i] = pts[i + 1].x - pts[i].x;
    slope[i] = (pts[i + 1].y - pts[i].y) / dx[i];
  }
  const tan: number[] = new Array(n);
  tan[0] = slope[0];
  tan[n - 1] = slope[n - 2];
  for (let i = 1; i < n - 1; i++) {
    if (slope[i - 1] * slope[i] <= 0) {
      tan[i] = 0;
    } else {
      const w1 = 2 * dx[i] + dx[i - 1];
      const w2 = dx[i] + 2 * dx[i - 1];
      tan[i] = (w1 + w2) / (w1 / slope[i - 1] + w2 / slope[i]);
    }
  }
  let d = `M${pts[0].x},${pts[0].y}`;
  for (let i = 0; i < n - 1; i++) {
    const c1x = pts[i].x + dx[i] / 3;
    const c1y = pts[i].y + (tan[i] * dx[i]) / 3;
    const c2x = pts[i + 1].x - dx[i] / 3;
    const c2y = pts[i + 1].y - (tan[i + 1] * dx[i]) / 3;
    d += ` C${c1x},${c1y} ${c2x},${c2y} ${pts[i + 1].x},${pts[i + 1].y}`;
  }
  return d;
}

export default function EvolutionChart({
  measurements,
}: {
  measurements: EvolutionMeasurement[];
}) {
  const { t } = useTranslation();
  const [width, setWidth] = useState(0);
  const [period, setPeriod] = useState<PeriodKey>("all");
  const [showRef, setShowRef] = useState(true);
  const [showAff, setShowAff] = useState(true);
  const [selected, setSelected] = useState<number | null>(null);

  const all: Point[] = useMemo(
    () =>
      measurements
        .filter((m) => !!m.dataAvaliacao)
        .map((m) => {
          const time = parseDate(m.dataAvaliacao);
          const ref = sum(m.volumesReferencia);
          const aff = sum(m.volumesAfetado);
          return {
            time,
            label: formatDate(time, false),
            fullDate: formatDate(time, true),
            ref,
            aff,
            diff:
              typeof m.volumeDifference === "number"
                ? m.volumeDifference
                : ref > 0
                ? ((aff - ref) / ref) * 100
                : null,
          };
        })
        .sort((a, b) => a.time - b.time),
    [measurements]
  );

  const points = useMemo(() => {
    const p = PERIODS.find((x) => x.key === period);
    if (!p || p.months == null) return all;
    const limit = new Date();
    limit.setUTCMonth(limit.getUTCMonth() - p.months);
    return all.filter((pt) => pt.time >= limit.getTime());
  }, [all, period]);

  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

  const series = [
    { key: "ref", visible: showRef, color: COLOR_REF },
    { key: "aff", visible: showAff, color: COLOR_AFF },
  ] as const;

  // --- geometria ---
  const plotW = Math.max(width - PAD.left - PAD.right, 10);
  const plotH = CHART_HEIGHT - PAD.top - PAD.bottom;

  const visibleValues = points.flatMap((p) => [
    ...(showRef ? [p.ref] : []),
    ...(showAff ? [p.aff] : []),
  ]);
  const hasData = points.length > 0 && visibleValues.length > 0;
  const ticks = hasData
    ? niceTicks(Math.min(...visibleValues), Math.max(...visibleValues))
    : [0, 1];
  const yMin = ticks[0];
  const yMax = ticks[ticks.length - 1];

  const t0 = points.length ? points[0].time : 0;
  const t1 = points.length ? points[points.length - 1].time : 1;
  const xOf = (time: number, i: number) =>
    points.length === 1 || t1 === t0
      ? PAD.left + plotW / 2 + i * 0.001
      : PAD.left + ((time - t0) / (t1 - t0)) * plotW;
  const yOf = (v: number) =>
    PAD.top + (1 - (v - yMin) / (yMax - yMin || 1)) * plotH;

  const xs = points.map((p, i) => xOf(p.time, i));

  // Rótulos do eixo X: no máximo 1 a cada ~64 px, sempre incluindo o último
  const maxLabels = Math.max(2, Math.floor(plotW / 64));
  const labelStep = Math.max(1, Math.ceil(points.length / maxLabels));
  const labelIdx = points
    .map((_, i) => i)
    .filter((i) => i % labelStep === 0 || i === points.length - 1);
  // Mantém sempre o último rótulo e descarta os anteriores que ficarem a < 56 px
  const filteredLabelIdx: number[] = [];
  for (let k = labelIdx.length - 1; k >= 0; k--) {
    const i = labelIdx[k];
    const last = filteredLabelIdx[0];
    if (last === undefined || xs[last] - xs[i] >= 56) filteredLabelIdx.unshift(i);
  }

  const sel = selected != null && points[selected] ? points[selected] : null;
  const selX = sel ? xs[selected as number] : 0;
  const selY = sel
    ? yOf(
        showAff && showRef
          ? Math.max(sel.aff, sel.ref)
          : showAff
          ? sel.aff
          : sel.ref
      )
    : 0;
  const tipLeft = Math.min(
    Math.max(selX - TOOLTIP_W / 2, 4),
    Math.max(width - TOOLTIP_W - 4, 4)
  );
  const tipTop = selY - TOOLTIP_H - 12 >= 0 ? selY - TOOLTIP_H - 12 : selY + 14;

  const toggle = (which: "ref" | "aff") => {
    // ao menos uma série permanece visível
    if (which === "ref") {
      if (showRef && !showAff) return;
      setShowRef(!showRef);
    } else {
      if (showAff && !showRef) return;
      setShowAff(!showAff);
    }
  };

  const Chip = ({
    active,
    onPress,
    children,
    color = COLOR_AFF,
    icon,
  }: {
    active: boolean;
    onPress: () => void;
    children: React.ReactNode;
    color?: string;
    icon?: React.ReactNode;
  }) => (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      activeOpacity={0.7}
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: active ? color : "#D1D5DB",
        backgroundColor: active ? `${color}14` : "#FFFFFF",
        marginRight: 8,
        marginBottom: 8,
      }}
    >
      {icon}
      <Text
        style={{
          fontSize: 12,
          fontWeight: "600",
          color: active ? color : "#6B7280",
        }}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View>
      {/* Filtro de período */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
        <Feather name="calendar" size={14} color="#6B7280" />
        <Text
          style={{ fontSize: 12, fontWeight: "600", color: "#6B7280", marginLeft: 6 }}
        >
          {t("patientDetails.chart.period")}
        </Text>
      </View>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {PERIODS.map((p) => (
          <Chip
            key={p.key}
            active={period === p.key}
            onPress={() => {
              setPeriod(p.key);
              setSelected(null);
            }}
          >
            {t(`patientDetails.chart.${p.labelKey}`)}
          </Chip>
        ))}
      </View>

      {/* Cartão do gráfico */}
      <View
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 14,
          borderWidth: 1,
          borderColor: "#E5E7EB",
          padding: 12,
          marginTop: 4,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", flexShrink: 1 }}>
            <Feather name="activity" size={16} color="#374151" />
            <Text
              style={{
                fontSize: 14,
                fontWeight: "700",
                color: "#374151",
                marginLeft: 6,
              }}
              numberOfLines={1}
            >
              {t("patientDetails.chart.title")}
            </Text>
          </View>
          <Text style={{ fontSize: 11, color: "#6B7280" }}>
            {t("patientDetails.chart.volumeUnit")}
          </Text>
        </View>

        {/* Séries (tocar liga/desliga) */}
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          <Chip
            active={showRef}
            color={COLOR_REF}
            onPress={() => toggle("ref")}
            icon={
              <Feather
                name={showRef ? "check-circle" : "circle"}
                size={13}
                color={showRef ? COLOR_REF : "#9CA3AF"}
                style={{ marginRight: 6 }}
              />
            }
          >
            {t("patientDetails.chart.referenceLimb")}
          </Chip>
          <Chip
            active={showAff}
            color={COLOR_AFF}
            onPress={() => toggle("aff")}
            icon={
              <Feather
                name={showAff ? "check-circle" : "circle"}
                size={13}
                color={showAff ? COLOR_AFF : "#9CA3AF"}
                style={{ marginRight: 6 }}
              />
            }
          >
            {t("patientDetails.chart.affectedLimb")}
          </Chip>
        </View>

        <View onLayout={onLayout} style={{ width: "100%", height: CHART_HEIGHT }}>
          {width > 0 && !hasData && (
            <View
              style={{
                height: CHART_HEIGHT,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Feather name="inbox" size={26} color="#9CA3AF" />
              <Text style={{ color: "#6B7280", marginTop: 6, textAlign: "center" }}>
                {t("patientDetails.chart.emptyPeriod")}
              </Text>
            </View>
          )}

          {width > 0 && hasData && (
            <>
              <Svg width={width} height={CHART_HEIGHT}>
                <Defs>
                  <LinearGradient id="areaAff" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor={COLOR_AFF} stopOpacity={0.22} />
                    <Stop offset="1" stopColor={COLOR_AFF} stopOpacity={0} />
                  </LinearGradient>
                  <LinearGradient id="areaRef" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor={COLOR_REF} stopOpacity={0.18} />
                    <Stop offset="1" stopColor={COLOR_REF} stopOpacity={0} />
                  </LinearGradient>
                </Defs>

                {/* Grade e eixo Y */}
                {ticks.map((tick) => (
                  <React.Fragment key={`g-${tick}`}>
                    <Line
                      x1={PAD.left}
                      x2={PAD.left + plotW}
                      y1={yOf(tick)}
                      y2={yOf(tick)}
                      stroke="#EEF0F3"
                      strokeWidth={1}
                    />
                    <SvgText
                      x={PAD.left - 8}
                      y={yOf(tick) + 4}
                      fontSize={10}
                      fill="#6B7280"
                      textAnchor="end"
                    >
                      {formatVolume(tick)}
                    </SvgText>
                  </React.Fragment>
                ))}

                {/* Eixo X */}
                {filteredLabelIdx.map((i) => (
                  <SvgText
                    key={`x-${i}`}
                    x={xs[i]}
                    y={CHART_HEIGHT - 8}
                    fontSize={10}
                    fill="#6B7280"
                    textAnchor="middle"
                  >
                    {points[i].label}
                  </SvgText>
                ))}

                {/* Guia vertical do ponto selecionado */}
                {sel && (
                  <Line
                    x1={selX}
                    x2={selX}
                    y1={PAD.top}
                    y2={PAD.top + plotH}
                    stroke="#9CA3AF"
                    strokeDasharray="4 4"
                    strokeWidth={1}
                  />
                )}

                {/* Áreas e linhas suaves */}
                {series.map((s) => {
                  if (!s.visible) return null;
                  const pts = points.map((p, i) => ({
                    x: xs[i],
                    y: yOf(s.key === "ref" ? p.ref : p.aff),
                  }));
                  const line = monotonePath(pts);
                  const area =
                    pts.length > 1
                      ? `${line} L${pts[pts.length - 1].x},${PAD.top + plotH} L${pts[0].x},${
                          PAD.top + plotH
                        } Z`
                      : "";
                  return (
                    <React.Fragment key={`s-${s.key}`}>
                      {area ? (
                        <Path
                          d={area}
                          fill={`url(#${s.key === "ref" ? "areaRef" : "areaAff"})`}
                        />
                      ) : null}
                      {pts.length > 1 && (
                        <Path
                          d={line}
                          stroke={s.color}
                          strokeWidth={2.5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                        />
                      )}
                    </React.Fragment>
                  );
                })}

                {/* Pontos (área de toque maior que o ponto visível) */}
                {points.map((p, i) =>
                  series.map((s) => {
                    if (!s.visible) return null;
                    const v = s.key === "ref" ? p.ref : p.aff;
                    const active = selected === i;
                    return (
                      <React.Fragment key={`p-${s.key}-${i}`}>
                        <Circle
                          cx={xs[i]}
                          cy={yOf(v)}
                          r={active ? 6 : 4}
                          fill="#FFFFFF"
                          stroke={s.color}
                          strokeWidth={2.5}
                        />
                      </React.Fragment>
                    );
                  })
                )}
              </Svg>

              {/* Áreas de toque dos pontos (onPress em SVG não funciona na web) */}
              {points.map((p, i) =>
                series.map((s) => {
                  if (!s.visible) return null;
                  const v = s.key === "ref" ? p.ref : p.aff;
                  return (
                    <TouchableOpacity
                      key={`hit-${s.key}-${i}`}
                      accessibilityRole="button"
                      accessibilityLabel={`${p.fullDate}`}
                      activeOpacity={0.6}
                      onPress={() => setSelected(selected === i ? null : i)}
                      style={{
                        position: "absolute",
                        left: xs[i] - 16,
                        top: yOf(v) - 16,
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                      }}
                    />
                  );
                })
              )}

              {/* Detalhe do ponto selecionado */}
              {sel && (
                <View
                  style={{
                    pointerEvents: "none",
                    position: "absolute",
                    left: tipLeft,
                    top: tipTop,
                    width: TOOLTIP_W,
                    height: TOOLTIP_H,
                    backgroundColor: "#111827",
                    borderRadius: 10,
                    paddingHorizontal: 10,
                    paddingVertical: 8,
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Feather name="calendar" size={12} color="#D1D5DB" />
                    <Text
                      style={{
                        color: "#FFFFFF",
                        fontSize: 12,
                        fontWeight: "700",
                        marginLeft: 6,
                      }}
                    >
                      {sel.fullDate}
                    </Text>
                  </View>
                  {showRef && (
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <View
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: COLOR_REF,
                          marginRight: 6,
                        }}
                      />
                      <Text style={{ color: "#E5E7EB", fontSize: 11 }}>
                        {formatVolume(sel.ref)} cm³
                      </Text>
                    </View>
                  )}
                  {showAff && (
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <View
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: COLOR_AFF,
                          marginRight: 6,
                        }}
                      />
                      <Text style={{ color: "#E5E7EB", fontSize: 11 }}>
                        {formatVolume(sel.aff)} cm³
                      </Text>
                    </View>
                  )}
                  {sel.diff != null && (
                    <Text style={{ color: "#FBCFE8", fontSize: 11, fontWeight: "600" }}>
                      {t("patientDetails.chart.difference")}: {sel.diff.toFixed(1)}%
                    </Text>
                  )}
                </View>
              )}
            </>
          )}
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 6,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", flexShrink: 1 }}>
            <Feather name="info" size={12} color="#9CA3AF" />
            <Text style={{ fontSize: 11, color: "#6B7280", marginLeft: 5 }}>
              {t("patientDetails.chart.hint")}
            </Text>
          </View>
          <Text style={{ fontSize: 11, color: "#6B7280" }}>
            {t("patientDetails.chart.measurementsCount").replace(
              "{count}",
              String(points.length)
            )}
          </Text>
        </View>
      </View>
    </View>
  );
}
