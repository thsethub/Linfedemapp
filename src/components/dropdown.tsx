import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "@/context/LanguageContext";

interface DropdownProps {
  title?: string; // Nome acima do dropdown (omitido se vazio)
  width?: number; // Largura do campo (padrão 300)
  items: { label: string; value: string }[]; // Itens do dropdown
  selectedValue: string | null; // Valor selecionado
  setSelectedValue: (value: string | null) => void; // Função para atualizar o valor selecionado
}

// A lista abre DENTRO do fluxo da tela (empurra o conteúdo abaixo) em vez de
// flutuar por cima: a versão com posição absoluta cobria o campo seguinte e
// ficava cortada no fim da tela, principalmente na web.
const ITEM_HEIGHT = 42;
const LIST_MAX_HEIGHT = 210;

const Dropdown: React.FC<DropdownProps> = ({
  title,
  items,
  selectedValue,
  setSelectedValue,
  width = 300,
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const selected = items.find((item) => item.value === selectedValue);

  return (
    <View style={styles.container}>
      {!!title && <Text style={styles.title}>{title}</Text>}
      <View style={[styles.box, { width }]}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityState={{ expanded: open }}
          activeOpacity={0.7}
          onPress={() => setOpen((o) => !o)}
          style={[styles.field, open && styles.fieldOpen]}
        >
          <Text
            numberOfLines={1}
            style={selected ? styles.value : styles.placeholder}
          >
            {selected ? selected.label : t("common.select")}
          </Text>
          <Feather
            name={open ? "chevron-up" : "chevron-down"}
            size={20}
            color="#555"
          />
        </TouchableOpacity>

        {open && (
          <ScrollView
            nestedScrollEnabled
            style={styles.list}
            keyboardShouldPersistTaps="handled"
          >
            {items.map((item, index) => {
              const isSelected = item.value === selectedValue;
              return (
                <TouchableOpacity
                  key={item.value}
                  accessibilityRole="menuitem"
                  activeOpacity={0.7}
                  onPress={() => {
                    setSelectedValue(item.value);
                    setOpen(false);
                  }}
                  style={[
                    styles.option,
                    index < items.length - 1 && styles.optionDivider,
                    isSelected && styles.optionSelected,
                  ]}
                >
                  <Text
                    style={[styles.optionText, isSelected && styles.optionTextSelected]}
                    numberOfLines={1}
                  >
                    {item.label}
                  </Text>
                  {isSelected && (
                    <Feather name="check" size={18} color="#B41976" />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
  },
  title: {
    fontWeight: "600",
    alignSelf: "flex-start",
  },
  box: {
    maxWidth: "100%",
    marginVertical: 10,
  },
  field: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#cdcdcd",
    borderRadius: 8,
    backgroundColor: "#f8f8f8",
  },
  fieldOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderColor: "#B41976",
  },
  value: {
    flex: 1,
    color: "#000000",
  },
  placeholder: {
    flex: 1,
    color: "#B0B0B0",
  },
  list: {
    maxHeight: LIST_MAX_HEIGHT,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: "#B41976",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: "#f8f8f8",
  },
  option: {
    minHeight: ITEM_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    backgroundColor: "#f8f8f8",
  },
  optionDivider: {
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  optionSelected: {
    backgroundColor: "#FCE4EC",
  },
  optionText: {
    flex: 1,
    color: "#000000",
  },
  optionTextSelected: {
    color: "#B41976",
    fontWeight: "600",
  },
});

export default Dropdown;
