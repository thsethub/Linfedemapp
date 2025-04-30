import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";

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
  const [visible, setVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const listRef = useRef<FlatList>(null);

  const getDaysInMonth = (year: number, month: number) =>
    new Date(year, month, 0).getDate();

  const currentYear = new Date().getFullYear(); // Obtém o ano atual dinamicamente

  const data =
    type === "month"
      ? Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"))
      : type === "year"
      ? Array.from(
          { length: currentYear - 1900 + 1 }, // Gera anos de 1900 até o ano atual
          (_, i) => String(currentYear - i) // Gera em ordem decrescente
        )
      : type === "day" && selectedYear && selectedMonth
      ? Array.from(
          { length: getDaysInMonth(selectedYear, selectedMonth) },
          (_, i) => String(i + 1).padStart(2, "0")
        )
      : [];

  useEffect(() => {
    if (initialValue) {
      setSelectedValue(initialValue);
    }
  }, [initialValue]);

  const handleConfirm = () => {
    if (selectedValue) {
      onConfirm(selectedValue);
      setVisible(false);
    }
  };

  return (
    <>
      {/* Botão com placeholder e seta */}
      <TouchableOpacity onPress={() => setVisible(true)} style={styles.button}>
        <Text style={styles.buttonText}>{selectedValue || placeholder}</Text>
        <Feather name="chevron-down" size={16} color="#000" />
      </TouchableOpacity>

      {/* Modal do Picker */}
      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.pickerContainer}>
            <Text style={styles.title}>{title}</Text>
            <FlatList
              ref={listRef}
              data={data}
              keyExtractor={(item) => item}
              showsVerticalScrollIndicator={false}
              style={{ maxHeight: 200 }} // Limita a altura do modal
              contentContainerStyle={{ paddingVertical: 10 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => setSelectedValue(item)}
                  style={styles.itemContainer}
                >
                  <Text
                    style={[
                      styles.itemText,
                      item === selectedValue && styles.selectedItemText,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity
                onPress={() => setVisible(false)}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirm}
                style={styles.confirmButton}
              >
                <Text style={styles.confirmButtonText}>Confirmar</Text>
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  pickerContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  itemContainer: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  itemText: {
    fontSize: 14,
    color: "#A9A9A9",
  },
  selectedItemText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#b41976",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    padding: 8,
    marginHorizontal: 5,
    backgroundColor: "#ccc",
    borderRadius: 5,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#000",
    fontWeight: "bold",
  },
  confirmButton: {
    flex: 1,
    padding: 8,
    marginHorizontal: 5,
    backgroundColor: "#b41976",
    borderRadius: 5,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default SinglePicker;