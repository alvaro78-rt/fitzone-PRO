/**
 * Serviço de Autenticação (Regras de Negócio de Sessão e Acesso)
 */

window.GymSystem = window.GymSystem || {};

GymSystem.AuthService = (function () {
  const SESSION_USER_KEY = 'GYM_CURRENT_USER';

  return {
    /**
     * Valida credenciais e inicia sessão
     */
    login: function (email, password) {
      if (!email || !password) {
        throw new Error('E-mail e senha são obrigatórios.');
      }

      const users = GymSystem.DB.getAll('users');
      const user = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password);

      if (!user) {
        throw new Error('Credenciais inválidas. Verifique seu e-mail e senha.');
      }

      const sessionData = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        loggedAt: new Date().toISOString()
      };

      sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(sessionData));
      return sessionData;
    },

    /**
     * Encerra a sessão do usuário
     */
    logout: function () {
      sessionStorage.removeItem(SESSION_USER_KEY);
    },

    /**
     * Retorna o usuário autenticado atualmente, ou null
     */
    getCurrentUser: function () {
      const data = sessionStorage.getItem(SESSION_USER_KEY);
      if (!data) return null;
      try {
        return JSON.parse(data);
      } catch (e) {
        return null;
      }
    },

    /**
     * Verifica se há usuário logado
     */
    isAuthenticated: function () {
      return this.getCurrentUser() !== null;
    }
  };
})();
