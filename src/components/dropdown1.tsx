import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useMeasurementContext } from '../context/context';

const Dropdown1: React.FC = () => {
  const { selectedValue, setSelectedValue } = useMeasurementContext();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: 'Processo Estilóide', value: 'opcao1' },
    { label: 'Linha Articular do Cotovelo', value: 'opcao2' },
    { label: 'Acrômio', value: 'opcao3' },
  ]);

  return (
    <View style={styles.container}>
      <Text className='right-20 font-semibold' style={{right: 88}}>Tipo de Referência</Text>
      <DropDownPicker
        open={open}
        value={selectedValue}
        items={items}
        setOpen={setOpen}
        setValue={(callback) => setSelectedValue(typeof callback === 'function' ? callback(selectedValue) : callback)} // Use setSelectedValue diretamente
        setItems={setItems}
        placeholder="Selecionar"
        placeholderStyle={styles.placeholderStyle}
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
        listItemContainerStyle={styles.listItemContainer}
        labelStyle={styles.labelStyle}
        dropDownDirection="BOTTOM"
      />
      <View style={[styles.contentBelow, open && { marginTop: 120 }]}>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdown: {
    width: 300,
    marginVertical: 10,
    borderColor: '#F4F4F4',
    zIndex: 1000,
  },
  dropdownContainer: {
    width: 300,
    borderColor: '#F4F4F4',
    zIndex: 1000,
  },
  contentBelow: {
    marginTop: 10,
    zIndex: 1,
  },
  placeholderStyle: {
    color: '#B0B0B0',
  },
  listItemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  labelStyle: {
    color: '#000000',
  },
});

export default Dropdown1;