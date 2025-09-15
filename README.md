# CivicFix Frontend 🏙️

A React Native mobile application built with Expo for reporting and managing civic issues. CivicFix enables citizens to report local problems, authorities to manage these reports, and departments to address and resolve issues efficiently.

## 📱 Features

### For Citizens
- **Issue Reporting**: Submit detailed reports with photos, descriptions, and automatic location capture
- **My Reports**: View and track the status of submitted reports
- **Dashboard**: Monitor personal reporting activity and statistics
- **Profile Management**: Manage personal information and account settings

### For Authorities/Admin
- **Analytics Dashboard**: View comprehensive statistics and insights
- **Department Management**: Oversee and manage different municipal departments
- **Issue Overview**: Monitor all reported issues across the platform
- **User Management**: Handle user accounts and permissions

### For Departments
- **Department Dashboard**: View assigned issues and department-specific metrics
- **Issue Resolution**: Update issue status and manage department workflow
- **Profile Management**: Maintain department information

## 🛠️ Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router v6
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **State Management**: Zustand
- **Storage**: AsyncStorage for local data persistence
- **Authentication**: JWT with custom token management
- **Location Services**: Expo Location
- **Image Handling**: Expo Image Picker & Camera
- **UI Components**: React Native + Expo Vector Icons

## 📁 Project Structure

```
CivicFix-Frontend/
├── app/                           # Main application screens
│   ├── _layout.jsx               # Root layout
│   ├── index.jsx                 # Landing/Home page
│   ├── citizenLogin.jsx          # Citizen authentication
│   ├── AutorityLogin.jsx         # Authority authentication
│   ├── deptLogin.jsx            # Department authentication
│   ├── signup.jsx               # User registration
│   ├── (Admin)/                 # Admin-specific screens
│   │   ├── analytics.jsx        # Analytics dashboard
│   │   ├── DepartmentManagement.jsx
│   │   └── home_admin.jsx       # Admin home
│   ├── (DashBoard)/             # Citizen dashboard
│   │   ├── Home.jsx             # Dashboard home
│   │   ├── MyReports.jsx        # User's reports
│   │   └── Profile.jsx          # User profile
│   ├── (Department)/            # Department screens
│   │   ├── DepartmentHome.jsx   # Department dashboard
│   │   └── DepartmentProfile.jsx
│   └── (Reports)/               # Report management
│       ├── AddPost.jsx          # Create new report
│       └── ReportsDetails.jsx   # View report details
├── Components/                   # Reusable components
│   ├── Allissues_dash.jsx      # Issues dashboard component
│   ├── IssueCard.jsx           # Individual issue card
│   ├── MyReports_dash.jsx      # Personal reports component
│   └── StatusBadge.jsx         # Status indicator component
├── store/                       # State management
│   └── useAuthStore.js         # Authentication store
├── assets/                      # Images and static files
├── config/                      # Configuration files
└── ...
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Android Studio (for Android development)
- Xcode (for iOS development - macOS only)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/S26R/CivicFix-Frontend.git
   cd CivicFix-Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   API_URL=your_backend_api_url
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

### Running on Devices

- **Android**: `npm run android`
- **iOS**: `npm run ios`
- **Web**: `npm run web`

## 📱 App Navigation

The app uses a role-based navigation system:

1. **Landing Page**: Users select their role (Citizen, Authority, or Department)
2. **Authentication**: Role-specific login screens
3. **Dashboard**: Customized experience based on user role
4. **Feature Access**: Different features available based on permissions

## 🔐 Authentication

The app implements JWT-based authentication with:
- Role-based access control (Citizen, Authority, Department)
- Secure token storage using AsyncStorage
- Automatic token validation and refresh
- Multi-role login support

## 📸 Key Features Implementation

### Issue Reporting
- Camera integration for photo capture
- GPS location tracking
- Department categorization
- Real-time form validation

### Dashboard Analytics
- Issue statistics and metrics
- Status tracking
- Progress visualization
- Department performance monitoring

### State Management
- Zustand for lightweight state management
- Persistent authentication state
- Optimistic UI updates

## 🎨 Styling

The app uses NativeWind for styling, which brings Tailwind CSS utility classes to React Native:
- Consistent design system
- Responsive layouts
- Dark/light theme support
- Custom color schemes

## 🔧 Development Scripts

```json
{
  "start": "expo start",
  "android": "expo start --android", 
  "ios": "expo start --ios",
  "web": "expo start --web"
}
```

## 📦 Key Dependencies

- `expo`: ^54.0.2 - Expo SDK
- `expo-router`: ~6.0.1 - File-based routing
- `react-native`: 0.81.4 - React Native framework
- `zustand`: ^5.0.8 - State management
- `nativewind`: ^4.1.23 - Tailwind CSS for React Native
- `expo-location`: ~19.0.7 - Location services
- `expo-image-picker`: ~17.0.8 - Image selection
- `jwt-decode`: ^4.0.0 - JWT token handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

**DevVikings** - Developed as part of a civic engagement initiative to improve municipal service delivery and citizen participation.

## 🐛 Known Issues

- Ensure location permissions are granted for proper functionality
- Camera permissions required for image capture
- Network connectivity needed for API interactions

## 📞 Support

For support and questions, please open an issue in the GitHub repository.

---

**CivicFix** - Bridging the gap between citizens and civic authorities through technology. 🌟
