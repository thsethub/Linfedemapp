import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useTranslation } from "@/context/LanguageContext";
import WheelColumn from "@/components/WheelColumn";

interface SinglePickerProps {
  title: string; // Título acima do dropdown
  type: "month" | "year" | "day"; // Define o tipo do picker
  initialValue?: string; // Valor inicial opcional
  placeholder: string; // Placeholder para o botão
  onConfirm: (value: string) => void; // Callback para o valor selecionado
  selectedMonth?: number; // Mês selecionado (necessário para calcular os dias)
  selectedYear?: number; // Ano selecionado (necessário para calcular os dias)
}

const SinglePicker: React.FC<SinglePickerProps> = ({
  title,
  type,
  initialValue,
  placeholder,
  onConfirm,
  selectedMonth,
  selectedYear,
}) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | null>(
    initialValue ?? null
  );
  // Valor "ativo" enquanto o modal está aberto (antes de confirmar).
  const [tempValue, setTempValue] = useState<string | null>(null);

  const getDaysInMonth = (year: number, month: number) =>
    new Date(year, month, 0).getDate();

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const data =
    type === "month"
      ? Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"))
      : type === "year"
      ? Array.from({ length: currentYear - 1900 + 1 }, (_, i) =>
          String(currentYear - i)
        ) // Anos do atual (topo) até 1900
      : type === "day" && selectedYear && selectedMonth
      ? Array.from({ length: getDaysInMonth(selectedYear, selectedMonth) }, (_, i) =>
          String(i + 1).padStart(2, "0")
        )
      : [];

  useEffect(() => {
    if (initialValue) {
      setSelectedValue(initialValue);
    }
  }, [initialValue]);

  // Valor padrão ao abrir: o já selecionado, ou a data atual (mês/ano), ou o primeiro item.
  const defaultValue = () => {
    if (selectedValue && data.includes(selectedValue)) return selectedValue;
    if (type === "month") return String(currentMonth).padStart(2, "0");
    if (type === "year") return String(currentYear);
    return data[0] ?? null;
  };

  const openModal = () => {
    setTempValue(defaultValue());
    setVisible(true);
  };

  const handleConfirm = () => {
    if (tempValue) {
      setSelectedValue(tempValue);
      onConfirm(tempValue);
    }
    setVisible(false);
  };

  return (
    <>
      {/* Botão com placeholder e seta */}
      <TouchableOpacity onPress={openModal} style={styles.button}>
        <Text
          style={[styles.buttonText, selectedValue && styles.buttonTextFilled]}
        >
          {selectedValue || placeholder}
        </Text>
        <Feather name="chevron-down" size={16} color="#000" />
      </TouchableOpacity>

      {/* Modal do Picker */}
      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.pickerContainer}>
            <Text style={styles.title}>{title}</Text>

            <View style={styles.wheelRow}>
              <WheelColumn
                data={data}
                selectedValue={tempValue}
                onChange={setTempValue}
                visible={visible}
              />
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                onPress={() => setVisible(false)}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelButtonText}>{t("common.cancel")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirm}
                style={styles.confirmButton}
              >
                <Text style={styles.confirmButtonText}>
                  {t("common.confirm")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#f8f8f8",
    width: "30%",
    marginRight: 8,
  },
  buttonText: {
    color: "#B0B0B0",
    fontSize: 14,
    marginRight: 10,
  },
  buttonTextFilled: {
    color: "#000",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  pickerContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#111827",
  },
  wheelRow: {
    flexDirection: "row",
    width: "60%",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    padding: 10,
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
    padding: 10,
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

export default SinglePicker;
