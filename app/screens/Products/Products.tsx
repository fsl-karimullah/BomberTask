import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Animated,
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
  const [refreshing, setRefreshing] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [allProductsLoaded, setAllProductsLoaded] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const [showFab, setShowFab] = useState(false);
  const fabOpacity = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.favorites.items);

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart(product));
    showToast('success', 'Informasi', 'Berhasil menambahkan ke keranjang');
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);

      if (selectedCategory === 'all' || !selectedCategory) {
        await fetchPaginatedProducts(true);
      } else {
        await fetchCategoryProducts(selectedCategory, true);
      }
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const isFavorite = (product: Product) =>
    favorites.some(item => item.id === product.id);

  const toggleFavorite = (product: Product) => {
    if (isFavorite(product)) {
      dispatch(removeFromFavorites(product.id));
    } else {
      dispatch(addFavorite(product));
      showToast('success', 'Informasi', 'Berhasil menambahkan ke favorit');
    }
  };

  const handleScroll = (event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    const shouldShow = scrollY > 300;

    if (shouldShow !== showFab) {
      setShowFab(shouldShow);
      Animated.timing(fabOpacity, {
        toValue: shouldShow ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
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

  const fetchAllProducts = async () => {
    try {
      const res = await axios.get('https://dummyjson.com/products?limit=0');
      const allProductsData = res.data.products || [];
      setAllProducts(allProductsData);
      setAllProductsLoaded(true);
      setTotalProducts(res.data.total || 0);
      return allProductsData;
    } catch (error) {
      console.error('Error fetching all products:', error);
      return [];
    }
  };

  const LIMIT = 10;

  const fetchPaginatedProducts = async (initial = false) => {
    if ((!hasMore && !initial) || isSearchMode) return;

    try {
      if (initial) {
        setLoading(true);
        setSkip(0);
        setProducts([]);
      } else {
        setIsLoadingMore(true);
      }

      const currentSkip = initial ? 0 : skip;

      const res = await axios.get(
        `https://dummyjson.com/products?limit=${LIMIT}&skip=${currentSkip}`,
      );

      const fetched = res.data.products;
      const total = res.data.total;

      if (initial) {
        setProducts(fetched);
        setSkip(LIMIT);
      } else {
        setProducts(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const newProducts = fetched.filter(
            (p: Product) => !existingIds.has(p.id),
          );
          return [...prev, ...newProducts];
        });
        setSkip(prev => prev + LIMIT);
      }

      setHasMore((initial ? LIMIT : skip + LIMIT) < total);
      setTotalProducts(total);
    } catch (error) {
      console.error('Error fetching paginated products:', error);
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  const fetchCategoryProducts = async (
    categorySlug: string,
    initial = false,
  ) => {
    if (categorySlug === 'all') {
      return fetchPaginatedProducts(initial);
    }

    try {
      if (initial) {
        setLoading(true);
        setSkip(0);
        setProducts([]);
      } else {
        setIsLoadingMore(true);
      }

      const currentSkip = initial ? 0 : skip;

      const res = await axios.get(
        `https://dummyjson.com/products/category/${categorySlug}?limit=${LIMIT}&skip=${currentSkip}`,
      );

      const fetched = res.data.products;
      const total = res.data.total;

      if (initial) {
        setProducts(fetched);
        setSkip(LIMIT);
      } else {
        setProducts(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const newProducts = fetched.filter(
            (p: Product) => !existingIds.has(p.id),
          );
          return [...prev, ...newProducts];
        });
        setSkip(prev => prev + LIMIT);
      }

      setHasMore((initial ? LIMIT : skip + LIMIT) < total);
    } catch (error) {
      console.error('Error fetching category products:', error);
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      await fetchCategories();
      await fetchAllProducts();
      await fetchPaginatedProducts(true);
    };

    initializeData();
  }, []);

  const handleCategoryPress = (slug: string) => {
    setSelectedCategory(slug);
    setSearchQuery('');

    if (slug === 'all') {
      setIsSearchMode(false);
      setSkip(0);
      setHasMore(true);
      fetchPaginatedProducts(true);
    } else {
      setIsSearchMode(false);
      setSkip(0);
      setHasMore(true);
      fetchCategoryProducts(slug, true);
    }
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);

    if (text.trim() === '') {
      setIsSearchMode(false);
      if (selectedCategory === 'all' || !selectedCategory) {
        setSkip(0);
        setHasMore(true);
        fetchPaginatedProducts(true);
      } else {
        setSkip(0);
        setHasMore(true);
        fetchCategoryProducts(selectedCategory, true);
      }
      return;
    }

    setIsSearchMode(true);

    const searchFiltered = allProducts.filter(product =>
      product.title.toLowerCase().includes(text.toLowerCase()),
    );

    const finalFiltered =
      selectedCategory && selectedCategory !== 'all'
        ? searchFiltered.filter(p => p.category === selectedCategory)
        : searchFiltered;

    setProducts(finalFiltered);
  };

  const handleResetSearch = () => {
    setSearchQuery('');
    setIsSearchMode(false);

    if (selectedCategory === 'all' || !selectedCategory) {
      setSkip(0);
      setHasMore(true);
      fetchPaginatedProducts(true);
    } else {
      setSkip(0);
      setHasMore(true);
      fetchCategoryProducts(selectedCategory, true);
    }
  };

  const renderItem = ({ item }: { item: Product }) => (
    <ProductCard
      key={`product-${item.id}`}
      product={item}
      isFavorite={isFavorite(item)}
      onToggleFavorite={() => toggleFavorite(item)}
      onPress={() =>
        navigation.navigate('DetailProduct', { productId: String(item.id) })
      }
      onAddToCart={() => handleAddToCart(item)}
    />
  );

  const handleEndReached = () => {
    if (!isSearchMode && hasMore && !isLoadingMore) {
      if (selectedCategory === 'all' || !selectedCategory) {
        fetchPaginatedProducts();
      } else {
        fetchCategoryProducts(selectedCategory);
      }
    }
  };

  return (
    <View style={styles.wrapper}>
      <FlatList
        ref={flatListRef}
        data={products}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        numColumns={2}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        onScroll={handleScroll}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        scrollEventThrottle={16}
        ListFooterComponent={
          isLoadingMore && !isSearchMode ? (
            <ActivityIndicator style={{ marginVertical: 20 }} />
          ) : null
        }
        ListHeaderComponent={
          <>
            <Text style={styles.header}>
              {selectedCategory && selectedCategory !== 'all'
                ? selectedCategory.replace(/-/g, ' ').toUpperCase()
                : 'ALL PRODUCTS'}
              {!isSearchMode && totalProducts > 0 && (
                <Text style={styles.totalCount}>
                  {' '}
                  ({products.length}/{totalProducts})
                </Text>
              )}
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
              keyExtractor={item => `category-${item.slug}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ height: 50 }}
              contentContainerStyle={styles.categoryContainer}
              renderItem={({ item }) => (
                <CategoryButton
                  key={`cat-btn-${item.slug}`}
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
            <Text style={styles.emptyText}>
              {searchQuery
                ? 'No products found for your search.'
                : 'No products found.'}
            </Text>
          ) : null
        }
      />

      <Animated.View
        style={[
          styles.fabContainer,
          {
            opacity: fabOpacity,
            transform: [
              {
                scale: fabOpacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              },
            ],
          },
        ]}
        pointerEvents={showFab ? 'auto' : 'none'}
      >
        <TouchableOpacity
          style={styles.fab}
          onPress={scrollToTop}
          activeOpacity={0.8}
        >
          <Ionicons name="chevron-up" size={24} color="#fff" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default Products;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 10,
    paddingBottom: 40,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    marginLeft: 16,
    marginBottom: 10,
    color: '#333',
  },
  totalCount: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666',
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
  fabContainer: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    zIndex: 1000,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
});
