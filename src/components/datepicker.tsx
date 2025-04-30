import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
} from "react-native";

interface DatePickerProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (date: string) => void;
  initialDate?: string; // Data inicial opcional no formato "DD/MM/AAAA"
}

const DatePicker: React.FC<DatePickerProps> = ({
  visible,
  onClose,
  onConfirm,
  initialDate,
}) => {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const yearListRef = useRef<FlatList>(null);
  const monthListRef = useRef<FlatList>(null);
  const dayListRef = useRef<FlatList>(null);

  const years = Array.from(
    { length: 101 },
    (_, i) => new Date().getFullYear() - 100 + i
  );
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const getDaysInMonth = (year: number, month: number) =>
    new Date(year, month, 0).getDate();

  const days =
    selectedYear && selectedMonth
      ? Array.from(
          { length: getDaysInMonth(selectedYear, selectedMonth) },
          (_, i) => i + 1
        )
      : [];

  useEffect(() => {
    if (visible && initialDate) {
      const [day, month, year] = initialDate.split("/").map(Number);
      setSelectedYear(year);
      setSelectedMonth(month);
      setSelectedDay(day);

      setTimeout(() => {
        yearListRef.current?.scrollToIndex({
          index: years.indexOf(year),
          animated: false,
        });
        monthListRef.current?.scrollToIndex({
          index: month - 1,
          animated: false,
        });
        dayListRef.current?.scrollToIndex({ index: day - 1, animated: false });
      }, 100);
    }
  }, [visible, initialDate]);

  const handleConfirm = () => {
    if (selectedYear && selectedMonth && selectedDay) {
      const formattedDate = `${String(selectedDay).padStart(2, "0")}/${String(
        selectedMonth
      ).padStart(2, "0")}/${selectedYear}`;
      onConfirm(formattedDate);
      onClose();
    }
  };

  const renderPicker = (
    data: number[],
    selectedValue: number | null,
    onValueChange: (value: number) => void,
    listRef: React.RefObject<FlatList>
  ) => (
    <FlatList
      ref={listRef}
      data={data}
      keyExtractor={(item) => item.toString()}
      showsVerticalScrollIndicator={false}
      snapToAlignment="center"
      snapToInterval={50}
      decelerationRate="fast"
      getItemLayout={(_, index) => ({
        length: 50,
        offset: 50 * index,
        index,
      })}
      contentContainerStyle={{ paddingVertical: 100 }}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => onValueChange(item)}
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
  );

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.pickerContainer}>
          <Text style={styles.title}>Selecione a Data</Text>
          <View style={styles.pickerRow}>
            <View style={styles.pickerColumn}>
              {renderPicker(years, selectedYear, setSelectedYear, yearListRef)}
            </View>
            <View style={styles.pickerColumn}>
              {renderPicker(
                months,
                selectedMonth,
                setSelectedMonth,
                monthListRef
              )}
            </View>
            <View style={styles.pickerColumn}>
              {renderPicker(days, selectedDay, setSelectedDay, dayListRef)}
            </View>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={onClose} style={styles.button}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleConfirm} style={styles.button}>
              <Text style={styles.buttonText}>Confirmar</Text>
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
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  pickerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  pickerColumn: {
    flex: 1,
    height: 200,
    alignItems: "center",
  },
  itemContainer: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  itemText: {
    fontSize: 16,
    color: "#A9A9A9",
  },
  selectedItemText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#b41976",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
  },
  button: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: "#b41976",
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default DatePicker;
