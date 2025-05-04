import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';
import { Users, Heart, MapPin, Bell, CircleHelp as HelpCircle, Settings, LogOut, ChevronRight } from 'lucide-react-native';

export default function MoreScreen() {
  const { user, signOut } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  const menuItems = [
    {
      title: 'Emergency Contacts',
      icon: <Users size={20} color={Colors.primary[500]} />,
      badge: user?.emergencyContacts.length || 0,
    },
    {
      title: 'Medical Information',
      icon: <Heart size={20} color={Colors.secondary[500]} />,
    },
    {
      title: 'Location Settings',
      icon: <MapPin size={20} color={Colors.success[500]} />,
      toggle: true,
      value: user?.hasGrantedLocationPermission || false,
    },
    {
      title: 'Notification Preferences',
      icon: <Bell size={20} color={Colors.warning[500]} />,
      toggle: true,
      value: notificationsEnabled,
      onToggle: setNotificationsEnabled,
    },
    {
      title: 'Help & Support',
      icon: <HelpCircle size={20} color={Colors.gray[700]} />,
    },
    {
      title: 'App Settings',
      icon: <Settings size={20} color={Colors.gray[700]} />,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>More</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.userSection}>
          <View style={styles.userInfo}>
            <View style={styles.userInitial}>
              <Text style={styles.initialText}>
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
            <View>
              <Text style={styles.userName}>{user?.email?.split('@')[0] || 'User'}</Text>
              <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editProfileButton}>
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.menuItem}
              disabled={item.toggle}
            >
              <View style={styles.menuItemLeft}>
                {item.icon}
                <Text style={styles.menuItemText}>{item.title}</Text>
              </View>
              
              <View style={styles.menuItemRight}>
                {item.badge !== undefined && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.badge}</Text>
                  </View>
                )}
                
                {item.toggle ? (
                  <Switch
                    value={item.value}
                    onValueChange={item.onToggle}
                    trackColor={{ false: Colors.gray[300], true: Colors.primary[300] }}
                    thumbColor={item.value ? Colors.primary[500] : Colors.gray[100]}
                  />
                ) : (
                  <ChevronRight size={20} color={Colors.gray[400]} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        <TouchableOpacity 
          style={styles.signOutButton}
          onPress={signOut}
        >
          <LogOut size={20} color={Colors.secondary[500]} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
        
        <View style={styles.footer}>
          <Text style={styles.version}>Version 1.0.0</Text>
          <Text style={styles.copyright}>© 2025 AI First Responder</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.gray[900],
    fontFamily: 'Inter-Bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  userSection: {
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  userInitial: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  initialText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.white,
    fontFamily: 'Inter-Bold',
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.gray[900],
    marginBottom: 4,
    fontFamily: 'Inter-SemiBold',
  },
  userEmail: {
    fontSize: 14,
    color: Colors.gray[600],
    fontFamily: 'Inter-Regular',
  },
  editProfileButton: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    backgroundColor: Colors.gray[100],
  },
  editProfileText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.gray[800],
    fontFamily: 'Inter-Medium',
  },
  menuSection: {
    paddingVertical: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: Colors.gray[900],
    marginLeft: 12,
    fontFamily: 'Inter-Regular',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: Colors.primary[100],
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.primary[500],
    fontFamily: 'Inter-Medium',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginTop: 24,
    borderWidth: 1,
    borderColor: Colors.secondary[500],
    borderRadius: 8,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.secondary[500],
    marginLeft: 8,
    fontFamily: 'Inter-Medium',
  },
  footer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  version: {
    fontSize: 14,
    color: Colors.gray[500],
    fontFamily: 'Inter-Regular',
  },
  copyright: {
    fontSize: 12,
    color: Colors.gray[500],
    marginTop: 4,
    fontFamily: 'Inter-Regular',
  },
});