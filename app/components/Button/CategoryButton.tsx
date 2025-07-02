import React from 'react';
import { Text, TouchableOpacity, StyleSheet, View, Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

type Props = {
  title: string;
  isActive: boolean;
  onPress: () => void;
};

const CategoryButton: React.FC<Props> = ({ title, isActive, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        isActive ? styles.activeButton : {},
        Platform.OS === 'ios' ? styles.shadow : styles.elevation,
      ]}
    >
      <View style={styles.content}>
        <Ionicons
          name="pricetag-outline"
          size={16}
          color={isActive ? '#fff' : '#333'}
          style={styles.icon}
        />
        <Text
          style={[styles.text, isActive && styles.activeText]}
          numberOfLines={1}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default CategoryButton;


const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#005FCC',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  text: {
    color: '#333',
    fontSize: 15,
    fontWeight: '600',
  },
  activeText: {
    color: '#fff',
  },
  elevation: {
    elevation: 2,
  },
  shadow: {
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
});
