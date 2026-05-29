import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { useTranslation } from "@/context/LanguageContext";
import WheelColumn from "@/components/WheelColumn";

interface DatePickerProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (date: string) => void;
  initialDate?: string; // Data inicial opcional no formato "DD/MM/AAAA"
}

const pad = (n: number) => String(n).padStart(2, "0");

const DatePicker: React.FC<DatePickerProps> = ({
  visible,
  onClose,
  onConfirm,
  initialDate,
}) => {
  const { t } = useTranslation();
  const today = new Date();

  const [selectedYear, setSelectedYear] = useState<number>(
    today.getFullYear()
  );
  const [selectedMonth, setSelectedMonth] = useState<number>(
    today.getMonth() + 1
  );
  const [selectedDay, setSelectedDay] = useState<number>(today.getDate());

  // Anos de (atual - 100) até o ano atual, em ordem crescente.
  const years = Array.from(
    { length: 101 },
    (_, i) => today.getFullYear() - 100 + i
  );
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const getDaysInMonth = (year: number, month: number) =>
    new Date(year, month, 0).getDate();

  const days = Array.from(
    { length: getDaysInMonth(selectedYear, selectedMonth) },
    (_, i) => i + 1
  );

  // Ao abrir: posiciona nos valores de initialDate, ou na data de hoje.
  useEffect(() => {
    if (!visible) return;
    if (initialDate) {
      const [day, month, year] = initialDate.split("/").map(Number);
      if (day && month && year) {
        setSelectedYear(year);
        setSelectedMonth(month);
        setSelectedDay(day);
        return;
      }
    }
    setSelectedYear(today.getFullYear());
    setSelectedMonth(today.getMonth() + 1);
    setSelectedDay(today.getDate());
  }, [visible, initialDate]);

  // Garante que o dia selecionado seja válido ao mudar mês/ano.
  useEffect(() => {
    const maxDay = getDaysInMonth(selectedYear, selectedMonth);
    if (selectedDay > maxDay) {
      setSelectedDay(maxDay);
    }
  }, [selectedYear, selectedMonth]);

  const handleConfirm = () => {
    const formattedDate = `${pad(selectedDay)}/${pad(
      selectedMonth
    )}/${selectedYear}`;
    onConfirm(formattedDate);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.pickerContainer}>
          <Text style={styles.title}>{t("patient.selectDate")}</Text>

          <View style={styles.pickerRow}>
            <WheelColumn
              data={days.map(pad)}
              selectedValue={pad(selectedDay)}
              onChange={(v) => setSelectedDay(Number(v))}
              visible={visible}
            />
            <WheelColumn
              data={months.map(pad)}
              selectedValue={pad(selectedMonth)}
              onChange={(v) => setSelectedMonth(Number(v))}
              visible={visible}
            />
            <WheelColumn
              data={years.map(String)}
              selectedValue={String(selectedYear)}
              onChange={(v) => setSelectedYear(Number(v))}
              visible={visible}
            />
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>{t("common.cancel")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleConfirm}
              style={styles.confirmButton}
            >
              <Text style={styles.confirmButtonText}>{t("common.confirm")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  pickerContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#111827",
  },
  pickerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    marginHorizontal: 5,
    backgroundColor: "#eee",
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#444",
    fontWeight: "bold",
  },
  confirmButton: {
    flex: 1,
    padding: 12,
    marginHorizontal: 5,
    backgroundColor: "#b41976",
    borderRadius: 8,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default DatePicker;
