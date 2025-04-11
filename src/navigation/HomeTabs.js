import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/Home/Home';
import RegistrationScreen from '../screens/Auth/Registration';
import { FontAwesome } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function HomeTabs({ route }) {
  const { email, password } = route.params;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: '#00AF00', borderTopWidth: 0 },
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#B7B021',
        tabBarIcon: ({ color, size }) => {
          let iconName = route.name === 'Home' ? 'home' : 'user-plus';
          return <FontAwesome name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} initialParams={{ email, password }} />
      <Tab.Screen name="Registration" component={RegistrationScreen} />
    </Tab.Navigator>
  );
}
