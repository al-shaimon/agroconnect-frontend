import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const { user, token, isAuthenticated, isLoading, login, logout, setUser, initialize } =
    useAuthStore();

  const isRole = (role: string) => {
    return user?.role === role;
  };

  const isFarmer = () => isRole('farmer');
  const isBuyer = () => isRole('buyer');
  const isAdmin = () => isRole('admin');

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
    setUser,
    initialize,
    isRole,
    isFarmer,
    isBuyer,
    isAdmin,
  };
};
