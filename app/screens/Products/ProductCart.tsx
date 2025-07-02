import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import {
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
} from '../../redux/slices/cartSlice';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CartItemCard from '../../components/Card/CartItemCard';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useRef } from 'react';
import { showToast } from '../../helper/HelperFunction';

const ProductCart = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const bottomSheetRef = useRef<typeof RBSheet>(null);

  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const navigation = useNavigation();

  const getTotal = () => {
    return cartItems.reduce((sum, item) => {
      return sum + item.price * (item.quantity || 1);
    }, 0);
  };

  const confirmDelete = (itemId: number) => {
    setSelectedItemId(itemId);
    setModalVisible(true);
  };

  const handleDelete = () => {
    showToast('success', 'Informasi', 'Berhasil dihapus dari favorit');
    if (selectedItemId !== null) {
      dispatch(removeFromCart(selectedItemId));
      setSelectedItemId(null);
    }
    setModalVisible(false);
  };

  const renderItem = ({ item }: any) => (
    <CartItemCard
      item={item}
      onRemove={confirmDelete}
      onIncrement={id => dispatch(incrementQuantity(id))}
      onDecrement={id => dispatch(decrementQuantity(id))}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Cart</Text>
      <FlatList
        data={cartItems}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.empty}>Your cart is empty.</Text>
        }
      />
      <View style={styles.totalWrapper}>
        <Text style={styles.totalText}>Total: ${getTotal().toFixed(2)}</Text>
      </View>

      {/* 🧾 Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Are you sure you want to remove this item from your cart?
            </Text>
            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleDelete}
              >
                <Text style={styles.modalButtonText}>Remove</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <TouchableOpacity
        style={styles.checkoutButton}
        onPress={() => bottomSheetRef.current?.open()}
      >
        <Text style={styles.checkoutText}>Checkout</Text>
      </TouchableOpacity>
      <RBSheet
        ref={bottomSheetRef}
        closeOnDragDown={true}
        closeOnPressMask={true}
        height={400}
        customStyles={{
          container: {
            padding: 16,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
          draggableIcon: {
            backgroundColor: '#ccc',
          },
        }}
      >
        <Text style={styles.sheetTitle}>Order Summary</Text>

        <FlatList
          data={cartItems}
          keyExtractor={item => item.id.toString()}
          style={{ maxHeight: 220 }}
          renderItem={({ item }) => (
            <View style={styles.sheetItemRow}>
              <Image
                source={{ uri: item.thumbnail }}
                style={styles.sheetImage}
              />
              <View style={styles.sheetItemInfo}>
                <Text style={styles.sheetItemTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.sheetItemPrice}>
                  ${item.price.toFixed(2)} × {item.quantity}
                </Text>
                <Text style={styles.sheetItemSubtotal}>
                  Total: ${(item.price * (item.quantity || 1)).toFixed(2)}
                </Text>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>No items in cart.</Text>
          }
        />

        <Text style={styles.sheetTotal}>Total: ${getTotal().toFixed(2)}</Text>

        <TouchableOpacity
          style={styles.sheetContinueButton}
          onPress={() => {
            bottomSheetRef.current?.close();
            navigation.navigate('CheckoutPage', {
              cartItems,
              total: getTotal(),
            });
          }}
        >
          <Text style={styles.sheetContinueText}>Continue</Text>
        </TouchableOpacity>
      </RBSheet>
    </View>
  );
};

export default ProductCart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    paddingBottom: 100,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
  },
  cartItem: {
    flexDirection: 'row',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 12,
    borderRadius: 8,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  price: {
    fontSize: 14,
    color: '#555',
  },
  total: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  qtyText: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  totalWrapper: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    alignItems: 'flex-end',
  },
  totalText: {
    fontSize: 18,
    fontWeight: '700',
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: '#888',
    fontSize: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  modalText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  confirmButton: {
    backgroundColor: 'red',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '600',
  },

  checkoutButton: {
    marginTop: 12,
    backgroundColor: '#28a745',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  sheetItem: {
    fontSize: 16,
    marginBottom: 5,
  },
  sheetTotal: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 20,
  },
  sheetContinueButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  sheetContinueText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  sheetItemRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  sheetImage: {
    width: 50,
    height: 50,
    borderRadius: 6,
    marginRight: 10,
  },
  sheetItemInfo: {
    flex: 1,
  },
  sheetItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  sheetItemPrice: {
    fontSize: 13,
    color: '#555',
  },
  sheetItemSubtotal: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
    marginTop: 2,
  },
});
