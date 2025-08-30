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

// Database types for TypeScript
export interface Database {
  public: {
    Tables: {
      assets: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          serial_number: string | null;
          asset_tag: string | null;
          category: string | null;
          location: string | null;
          status: 'available' | 'assigned' | 'maintenance' | 'retired';
          assigned_to: string | null;
          assigned_date: string | null;
          purchase_date: string | null;
          warranty_expiry: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          serial_number?: string | null;
          asset_tag?: string | null;
          category?: string | null;
          location?: string | null;
          status?: 'available' | 'assigned' | 'maintenance' | 'retired';
          assigned_to?: string | null;
          assigned_date?: string | null;
          purchase_date?: string | null;
          warranty_expiry?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          serial_number?: string | null;
          asset_tag?: string | null;
          category?: string | null;
          location?: string | null;
          status?: 'available' | 'assigned' | 'maintenance' | 'retired';
          assigned_to?: string | null;
          assigned_date?: string | null;
          purchase_date?: string | null;
          warranty_expiry?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      asset_requests: {
        Row: {
          id: string;
          user_id: string;
          asset_id: string | null;
          request_type: 'borrow' | 'maintenance' | 'return';
          description: string;
          priority: 'low' | 'medium' | 'high' | 'urgent';
          status: 'pending' | 'approved' | 'rejected' | 'completed';
          requested_date: string;
          approved_date: string | null;
          completed_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          asset_id?: string | null;
          request_type: 'borrow' | 'maintenance' | 'return';
          description: string;
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          status?: 'pending' | 'approved' | 'rejected' | 'completed';
          requested_date?: string;
          approved_date?: string | null;
          completed_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          asset_id?: string | null;
          request_type?: 'borrow' | 'maintenance' | 'return';
          description?: string;
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          status?: 'pending' | 'approved' | 'rejected' | 'completed';
          requested_date?: string;
          approved_date?: string | null;
          completed_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      users: {
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
    };
  };
}

export type Asset = Database['public']['Tables']['assets']['Row'];
export type AssetRequest = Database['public']['Tables']['asset_requests']['Row'];
export type User = Database['public']['Tables']['users']['Row'];
