import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Pressable,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

type Product = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
};

type Props = {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onPress: () => void;
  onAddToCart: () => void; 
  key: string | number;
};

const ProductCard: React.FC<Props> = ({
  product,
  isFavorite,
  onToggleFavorite,
  onPress,
  onAddToCart,
  key
}) => {
  return (
    <Pressable key={key} style={styles.card} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.thumbnail }} style={styles.image} />
        <TouchableOpacity style={styles.favoriteIcon} onPress={onToggleFavorite}>
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={22}
            color={isFavorite ? 'red' : '#555'}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {product.title}
        </Text>
        <View style={styles.priceTag}>
          <Text style={styles.priceText}>${product.price}</Text>
        </View>
      </View>

      {/* Add to cart button */}
      <TouchableOpacity style={styles.cartButton} onPress={onAddToCart}>
        <Ionicons name="cart-outline" size={20} color="#fff" />
        <Text style={styles.cartButtonText}>Add to Cart</Text>
      </TouchableOpacity>
    </Pressable>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    margin: 8,
    flex: 1,
    padding: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: width / 2 - 36,
    height: 140,
    resizeMode: 'cover',
  },
  favoriteIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#ffffffcc',
    borderRadius: 20,
    padding: 4,
  },
  infoContainer: {
    marginTop: 12,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  priceTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#007AFF22',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 14,
  },
  priceText: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 14,
  },
  cartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginTop: 10,
    justifyContent: 'center',
  },
  cartButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 6,
  },
    priceCartRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartIcon: {
    padding: 6,
    backgroundColor: '#EAF4FF',
    borderRadius: 20,
  },

});
