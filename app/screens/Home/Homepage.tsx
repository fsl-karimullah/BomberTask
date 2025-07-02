import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../routes';
import images from '../../helper/images';

const { width } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const menus = [
  {
    title: 'Products',
    icon: 'grid-outline',
    screen: 'ListProduct',
  },
  {
    title: 'Favorites',
    icon: 'heart-outline',
    screen: 'FavouriteProducts',
  },
  {
    title: 'Cart',
    icon: 'cart-outline',
    screen: 'ProductCart',
  },

  {
    title: 'Profile',
    icon: 'person-outline',
    screen: 'Profile',
  },
];

const randomNames = ['Amir', 'Faisal', 'John', 'Sarah', 'Nina', 'Leo', 'Tariq'];
const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];

const Homepage: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleNavigate = (screen: keyof RootStackParamList) => {
    navigation.navigate(screen);
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={images.banner1} style={styles.banner} resizeMode="cover" />

      <View style={styles.menuSection}>
        <Text style={styles.greeting}>Hello, {randomName}! 👋</Text>
        <Text style={styles.sectionTitle}>Menu</Text>

        <View style={styles.menuGrid}>
          {menus.map((menu, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() =>
                handleNavigate(menu.screen as keyof RootStackParamList)
              }
            >
              <View style={styles.iconWrapper}>
                <Ionicons name={menu.icon} size={30} color="#007AFF" />
              </View>
              <Text style={styles.menuText}>{menu.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default Homepage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  banner: {
    width: width,
    height: width * 0.5,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  menuSection: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    color: '#222',
  },
  greeting: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
    textAlign: 'center',
    color: '#555',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  menuItem: {
    width: '45%',
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  iconWrapper: {
    marginBottom: 6,
  },
  menuText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#444',
    textAlign: 'center',
  },
});
