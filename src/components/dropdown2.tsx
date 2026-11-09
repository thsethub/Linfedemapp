import React from "react";
import { View } from "react-native";
import Dropdown from "./dropdown";

interface DropdownProps {
  title?: string;
  items: { label: string; value: string }[];
  selectedValue: string | null;
  setSelectedValue: (value: string | null) => void;
  zIndex?: number; // mantido por compatibilidade; a lista agora abre no fluxo da tela
}

// Variante compacta (200 px, sem título) usada em procedimentosEcapsulados.
const Dropdown2: React.FC<DropdownProps> = ({
  items,
  selectedValue,
  setSelectedValue,
}) => (
  <View style={{ alignItems: "center", marginBottom: 16 }}>
    <Dropdown
      width={200}
      items={items}
      selectedValue={selectedValue}
      setSelectedValue={setSelectedValue}
    />
  </View>
);

export default Dropdown2;
