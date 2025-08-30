import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../components/auth/AuthContext';
import Colors from '../../../constants/Colors';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            const result = await signOut();
            if (result.error) {
              Alert.alert('Error', result.error);
            }
          },
        },
      ]
    );
  };

  const ProfileSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const ProfileItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    showArrow = true,
    rightComponent 
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    showArrow?: boolean;
    rightComponent?: React.ReactNode;
  }) => (
    <TouchableOpacity
      style={styles.profileItem}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.profileItemLeft}>
        <View style={styles.profileItemIcon}>
          <Ionicons name={icon as any} size={20} color={Colors.light.primary} />
        </View>
        <View style={styles.profileItemText}>
          <Text style={styles.profileItemTitle}>{title}</Text>
          {subtitle && (
            <Text style={styles.profileItemSubtitle}>{subtitle}</Text>
          )}
        </View>
      </View>
      
      {rightComponent ? (
        rightComponent
      ) : showArrow && onPress ? (
        <Ionicons name="chevron-forward" size={20} color={Colors.light.textTertiary} />
      ) : null}
    </TouchableOpacity>
  );

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    value, 
    onValueChange 
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
  }) => (
    <View style={styles.profileItem}>
      <View style={styles.profileItemLeft}>
        <View style={styles.profileItemIcon}>
          <Ionicons name={icon as any} size={20} color={Colors.light.primary} />
        </View>
        <View style={styles.profileItemText}>
          <Text style={styles.profileItemTitle}>{title}</Text>
          {subtitle && (
            <Text style={styles.profileItemSubtitle}>{subtitle}</Text>
          )}
        </View>
      </View>
      
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: Colors.light.border, true: Colors.light.primary }}
        thumbColor={value ? 'white' : Colors.light.textTertiary}
      />
    </View>
  );

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>User not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color={Colors.light.primary} />
          </View>
        </View>
        
        <Text style={styles.userName}>{user.full_name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
        <Text style={styles.userRole}>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</Text>
        
        {user.department && (
          <Text style={styles.userDepartment}>{user.department}</Text>
        )}
      </View>

      {/* Account Information */}
      <ProfileSection title="Account Information">
        <ProfileItem
          icon="person-outline"
          title="Edit Profile"
          subtitle="Update your personal information"
          onPress={() => router.push('/(dashboard)/profile/edit')}
        />
        
        <ProfileItem
          icon="lock-closed-outline"
          title="Change Password"
          subtitle="Update your password"
          onPress={() => router.push('/(dashboard)/profile/change-password')}
        />
        
        <ProfileItem
          icon="shield-checkmark-outline"
          title="Security Settings"
          subtitle="Manage your security preferences"
          onPress={() => router.push('/(dashboard)/profile/security')}
        />
      </ProfileSection>

      {/* App Settings */}
      <ProfileSection title="App Settings">
        <SettingItem
          icon="notifications-outline"
          title="Push Notifications"
          subtitle="Receive alerts about your assets"
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
        />
        
        <SettingItem
          icon="moon-outline"
          title="Dark Mode"
          subtitle="Switch between light and dark themes"
          value={darkModeEnabled}
          onValueChange={setDarkModeEnabled}
        />
        
        <SettingItem
          icon="finger-print-outline"
          title="Biometric Login"
          subtitle="Use fingerprint or face ID to sign in"
          value={biometricEnabled}
          onValueChange={setBiometricEnabled}
        />
      </ProfileSection>

      {/* Support & Help */}
      <ProfileSection title="Support & Help">
        <ProfileItem
          icon="help-circle-outline"
          title="Help Center"
          subtitle="Get help and find answers"
          onPress={() => router.push('/(dashboard)/profile/help')}
        />
        
        <ProfileItem
          icon="document-text-outline"
          title="User Manual"
          subtitle="Learn how to use the app"
          onPress={() => router.push('/(dashboard)/profile/manual')}
        />
        
        <ProfileItem
          icon="chatbubble-outline"
          title="Contact Support"
          subtitle="Get in touch with our team"
          onPress={() => router.push('/(dashboard)/profile/contact')}
        />
      </ProfileSection>

      {/* About */}
      <ProfileSection title="About">
        <ProfileItem
          icon="information-circle-outline"
          title="App Version"
          subtitle="1.0.0"
          showArrow={false}
        />
        
        <ProfileItem
          icon="business-outline"
          title="CUT Asset Manager"
          subtitle="Chinhoyi University of Technology"
          showArrow={false}
        />
        
        <ProfileItem
          icon="document-outline"
          title="Privacy Policy"
          subtitle="Read our privacy policy"
          onPress={() => router.push('/(dashboard)/profile/privacy')}
        />
        
        <ProfileItem
          icon="document-text-outline"
          title="Terms of Service"
          subtitle="Read our terms of service"
          onPress={() => router.push('/(dashboard)/profile/terms')}
        />
      </ProfileSection>

      {/* Sign Out */}
      <View style={styles.signOutSection}>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={20} color={Colors.light.error} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: Colors.light.error,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: Colors.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.light.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    marginBottom: 8,
  },
  userRole: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: '600',
    marginBottom: 4,
  },
  userDepartment: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.light.surface,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  profileItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileItemText: {
    flex: 1,
  },
  profileItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: 2,
  },
  profileItemSubtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  signOutSection: {
    marginTop: 32,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.surface,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.error,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.error,
    marginLeft: 8,
  },
});
