import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const Homepage: React.FC = () => {
  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: 'https://source.unsplash.com/800x600/?technology,product',
        }}
        style={styles.banner}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Productio!</Text>
        <Text style={styles.subtitle}>
          Discover the best products curated just for you.
        </Text>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Explore Products</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    height: width * 0.7,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginVertical: 16,
    color: '#333333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
});
