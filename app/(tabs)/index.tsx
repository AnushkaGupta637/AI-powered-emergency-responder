// import React from 'react';
// import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
// import { useAuth } from '@/context/AuthContext';
// import Colors from '@/constants/Colors';
// import { useNavigation } from '@react-navigation/native';
// import Emergency from './emergency';
// import { Heart, Phone, MapPin, Clock, ChevronRight } from 'lucide-react-native';
// import { Linking } from 'react-native';
// import { useState, useEffect } from 'react';


// export default function HomeScreen() {
//   const { user } = useAuth();
//   const navigation = useNavigation();
//   const handleCallEmergency = () => {
//     if (user?.emergencyContacts.length > 0) {
//       // Assuming you want to call the first emergency contact in the list
//       const emergencyContact = user.emergencyContacts[0];
      
//       // Check if a phone number exists and make a call
//       if (emergencyContact.phoneNumber) {
//         Linking.openURL(`tel:${emergencyContact.phoneNumber}`);
//       } else {
//         alert('No phone number available for the emergency contact');
//       }
//     } else {
//       alert('No emergency contacts available');
//     }
//   };
//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.greeting}>Hello,</Text>
//         <Text style={styles.username}>{user?.email?.split('@')[0] || 'User'}</Text>
//       </View>

//       <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
//         <View style={styles.emergencyCard}>
//           <Heart size={24} color={Colors.white} style={styles.emergencyIcon} />
//           <Text style={styles.emergencyTitle}>Emergency Ready</Text>
//           <Text style={styles.emergencyText}>
//             Tap the Emergency tab for immediate assistance
//           </Text>
//         </View>

//         <Text style={styles.sectionTitle}>Quick Actions</Text>

//         <View style={styles.quickActions}>
//         <TouchableOpacity style={styles.actionCard} onPress={handleCallEmergency}>
//           <View style={[styles.actionIcon, { backgroundColor: Colors.primary[500] }]}>
//             <Phone size={20} color={Colors.white} />
//           </View>
//           <Text style={styles.actionText}>Call Emergency</Text>
//         </TouchableOpacity>

//           <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Emergency')}>
//             <View style={[styles.actionIcon, { backgroundColor: Colors.success[500] }]}>
//               <Heart size={40} color={Colors.white} />  {/* Bigger icon */}
//             </View>
//             <Text style={styles.actionText}>Lifeline AI</Text>  {/* Updated text */}
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.actionCard}>
//             <View style={[styles.actionIcon, { backgroundColor: Colors.secondary[500] }]}>
//               <MapPin size={20} color={Colors.white} />
//             </View>
//             <Text style={styles.actionText}>My Location</Text>
//           </TouchableOpacity>
//         </View>

//         <Text style={styles.sectionTitle}>Emergency Contacts</Text>
        
//         {user?.emergencyContacts.length > 0 ? (
//           <View style={styles.contactsList}>
//             {user.emergencyContacts.map((contact) => (
//               <TouchableOpacity key={contact.id} style={styles.contactCard}>
//                 <View style={styles.contactInfo}>
//                   <Text style={styles.contactName}>{contact.name}</Text>
//                   <Text style={styles.contactPhone}>{contact.phoneNumber}</Text>
//                 </View>
//                 <ChevronRight size={20} color={Colors.gray[400]} />
//               </TouchableOpacity>
//             ))}
//           </View>
//         ) : (
//           <View style={styles.emptyState}>
//             <Text style={styles.emptyStateText}>
//               No emergency contacts added yet
//             </Text>
//             <TouchableOpacity style={styles.addButton}>
//               <Text style={styles.addButtonText}>Add Contacts</Text>
//             </TouchableOpacity>
//           </View>
//         )}

//         <Text style={styles.sectionTitle}>Recent Alerts</Text>
        
//         <View style={styles.alertCard}>
//           <View style={styles.alertHeader}>
//             <View style={styles.alertIcon}>
//               <Clock size={16} color={Colors.white} />
//             </View>
//             <Text style={styles.alertTime}>Today, 10:15 AM</Text>
//           </View>
//           <Text style={styles.alertTitle}>Practice Alert</Text>
//           <Text style={styles.alertDescription}>
//             This is a test alert to show how emergency notifications will appear.
//           </Text>
//         </View>

//         <View style={styles.tipsSection}>
//           <Text style={styles.sectionTitle}>Emergency Tips</Text>
//           <Image
//             source={{ uri: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg' }}
//             style={styles.tipsImage}
//             resizeMode="cover"
//           />
//           <Text style={styles.tipsTitle}>Be Prepared</Text>
//           <Text style={styles.tipsText}>
//             Remember to keep your phone charged and easily accessible in case of emergencies.
//           </Text>
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.white,
//   },
//   header: {
//     paddingTop: 60,
//     paddingHorizontal: 24,
//     paddingBottom: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.gray[200],
//   },
//   greeting: {
//     fontSize: 16,
//     color: Colors.gray[600],
//     fontFamily: 'Inter-Regular',
//   },
//   username: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: Colors.gray[900],
//     fontFamily: 'Inter-Bold',
//   },
//   content: {
//     flex: 1,
//     padding: 24,
//   },
//   emergencyCard: {
//     backgroundColor: Colors.secondary[500],
//     borderRadius: 12,
//     padding: 20,
//     marginBottom: 24,
//     alignItems: 'center',
//   },
//   emergencyIcon: {
//     marginBottom: 12,
//   },
//   emergencyTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: Colors.white,
//     marginBottom: 8,
//     fontFamily: 'Inter-Bold',
//   },
//   emergencyText: {
//     fontSize: 16,
//     color: Colors.white,
//     textAlign: 'center',
//     fontFamily: 'Inter-Regular',
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: Colors.gray[900],
//     marginBottom: 16,
//     fontFamily: 'Inter-SemiBold',
//   },
//   quickActions: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 32,
//   },
//   actionCard: {
//     flex: 1,
//     alignItems: 'center',
//     marginHorizontal: 4,
//   },
//   actionIcon: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   actionText: {
//     fontSize: 14,
//     color: Colors.gray[800],
//     textAlign: 'center',
//     fontFamily: 'Inter-Medium',
//   },
//   contactsList: {
//     marginBottom: 24,
//   },
//   contactCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingVertical: 16,
//     paddingHorizontal: 12,
//     backgroundColor: Colors.gray[50],
//     borderRadius: 8,
//     marginBottom: 8,
//     borderWidth: 1,
//     borderColor: Colors.gray[200],
//   },
//   contactInfo: {
//     flex: 1,
//   },
//   contactName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: Colors.gray[900],
//     marginBottom: 4,
//     fontFamily: 'Inter-SemiBold',
//   },
//   contactPhone: {
//     fontSize: 14,
//     color: Colors.gray[600],
//     fontFamily: 'Inter-Regular',
//   },
//   emptyState: {
//     backgroundColor: Colors.gray[50],
//     borderRadius: 8,
//     padding: 16,
//     alignItems: 'center',
//     marginBottom: 24,
//     borderWidth: 1,
//     borderColor: Colors.gray[200],
//   },
//   emptyStateText: {
//     fontSize: 14,
//     color: Colors.gray[600],
//     marginBottom: 12,
//     fontFamily: 'Inter-Regular',
//   },
//   addButton: {
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     backgroundColor: Colors.primary[500],
//     borderRadius: 4,
//   },
//   addButtonText: {
//     fontSize: 14,
//     color: Colors.white,
//     fontWeight: '500',
//     fontFamily: 'Inter-Medium',
//   },
//   alertCard: {
//     backgroundColor: Colors.gray[50],
//     borderRadius: 8,
//     padding: 16,
//     marginBottom: 24,
//     borderLeftWidth: 4,
//     borderLeftColor: Colors.warning[500],
//   },
//   alertHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   alertIcon: {
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     backgroundColor: Colors.warning[500],
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 8,
//   },
//   alertTime: {
//     fontSize: 12,
//     color: Colors.gray[600],
//     fontFamily: 'Inter-Regular',
//   },
//   alertTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: Colors.gray[900],
//     marginBottom: 4,
//     fontFamily: 'Inter-SemiBold',
//   },
//   alertDescription: {
//     fontSize: 14,
//     color: Colors.gray[700],
//     fontFamily: 'Inter-Regular',
//   },
//   tipsSection: {
//     marginBottom: 40,
//   },
//   tipsImage: {
//     width: '100%',
//     height: 160,
//     borderRadius: 8,
//     marginBottom: 12,
//   },
//   tipsTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: Colors.gray[900],
//     marginBottom: 4,
//     fontFamily: 'Inter-SemiBold',
//   },
//   tipsText: {
//     fontSize: 14,
//     color: Colors.gray[700],
//     lineHeight: 20,
//     fontFamily: 'Inter-Regular',
//   },
// });


// screens/HomeScreen.tsx
import React from 'react';
import {
  StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, Linking
} from 'react-native';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';
import { useNavigation } from '@react-navigation/native';
import { Heart, Phone, MapPin, Clock, ChevronRight } from 'lucide-react-native';
import * as Location from 'expo-location';

export default function HomeScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();

  const handleCallEmergency = () => {
    if (user?.emergencyContacts.length) {
      const contact = user.emergencyContacts[0];
      if (contact.phoneNumber) {
        Linking.openURL(`tel:${contact.phoneNumber}`);
      } else {
        alert('No phone number available');
      }
    } else {
      alert('No emergency contacts found');
    }
  };

  const handleGetLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access location was denied');
      return;
    }
  
    const location = await Location.getCurrentPositionAsync({});
    alert(`Latitude: ${location.coords.latitude}\nLongitude: ${location.coords.longitude}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello,</Text>
        <Text style={styles.username}>
          {user?.email?.split('@')[0] || 'User'}
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.emergencyCard}>
          <Heart size={24} color={Colors.white} style={styles.emergencyIcon} />
          <Text style={styles.emergencyTitle}>Emergency Ready</Text>
          <Text style={styles.emergencyText}>
            Tap the Emergency tab for immediate assistance
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionCard} onPress={handleCallEmergency}>
            <View style={[styles.actionIcon, { backgroundColor: Colors.primary[500] }]}>
              <Phone size={20} color={Colors.white} />
            </View>
            <Text style={styles.actionText}>Call Emergency</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Emergency')}
          >
            <View style={[styles.actionIcon, { backgroundColor: Colors.success[500] }]}>
              <Heart size={40} color={Colors.white} />
            </View>
            <Text style={styles.actionText}>Lifeline AI</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={handleGetLocation}>
            <View style={[styles.actionIcon, { backgroundColor: Colors.secondary[500] }]}>
              <MapPin size={20} color={Colors.white} />
            </View>
            <Text style={styles.actionText}>My Location</Text>
          </TouchableOpacity>

        </View>

        <Text style={styles.sectionTitle}>Emergency Contacts</Text>

        {user?.emergencyContacts?.length ? (
          <View style={styles.contactsList}>
            {user.emergencyContacts.map((contact) => (
              <TouchableOpacity key={contact.id} style={styles.contactCard}>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactPhone}>{contact.phoneNumber}</Text>
                </View>
                <ChevronRight size={20} color={Colors.gray[400]} />
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No emergency contacts added yet
            </Text>
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>Add Contacts</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.sectionTitle}>Recent Alerts</Text>
        <View style={styles.alertCard}>
          <View style={styles.alertHeader}>
            <View style={styles.alertIcon}>
              <Clock size={16} color={Colors.white} />
            </View>
            <Text style={styles.alertTime}>Today, 10:15 AM</Text>
          </View>
          <Text style={styles.alertTitle}>Practice Alert</Text>
          <Text style={styles.alertDescription}>
            This is a test alert to show how emergency notifications will appear.
          </Text>
        </View>

        <View style={styles.tipsSection}>
          <Text style={styles.sectionTitle}>Emergency Tips</Text>
          <Image
            source={{
              uri: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg',
            }}
            style={styles.tipsImage}
            resizeMode="cover"
          />
          <Text style={styles.tipsTitle}>Be Prepared</Text>
          <Text style={styles.tipsText}>
            Remember to keep your phone charged and easily accessible in case of emergencies.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: {
    paddingTop: 60, paddingHorizontal: 24, paddingBottom: 16,
    borderBottomWidth: 1, borderBottomColor: Colors.gray[200],
  },
  greeting: { fontSize: 16, color: Colors.gray[600] },
  username: { fontSize: 24, fontWeight: '700', color: Colors.gray[900] },
  content: { flex: 1, padding: 24 },
  emergencyCard: {
    backgroundColor: Colors.secondary[500],
    borderRadius: 12, padding: 20, marginBottom: 24, alignItems: 'center',
  },
  emergencyIcon: { marginBottom: 12 },
  emergencyTitle: {
    fontSize: 20, fontWeight: '700', color: Colors.white, marginBottom: 8,
  },
  emergencyText: {
    fontSize: 16, color: Colors.white, textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18, fontWeight: '600', color: Colors.gray[900], marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32,
  },
  actionCard: {
    width: '30%', alignItems: 'center',
  },
  actionIcon: {
    width: 60, height: 60, borderRadius: 30,
    justifyContent: 'center', alignItems: 'center', marginBottom: 8,
  },
  actionText: { textAlign: 'center' },
  contactsList: { marginBottom: 24 },
  contactCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.gray[200],
  },
  contactInfo: {},
  contactName: { fontWeight: '600', fontSize: 16 },
  contactPhone: { color: Colors.gray[600], fontSize: 14 },
  emptyState: { alignItems: 'center', marginVertical: 16 },
  emptyStateText: { color: Colors.gray[600], marginBottom: 8 },
  addButton: {
    backgroundColor: Colors.primary[500],
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8,
  },
  addButtonText: { color: Colors.white },
  alertCard: {
    backgroundColor: Colors.gray[100], padding: 16,
    borderRadius: 8, marginBottom: 24,
  },
  alertHeader: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 8,
  },
  alertIcon: {
    backgroundColor: Colors.primary[500],
    padding: 4, borderRadius: 4, marginRight: 8,
  },
  alertTime: { fontSize: 12, color: Colors.gray[600] },
  alertTitle: { fontWeight: '600', fontSize: 16 },
  alertDescription: { color: Colors.gray[700], marginTop: 4 },
  tipsSection: { marginBottom: 60 },
  tipsImage: { width: '100%', height: 180, borderRadius: 12, marginVertical: 12 },
  tipsTitle: { fontWeight: '600', fontSize: 16 },
  tipsText: { color: Colors.gray[700], marginTop: 4 },
});
