import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";

export const ITEM_HEIGHT = 48;
export const VISIBLE_ITEMS = 5;
export const WHEEL_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

interface WheelColumnProps {
  data: string[];
  selectedValue: string | null;
  onChange: (value: string) => void;
  /** Quando vira true (modal abre), rola com animação até o valor selecionado. */
  visible: boolean;
}

/**
 * Coluna de rolagem estilo "roda" (wheel picker):
 * - Abre já posicionada no valor atual/selecionado, com animação.
 * - O usuário rola e o item que parar no centro vira a seleção (snap).
 * - Tocar em um item também o seleciona e o centraliza.
 */
const WheelColumn: React.FC<WheelColumnProps> = ({
  data,
  selectedValue,
  onChange,
  visible,
}) => {
  const listRef = useRef<FlatList<string>>(null);

  // Rola até o valor selecionado quando o modal abre (ou quando o valor muda).
  useEffect(() => {
    if (!visible) return;
    const index = selectedValue != null ? data.indexOf(selectedValue) : -1;
    if (index < 0) return;
    const id = setTimeout(() => {
      listRef.current?.scrollToOffset({
        offset: index * ITEM_HEIGHT,
        animated: true,
      });
    }, 50);
    return () => clearTimeout(id);
  }, [visible, selectedValue, data.length]);

  const handleSettle = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
    const clamped = Math.max(0, Math.min(index, data.length - 1));
    const value = data[clamped];
    if (value != null && value !== selectedValue) {
      onChange(value);
    }
  };

  return (
    <View style={styles.container}>
      {/* Faixa de destaque do item central */}
      <View pointerEvents="none" style={styles.highlight} />

      <FlatList
        ref={listRef}
        data={data}
        keyExtractor={(item, index) => `${item}-${index}`}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        bounces={false}
        nestedScrollEnabled
        getItemLayout={(_, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
        contentContainerStyle={{ paddingVertical: ITEM_HEIGHT * 2 }}
        onMomentumScrollEnd={handleSettle}
        onScrollEndDrag={handleSettle}
        renderItem={({ item }) => {
          const isSelected = item === selectedValue;
          return (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => onChange(item)}
              style={styles.item}
            >
              <Text
                style={[styles.itemText, isSelected && styles.itemTextSelected]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: WHEEL_HEIGHT,
  },
  highlight: {
    position: "absolute",
    top: ITEM_HEIGHT * 2,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#F0D0E2",
    backgroundColor: "rgba(180, 25, 118, 0.06)",
  },
  item: {
    height: ITEM_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  itemText: {
    fontSize: 18,
    color: "#A9A9A9",
  },
  itemTextSelected: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#b41976",
  },
});

export default WheelColumn;
