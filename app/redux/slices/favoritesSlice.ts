import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { saveFavoritesToStorage } from '../../utils/storage'; 

type Product = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  [key: string]: any;
};

type FavoritesState = {
  items: Product[];
};

const initialState: FavoritesState = {
  items: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    setFavorites: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload;
    },
    addFavorite: (state, action: PayloadAction<Product>) => {
      const exists = state.items.find(item => item.id === action.payload.id);
      if (!exists) {
        state.items.push(action.payload);
        saveFavoritesToStorage(state.items);
      }
    },
    removeFromFavorites: (state, action: PayloadAction<number>) => {
  state.items = state.items.filter(item => item.id !== action.payload);
},

    toggleFavorite: (state, action: PayloadAction<Product>) => {
      const exists = state.items.find(item => item.id === action.payload.id);
      if (exists) {
        state.items = state.items.filter(item => item.id !== action.payload.id);
      } else {
        state.items.push(action.payload);
      }
      saveFavoritesToStorage(state.items);
    },
  },
});

export const { setFavorites, addFavorite, removeFromFavorites, toggleFavorite } =
  favoritesSlice.actions;

export default favoritesSlice.reducer;
