import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace with your actual Supabase URL and anon key
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://asddokodyqoxhuuzkspn.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzZGRva29keXFveGh1dXprc3BuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0ODA2OTQsImV4cCI6MjA3MjA1NjY5NH0.POLS3_MOT-4Hevgt94LZ_ueWftEuByiXc7SwX3uYjjM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    flowType: 'pkce',
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Database types for TypeScript - Updated to match actual database schema
export interface Database {
  public: {
    Tables: {
      assets: {
        Row: {
          id: string;
          asset_code: string;
          name: string;
          category: 'projector' | 'laptop' | 'desktop' | 'printer' | 'camera' | 'other';
          brand: string | null;
          model: string | null;
          serial_number: string | null;
          purchase_date: string | null;
          purchase_price: number | null;
          warranty_expiry: string | null;
          condition: 'excellent' | 'good' | 'fair' | 'poor' | 'damaged';
          status: 'available' | 'issued' | 'maintenance' | 'retired';
          location: string | null;
          description: string | null;
          qr_code_url: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          asset_code: string;
          name: string;
          category: 'projector' | 'laptop' | 'desktop' | 'printer' | 'camera' | 'other';
          brand?: string | null;
          model?: string | null;
          serial_number?: string | null;
          purchase_date?: string | null;
          purchase_price?: number | null;
          warranty_expiry?: string | null;
          condition: 'excellent' | 'good' | 'fair' | 'poor' | 'damaged';
          status?: 'available' | 'issued' | 'maintenance' | 'retired';
          location?: string | null;
          description?: string | null;
          qr_code_url?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          asset_code?: string;
          name?: string;
          category?: 'projector' | 'laptop' | 'desktop' | 'printer' | 'camera' | 'other';
          brand?: string | null;
          model?: string | null;
          serial_number?: string | null;
          purchase_date?: string | null;
          purchase_price?: number | null;
          warranty_expiry?: string | null;
          condition?: 'excellent' | 'good' | 'fair' | 'poor' | 'damaged';
          status?: 'available' | 'issued' | 'maintenance' | 'retired';
          location?: string | null;
          description?: string | null;
          qr_code_url?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      asset_issues: {
        Row: {
          id: string;
          asset_id: string;
          issued_to: string;
          issued_by: string;
          issue_date: string;
          expected_return_date: string | null;
          actual_return_date: string | null;
          return_condition: 'excellent' | 'good' | 'fair' | 'poor' | 'damaged' | null;
          notes: string | null;
          status: 'active' | 'returned' | 'overdue';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          asset_id: string;
          issued_to: string;
          issued_by: string;
          issue_date?: string;
          expected_return_date?: string | null;
          actual_return_date?: string | null;
          return_condition?: 'excellent' | 'good' | 'fair' | 'poor' | 'damaged' | null;
          notes?: string | null;
          status?: 'active' | 'returned' | 'overdue';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          asset_id?: string;
          issued_to?: string;
          issued_by?: string;
          issue_date?: string;
          expected_return_date?: string | null;
          actual_return_date?: string | null;
          return_condition?: 'excellent' | 'good' | 'fair' | 'poor' | 'damaged' | null;
          notes?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role: 'admin' | 'technician' | 'staff';
          department: string | null;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name: string;
          role?: 'admin' | 'technician' | 'staff';
          department?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          role?: 'admin' | 'technician' | 'staff';
          department?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      maintenance_logs: {
        Row: {
          id: string;
          asset_id: string;
          maintenance_type: 'repair' | 'service' | 'inspection' | 'upgrade';
          description: string;
          cost: number | null;
          performed_by: string | null;
          maintenance_date: string;
          next_maintenance_date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          asset_id: string;
          maintenance_type: 'repair' | 'service' | 'inspection' | 'upgrade';
          description: string;
          cost?: number | null;
          performed_by?: string | null;
          maintenance_date?: string;
          next_maintenance_date?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          asset_id?: string;
          maintenance_type?: 'repair' | 'service' | 'inspection' | 'upgrade';
          description?: string;
          cost?: number | null;
          performed_by?: string | null;
          maintenance_date?: string;
          next_maintenance_date?: string | null;
          created_at?: string;
        };
      };
    };
  };
}

export type Asset = Database['public']['Tables']['assets']['Row'];
export type AssetIssue = Database['public']['Tables']['asset_issues']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type MaintenanceLog = Database['public']['Tables']['maintenance_logs']['Row'];
