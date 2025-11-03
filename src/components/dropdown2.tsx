import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useTranslation } from "@/context/LanguageContext";

interface DropdownProps {
  title: string;
  items: { label: string; value: string }[];
  selectedValue: string | null;
  setSelectedValue: (value: string | null) => void;
  zIndex?: number; // <- novo!
}

const Dropdown: React.FC<DropdownProps> = ({
  title,
  items,
  selectedValue,
  setSelectedValue,
  zIndex = 1000, // <- valor padrão
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <View style={[styles.container, { zIndex }]}>
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
        placeholder={t("common.select")}
        placeholderStyle={styles.placeholderStyle}
        style={styles.dropdown}
        dropDownContainerStyle={[styles.dropdownContainer, { zIndex: 1000 }]}
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
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
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
