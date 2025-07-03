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
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../routes';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  loadFavoritesFromStorage,
  saveFavoritesToStorage,
} from '../../utils/storage';
import {
  setFavorites,
  removeFromFavorites,
} from '../../redux/slices/favoritesSlice';

const FavouriteProducts = () => {
  const favorites = useSelector((state: RootState) => state.favorites.items);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    const loadFavorites = async () => {
      const storedFavorites = await loadFavoritesFromStorage();
      dispatch(setFavorites(storedFavorites));
    };
    loadFavorites();
  }, []);

  const handleRemoveFavorite = async (id: number) => {
    dispatch(removeFromFavorites(id));
    const updatedFavorites = favorites.filter(item => item.id !== id);
    await saveFavoritesToStorage(updatedFavorites);
  };

  if (favorites.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No favorite products yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('DetailProduct', {
                  productId: String(item.id),
                })
              }
              style={styles.touchArea}
            >
              <Image source={{ uri: item.thumbnail }} style={styles.image} />
              <View style={styles.info}>
                <Text style={styles.title} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.price}>${item.price}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setSelectedId(item.id);
                setModalVisible(true);
              }}
              style={styles.trashIcon}
            >
              <Ionicons name="trash-outline" size={22} color="red" />
            </TouchableOpacity>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={{ paddingVertical: 10 }}
      />

      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>
              Remove this item from favorites?
            </Text>
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.confirmButton]}
                onPress={() => {
                  if (selectedId !== null) {
                    handleRemoveFavorite(selectedId);
                    setModalVisible(false);
                    setSelectedId(null);
                  }
                }}
              >
                <Text style={styles.modalButtonText}>Remove</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default FavouriteProducts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingBottom: 80,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    marginHorizontal: 16,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: '#e0e0e0',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  price: {
    marginTop: 4,
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  separator: {
    height: 10,
  },
  touchArea: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  trashIcon: {
    paddingLeft: 10,
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  confirmButton: {
    backgroundColor: '#dc3545',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
