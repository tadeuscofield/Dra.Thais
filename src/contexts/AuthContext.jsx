import { createContext, useContext, useState, useEffect } from 'react';
import { USERS, ROLES, hasPermission } from '../config/roles';

const AuthContext = createContext();

const STORAGE_KEY_AUTH = 'pediatria-auth';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar autenticação ao carregar
  useEffect(() => {
    const authData = localStorage.getItem(STORAGE_KEY_AUTH);
    if (authData) {
      try {
        const { user: savedUser, timestamp } = JSON.parse(authData);
        const now = Date.now();
        // Session expira em 8 horas
        if (now - timestamp < 8 * 60 * 60 * 1000) {
          setUser(savedUser);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem(STORAGE_KEY_AUTH);
        }
      } catch (error) {
        localStorage.removeItem(STORAGE_KEY_AUTH);
      }
    }
  }, []);

  const login = (username, password) => {
    // Buscar usuário
    const userData = Object.values(USERS).find(
      u => u.username === username && u.password === password
    );

    if (userData) {
      const userInfo = {
        username: userData.username,
        name: userData.name,
        role: userData.role,
        specialty: userData.specialty
      };

      setUser(userInfo);
      setIsAuthenticated(true);

      // Salvar no localStorage
      localStorage.setItem(
        STORAGE_KEY_AUTH,
        JSON.stringify({ user: userInfo, timestamp: Date.now() })
      );

      return { success: true, user: userInfo };
    }

    return { success: false, error: 'Usuário ou senha incorretos' };
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(STORAGE_KEY_AUTH);
  };

  const checkPermission = (permission) => {
    if (!user) return false;
    return hasPermission(user.role, permission);
  };

  const isMedico = () => user?.role === ROLES.MEDICO;
  const isSecretaria = () => user?.role === ROLES.SECRETARIA;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        checkPermission,
        isMedico,
        isSecretaria
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};
