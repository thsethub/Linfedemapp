import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

interface DropdownProps {
  title: string; // Nome acima do dropdown
  items: { label: string; value: string }[]; // Itens do dropdown
  selectedValue: string | null; // Valor selecionado
  setSelectedValue: (value: string | null) => void; // Função para atualizar o valor selecionado
}

const Dropdown: React.FC<DropdownProps> = ({
  title,
  items,
  selectedValue,
  setSelectedValue,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.container}>
      <DropDownPicker
        open={open}
        value={selectedValue}
        items={items}
        setOpen={setOpen}
        setValue={(callback) =>
          setSelectedValue(
            typeof callback === "function" ? callback(selectedValue) : callback
          )
        }
        placeholder="Selecionar"
        placeholderStyle={styles.placeholderStyle}
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
        listItemContainerStyle={styles.listItemContainer}
        labelStyle={styles.labelStyle}
        dropDownDirection="BOTTOM"
      />
      <View style={[styles.contentBelow, open && { marginTop: 120 }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontWeight: "600",
    alignSelf: "flex-start",
  },
  dropdown: {
    width: 200,
    marginVertical: 10,
    borderColor: "#cdcdcd",
    backgroundColor: "#f8f8f8",
    zIndex: 1000,
  },
  dropdownContainer: {
    width: 200,
    borderColor: "#cdcdcd",
    zIndex: 1000,
  },
  contentBelow: {
    // marginTop: 10,
    zIndex: 1,
  },
  placeholderStyle: {
    color: "#B0B0B0",
  },
  listItemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    backgroundColor: "#f8f8f8",
  },
  labelStyle: {
    color: "#000000",
  },
});

export default Dropdown;