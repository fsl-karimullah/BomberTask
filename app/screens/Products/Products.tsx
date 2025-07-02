import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  TextInput,
} from 'react-native';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import {
  addFavorite,
  removeFromFavorites,
} from '../../redux/slices/favoritesSlice';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProductCard from '../../components/ProductCard';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../routes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import CategoryButton from '../../components/Button/CategoryButton';
import { addToCart } from '../../redux/slices/cartSlice';
import { endpoint } from '../../api/endpoint';
import { showToast } from '../../helper/HelperFunction';

const { width } = Dimensions.get('window');

type Product = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  category: string;
};

type Category = {
  slug: string;
  name: string;
  url: string;
};

const Products: React.FC = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    'all',
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const dispatch = useDispatch();
  const handleAddToCart = (product: Product) => {
    dispatch(addToCart(product));
    showToast(
      'success',
      'Informasi',
      'Berhasil menambahkan ke keranjang',
      'TOP',
    );
  };
  const favorites = useSelector((state: RootState) => state.favorites.items);

  const isFavorite = (product: Product) =>
    favorites.some(item => item.id === product.id);

  const toggleFavorite = (product: Product) => {
    if (isFavorite(product)) {
      dispatch(removeFromFavorites(product.id));
    } else {
      dispatch(addFavorite(product));
      showToast(
        'success',
        'Informasi',
        'Berhasil menambahkan ke favorit',
        'TOP',
      );
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('https://dummyjson.com/products/categories');
      const allCategory: Category = {
        slug: 'all',
        name: 'All',
        url: '',
      };
      setCategories([allCategory, ...res.data]);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const LIMIT = 10;

  const fetchPaginatedProducts = async (initial = false) => {
    if (!hasMore && !initial) return;

    try {
      if (initial) {
        setLoading(true);
        setSkip(0);
        setProducts([]);
      } else {
        setIsLoadingMore(true);
      }

      const res = await axios.get(
        endpoint.getProductDetailPagination('', LIMIT, initial ? 0 : skip),
      );

      const fetched = res.data.products;

      setProducts(prev => [...prev, ...fetched]);
      setSkip(prev => prev + LIMIT);
      setHasMore(skip + LIMIT < res.data.total);
    } catch (error) {
      console.error('Error fetching paginated products:', error);
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchPaginatedProducts(true);
  }, []);

  const handleCategoryPress = (slug: string) => {
    setSelectedCategory(slug);
    setSearchQuery('');
    if (slug === 'all') {
      setProducts(allProducts);
    } else {
      const filtered = allProducts.filter(p => p.category === slug);
      setProducts(filtered);
    }
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);

    const filtered = allProducts.filter(product =>
      product.title.toLowerCase().includes(text.toLowerCase()),
    );

    const finalFiltered =
      selectedCategory && selectedCategory !== 'all'
        ? filtered.filter(p => p.category === selectedCategory)
        : filtered;

    setProducts(finalFiltered);
  };

  const handleResetSearch = () => {
    setSearchQuery('');
    if (selectedCategory === 'all' || !selectedCategory) {
      setProducts(allProducts);
    } else {
      const filtered = allProducts.filter(p => p.category === selectedCategory);
      setProducts(filtered);
    }
  };

  const renderItem = ({ item }: { item: Product }) => (
    <ProductCard
      key={item.id}
      product={item}
      isFavorite={isFavorite(item)}
      onToggleFavorite={() => toggleFavorite(item)}
      onPress={() =>
        navigation.navigate('DetailProduct', { productId: String(item.id) })
      }
      onAddToCart={() => handleAddToCart(item)}
    />
  );

  return (
    <View style={styles.wrapper}>
      <FlatList
        data={products}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        onEndReached={() => fetchPaginatedProducts()}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isLoadingMore ? (
            <ActivityIndicator style={{ marginVertical: 20 }} />
          ) : null
        }
        ListHeaderComponent={
          <>
            <Text style={styles.header}>
              {selectedCategory
                ? selectedCategory.replace(/-/g, ' ').toUpperCase()
                : 'ALL PRODUCTS'}
            </Text>

            <View style={styles.searchWrapper}>
              <TextInput
                placeholder="Search products..."
                value={searchQuery}
                onChangeText={handleSearch}
                style={styles.searchBar}
              />
              <TouchableOpacity
                onPress={handleResetSearch}
                style={styles.resetButton}
              >
                <Ionicons name="refresh" size={22} color="#007AFF" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={categories}
              keyExtractor={item => item.slug}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ height: 50 }}
              contentContainerStyle={styles.categoryContainer}
              renderItem={({ item }) => (
                <CategoryButton
                  title={item.name}
                  isActive={selectedCategory === item.slug}
                  onPress={() => handleCategoryPress(item.slug)}
                />
              )}
            />

            {loading && (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
              </View>
            )}
          </>
        }
        renderItem={renderItem}
        contentContainerStyle={styles.productList}
        ListEmptyComponent={
          !loading ? (
            <Text style={styles.emptyText}>No products found.</Text>
          ) : null
        }
      />
    </View>
  );
};

export default Products;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    marginLeft: 16,
    marginBottom: 10,
    color: '#333',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 10,
  },
  searchBar: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    marginRight: 8,
  },
  resetButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  categoryContainer: {
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  productList: {
    paddingBottom: 16,
    paddingHorizontal: 8,
    minHeight: 200,
  },
  loaderContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
    fontSize: 16,
  },
});
