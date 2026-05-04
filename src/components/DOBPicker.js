import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, Modal, Platform, StyleSheet,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../assets/themecontext/ThemeContext';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';

export const DOBPicker = ({ value, onChange }) => {

  const { theme: COLOURS, isDark } = useTheme();
  const [show, setShow] = useState(false);
  const [tempDate, setTempDate] = useState(
    value instanceof Date ? value : new Date()
  );

  useEffect(() => {
    if (value instanceof Date && !isNaN(value)) {
      setTempDate(value);
    }
  }, [value]);

  const formatDate = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date)) return '';
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  };

  const handleConfirm = () => {
    onChange(tempDate);
    setShow(false);
  };

  return (
    <View>
      <TouchableOpacity
        style={[[styles.input, { backgroundColor: COLOURS.light_primary }], value && [styles.inputFilled, { borderColor: COLOURS.light_grey, }]]}
        onPress={() => setShow(true)}
        activeOpacity={0.8}
      >
        <Text style={value ? [styles.valueText, { color: COLOURS.grey, }] : styles.placeholder}>
          {value ? formatDate(value) : 'dd/mm/yyyy'}
        </Text>
      </TouchableOpacity>

      {Platform.OS === 'android' && show && (
        <DateTimePicker
          value={tempDate}
          mode="date"
          display="default"
          maximumDate={new Date()}
          onValueChange={(event, date) => {
            setShow(false);
            if (date) onChange(date);
          }}
          onDismiss={() => setShow(false)}
        />
      )}

      {Platform.OS === 'ios' && (
        <Modal visible={show} transparent animationType="slide">
          <View style={styles.overlay}>
            <View style={styles.modal}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setShow(false)}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Date of Birth</Text>
                <TouchableOpacity onPress={handleConfirm}>
                  <Text style={styles.doneText}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="spinner"
                maximumDate={new Date()}
                onValueChange={(event, date) => {
                  if (date) setTempDate(date);
                }}
                onDismiss={() => setShow(false)}
                style={{ height: 200 }}
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({

  input: {
    width: responsiveWidth(42),
    borderRadius: responsiveWidth(2),
    paddingVertical: responsiveWidth(3.5),

    paddingHorizontal: responsiveWidth(4),
  },

  placeholder: {
    color: '#AAAAAA',
    fontSize: responsiveFontSize(2),
  },
  valueText: {
    fontSize: responsiveFontSize(2),
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  cancelText: {
    fontSize: 15,
    color: '#888',
  },
  doneText: {
    fontSize: 15,
    color: '#FF8C00',
    fontWeight: '600',
  },
});