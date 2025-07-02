import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { Product } from '../../redux/slices/cartSlice';

type Props = {
  item: Product;
  onRemove: (id: number) => void;
  onIncrement: (id: number) => void;
  onDecrement: (id: number) => void;
};

const CartItemCard: React.FC<Props> = ({
  item,
  onRemove,
  onIncrement,
  onDecrement,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
const [selectedId, setSelectedId] = useState<number | null>(null);

  return (
    <View style={styles.card}>
      <Image source={{ uri: item.thumbnail }} style={styles.image} />
      <View style={styles.info}>
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          <TouchableOpacity onPress={() => onRemove(item.id)}>
            <Ionicons name="trash-outline" size={20} color="red" />
          </TouchableOpacity>
        </View>
        <Text style={styles.price}>
          ${item.price.toFixed(2)} × {item.quantity}
        </Text>
        <Text style={styles.total}>
          Total: ${(item.price * (item.quantity || 1)).toFixed(2)}
        </Text>
        <View style={styles.quantityRow}>
          <TouchableOpacity onPress={() => onDecrement(item.id)}>
            <Ionicons name="remove-circle-outline" size={26} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <TouchableOpacity onPress={() => onIncrement(item.id)}>
            <Ionicons name="add-circle-outline" size={26} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CartItemCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginVertical: 8,
    padding: 12,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 12,
  },
  info: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    marginRight: 8,
  },
  price: {
    fontSize: 13,
    color: '#555',
  },
  total: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 2,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  quantity: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 10,
  },
});
