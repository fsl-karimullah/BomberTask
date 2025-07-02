import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = 'FAVORITES_LIST';

export const saveFavoritesToStorage = async (items: any[]) => {
  try {
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save favorites:', error);
  }
};

export const loadFavoritesFromStorage = async (): Promise<any[]> => {
  try {
    const json = await AsyncStorage.getItem(FAVORITES_KEY);
    return json != null ? JSON.parse(json) : [];
  } catch (error) {
    console.error('Failed to load favorites:', error);
    return [];
  }
};
