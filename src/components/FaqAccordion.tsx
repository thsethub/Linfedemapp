import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { Feather } from "@expo/vector-icons";

// Habilita LayoutAnimation para Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface FaqItem {
  title: string;
  content: string | React.ReactNode;
}

interface FaqAccordionProps {
  items: FaqItem[];
}

const FaqAccordion: React.FC<FaqAccordionProps> = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    // Adiciona uma animação suave de abertura/fechamento
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <View className="w-full px-6 mt-10">
      {items.map((item, index) => (
        <View
          key={index}
          className="bg-white border border-gray-200 rounded-xl mb-3 overflow-hidden"
        >
          <TouchableOpacity
            onPress={() => toggleItem(index)}
            className="flex-row justify-between items-center p-4"
            activeOpacity={0.7}
          >
            <Text className="text-primary-500 font-bold text-base flex-1 mr-2">
              {item.title}
            </Text>
            <Feather
              name={activeIndex === index ? "x" : "plus"}
              size={22}
              color="#b41976"
            />
          </TouchableOpacity>

          {activeIndex === index && (
            <View className="px-4 pb-4">
              <Text className="text-gray-700 leading-relaxed">
                {item.content}
              </Text>
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

export default FaqAccordion;