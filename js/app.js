/**
 * Controlador Principal da Aplicação (App Controller & Router)
 * Orquestra o ciclo de vida, rotas entre telas, autenticação e eventos da interface.
 */

window.GymSystem = window.GymSystem || {};

GymSystem.App = (function () {
  let currentView = 'dashboard';

  // Configuração das rotas/telas disponíveis
  const ROUTES = {
    dashboard: {
      title: 'Dashboard Geral',
      subtitle: 'Visão consolidada de indicadores e métricas da academia',
      render: GymSystem.Views.renderDashboard
    },
    alunos: {
      title: 'Controle de Alunos',
      subtitle: 'Cadastro, consulta, edição e histórico de membros',
      render: GymSystem.Views.renderAlunos
    },
    professores: {
      title: 'Quadro de Professores',
      subtitle: 'Gestão da equipe de instrutores e especialidades',
      render: GymSystem.Views.renderProfessores
    },
    planos: {
      title: 'Planos de Treino',
      subtitle: 'Pacotes, mensalidades, durações e planos de acesso',
      render: GymSystem.Views.renderPlanos
    },
    matriculas: {
      title: 'Matrículas de Alunos',
      subtitle: 'Vínculos ativos de alunos, planos e professores responsáveis',
      render: GymSystem.Views.renderMatriculas
    },
    pagamentos: {
      title: 'Controle Financeiro',
      subtitle: 'Acompanhamento de mensalidades, pagamentos e pendências',
      render: GymSystem.Views.renderPagamentos
    }
  };

  /**
   * Navega para a tela indicada
   */
  function navigate(viewName) {
    if (!ROUTES[viewName]) {
      viewName = 'dashboard';
    }
    currentView = viewName;

    // Atualiza links ativos na Sidebar
    document.querySelectorAll('.nav-item').forEach(el => {
      if (el.getAttribute('data-route') === viewName) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });

    // Atualiza títulos do cabeçalho
    const titleEl = document.getElementById('page-title');
    const subtitleEl = document.getElementById('page-subtitle');
    if (titleEl) titleEl.textContent = ROUTES[viewName].title;
    if (subtitleEl) subtitleEl.textContent = ROUTES[viewName].subtitle;

    // Renderiza conteúdo na área principal
    const contentContainer = document.getElementById('main-content-view');
    if (contentContainer) {
      ROUTES[viewName].render(contentContainer);
    }

    // Fecha sidebar no mobile após navegar
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      sidebar.classList.remove('mobile-open');
    }
  }

  /**
   * Recarrega a view atual (usado após cadastros/edições/exclusões)
   */
  function refreshCurrentView() {
    navigate(currentView);
  }

  /**
   * Renderiza a tela de login
   */
  function renderLoginScreen() {
    const root = document.getElementById('app-root');
    root.innerHTML = `
      <div class="login-container">
        <div class="login-card">
          <div class="login-brand">
            <div class="logo-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 5v14M18 5v14M2 9v6M22 9v6M6 12h12"></path></svg>
            </div>
            <h1>FitZone Pro</h1>
          </div>

          <div class="login-header">
            <h2>Sistema de Academia</h2>
            <p>Projeto de Engenharia de Software</p>
          </div>

          <!-- Caixa informativa de dados de demonstração -->
          <div class="login-demo-box">
            <div><strong>Ambiente de Demonstração Acadêmica:</strong></div>
            <div>E-mail: <code>admin@fitzone.com</code> | Senha: <code>admin123</code></div>
            <button type="button" class="demo-btn" id="btn-fill-demo">Preencher automaticamente</button>
          </div>

          <form id="form-login">
            <div class="form-group" style="margin-bottom: 16px;">
              <label for="login-email">E-mail de Acesso</label>
              <input type="email" id="login-email" class="form-control" required placeholder="admin@fitzone.com">
            </div>

            <div class="form-group" style="margin-bottom: 24px;">
              <label for="login-password">Senha</label>
              <input type="password" id="login-password" class="form-control" required placeholder="••••••••">
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%; padding: 12px; font-size: 15px;">
              Entrar no Sistema
            </button>
          </form>
        </div>
      </div>
    `;

    // Handler de preenchimento automático para apresentação
    document.getElementById('btn-fill-demo').addEventListener('click', function () {
      document.getElementById('login-email').value = 'admin@fitzone.com';
      document.getElementById('login-password').value = 'admin123';
    });

    // Handler do formulário de login
    document.getElementById('form-login').addEventListener('submit', function (e) {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const pass = document.getElementById('login-password').value;

      try {
        const user = GymSystem.AuthService.login(email, pass);
        GymSystem.Notification.success(`Bem-vindo, ${user.name}!`);
        renderMainApp();
      } catch (err) {
        GymSystem.Notification.error(err.message);
      }
    });
  }

  /**
   * Renderiza a interface principal do sistema com menu lateral e header
   */
  function renderMainApp() {
    const user = GymSystem.AuthService.getCurrentUser();
    const root = document.getElementById('app-root');

    root.innerHTML = `
      <div class="app-container">
        <!-- Sidebar Navigation -->
        <aside class="sidebar" id="sidebar">
          <div class="sidebar-header">
            <div class="sidebar-brand">
              <div class="logo-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 5v14M18 5v14M2 9v6M22 9v6M6 12h12"></path></svg>
              </div>
              <span>FitZone <span>Pro</span></span>
            </div>
            <button class="btn-icon btn-mobile-toggle" id="btn-close-sidebar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          <nav class="sidebar-nav">
            <span class="nav-section-label">Principal</span>
            <div class="nav-item active" data-route="dashboard">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              Dashboard
            </div>

            <span class="nav-section-label" style="margin-top: 12px;">Cadastros & Operação</span>
            <div class="nav-item" data-route="alunos">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              Alunos
            </div>
            <div class="nav-item" data-route="professores">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              Professores
            </div>
            <div class="nav-item" data-route="planos">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
              Planos
            </div>
            <div class="nav-item" data-route="matriculas">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              Matrículas
            </div>

            <span class="nav-section-label" style="margin-top: 12px;">Financeiro</span>
            <div class="nav-item" data-route="pagamentos">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              Pagamentos
            </div>
          </nav>

          <div class="sidebar-footer">
            <div class="user-profile">
              <div class="user-avatar">${(user ? user.name.charAt(0) : 'U').toUpperCase()}</div>
              <div class="user-info">
                <div class="user-name">${user ? user.name : 'Usuário'}</div>
                <div class="user-role">${user ? user.role : 'Acesso Padrão'}</div>
              </div>
            </div>

            <button class="btn-logout" id="btn-logout">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              Sair da Conta
            </button>
          </div>
        </aside>

        <!-- Main Wrapper -->
        <div class="main-wrapper">
          <!-- Top Header -->
          <header class="top-header">
            <div style="display: flex; align-items: center; gap: 14px;">
              <button class="btn-icon btn-mobile-toggle" id="btn-open-sidebar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
              </button>
              <div class="header-title-box">
                <h1 id="page-title">Dashboard Geral</h1>
                <p id="page-subtitle">Visão consolidada de indicadores e métricas da academia</p>
              </div>
            </div>

            <div class="header-actions">
              <!-- Botão para restaurar dados padrão caso o professor queira testar do zero -->
              <button class="btn btn-secondary btn-sm" id="btn-reset-demo" title="Restaura os dados de teste padrão">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path></svg>
                Restaurar Dados Demo
              </button>
            </div>
          </header>

          <!-- Main Dynamic Content -->
          <main class="main-content" id="main-content-view">
            <!-- As views são injetadas aqui -->
          </main>
        </div>
      </div>
    `;

    // Vincular cliques da Sidebar
    document.querySelectorAll('.nav-item').forEach(el => {
      el.addEventListener('click', function () {
        const route = this.getAttribute('data-route');
        if (route) {
          navigate(route);
        }
      });
    });

    // Mobile Sidebar Toggles
    const sidebar = document.getElementById('sidebar');
    const openBtn = document.getElementById('btn-open-sidebar');
    const closeBtn = document.getElementById('btn-close-sidebar');

    if (openBtn) {
      openBtn.addEventListener('click', () => sidebar.classList.add('mobile-open'));
    }
    if (closeBtn) {
      closeBtn.addEventListener('click', () => sidebar.classList.remove('mobile-open'));
    }

    // Logout
    document.getElementById('btn-logout').addEventListener('click', function () {
      GymSystem.AuthService.logout();
      GymSystem.Notification.info('Você saiu da sua conta.');
      renderLoginScreen();
    });

    // Botão Restaurar Dados Demo
    document.getElementById('btn-reset-demo').addEventListener('click', function () {
      GymSystem.Modal.confirm(
        'Restaurar Dados Padrão',
        'Deseja restaurar a base de dados para o estado inicial com exemplos de alunos, professores, planos e pagamentos?',
        function () {
          GymSystem.DB.resetToDefaults();
          GymSystem.Notification.success('Base de dados restaurada com sucesso!');
          refreshCurrentView();
          return true;
        },
        false
      );
    });

    // Inicia no Dashboard
    navigate('dashboard');
  }

  /**
   * Inicialização da Aplicação
   */
  function init() {
    if (GymSystem.AuthService.isAuthenticated()) {
      renderMainApp();
    } else {
      renderLoginScreen();
    }
  }

  return {
    init: init,
    navigate: navigate,
    refreshCurrentView: refreshCurrentView
  };
})();

// Inicializa a aplicação assim que o DOM carregar
document.addEventListener('DOMContentLoaded', function () {
  GymSystem.App.init();
});
