import React from "react";
import { View, Text, TextInput } from "react-native";
import Dropdown from "@/components/dropdown2"; // Ajuste o caminho conforme necessário
import { useTranslation } from "@/context/LanguageContext";

interface ProcedureDetailsProps {
  title: string;
  dropdownItems: { label: string; value: string }[];
  selectedValue: string;
  onDropdownChange: (value: string | null) => void;
  duration: string;
  onDurationChange: (value: string) => void;
  zIndex: number; // <- novo!
  open: boolean;
  setOpen: (isOpen: boolean) => void;
}

const ProcedureDetails: React.FC<ProcedureDetailsProps> = ({
  title,
  dropdownItems,
  selectedValue,
  onDropdownChange,
  duration,
  onDurationChange,
  zIndex,
}) => {
  const { t } = useTranslation();

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 16,
      }}
    >
      {/* Bloco do Dropdown */}
      <View style={{ flex: 1, marginRight: 12 }}>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>{title}</Text>
        <Dropdown
          title={t("patient.selectType")}
          items={dropdownItems}
          selectedValue={selectedValue}
          setSelectedValue={(value) => onDropdownChange(value)}
          zIndex={zIndex} // <- novo!
        />
      </View>

      {/* Bloco "Há quanto tempo?" */}
      <View style={{ alignItems: "center" }}>
        <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 10 }}>
          {t("patient.howLongAgo")}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TextInput
            placeholder="___"
            keyboardType="numeric"
            value={duration}
            onChangeText={onDurationChange}
            style={{
              width: 50,
              height: 30,
              backgroundColor: "#f8f8f8",
              borderRadius: 8,
              textAlign: "center",
              marginRight: 6,
              paddingVertical: 4,
            }}
          />
          <Text>{t("patientDetails.values.months")}</Text>
        </View>
      </View>
    </View>
  );
};

export default ProcedureDetails;
