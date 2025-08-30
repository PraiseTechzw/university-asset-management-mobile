import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../../lib/supabase';
import { Asset } from '../../../lib/supabase';
import Colors from '../../../constants/Colors';
import { statusColors } from '../../../constants/Colors';

interface AssetItemProps {
  asset: Asset;
  onPress: () => void;
}

const AssetItem: React.FC<AssetItemProps> = ({ asset, onPress }) => (
  <TouchableOpacity style={styles.assetItem} onPress={onPress}>
    <View style={styles.assetIcon}>
      <Ionicons name="cube-outline" size={24} color={Colors.light.primary} />
    </View>
    
    <View style={styles.assetInfo}>
      <Text style={styles.assetName}>{asset.name}</Text>
      <Text style={styles.assetCategory}>{asset.category || 'No category'}</Text>
      <Text style={styles.assetLocation}>{asset.location || 'No location'}</Text>
      {asset.asset_tag && (
        <Text style={styles.assetTag}>Tag: {asset.asset_tag}</Text>
      )}
    </View>
    
    <View style={[styles.statusBadge, { backgroundColor: statusColors[asset.status] }]}>
      <Text style={styles.statusText}>{asset.status}</Text>
    </View>
  </TouchableOpacity>
);

export default function AssetsScreen() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const router = useRouter();

  const loadAssets = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;

      setAssets(data || []);
      setFilteredAssets(data || []);
    } catch (error) {
      console.error('Error loading assets:', error);
      Alert.alert('Error', 'Failed to load assets');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAssets();
    setRefreshing(false);
  };

  useEffect(() => {
    loadAssets();
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = assets;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(asset =>
        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.asset_tag?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.serial_number?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(asset => asset.status === statusFilter);
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(asset => asset.category === categoryFilter);
    }

    setFilteredAssets(filtered);
  }, [assets, searchQuery, statusFilter, categoryFilter]);

  const getUniqueCategories = () => {
    const categories = assets.map(asset => asset.category).filter(Boolean);
    return ['all', ...Array.from(new Set(categories))];
  };

  const getStatusCount = (status: string) => {
    return assets.filter(asset => asset.status === status).length;
  };

  const FilterChip = ({ title, selected, onPress, count }: {
    title: string;
    selected: boolean;
    onPress: () => void;
    count?: number;
  }) => (
    <TouchableOpacity
      style={[styles.filterChip, selected && styles.filterChipSelected]}
      onPress={onPress}
    >
      <Text style={[styles.filterChipText, selected && styles.filterChipTextSelected]}>
        {title} {count !== undefined && `(${count})`}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
        <Text style={styles.loadingText}>Loading assets...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search-outline" size={20} color={Colors.light.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search assets..."
            placeholderTextColor={Colors.light.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={Colors.light.textSecondary} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Status Filters */}
      <View style={styles.filtersContainer}>
        <Text style={styles.filtersTitle}>Status</Text>
        <View style={styles.filtersRow}>
          <FilterChip
            title="All"
            selected={statusFilter === 'all'}
            onPress={() => setStatusFilter('all')}
            count={assets.length}
          />
          <FilterChip
            title="Available"
            selected={statusFilter === 'available'}
            onPress={() => setStatusFilter('available')}
            count={getStatusCount('available')}
          />
          <FilterChip
            title="Assigned"
            selected={statusFilter === 'assigned'}
            onPress={() => setStatusFilter('assigned')}
            count={getStatusCount('assigned')}
          />
          <FilterChip
            title="Maintenance"
            selected={statusFilter === 'maintenance'}
            onPress={() => setStatusFilter('maintenance')}
            count={getStatusCount('maintenance')}
          />
        </View>
      </View>

      {/* Category Filters */}
      <View style={styles.filtersContainer}>
        <Text style={styles.filtersTitle}>Category</Text>
        <View style={styles.filtersRow}>
          <FilterChip
            title="All"
            selected={categoryFilter === 'all'}
            onPress={() => setCategoryFilter('all')}
          />
          {getUniqueCategories().slice(1).map(category => (
            <FilterChip
              key={category}
              title={category || 'Uncategorized'}
              selected={categoryFilter === category}
              onPress={() => setCategoryFilter(category)}
            />
          ))}
        </View>
      </View>

      {/* Assets List */}
      <FlatList
        data={filteredAssets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AssetItem
            asset={item}
            onPress={() => router.push(`/(dashboard)/assets/${item.id}`)}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="cube-outline" size={64} color={Colors.light.textTertiary} />
            <Text style={styles.emptyTitle}>No assets found</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all'
                ? 'Try adjusting your filters or search terms'
                : 'No assets have been added yet'}
            </Text>
          </View>
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/(dashboard)/assets/new')}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.light.textSecondary,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: Colors.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surfaceVariant,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: Colors.light.text,
  },
  filtersContainer: {
    padding: 16,
    backgroundColor: Colors.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  filtersTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 12,
  },
  filtersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.light.surfaceVariant,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  filterChipSelected: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  filterChipText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
  filterChipTextSelected: {
    color: 'white',
  },
  listContainer: {
    padding: 16,
  },
  assetItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
  assetIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  assetInfo: {
    flex: 1,
  },
  assetName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 4,
  },
  assetCategory: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 2,
  },
  assetLocation: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 2,
  },
  assetTag: {
    fontSize: 12,
    color: Colors.light.textTertiary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'white',
    textTransform: 'capitalize',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
