import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../components/auth/AuthContext';
import { supabase } from '../../lib/supabase';
import { Asset, AssetIssue } from '../../lib/supabase';
import Colors from '../../constants/Colors';
import { statusColors, priorityColors } from '../../constants/Colors';

interface DashboardStats {
  totalAssets: number;
  availableAssets: number;
  issuedAssets: number;
  maintenanceAssets: number;
  activeIssues: number;
  myIssues: number;
}

export default function DashboardScreen() {
  const [stats, setStats] = useState<DashboardStats>({
    totalAssets: 0,
    availableAssets: 0,
    issuedAssets: 0,
    maintenanceAssets: 0,
    activeIssues: 0,
    myIssues: 0,
  });
  const [recentAssets, setRecentAssets] = useState<Asset[]>([]);
  const [recentIssues, setRecentIssues] = useState<AssetIssue[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { user } = useAuth();
  const router = useRouter();

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load asset statistics
      const { data: assets, error: assetsError } = await supabase
        .from('assets')
        .select('*');

      if (assetsError) throw assetsError;

      // Load asset issue statistics
      const { data: issues, error: issuesError } = await supabase
        .from('asset_issues')
        .select('*');

      if (issuesError) throw issuesError;

      // Calculate statistics
      const totalAssets = assets?.length || 0;
      const availableAssets = assets?.filter(a => a.status === 'available').length || 0;
      const issuedAssets = assets?.filter(a => a.status === 'issued').length || 0;
      const maintenanceAssets = assets?.filter(a => a.status === 'maintenance').length || 0;
      const activeIssues = issues?.filter(i => i.status === 'active').length || 0;
      const myIssues = issues?.filter(i => i.issued_to === user?.id).length || 0;

      setStats({
        totalAssets,
        availableAssets,
        issuedAssets,
        maintenanceAssets,
        activeIssues,
        myIssues,
      });

      // Load recent assets
      const { data: recentAssetsData } = await supabase
        .from('assets')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentAssets(recentAssetsData || []);

      // Load recent asset issues
      const { data: recentIssuesData } = await supabase
        .from('asset_issues')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentIssues(recentIssuesData || []);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const StatCard = ({ title, value, icon, color, onPress }: {
    title: string;
    value: number;
    icon: string;
    color: string;
    onPress?: () => void;
  }) => (
    <TouchableOpacity
      style={[styles.statCard, { borderLeftColor: color }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.statContent}>
        <Ionicons name={icon as any} size={24} color={color} />
        <View style={styles.statText}>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statTitle}>{title}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const QuickAction = ({ title, icon, color, onPress }: {
    title: string;
    icon: string;
    color: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity style={styles.quickAction} onPress={onPress}>
      <View style={[styles.quickActionIcon, { backgroundColor: color }]}>
        <Ionicons name={icon as any} size={24} color="white" />
      </View>
      <Text style={styles.quickActionText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome back, {user?.full_name}!</Text>
        <Text style={styles.subtitle}>Here's what's happening with your assets</Text>
      </View>

      {/* Statistics Cards */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.statsGrid}>
          <StatCard
            title="Total Assets"
            value={stats.totalAssets}
            icon="cube-outline"
            color={Colors.light.primary}
            onPress={() => router.push('/(dashboard)/assets')}
          />
          <StatCard
            title="Available"
            value={stats.availableAssets}
            icon="checkmark-circle-outline"
            color={Colors.light.success}
            onPress={() => router.push('/(dashboard)/assets')}
          />
          <StatCard
            title="Assigned"
            value={stats.assignedAssets}
            icon="person-outline"
            color={Colors.light.info}
            onPress={() => router.push('/(dashboard)/assets')}
          />
          <StatCard
            title="Maintenance"
            value={stats.maintenanceAssets}
            icon="construct-outline"
            color={Colors.light.warning}
            onPress={() => router.push('/(dashboard)/maintenance')}
          />
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <QuickAction
            title="Scan QR Code"
            icon="qr-code-outline"
            color={Colors.light.primary}
            onPress={() => router.push('/(dashboard)/assets/scan')}
          />
          <QuickAction
            title="New Request"
            icon="add-circle-outline"
            color={Colors.light.accent}
            onPress={() => router.push('/(dashboard)/requests/new')}
          />
          <QuickAction
            title="My Assets"
            icon="person-circle-outline"
            color={Colors.light.info}
            onPress={() => router.push('/(dashboard)/my-assets')}
          />
          <QuickAction
            title="Calendar"
            icon="calendar-outline"
            color={Colors.light.success}
            onPress={() => router.push('/(dashboard)/calendar')}
          />
        </View>
      </View>

      {/* Recent Assets */}
      <View style={styles.recentContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Assets</Text>
          <TouchableOpacity onPress={() => router.push('/(dashboard)/assets')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        {recentAssets.map((asset) => (
          <TouchableOpacity
            key={asset.id}
            style={styles.recentItem}
            onPress={() => router.push(`/(dashboard)/assets/${asset.id}`)}
          >
            <View style={styles.recentItemContent}>
              <View style={styles.recentItemIcon}>
                <Ionicons name="cube-outline" size={20} color={Colors.light.primary} />
              </View>
              <View style={styles.recentItemText}>
                <Text style={styles.recentItemTitle}>{asset.name}</Text>
                <Text style={styles.recentItemSubtitle}>{asset.category || 'No category'}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: statusColors[asset.status] }]}>
                <Text style={styles.statusText}>{asset.status}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Recent Requests */}
      <View style={styles.recentContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Requests</Text>
          <TouchableOpacity onPress={() => router.push('/(dashboard)/requests')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        {recentRequests.map((request) => (
          <TouchableOpacity
            key={request.id}
            style={styles.recentItem}
            onPress={() => router.push(`/(dashboard)/requests/${request.id}`)}
          >
            <View style={styles.recentItemContent}>
              <View style={styles.recentItemIcon}>
                <Ionicons name="document-text-outline" size={20} color={Colors.light.accent} />
              </View>
              <View style={styles.recentItemText}>
                <Text style={styles.recentItemTitle}>{request.request_type}</Text>
                <Text style={styles.recentItemSubtitle}>{request.description}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: statusColors[request.status] }]}>
                <Text style={styles.statusText}>{request.status}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    padding: 20,
    backgroundColor: Colors.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
  },
  statsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    shadowColor: Colors.light.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: 12,
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  statTitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  quickActionsContainer: {
    padding: 20,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAction: {
    width: '48%',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: Colors.light.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.text,
    textAlign: 'center',
  },
  recentContainer: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: '500',
  },
  recentItem: {
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.light.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  recentItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recentItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recentItemText: {
    flex: 1,
  },
  recentItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: 2,
  },
  recentItemSubtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'white',
    textTransform: 'capitalize',
  },
});
