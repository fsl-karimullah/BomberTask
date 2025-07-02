import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../routes';
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite } from '../../redux/slices/favoritesSlice';
import { RootState } from '../../redux/store';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native';
import { endpoint } from '../../api/endpoint';
import { addToCart, removeFromCart } from '../../redux/slices/cartSlice';
import { toggleFavorite } from '../../redux/slices/favoritesSlice';
import { showToast } from '../../helper/HelperFunction';

const { width } = Dimensions.get('window');

type ProductDetailRouteProp = RouteProp<RootStackParamList, 'DetailProduct'>;

const DetailProducts: React.FC = () => {
  const route = useRoute<ProductDetailRouteProp>();
  const { productId } = route.params;
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.favorites.items);

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const isFavorite = React.useMemo(() => {
    if (!product) return false;
    return favorites.some(fav => fav.id === product.id);
  }, [favorites, product]);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const isInCart = cartItems.some(item => item.id === product?.id);

  useEffect(() => {
    fetch(endpoint.getProductDetail(productId))
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(error => console.error('Error fetching product:', error))
      .finally(() => setLoading(false));
  }, [productId]);

  const handleCartPress = () => {
    if (isInCart) {
      dispatch(removeFromCart(product.id));
      showToast('info', 'Informasi', 'Berhasil dihapus dari keranjang');
    } else {
      dispatch(addToCart(product));
      showToast('success', 'Informasi', 'Berhasil menambahkan ke keranjang');
    }
  };

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(product));

    if (isFavorite) {
      showToast('info', 'Informasi', 'Dihapus dari favorit');
    } else {
      showToast('success', 'Informasi', 'Berhasil ditambahkan ke favorit');
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.loader}>
        <Text>Product not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: product.thumbnail }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.favoriteContainer}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title} numberOfLines={2}>
              {product.title}
            </Text>
          </View>
          <TouchableOpacity onPress={handleToggleFavorite}>
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={26}
              color={isFavorite ? 'red' : '#aaa'}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.price}>${product.price}</Text>
        <Text style={styles.rating}>Rating: {product.rating} ⭐</Text>
        <Text style={styles.description}>{product.description}</Text>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Brand:</Text>
          <Text style={styles.infoValue}>{product.brand}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Category:</Text>
          <Text style={styles.infoValue}>{product.category}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Stock:</Text>
          <Text style={styles.infoValue}>{product.stock} units</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.cartButton,
            isInCart ? styles.removeButton : styles.addButton,
          ]}
          onPress={handleCartPress}
        >
          <Text style={styles.cartButtonText}>
            {isInCart ? 'Remove from Cart' : 'Add to Cart'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default DetailProducts;

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    paddingBottom: 32,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  buttonContainer: {
    marginTop: 16,
    marginBottom: 32,
    alignItems: 'center',
  },
  image: {
    width,
    height: 280,
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
  },

  price: {
    fontSize: 20,
    color: '#007AFF',
    fontWeight: '600',
    marginBottom: 8,
  },
  rating: {
    fontSize: 16,
    color: '#444',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
    marginBottom: 16,
  },
  infoBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
  },
  favoriteContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 12,
  },
  cartButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  addButton: {
    backgroundColor: '#28a745',
  },
  removeButton: {
    backgroundColor: '#dc3545',
  },
  cartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
