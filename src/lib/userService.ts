import { authService } from './authService';

class UserService {
  getUserId(): string {
    const user = authService.getUser();
    if (user) {
      return user.id;
    }
    
    // Fallback para usuário não autenticado (modo offline)
    let userId = localStorage.getItem('clarity-cash-user-id');
    if (!userId) {
      userId = this.generateUserId();
      localStorage.setItem('clarity-cash-user-id', userId);
    }
    return userId;
  }

  private generateUserId(): string {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  isAuthenticated(): boolean {
    return authService.isAuthenticated();
  }

  logout(): void {
    authService.logout();
    localStorage.removeItem('clarity-cash-user-id');
  }
}

export const userService = new UserService();