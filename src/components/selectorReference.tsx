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
              numberOfLines={2} // Permite quebra de linha
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
    flexDirection: "row", // Alinha os itens horizontalmente
    justifyContent: "space-between", // Espaça os itens igualmente
    flexWrap: "nowrap", // Impede a quebra de linha
    width: "100%",
  },
  optionWrapper: {
    alignItems: "center",
    marginHorizontal: 4, // Espaçamento horizontal entre os itens
    marginBottom: 16, // Espaçamento entre linhas
    width: 100, // Largura fixa para alinhar os itens
  },
  option: {
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#cdcdcd",
    backgroundColor: "#f8f8f8",
    width: 80,
    height: 80,
  },
  selectedOption: {
    borderColor: "#B41976",
    backgroundColor: "#FCE4EC",
  },
  image: {
    width: 80, // Tamanho ajustado da imagem
    height: 80,
  },
  label: {
    fontSize: 12, // Reduzido o tamanho da fonte
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
    marginTop: 4, // Espaçamento menor entre a caixa e o texto
  },
  selectedLabel: {
    color: "#B41976", // Cor destacada para o item selecionado
    fontWeight: "bold",
  },
});

export default ReferenceSelector;
