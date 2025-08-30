# CUT Asset Manager Mobile App

A comprehensive React Native Expo mobile application for managing university assets at Chinhoyi University of Technology (CUT). This mobile app integrates seamlessly with the existing web application using the same Supabase backend.

## 🚀 Features

### Core Functionality
- **Asset Management**: Browse, search, and filter assets by status and category
- **QR Code Scanning**: Quick asset identification using built-in camera
- **Role-Based Access**: Different interfaces for Admin, Technician, and Staff users
- **Real-time Updates**: Live synchronization with the web application
- **Offline Support**: Work without internet connection with data caching

### User Roles
- **Admin**: Full system access, user management, asset administration
- **Technician**: Asset maintenance, issue resolution, technical operations
- **Staff**: Asset requests, basic operations, personal asset tracking

### Mobile-Specific Features
- **QR Scanner**: Scan asset QR codes for instant access
- **Camera Integration**: Take photos of assets and damage reports
- **Biometric Authentication**: Secure login with fingerprint/face ID
- **Push Notifications**: Real-time alerts for asset updates
- **Touch-Optimized UI**: Mobile-first design with intuitive navigation

## 🛠️ Tech Stack

- **Frontend**: React Native with Expo SDK 53
- **Navigation**: Expo Router with file-based routing
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **State Management**: React Context API
- **UI Components**: Custom components with consistent design system
- **Icons**: Ionicons and Lucide React Native
- **Authentication**: Supabase Auth with role-based access control

## 📱 App Structure

```
app/
├── (auth)/                    # Authentication routes
│   ├── login.tsx             # Login screen
│   ├── register.tsx          # Registration screen
│   └── forgot-password.tsx   # Password reset
├── (dashboard)/              # Main app routes
│   ├── index.tsx             # Dashboard home
│   ├── assets/               # Asset management
│   │   ├── index.tsx         # Assets list
│   │   ├── [id].tsx          # Asset details
│   │   └── scan.tsx          # QR scanner
│   ├── requests/             # Asset requests
│   ├── maintenance/          # Maintenance records
│   ├── profile/              # User profile
│   └── _layout.tsx           # Dashboard layout
├── _layout.tsx               # Root layout
└── index.tsx                 # Entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm
- Expo CLI (`npm install -g @expo/cli`)
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cut-asset-manager-mobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Supabase Configuration**
   - Create a new Supabase project
   - Set up the database tables (see Database Schema below)
   - Configure authentication and policies
   - Update the environment variables

5. **Start the development server**
   ```bash
   npm start
   # or
   pnpm start
   ```

6. **Run on device/simulator**
   ```bash
   # Android
   npm run android
   
   # iOS
   npm run ios
   
   # Web
   npm run web
   ```

## 🗄️ Database Schema

The mobile app uses the same database as the web application. Here are the key tables:

### Assets Table
```sql
CREATE TABLE assets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  serial_number TEXT,
  asset_tag TEXT UNIQUE,
  category TEXT,
  location TEXT,
  status TEXT CHECK (status IN ('available', 'assigned', 'maintenance', 'retired')),
  assigned_to UUID REFERENCES auth.users(id),
  assigned_date TIMESTAMP WITH TIME ZONE,
  purchase_date DATE,
  warranty_expiry DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Asset Requests Table
```sql
CREATE TABLE asset_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  asset_id UUID REFERENCES assets(id),
  request_type TEXT CHECK (request_type IN ('borrow', 'maintenance', 'return')),
  description TEXT NOT NULL,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
  requested_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_date TIMESTAMP WITH TIME ZONE,
  completed_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Users Table
```sql
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin', 'technician', 'staff')),
  department TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔐 Authentication & Security

### User Roles & Permissions
- **Admin**: Full access to all features and data
- **Technician**: Asset maintenance, issue management, limited admin functions
- **Staff**: Basic asset operations, personal requests, view-only access to most data

### Security Features
- Supabase Row Level Security (RLS) policies
- JWT token-based authentication
- Secure storage for sensitive data
- Biometric authentication support
- Session management and auto-logout

## 🎨 Design System

### Color Palette
- **Primary**: CUT Blue (#4F46E5)
- **Secondary**: CUT Blue Light (#6366F1)
- **Accent**: CUT Orange (#F59E0B)
- **Success**: Green (#10B981)
- **Warning**: Orange (#F59E0B)
- **Error**: Red (#EF4444)

### Typography
- **Primary Font**: System fonts (San Francisco on iOS, Roboto on Android)
- **Headings**: Bold weights for hierarchy
- **Body Text**: Regular weights for readability
- **Captions**: Smaller sizes for secondary information

### Components
- Consistent spacing and sizing
- Card-based layouts with shadows
- Touch-friendly button sizes
- Responsive design for different screen sizes

## 📱 Mobile Features

### QR Code Scanning
- Built-in camera integration
- Real-time asset lookup
- Error handling and validation
- Flash control for low-light conditions

### Offline Support
- Local data caching
- Queue-based sync when online
- Graceful degradation for offline features
- Conflict resolution strategies

### Push Notifications
- Asset due date reminders
- Maintenance alerts
- Request status updates
- System announcements

## 🧪 Testing

### Development Testing
```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Manual Testing Checklist
- [ ] Authentication flow (login, logout, password reset)
- [ ] Asset browsing and filtering
- [ ] QR code scanning functionality
- [ ] Offline mode behavior
- [ ] Role-based access control
- [ ] Push notification delivery
- [ ] Camera and photo capture
- [ ] Biometric authentication

## 🚀 Deployment

### Building for Production

1. **Configure app.json**
   - Update app name, version, and bundle identifiers
   - Configure signing certificates
   - Set up app store metadata

2. **Build the app**
   ```bash
   # Android APK
   eas build --platform android
   
   # iOS IPA
   eas build --platform ios
   ```

3. **Submit to app stores**
   - Google Play Store for Android
   - App Store for iOS

### Environment Configuration
- Production Supabase instance
- Production API endpoints
- App store signing keys
- Push notification certificates

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Standards
- Follow React Native best practices
- Use TypeScript for type safety
- Maintain consistent code formatting
- Write meaningful commit messages
- Include proper error handling

## 📚 Documentation

### Additional Resources
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [Expo Router Documentation](https://expo.github.io/router/)

### API Reference
- Asset Management API
- Authentication API
- Real-time Subscriptions
- Storage API

## 🐛 Troubleshooting

### Common Issues

**Build Errors**
- Clear Metro cache: `npx expo start --clear`
- Reset Expo cache: `npx expo install --fix`
- Check Node.js version compatibility

**Authentication Issues**
- Verify Supabase credentials
- Check network connectivity
- Validate user permissions

**Google OAuth Issues**
- Verify Google Client ID is correct in `.env` file
- Check redirect URIs match exactly in Google Cloud Console
- Ensure Google OAuth is enabled in Supabase dashboard
- Verify the app scheme `cut-asset-manager://` is properly configured
- Check that `expo-auth-session` plugin is included in `app.json`

**Camera/QR Scanner Issues**
- Ensure camera permissions are granted
- Check device compatibility
- Verify Expo camera plugin installation

### Support
- Check the [Issues](https://github.com/your-repo/issues) page
- Review [FAQ](docs/FAQ.md)
- Contact the development team

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Chinhoyi University of Technology for the project opportunity
- Expo team for the excellent development platform
- Supabase for the powerful backend services
- React Native community for the robust framework

---

**Developed for Chinhoyi University of Technology**  
**Asset Management System**  
**Version 1.0.0**
