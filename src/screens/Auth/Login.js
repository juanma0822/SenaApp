import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
  Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';

export default function InstagramLogin() {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleLogin = () => {
    // Add login logic here
    if (!username || !password) {
      alert('Please fill in all fields');
      return;
    }
    console.log('Logging in with:', username, password);
    navigation.navigate('HomeTabs', { email: username, password }); // Navegar a HomeTabs con parámetros
  };

  const handleLinkPress = (url) => {
    Linking.openURL(url);
  };

  return (
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          {/* Logo Section */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../../../assets/logoSena.png')}
              style={styles.logoImage}
            />
            <Text style={styles.logoText}>Registro Sena</Text>
          </View>

          {/* Form Section */}
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                placeholderTextColor="#666"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Contraseña"
                placeholderTextColor="#666"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!isPasswordVisible}
              />
              <Pressable 
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                style={styles.eyeIcon}
              >
                <FontAwesome 
                  name={isPasswordVisible ? 'eye' : 'eye-slash'} 
                  size={20} 
                  color="#666" 
                />
              </Pressable>
            </View>

            <TouchableOpacity
              onPress={handleLogin}
              style={styles.loginButton}
            >
              <LinearGradient
                colors={['#4AB000', '#00B03C', '#00AF00', '#93B000', '#B7B021']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
              >
                <Text style={styles.loginButtonText}>Ingresar</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Olvidaste tu contraseña?</Text>
            </TouchableOpacity>

            {/* OR Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.orText}>O</Text>
              <View style={styles.divider} />
            </View>

          </View>

          {/* Sign Up Section */}
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>No tienes cuenta? </Text>          
            <TouchableOpacity onPress={() => navigation.navigate('Registration')}>
              <Text style={styles.signUpLink}>Registrate</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>from</Text>
            <Text style={styles.metaText}>JuanmaSoft</Text>
          </View>

          {/* Links Footer */}
          <View style={styles.linksFooter}>
            <TouchableOpacity onPress={() => handleLinkPress('https://www.sena.edu.co/es-co/Paginas/default.aspx')}>
              <Text style={styles.footerLink}>Acerca de</Text>
            </TouchableOpacity>
            <Text style={styles.dotSeparator}>•</Text>
            <TouchableOpacity onPress={() => handleLinkPress('https://oferta.senasofiaplus.edu.co/sofia-oferta/')}>
              <Text style={styles.footerLink}>Sofia Plus</Text>
            </TouchableOpacity>
            <Text style={styles.dotSeparator}>•</Text>
            <TouchableOpacity onPress={() => handleLinkPress('https://www.sena.edu.co/es-co/trabajo/Paginas/busqueEmpleo.aspx')}>
              <Text style={styles.footerLink}>Empleos</Text>
            </TouchableOpacity>
            <Text style={styles.dotSeparator}>•</Text>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Ayuda</Text>
            </TouchableOpacity>
          </View>
        </View>
      

        {/* Wave Background */}
        <View style={styles.waveContainer}>
          <Svg
            height="100%"
            width="100%"
            viewBox="0 0 1415 301"
            style={styles.wave}
          >
            <Path
              fill="#00AF00"
               d="M0,96L48,106.7C96,117,192,139,288,154.7C384,171,480,181,576,186.7C672,192,768,192,864,186.7C960,181,1056,171,1152,160C1248,149,1344,139,1392,133.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </Svg>
        </View>
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    marginVertical: 100,
    alignItems: 'center',
  },
  logoText: {
    fontFamily: 'System',
    color: '#00AF00',
    fontSize: 40,
    fontWeight: 'bold',
  },
  logoImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  formContainer: {
    width: '100%',
    maxWidth: 350,
  },
  inputContainer: {
    marginBottom: 12,
    position: 'relative',
  },
  input: {
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#dbdbdb',
    borderRadius: 5,
    padding: 12,
    fontSize: 16,
  },
  passwordInput: {
    paddingRight: 45,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  loginButton: {
    marginTop: 8,
    borderRadius: 5,
    overflow: 'hidden',
  },
  gradient: {
    padding: 12,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 16,
  },
  forgotPasswordText: {
    color: '#385185',
    fontSize: 14,
    fontWeight: '500',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#dbdbdb',
  },
  orText: {
    color: '#666',
    paddingHorizontal: 20,
    fontSize: 14,
    fontWeight: '600',
  },
  signUpContainer: {
    flexDirection: 'row',
    marginTop: 'auto',
    paddingVertical: 20,
  },
  signUpText: {
    color: '#262626',
    fontSize: 14,
  },
  signUpLink: {
    color: '#0095f6',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#666',
    fontSize: 12,
  },
  metaText: {
    color: '#262626',
    fontSize: 14,
    fontWeight: '600',
  },
  linksFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    gap: 5,
  },
  footerLink: {
    color: '#666',
    fontSize: 12,
  },
  dotSeparator: {
    color: '#666',
    fontSize: 12,
  },
  waveContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '11%',
    zIndex: -1,

  },
  wave: {
    width: '100%',
  },
});