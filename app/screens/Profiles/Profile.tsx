import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import images from '../../helper/images';

const Profile = () => {
  const user = {
    name: 'Amir Faisal',
    email: 'faisalbic123@gmail.com',
    location: 'Dummmy address, City, Country',
    phone: '087826563459',
    bio: 'Passionate mobile developer. Coffee lover. Explorer of tech.'
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
       <Image source={images.profileImg} style={styles.avatar} />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="create-outline" size={18} color="#007AFF" />
          <Text style={styles.editText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoBox}>
          <Ionicons name="location-outline" size={20} color="#555" />
          <Text style={styles.infoText}>{user.location}</Text>
        </View>
        <View style={styles.infoBox}>
          <Ionicons name="call-outline" size={20} color="#555" />
          <Text style={styles.infoText}>{user.phone}</Text>
        </View>
        <View style={styles.bioBox}>
          <Text style={styles.bioTitle}>About</Text>
          <Text style={styles.bioText}>{user.bio}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
  },
  email: {
    fontSize: 15,
    color: '#666',
    marginBottom: 8,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF4FF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 6,
  },
  editText: {
    fontSize: 14,
    color: '#007AFF',
    marginLeft: 6,
    fontWeight: '600',
  },
  infoSection: {
    marginTop: 10,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  infoText: {
    fontSize: 15,
    color: '#333',
    marginLeft: 10,
  },
  bioBox: {
    backgroundColor: '#F5F5F5',
    padding: 14,
    borderRadius: 10,
  },
  bioTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
    color: '#222',
  },
  bioText: {
    fontSize: 15,
    color: '#444',
    lineHeight: 20,
  },
});
