import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';

type CartItem = {
  id: number;
  title: string;
  price: number;
  quantity: number;
  thumbnail: string;
};

type CheckoutRouteProp = RouteProp<
  { CheckoutPage: { cartItems: CartItem[]; total: number } },
  'CheckoutPage'
>;

const CheckoutPage = () => {
  const route = useRoute<CheckoutRouteProp>();
  const { cartItems, total } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>🧾 Invoice Summary</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Date:</Text>
        <Text style={styles.value}>{new Date().toLocaleDateString()}</Text>
      </View>

      <FlatList
        data={cartItems}
        keyExtractor={item => item.id.toString()}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image source={{ uri: item.thumbnail }} style={styles.image} />
            <View style={styles.itemInfo}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemDetail}>
                ${item.price.toFixed(2)} x {item.quantity}
              </Text>
              <Text style={styles.itemTotal}>
                Total: ${(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          </View>
        )}
      />

      <View style={styles.totalWrapper}>
        <Text style={styles.totalLabel}>Grand Total:</Text>
        <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
      </View>
    </ScrollView>
  );
};

export default CheckoutPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    color: '#444',
  },
  item: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingVertical: 12,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 6,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  itemDetail: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  totalWrapper: {
    marginTop: 24,
    borderTopWidth: 1,
    borderColor: '#ccc',
    paddingTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#28a745',
  },
});
