import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";

interface ReferenceSelectorProps {
  title: string; // Título acima das opções
  items: { label: string; value: string; image: any }[]; // Itens com label, valor e imagem
  selectedValue: string | null; // Valor selecionado
  setSelectedValue: (value: string) => void; // Função para atualizar o valor selecionado
}

const ReferenceSelector: React.FC<ReferenceSelectorProps> = ({
  title,
  items,
  selectedValue,
  setSelectedValue,
}) => {
  // Define o primeiro item como selecionado por padrão
  useEffect(() => {
    if (!selectedValue && items.length > 0) {
      setSelectedValue(items[0].value);
    }
  }, [selectedValue, items, setSelectedValue]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.optionsContainer}>
        {items.map((item) => (
          <View key={item.value} style={styles.optionWrapper}>
            <TouchableOpacity
              style={[
                styles.option,
                selectedValue === item.value && styles.selectedOption,
              ]}
              onPress={() => setSelectedValue(item.value)}
            >
              <Image source={item.image} style={styles.image} />
            </TouchableOpacity>
            <Text
              style={[
                styles.label,
                selectedValue === item.value && styles.selectedLabel,
              ]}
              numberOfLines={2}
            >
              {item.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    alignSelf: "flex-start",
    color: "#000",
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "nowrap",
    width: "100%",
  },
  optionWrapper: {
    alignItems: "center",
    marginHorizontal: 4,
    marginBottom: 16,
    width: 100,
  },
  option: {
    alignItems: "center",
    justifyContent: "center",
    // padding: 8, // Removido para a imagem preencher todo o espaço
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#cdcdcd",
    backgroundColor: "#f8f8f8",
    width: 80,
    height: 80,
    overflow: "hidden", // Adicionado para cortar a imagem nos cantos arredondados
  },
  selectedOption: {
    borderColor: "#B41976",
    backgroundColor: "#FCE4EC",
  },
  image: {
    width: "100%", // Alterado para preencher o container
    height: "100%", // Alterado para preencher o container
    resizeMode: "cover", // Adicionado para a imagem não distorcer
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
    marginTop: 4,
  },
  selectedLabel: {
    color: "#B41976",
    fontWeight: "bold",
  },
});

export default ReferenceSelector;
