class UserService {
  // Generate a simple user ID for offline mode
  getUserId(): string {
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

  // Always return false since we removed authentication
  isAuthenticated(): boolean {
    return false;
  }

  logout(): void {
    localStorage.removeItem('clarity-cash-user-id');
  }
}

export const userService = new UserService();