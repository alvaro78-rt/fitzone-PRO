/**
 * Camada de Apresentação / Views das Telas do Sistema
 * Responsável por renderizar o Dashboard e os módulos de CRUD (Alunos, Professores, Planos, Matrículas e Pagamentos)
 */

window.GymSystem = window.GymSystem || {};

GymSystem.Views = (function () {
  const F = GymSystem.Formatters;
  const Notify = GymSystem.Notification;
  const Modal = GymSystem.Modal;

  /* =========================================================================
     1. DASHBOARD
     ========================================================================= */
  function renderDashboard(container) {
    const alunos = GymSystem.AlunoService.listarTodos();
    const professores = GymSystem.ProfessorService.listarTodos();
    const planos = GymSystem.PlanoService.listarTodos();
    const matriculas = GymSystem.MatriculaService.listarTodas();
    const pagamentos = GymSystem.PagamentoService.listarTodos();

    const alunosAtivos = alunos.filter(a => a.status === 'ativo').length;
    const planosAtivos = planos.filter(p => p.status === 'ativo').length;
    const pagamentosPendentes = pagamentos.filter(p => p.status === 'pendente' || p.status === 'atrasado');
    const valorPendenteTotal = pagamentosPendentes.reduce((acc, cur) => acc + (parseFloat(cur.valor) || 0), 0);

    container.innerHTML = `
      <div class="metrics-grid">
        <!-- Card 1: Total Alunos -->
        <div class="metric-card">
          <div class="metric-info">
            <span class="metric-label">Total de Alunos</span>
            <span class="metric-value">${alunos.length}</span>
            <span class="metric-sub">${alunosAtivos} atualmente ativos</span>
          </div>
          <div class="metric-icon-box green">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </div>
        </div>

        <!-- Card 2: Alunos Ativos -->
        <div class="metric-card">
          <div class="metric-info">
            <span class="metric-label">Alunos Ativos</span>
            <span class="metric-value text-primary">${alunosAtivos}</span>
            <span class="metric-sub">${alunos.length - alunosAtivos} inativos</span>
          </div>
          <div class="metric-icon-box green">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
        </div>

        <!-- Card 3: Professores -->
        <div class="metric-card">
          <div class="metric-info">
            <span class="metric-label">Professores</span>
            <span class="metric-value text-indigo">${professores.length}</span>
            <span class="metric-sub">Equipe técnica ativa</span>
          </div>
          <div class="metric-icon-box indigo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </div>
        </div>

        <!-- Card 4: Planos Disponíveis -->
        <div class="metric-card">
          <div class="metric-info">
            <span class="metric-label">Planos Disponíveis</span>
            <span class="metric-value text-cyan">${planosAtivos}</span>
            <span class="metric-sub">Opções para contratação</span>
          </div>
          <div class="metric-icon-box cyan">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
          </div>
        </div>

        <!-- Card 5: Pagamentos Pendentes -->
        <div class="metric-card">
          <div class="metric-info">
            <span class="metric-label">Pagamentos Pendentes</span>
            <span class="metric-value text-amber">${pagamentosPendentes.length}</span>
            <span class="metric-sub">${F.formatMoeda(valorPendenteTotal)} a receber</span>
          </div>
          <div class="metric-icon-box amber">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
          </div>
        </div>
      </div>

      <!-- Atalhos Rápidos -->
      <div style="display: flex; gap: 12px; margin-bottom: 28px; flex-wrap: wrap;">
        <button class="btn btn-primary" onclick="GymSystem.Views.abrirModalAluno()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Cadastrar Aluno
        </button>
        <button class="btn btn-secondary" onclick="GymSystem.Views.abrirModalMatricula()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" y1="8" x2="19" y2="14"></line><line x1="22" y1="11" x2="16" y2="11"></line></svg>
          Nova Matrícula
        </button>
        <button class="btn btn-secondary" onclick="GymSystem.Views.abrirModalPagamento()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
          Registrar Pagamento
        </button>
      </div>

      <!-- Tabelas Resumo do Dashboard -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(450px, 1fr)); gap: 24px;">
        <!-- Matrículas Recentes -->
        <div class="card-section" style="margin-bottom: 0;">
          <div class="card-header">
            <div class="card-header-title">
              <h2>Matrículas Recentes</h2>
              <span class="count-badge">${matriculas.length}</span>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="GymSystem.App.navigate('matriculas')">Ver Todas</button>
          </div>
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Aluno</th>
                  <th>Plano</th>
                  <th>Vigência</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${matriculas.length === 0 ? '<tr><td colspan="4" style="text-align:center; padding: 24px; color: var(--text-muted);">Nenhuma matrícula registrada.</td></tr>' : 
                  matriculas.slice(0, 4).map(m => `
                    <tr>
                      <td class="font-medium">${m.alunoNome}</td>
                      <td>${m.planoNome}</td>
                      <td style="font-size: 12.5px;">${F.formatDataBR(m.dataInicio)} até ${F.formatDataBR(m.dataTermino)}</td>
                      <td><span class="badge ${m.status === 'ativa' ? 'badge-active' : 'badge-inactive'}">${m.status}</span></td>
                    </tr>
                  `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Pagamentos Pendentes ou Atrasados -->
        <div class="card-section" style="margin-bottom: 0;">
          <div class="card-header">
            <div class="card-header-title">
              <h2>Atenção: Pagamentos Pendentes</h2>
              <span class="count-badge">${pagamentosPendentes.length}</span>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="GymSystem.App.navigate('pagamentos')">Ver Todos</button>
          </div>
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Aluno</th>
                  <th>Valor</th>
                  <th>Vencimento</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${pagamentosPendentes.length === 0 ? '<tr><td colspan="4" style="text-align:center; padding: 24px; color: var(--primary);">Sem pendências no momento! Parabéns.</td></tr>' : 
                  pagamentosPendentes.slice(0, 4).map(p => `
                    <tr>
                      <td class="font-medium">${p.alunoNome}</td>
                      <td class="font-semibold">${F.formatMoeda(p.valor)}</td>
                      <td>${F.formatDataBR(p.dataVencimento)}</td>
                      <td><span class="badge ${p.status === 'atrasado' ? 'badge-late' : 'badge-pending'}">${p.status}</span></td>
                    </tr>
                  `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  /* =========================================================================
     2. ALUNOS
     ========================================================================= */
  function renderAlunos(container, termoBusca = '') {
    const alunos = GymSystem.AlunoService.filtrar(termoBusca);

    container.innerHTML = `
      <div class="card-section">
        <div class="card-header">
          <div class="card-header-title">
            <h2>Gerenciamento de Alunos</h2>
            <span class="count-badge">${alunos.length}</span>
          </div>
          <div class="card-header-actions">
            <div class="search-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input type="text" id="busca-alunos" class="search-input" placeholder="Pesquisar por nome, CPF ou e-mail..." value="${termoBusca}">
            </div>
            <button class="btn btn-primary" onclick="GymSystem.Views.abrirModalAluno()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Novo Aluno
            </button>
          </div>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Nome Completo</th>
                <th>CPF</th>
                <th>Contato</th>
                <th>Nascimento</th>
                <th>Endereço</th>
                <th>Cadastro</th>
                <th>Status</th>
                <th style="text-align: right;">Ações</th>
              </tr>
            </thead>
            <tbody>
              ${alunos.length === 0 ? `
                <tr>
                  <td colspan="8">
                    <div class="empty-table-state">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                      <p>Nenhum aluno encontrado ${termoBusca ? `para o termo "${termoBusca}"` : ''}.</p>
                    </div>
                  </td>
                </tr>
              ` : alunos.map(aluno => `
                <tr>
                  <td class="font-semibold">${aluno.nome}</td>
                  <td>${F.formatCPF(aluno.cpf)}</td>
                  <td>
                    <div>${aluno.telefone}</div>
                    <div style="font-size: 12px; color: var(--text-muted);">${aluno.email}</div>
                  </td>
                  <td>${F.formatDataBR(aluno.dataNascimento)}</td>
                  <td style="max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${aluno.endereco}">${aluno.endereco}</td>
                  <td>${F.formatDataBR(aluno.dataCadastro)}</td>
                  <td>
                    <span class="badge ${aluno.status === 'ativo' ? 'badge-active' : 'badge-inactive'}">${aluno.status}</span>
                  </td>
                  <td>
                    <div class="table-actions" style="justify-content: flex-end;">
                      <button class="btn-icon status" title="Alternar status (Ativo/Inativo)" onclick="GymSystem.Views.alternarStatusAluno('${aluno.id}')">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line></svg>
                      </button>
                      <button class="btn-icon edit" title="Editar Aluno" onclick="GymSystem.Views.abrirModalAluno('${aluno.id}')">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                      </button>
                      <button class="btn-icon delete" title="Excluir Aluno" onclick="GymSystem.Views.confirmarExclusaoAluno('${aluno.id}', '${aluno.nome}')">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Event listener para pesquisa em tempo real
    const searchInput = document.getElementById('busca-alunos');
    if (searchInput) {
      searchInput.addEventListener('input', function (e) {
        renderAlunos(container, e.target.value);
        // Restaura foco
        const updatedInput = document.getElementById('busca-alunos');
        if (updatedInput) {
          updatedInput.focus();
          updatedInput.selectionStart = updatedInput.selectionEnd = updatedInput.value.length;
        }
      });
    }
  }

  function abrirModalAluno(id = null) {
    const isEdicao = !!id;
    const aluno = isEdicao ? GymSystem.AlunoService.buscarPorId(id) : null;
    const hoje = new Date().toISOString().split('T')[0];

    const bodyHtml = `
      <form id="form-aluno" class="form-grid">
        <div class="form-group form-group-full">
          <label>Nome Completo <span class="req">*</span></label>
          <input type="text" id="aluno-nome" class="form-control" required placeholder="Ex: Mariana Costa Ramos" value="${aluno ? aluno.nome : ''}">
        </div>

        <div class="form-group">
          <label>CPF <span class="req">*</span></label>
          <input type="text" id="aluno-cpf" class="form-control" required placeholder="000.000.000-00" value="${aluno ? aluno.cpf : ''}">
        </div>

        <div class="form-group">
          <label>Data de Nascimento <span class="req">*</span></label>
          <input type="date" id="aluno-nascimento" class="form-control" required value="${aluno ? aluno.dataNascimento : ''}">
        </div>

        <div class="form-group">
          <label>Telefone <span class="req">*</span></label>
          <input type="text" id="aluno-telefone" class="form-control" required placeholder="(11) 98765-4321" value="${aluno ? aluno.telefone : ''}">
        </div>

        <div class="form-group">
          <label>E-mail <span class="req">*</span></label>
          <input type="email" id="aluno-email" class="form-control" required placeholder="mariana@exemplo.com" value="${aluno ? aluno.email : ''}">
        </div>

        <div class="form-group form-group-full">
          <label>Endereço Completo <span class="req">*</span></label>
          <input type="text" id="aluno-endereco" class="form-control" required placeholder="Rua, Número, Bairro, Cidade - UF" value="${aluno ? aluno.endereco : ''}">
        </div>

        <div class="form-group">
          <label>Data de Cadastro <span class="req">*</span></label>
          <input type="date" id="aluno-cadastro" class="form-control" required value="${aluno ? aluno.dataCadastro : hoje}">
        </div>

        <div class="form-group">
          <label>Status <span class="req">*</span></label>
          <select id="aluno-status" class="form-control">
            <option value="ativo" ${aluno && aluno.status === 'ativo' ? 'selected' : ''}>Ativo</option>
            <option value="inativo" ${aluno && aluno.status === 'inativo' ? 'selected' : ''}>Inativo</option>
          </select>
        </div>
      </form>
    `;

    Modal.open({
      title: isEdicao ? 'Editar Aluno' : 'Cadastrar Novo Aluno',
      bodyHtml: bodyHtml,
      confirmText: isEdicao ? 'Salvar Alterações' : 'Cadastrar Aluno',
      afterOpen: function (modalBody) {
        // Aplica máscaras
        F.aplicarMascaraCPF(modalBody.querySelector('#aluno-cpf'));
        F.aplicarMascaraTelefone(modalBody.querySelector('#aluno-telefone'));
      },
      onConfirm: function () {
        const dados = {
          nome: document.getElementById('aluno-nome').value,
          cpf: document.getElementById('aluno-cpf').value,
          dataNascimento: document.getElementById('aluno-nascimento').value,
          telefone: document.getElementById('aluno-telefone').value,
          email: document.getElementById('aluno-email').value,
          endereco: document.getElementById('aluno-endereco').value,
          dataCadastro: document.getElementById('aluno-cadastro').value,
          status: document.getElementById('aluno-status').value
        };

        try {
          if (isEdicao) {
            GymSystem.AlunoService.atualizar(id, dados);
            Notify.success('Aluno atualizado com sucesso!');
          } else {
            GymSystem.AlunoService.criar(dados);
            Notify.success('Aluno cadastrado com sucesso!');
          }
          GymSystem.App.refreshCurrentView();
          return true;
        } catch (err) {
          Notify.error(err.message);
          return false; // Mantém modal aberto para correção
        }
      }
    });
  }

  function alternarStatusAluno(id) {
    try {
      const atualizado = GymSystem.AlunoService.alternarStatus(id);
      Notify.success(`Status de ${atualizado.nome} alterado para ${atualizado.status.toUpperCase()}!`);
      GymSystem.App.refreshCurrentView();
    } catch (err) {
      Notify.error(err.message);
    }
  }

  function confirmarExclusaoAluno(id, nome) {
    Modal.confirm(
      'Excluir Aluno',
      `Tem certeza que deseja excluir o aluno <strong>${nome}</strong>?<br><br><span style="font-size:12px; color: var(--accent-rose);">Esta ação só poderá ser realizada se não houver matrículas ativas.</span>`,
      function () {
        try {
          GymSystem.AlunoService.excluir(id);
          Notify.success(`Aluno "${nome}" excluído com sucesso!`);
          GymSystem.App.refreshCurrentView();
          return true;
        } catch (err) {
          Notify.error(err.message);
          return false;
        }
      }
    );
  }

  /* =========================================================================
     3. PROFESSORES
     ========================================================================= */
  function renderProfessores(container, termoBusca = '') {
    const professores = GymSystem.ProfessorService.filtrar(termoBusca);

    container.innerHTML = `
      <div class="card-section">
        <div class="card-header">
          <div class="card-header-title">
            <h2>Quadro de Professores</h2>
            <span class="count-badge">${professores.length}</span>
          </div>
          <div class="card-header-actions">
            <div class="search-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input type="text" id="busca-professores" class="search-input" placeholder="Pesquisar por nome, especialidade ou CPF..." value="${termoBusca}">
            </div>
            <button class="btn btn-primary" onclick="GymSystem.Views.abrirModalProfessor()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Novo Professor
            </button>
          </div>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Especialidade</th>
                <th>CPF</th>
                <th>Telefone</th>
                <th>E-mail</th>
                <th style="text-align: right;">Ações</th>
              </tr>
            </thead>
            <tbody>
              ${professores.length === 0 ? `
                <tr>
                  <td colspan="6">
                    <div class="empty-table-state">
                      <p>Nenhum professor encontrado.</p>
                    </div>
                  </td>
                </tr>
              ` : professores.map(prof => `
                <tr>
                  <td class="font-semibold">${prof.nome}</td>
                  <td><span class="badge" style="background: var(--accent-indigo-light); color: var(--accent-indigo);">${prof.especialidade}</span></td>
                  <td>${F.formatCPF(prof.cpf)}</td>
                  <td>${prof.telefone}</td>
                  <td>${prof.email}</td>
                  <td>
                    <div class="table-actions" style="justify-content: flex-end;">
                      <button class="btn-icon edit" title="Editar Professor" onclick="GymSystem.Views.abrirModalProfessor('${prof.id}')">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                      </button>
                      <button class="btn-icon delete" title="Excluir Professor" onclick="GymSystem.Views.confirmarExclusaoProfessor('${prof.id}', '${prof.nome}')">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    const searchInput = document.getElementById('busca-professores');
    if (searchInput) {
      searchInput.addEventListener('input', function (e) {
        renderProfessores(container, e.target.value);
        const updatedInput = document.getElementById('busca-professores');
        if (updatedInput) {
          updatedInput.focus();
          updatedInput.selectionStart = updatedInput.selectionEnd = updatedInput.value.length;
        }
      });
    }
  }

  function abrirModalProfessor(id = null) {
    const isEdicao = !!id;
    const prof = isEdicao ? GymSystem.ProfessorService.buscarPorId(id) : null;

    const bodyHtml = `
      <form id="form-professor" class="form-grid">
        <div class="form-group form-group-full">
          <label>Nome do Professor <span class="req">*</span></label>
          <input type="text" id="prof-nome" class="form-control" required placeholder="Ex: Alexandre Pires" value="${prof ? prof.nome : ''}">
        </div>

        <div class="form-group">
          <label>CPF <span class="req">*</span></label>
          <input type="text" id="prof-cpf" class="form-control" required placeholder="000.000.000-00" value="${prof ? prof.cpf : ''}">
        </div>

        <div class="form-group">
          <label>Telefone <span class="req">*</span></label>
          <input type="text" id="prof-telefone" class="form-control" required placeholder="(11) 98765-4321" value="${prof ? prof.telefone : ''}">
        </div>

        <div class="form-group form-group-full">
          <label>E-mail <span class="req">*</span></label>
          <input type="email" id="prof-email" class="form-control" required placeholder="professor@fitzone.com" value="${prof ? prof.email : ''}">
        </div>

        <div class="form-group form-group-full">
          <label>Especialidade <span class="req">*</span></label>
          <input type="text" id="prof-especialidade" class="form-control" required placeholder="Ex: Musculação, Pilates, Spinning, Crossfit" value="${prof ? prof.especialidade : ''}">
        </div>
      </form>
    `;

    Modal.open({
      title: isEdicao ? 'Editar Professor' : 'Cadastrar Novo Professor',
      bodyHtml: bodyHtml,
      confirmText: isEdicao ? 'Salvar Alterações' : 'Cadastrar Professor',
      afterOpen: function (modalBody) {
        F.aplicarMascaraCPF(modalBody.querySelector('#prof-cpf'));
        F.aplicarMascaraTelefone(modalBody.querySelector('#prof-telefone'));
      },
      onConfirm: function () {
        const dados = {
          nome: document.getElementById('prof-nome').value,
          cpf: document.getElementById('prof-cpf').value,
          telefone: document.getElementById('prof-telefone').value,
          email: document.getElementById('prof-email').value,
          especialidade: document.getElementById('prof-especialidade').value
        };

        try {
          if (isEdicao) {
            GymSystem.ProfessorService.atualizar(id, dados);
            Notify.success('Professor atualizado com sucesso!');
          } else {
            GymSystem.ProfessorService.criar(dados);
            Notify.success('Professor cadastrado com sucesso!');
          }
          GymSystem.App.refreshCurrentView();
          return true;
        } catch (err) {
          Notify.error(err.message);
          return false;
        }
      }
    });
  }

  function confirmarExclusaoProfessor(id, nome) {
    Modal.confirm(
      'Excluir Professor',
      `Tem certeza que deseja excluir o professor <strong>${nome}</strong>?<br><br><span style="font-size:12px; color: var(--accent-rose);">Professores vinculados a matrículas ativas não podem ser excluídos.</span>`,
      function () {
        try {
          GymSystem.ProfessorService.excluir(id);
          Notify.success(`Professor "${nome}" excluído com sucesso!`);
          GymSystem.App.refreshCurrentView();
          return true;
        } catch (err) {
          Notify.error(err.message);
          return false;
        }
      }
    );
  }

  /* =========================================================================
     4. PLANOS
     ========================================================================= */
  function renderPlanos(container) {
    const planos = GymSystem.PlanoService.listarTodos();

    container.innerHTML = `
      <div class="card-section">
        <div class="card-header">
          <div class="card-header-title">
            <h2>Planos de Treinamento</h2>
            <span class="count-badge">${planos.length}</span>
          </div>
          <button class="btn btn-primary" onclick="GymSystem.Views.abrirModalPlano()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Novo Plano
          </button>
        </div>

        <div style="padding: 24px; display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
          ${planos.map(plano => `
            <div style="background: var(--bg-card-header); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 22px; display: flex; flex-direction: column; justify-content: space-between; position: relative;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                  <h3 style="font-size: 18px; font-weight: 700;">${plano.nome}</h3>
                  <span class="badge ${plano.status === 'ativo' ? 'badge-active' : 'badge-inactive'}">${plano.status}</span>
                </div>
                <p style="font-size: 13.5px; color: var(--text-secondary); margin-bottom: 20px; min-height: 40px;">${plano.descricao}</p>
                <div style="margin-bottom: 16px;">
                  <span style="font-size: 26px; font-weight: 800; color: var(--primary);">${F.formatMoeda(plano.valorMensal)}</span>
                  <span style="font-size: 13px; color: var(--text-muted);">/ mês</span>
                </div>
                <div style="font-size: 13px; color: var(--text-muted); margin-bottom: 20px;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: -2px; margin-right: 4px;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  Duração: <strong>${plano.duracaoMeses} ${plano.duracaoMeses === 1 ? 'mês' : 'meses'}</strong>
                </div>
              </div>

              <div style="display: flex; gap: 8px; border-top: 1px solid var(--border-subtle); pt-3; padding-top: 14px; justify-content: flex-end;">
                <button class="btn btn-secondary btn-sm" onclick="GymSystem.Views.alternarStatusPlano('${plano.id}')">
                  ${plano.status === 'ativo' ? 'Desativar' : 'Ativar'}
                </button>
                <button class="btn-icon edit" title="Editar Plano" onclick="GymSystem.Views.abrirModalPlano('${plano.id}')">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
                <button class="btn-icon delete" title="Excluir Plano" onclick="GymSystem.Views.confirmarExclusaoPlano('${plano.id}', '${plano.nome}')">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function abrirModalPlano(id = null) {
    const isEdicao = !!id;
    const plano = isEdicao ? GymSystem.PlanoService.buscarPorId(id) : null;

    const bodyHtml = `
      <form id="form-plano" class="form-grid">
        <div class="form-group form-group-full">
          <label>Nome do Plano <span class="req">*</span></label>
          <input type="text" id="plano-nome" class="form-control" required placeholder="Ex: Plano Trimestral" value="${plano ? plano.nome : ''}">
        </div>

        <div class="form-group form-group-full">
          <label>Descrição <span class="req">*</span></label>
          <textarea id="plano-desc" class="form-control" rows="3" required placeholder="Descreva os benefícios e condições do plano...">${plano ? plano.descricao : ''}</textarea>
        </div>

        <div class="form-group">
          <label>Valor Mensal (R$) <span class="req">*</span></label>
          <input type="number" step="0.01" id="plano-valor" class="form-control" required placeholder="99.90" value="${plano ? plano.valorMensal : ''}">
        </div>

        <div class="form-group">
          <label>Duração (Meses) <span class="req">*</span></label>
          <input type="number" min="1" id="plano-duracao" class="form-control" required placeholder="3" value="${plano ? plano.duracaoMeses : '1'}">
        </div>

        <div class="form-group form-group-full">
          <label>Status <span class="req">*</span></label>
          <select id="plano-status" class="form-control">
            <option value="ativo" ${plano && plano.status === 'ativo' ? 'selected' : ''}>Ativo</option>
            <option value="inativo" ${plano && plano.status === 'inativo' ? 'selected' : ''}>Inativo</option>
          </select>
        </div>
      </form>
    `;

    Modal.open({
      title: isEdicao ? 'Editar Plano' : 'Cadastrar Novo Plano',
      bodyHtml: bodyHtml,
      confirmText: isEdicao ? 'Salvar Alterações' : 'Cadastrar Plano',
      onConfirm: function () {
        const dados = {
          nome: document.getElementById('plano-nome').value,
          descricao: document.getElementById('plano-desc').value,
          valorMensal: document.getElementById('plano-valor').value,
          duracaoMeses: document.getElementById('plano-duracao').value,
          status: document.getElementById('plano-status').value
        };

        try {
          if (isEdicao) {
            GymSystem.PlanoService.atualizar(id, dados);
            Notify.success('Plano atualizado com sucesso!');
          } else {
            GymSystem.PlanoService.criar(dados);
            Notify.success('Plano cadastrado com sucesso!');
          }
          GymSystem.App.refreshCurrentView();
          return true;
        } catch (err) {
          Notify.error(err.message);
          return false;
        }
      }
    });
  }

  function alternarStatusPlano(id) {
    try {
      const p = GymSystem.PlanoService.alternarStatus(id);
      Notify.success(`Status do plano "${p.nome}" alterado para ${p.status.toUpperCase()}!`);
      GymSystem.App.refreshCurrentView();
    } catch (err) {
      Notify.error(err.message);
    }
  }

  function confirmarExclusaoPlano(id, nome) {
    Modal.confirm(
      'Excluir Plano',
      `Tem certeza que deseja excluir o plano <strong>${nome}</strong>?<br><br><span style="font-size:12px; color: var(--accent-rose);">Planos vinculados a matrículas ativas não podem ser excluídos.</span>`,
      function () {
        try {
          GymSystem.PlanoService.excluir(id);
          Notify.success(`Plano "${nome}" excluído com sucesso!`);
          GymSystem.App.refreshCurrentView();
          return true;
        } catch (err) {
          Notify.error(err.message);
          return false;
        }
      }
    );
  }

  /* =========================================================================
     5. MATRÍCULAS
     ========================================================================= */
  function renderMatriculas(container) {
    const matriculas = GymSystem.MatriculaService.listarTodas();

    container.innerHTML = `
      <div class="card-section">
        <div class="card-header">
          <div class="card-header-title">
            <h2>Matrículas dos Alunos</h2>
            <span class="count-badge">${matriculas.length}</span>
          </div>
          <button class="btn btn-primary" onclick="GymSystem.Views.abrirModalMatricula()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Nova Matrícula
          </button>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Aluno</th>
                <th>Plano Contratado</th>
                <th>Professor Responsável</th>
                <th>Início</th>
                <th>Término</th>
                <th>Status</th>
                <th style="text-align: right;">Ações</th>
              </tr>
            </thead>
            <tbody>
              ${matriculas.length === 0 ? `
                <tr>
                  <td colspan="7">
                    <div class="empty-table-state">
                      <p>Nenhuma matrícula cadastrada.</p>
                    </div>
                  </td>
                </tr>
              ` : matriculas.map(mat => `
                <tr>
                  <td class="font-semibold">${mat.alunoNome}</td>
                  <td>${mat.planoNome} <span style="font-size: 12px; color: var(--text-muted);">(${F.formatMoeda(mat.planoValor)}/mês)</span></td>
                  <td>${mat.professorNome}</td>
                  <td>${F.formatDataBR(mat.dataInicio)}</td>
                  <td>${F.formatDataBR(mat.dataTermino)}</td>
                  <td>
                    <span class="badge ${mat.status === 'ativa' ? 'badge-active' : 'badge-inactive'}">${mat.status}</span>
                  </td>
                  <td>
                    <div class="table-actions" style="justify-content: flex-end;">
                      ${mat.status === 'ativa' ? `
                        <button class="btn btn-secondary btn-sm" style="color: var(--accent-amber);" onclick="GymSystem.Views.cancelarMatricula('${mat.id}', '${mat.alunoNome}')">
                          Cancelar
                        </button>
                      ` : ''}
                      <button class="btn-icon edit" title="Editar Matrícula" onclick="GymSystem.Views.abrirModalMatricula('${mat.id}')">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                      </button>
                      <button class="btn-icon delete" title="Excluir Matrícula" onclick="GymSystem.Views.confirmarExclusaoMatricula('${mat.id}', '${mat.alunoNome}')">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function abrirModalMatricula(id = null) {
    const isEdicao = !!id;
    const matricula = isEdicao ? GymSystem.MatriculaService.buscarPorId(id) : null;

    const alunos = GymSystem.AlunoService.listarTodos();
    const planos = GymSystem.PlanoService.listarAtivos();
    const professores = GymSystem.ProfessorService.listarTodos();
    const hoje = new Date().toISOString().split('T')[0];

    // Calcula data término inicial padrão caso novo
    const dataInicioPadrao = matricula ? matricula.dataInicio : hoje;
    let dataTerminoPadrao = matricula ? matricula.dataTermino : '';
    if (!dataTerminoPadrao && planos.length > 0) {
      dataTerminoPadrao = GymSystem.MatriculaService.calcularDataTermino(dataInicioPadrao, planos[0].duracaoMeses);
    }

    const bodyHtml = `
      <form id="form-matricula" class="form-grid">
        <div class="form-group form-group-full">
          <label>Selecionar Aluno <span class="req">*</span></label>
          <select id="mat-aluno" class="form-control" required>
            <option value="">-- Selecione o Aluno --</option>
            ${alunos.map(a => `
              <option value="${a.id}" ${matricula && matricula.alunoId === a.id ? 'selected' : ''}>
                ${a.nome} (CPF: ${a.cpf}) [${a.status.toUpperCase()}]
              </option>
            `).join('')}
          </select>
        </div>

        <div class="form-group">
          <label>Selecionar Plano <span class="req">*</span></label>
          <select id="mat-plano" class="form-control" required>
            <option value="">-- Selecione o Plano --</option>
            ${planos.map(p => `
              <option value="${p.id}" data-duracao="${p.duracaoMeses}" ${matricula && matricula.planoId === p.id ? 'selected' : ''}>
                ${p.nome} - ${F.formatMoeda(p.valorMensal)}/mês (${p.duracaoMeses} m)
              </option>
            `).join('')}
          </select>
        </div>

        <div class="form-group">
          <label>Selecionar Professor <span class="req">*</span></label>
          <select id="mat-professor" class="form-control" required>
            <option value="">-- Selecione o Professor --</option>
            ${professores.map(pr => `
              <option value="${pr.id}" ${matricula && matricula.professorId === pr.id ? 'selected' : ''}>
                ${pr.nome} (${pr.especialidade})
              </option>
            `).join('')}
          </select>
        </div>

        <div class="form-group">
          <label>Data de Início <span class="req">*</span></label>
          <input type="date" id="mat-inicio" class="form-control" required value="${dataInicioPadrao}">
        </div>

        <div class="form-group">
          <label>Data de Término <span class="req">*</span></label>
          <input type="date" id="mat-termino" class="form-control" required value="${dataTerminoPadrao}">
        </div>

        <div class="form-group form-group-full">
          <label>Status da Matrícula <span class="req">*</span></label>
          <select id="mat-status" class="form-control">
            <option value="ativa" ${matricula && matricula.status === 'ativa' ? 'selected' : ''}>Ativa</option>
            <option value="cancelada" ${matricula && matricula.status === 'cancelada' ? 'selected' : ''}>Cancelada</option>
            <option value="concluida" ${matricula && matricula.status === 'concluida' ? 'selected' : ''}>Concluída</option>
          </select>
        </div>
      </form>
    `;

    Modal.open({
      title: isEdicao ? 'Editar Matrícula' : 'Nova Matrícula de Aluno',
      bodyHtml: bodyHtml,
      confirmText: isEdicao ? 'Salvar Matrícula' : 'Matricular Aluno',
      afterOpen: function (modalBody) {
        // Cálculo automático da data de término ao trocar o plano ou a data de início
        const planoSelect = modalBody.querySelector('#mat-plano');
        const dataInicioInput = modalBody.querySelector('#mat-inicio');
        const dataTerminoInput = modalBody.querySelector('#mat-termino');

        function recalcularTermino() {
          const selectedOption = planoSelect.options[planoSelect.selectedIndex];
          const duracao = selectedOption ? selectedOption.getAttribute('data-duracao') : null;
          if (duracao && dataInicioInput.value) {
            dataTerminoInput.value = GymSystem.MatriculaService.calcularDataTermino(dataInicioInput.value, duracao);
          }
        }

        planoSelect.addEventListener('change', recalcularTermino);
        dataInicioInput.addEventListener('change', recalcularTermino);
      },
      onConfirm: function () {
        const dados = {
          alunoId: document.getElementById('mat-aluno').value,
          planoId: document.getElementById('mat-plano').value,
          professorId: document.getElementById('mat-professor').value,
          dataInicio: document.getElementById('mat-inicio').value,
          dataTermino: document.getElementById('mat-termino').value,
          status: document.getElementById('mat-status').value
        };

        try {
          if (isEdicao) {
            GymSystem.MatriculaService.atualizar(id, dados);
            Notify.success('Matrícula atualizada com sucesso!');
          } else {
            GymSystem.MatriculaService.criar(dados);
            Notify.success('Aluno matriculado com sucesso! Fatura inicial gerada.');
          }
          GymSystem.App.refreshCurrentView();
          return true;
        } catch (err) {
          Notify.error(err.message);
          return false;
        }
      }
    });
  }

  function cancelarMatricula(id, nomeAluno) {
    Modal.confirm(
      'Cancelar Matrícula',
      `Deseja realmente cancelar a matrícula ativa do aluno <strong>${nomeAluno}</strong>?`,
      function () {
        try {
          GymSystem.MatriculaService.cancelar(id);
          Notify.success(`Matrícula de ${nomeAluno} cancelada.`);
          GymSystem.App.refreshCurrentView();
          return true;
        } catch (err) {
          Notify.error(err.message);
          return false;
        }
      },
      false
    );
  }

  function confirmarExclusaoMatricula(id, nomeAluno) {
    Modal.confirm(
      'Excluir Registro de Matrícula',
      `Tem certeza que deseja excluir o registro de matrícula de <strong>${nomeAluno}</strong>?`,
      function () {
        try {
          GymSystem.MatriculaService.excluir(id);
          Notify.success('Matrícula excluída com sucesso!');
          GymSystem.App.refreshCurrentView();
          return true;
        } catch (err) {
          Notify.error(err.message);
          return false;
        }
      }
    );
  }

  /* =========================================================================
     6. PAGAMENTOS
     ========================================================================= */
  function renderPagamentos(container, filtroStatus = 'todos') {
    let pagamentos = GymSystem.PagamentoService.listarTodos();

    if (filtroStatus !== 'todos') {
      pagamentos = pagamentos.filter(p => p.status === filtroStatus);
    }

    container.innerHTML = `
      <div class="card-section">
        <div class="card-header">
          <div class="card-header-title">
            <h2>Controle Financeiro / Pagamentos</h2>
            <span class="count-badge">${pagamentos.length}</span>
          </div>
          <div class="card-header-actions">
            <!-- Filtro de Status -->
            <select id="filtro-status-pagamento" class="form-control" style="width: auto; padding: 7px 12px;">
              <option value="todos" ${filtroStatus === 'todos' ? 'selected' : ''}>Todos os Status</option>
              <option value="pendente" ${filtroStatus === 'pendente' ? 'selected' : ''}>Pendentes</option>
              <option value="atrasado" ${filtroStatus === 'atrasado' ? 'selected' : ''}>Atrasados</option>
              <option value="pago" ${filtroStatus === 'pago' ? 'selected' : ''}>Pagos</option>
            </select>

            <button class="btn btn-primary" onclick="GymSystem.Views.abrirModalPagamento()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Novo Pagamento
            </button>
          </div>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Aluno</th>
                <th>Plano / Referência</th>
                <th>Valor</th>
                <th>Vencimento</th>
                <th>Data Pagamento</th>
                <th>Status</th>
                <th style="text-align: right;">Ações</th>
              </tr>
            </thead>
            <tbody>
              ${pagamentos.length === 0 ? `
                <tr>
                  <td colspan="7">
                    <div class="empty-table-state">
                      <p>Nenhum pagamento encontrado para este filtro.</p>
                    </div>
                  </td>
                </tr>
              ` : pagamentos.map(pag => `
                <tr>
                  <td class="font-semibold">${pag.alunoNome}</td>
                  <td>${pag.planoNome}</td>
                  <td class="font-bold">${F.formatMoeda(pag.valor)}</td>
                  <td>${F.formatDataBR(pag.dataVencimento)}</td>
                  <td>${pag.dataPagamento ? F.formatDataBR(pag.dataPagamento) : '<span style="color:var(--text-muted);">-</span>'}</td>
                  <td>
                    <span class="badge ${pag.status === 'pago' ? 'badge-paid' : pag.status === 'atrasado' ? 'badge-late' : 'badge-pending'}">${pag.status}</span>
                  </td>
                  <td>
                    <div class="table-actions" style="justify-content: flex-end;">
                      ${pag.status !== 'pago' ? `
                        <button class="btn btn-primary btn-sm" onclick="GymSystem.Views.darBaixaPagamento('${pag.id}', '${pag.alunoNome}')">
                          Baixar
                        </button>
                      ` : ''}
                      <button class="btn-icon edit" title="Editar Pagamento" onclick="GymSystem.Views.abrirModalPagamento('${pag.id}')">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                      </button>
                      <button class="btn-icon delete" title="Excluir Pagamento" onclick="GymSystem.Views.confirmarExclusaoPagamento('${pag.id}', '${pag.alunoNome}')">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    const filtroSelect = document.getElementById('filtro-status-pagamento');
    if (filtroSelect) {
      filtroSelect.addEventListener('change', function (e) {
        renderPagamentos(container, e.target.value);
      });
    }
  }

  function abrirModalPagamento(id = null) {
    const isEdicao = !!id;
    const pag = isEdicao ? GymSystem.PagamentoService.buscarPorId(id) : null;

    const alunos = GymSystem.AlunoService.listarTodos();
    const planos = GymSystem.PlanoService.listarTodos();
    const hoje = new Date().toISOString().split('T')[0];

    const bodyHtml = `
      <form id="form-pagamento" class="form-grid">
        <div class="form-group form-group-full">
          <label>Aluno <span class="req">* (Obrigatório)</span></label>
          <select id="pag-aluno" class="form-control" required>
            <option value="">-- Selecione o Aluno --</option>
            ${alunos.map(a => `
              <option value="${a.id}" ${pag && pag.alunoId === a.id ? 'selected' : ''}>
                ${a.nome} (CPF: ${a.cpf})
              </option>
            `).join('')}
          </select>
        </div>

        <div class="form-group">
          <label>Plano Associado</label>
          <select id="pag-plano" class="form-control">
            <option value="">Nenhum / Mensalidade Avulsa</option>
            ${planos.map(p => `
              <option value="${p.id}" data-valor="${p.valorMensal}" ${pag && pag.planoId === p.id ? 'selected' : ''}>
                ${p.nome} (${F.formatMoeda(p.valorMensal)})
              </option>
            `).join('')}
          </select>
        </div>

        <div class="form-group">
          <label>Valor (R$) <span class="req">*</span></label>
          <input type="number" step="0.01" id="pag-valor" class="form-control" required placeholder="99.90" value="${pag ? pag.valor : ''}">
        </div>

        <div class="form-group">
          <label>Data de Vencimento <span class="req">*</span></label>
          <input type="date" id="pag-vencimento" class="form-control" required value="${pag ? pag.dataVencimento : hoje}">
        </div>

        <div class="form-group">
          <label>Status <span class="req">*</span></label>
          <select id="pag-status" class="form-control">
            <option value="pendente" ${pag && pag.status === 'pendente' ? 'selected' : ''}>Pendente</option>
            <option value="pago" ${pag && pag.status === 'pago' ? 'selected' : ''}>Pago</option>
            <option value="atrasado" ${pag && pag.status === 'atrasado' ? 'selected' : ''}>Atrasado</option>
          </select>
        </div>

        <div class="form-group form-group-full" id="box-data-pagamento">
          <label>Data do Pagamento</label>
          <input type="date" id="pag-data-pag" class="form-control" value="${pag ? pag.dataPagamento : ''}">
        </div>
      </form>
    `;

    Modal.open({
      title: isEdicao ? 'Editar Pagamento' : 'Registrar Novo Pagamento',
      bodyHtml: bodyHtml,
      confirmText: isEdicao ? 'Salvar Pagamento' : 'Registrar Pagamento',
      afterOpen: function (modalBody) {
        const planoSelect = modalBody.querySelector('#pag-plano');
        const valorInput = modalBody.querySelector('#pag-valor');
        const statusSelect = modalBody.querySelector('#pag-status');
        const dataPagInput = modalBody.querySelector('#pag-data-pag');

        // Preenche valor automático ao selecionar plano
        planoSelect.addEventListener('change', function () {
          const selectedOption = planoSelect.options[planoSelect.selectedIndex];
          const valor = selectedOption.getAttribute('data-valor');
          if (valor && !valorInput.value) {
            valorInput.value = valor;
          }
        });

        // Preenche data de pagamento para hoje se marcado como pago
        statusSelect.addEventListener('change', function () {
          if (statusSelect.value === 'pago' && !dataPagInput.value) {
            dataPagInput.value = hoje;
          }
        });
      },
      onConfirm: function () {
        const dados = {
          alunoId: document.getElementById('pag-aluno').value,
          planoId: document.getElementById('pag-plano').value,
          valor: document.getElementById('pag-valor').value,
          dataVencimento: document.getElementById('pag-vencimento').value,
          status: document.getElementById('pag-status').value,
          dataPagamento: document.getElementById('pag-data-pag').value
        };

        try {
          if (isEdicao) {
            GymSystem.PagamentoService.atualizar(id, dados);
            Notify.success('Pagamento atualizado com sucesso!');
          } else {
            GymSystem.PagamentoService.criar(dados);
            Notify.success('Pagamento registrado com sucesso!');
          }
          GymSystem.App.refreshCurrentView();
          return true;
        } catch (err) {
          Notify.error(err.message);
          return false;
        }
      }
    });
  }

  function darBaixaPagamento(id, nomeAluno) {
    Modal.confirm(
      'Confirmar Recebimento',
      `Confirma o recebimento do pagamento para o aluno <strong>${nomeAluno}</strong>? O status será alterado para <strong>PAGO</strong> com a data de hoje.`,
      function () {
        try {
          GymSystem.PagamentoService.registrarPagamentoRecebido(id);
          Notify.success(`Pagamento de ${nomeAluno} registrado como PAGO!`);
          GymSystem.App.refreshCurrentView();
          return true;
        } catch (err) {
          Notify.error(err.message);
          return false;
        }
      },
      false
    );
  }

  function confirmarExclusaoPagamento(id, nomeAluno) {
    Modal.confirm(
      'Excluir Pagamento',
      `Tem certeza que deseja excluir o registro de pagamento de <strong>${nomeAluno}</strong>?`,
      function () {
        try {
          GymSystem.PagamentoService.excluir(id);
          Notify.success('Registro de pagamento excluído com sucesso!');
          GymSystem.App.refreshCurrentView();
          return true;
        } catch (err) {
          Notify.error(err.message);
          return false;
        }
      }
    );
  }

  return {
    renderDashboard: renderDashboard,
    renderAlunos: renderAlunos,
    abrirModalAluno: abrirModalAluno,
    alternarStatusAluno: alternarStatusAluno,
    confirmarExclusaoAluno: confirmarExclusaoAluno,

    renderProfessores: renderProfessores,
    abrirModalProfessor: abrirModalProfessor,
    confirmarExclusaoProfessor: confirmarExclusaoProfessor,

    renderPlanos: renderPlanos,
    abrirModalPlano: abrirModalPlano,
    alternarStatusPlano: alternarStatusPlano,
    confirmarExclusaoPlano: confirmarExclusaoPlano,

    renderMatriculas: renderMatriculas,
    abrirModalMatricula: abrirModalMatricula,
    cancelarMatricula: cancelarMatricula,
    confirmarExclusaoMatricula: confirmarExclusaoMatricula,

    renderPagamentos: renderPagamentos,
    abrirModalPagamento: abrirModalPagamento,
    darBaixaPagamento: darBaixaPagamento,
    confirmarExclusaoPagamento: confirmarExclusaoPagamento
  };
})();
