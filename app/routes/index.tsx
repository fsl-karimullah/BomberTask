import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Platform,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createBottomTabNavigator,
  BottomTabBarButtonProps,
} from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Homepage from '../screens/Home/Homepage';
import Profile from '../screens/Profiles/Profile';
import ListProduct from '../screens/Products/Products';
import DetailProduct from '../screens/Products/DetailProducts';
import FavouriteProducts from '../screens/Products/FavouriteProducts';
import ProductCart from '../screens/Products/ProductCart';
import { useSelector } from 'react-redux';
import CheckoutPage from '../screens/Products/CheckoutPage';
import { Product } from '../redux/slices/cartSlice';

export type RootTabParamList = {
  Homepage: undefined;
  ListProduct: undefined;
  ProductCart: undefined;
  FavouriteProducts: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Tabs: undefined;
  DetailProduct: { productId: string };
  
};

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const CustomCartButton = ({ children, onPress }: BottomTabBarButtonProps) => (
  <TouchableOpacity
    onPress={onPress}
    style={styles.customCartButton}
    activeOpacity={0.9}
  >
    <View style={styles.cartIconContainer}>{children}</View>
  </TouchableOpacity>
);

const BottomTabs: React.FC = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalItems = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0,
  );

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        },
        tabBarStyle: {
          position: 'absolute',
          height: 60,
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string = '';

          switch (route.name) {
            case 'Homepage':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'ListProduct':
              iconName = focused ? 'pricetags' : 'pricetags-outline';
              break;
            case 'FavouriteProducts':
              iconName = focused ? 'heart' : 'heart-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'ellipse';
          }

          return <Ionicons name={iconName} size={22} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#888',
      })}
    >
      <Tab.Screen
        name="Homepage"
        component={Homepage}
        options={{ title: 'Home' }}
      />
      <Tab.Screen
        name="ListProduct"
        component={ListProduct}
        options={{ title: 'Products' }}
      />

      <Tab.Screen
        name="ProductCart"
        component={ProductCart}
        options={{
          title: 'Cart',
          tabBarLabel: ({ focused }) => (
            <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>
              Cart
            </Text>
          ),
          tabBarIcon: ({ color }) => (
            <View>
              <Ionicons name="cart" size={28} color="#fff" />
              {totalItems > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{totalItems}</Text>
                </View>
              )}
            </View>
          ),
          tabBarButton: props => <CustomCartButton {...props} />,
        }}
      />

      <Tab.Screen
        name="FavouriteProducts"
        component={FavouriteProducts}
        options={{ title: 'Favourites' }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

const App: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundColor = isDarkMode ? '#1c1c1e' : '#ffffff';

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: true }}>
        <Stack.Screen
          name="Tabs"
          component={BottomTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DetailProduct"
          component={DetailProduct}
          options={{ title: 'Product Detail' }}
        />
        <Stack.Screen
          name="CheckoutPage"
          component={CheckoutPage}
          options={{ title: 'Checkout Details' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;


const styles = StyleSheet.create({
  customCartButton: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      android: {
        elevation: 5,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
    }),
  },
  cartIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    backgroundColor: 'red',
    borderRadius: 8,
    paddingHorizontal: 5,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
