# FitZone Pro - Sistema de Gerenciamento de Academia

Sistema completo, moderno e didático desenvolvido para projeto da disciplina de **Engenharia de Software**.

---

## 🎯 Objetivo do Projeto

Fornecer uma solução organizada, modular e funcional para a gestão operacional de uma academia, contemplando:
- Controle de alunos e professores
- Planos de treinamento
- Matrículas com regras de vigência
- Controle financeiro de pagamentos
- Dashboard com indicadores-chave em tempo real

O sistema foi concebido seguindo as melhores práticas de **Engenharia de Software**:
- **Separação de Responsabilidades (SoC)** em 3 Camadas: Apresentação (*UI/Views*), Lógica de Negócio (*Services*) e Acesso a Dados (*Storage/Repository*).
- **Validação estrita de regras de negócio**.
- Interface visual moderna, responsiva e limpa.

---

## 🚀 Como Executar

O sistema foi projetado para execução simples e rápida:

### Opção 1: Abrir diretamente no navegador (Zero Configuração)
1. Dê um duplo clique no arquivo [`index.html`](file:///c:/Users/GTI/Documents/aula/index.html) ou abra-o com o Google Chrome, Microsoft Edge ou Firefox.
2. O sistema já carrega com dados de teste pré-populados (*Seed Data*).

### Opção 2: Servidor Local (Opcional)
Se preferir rodar em um servidor HTTP local:
```bash
# Com Python 3:
python -m http.server 3000

# Ou com Node.js (npx serve):
npx serve .
```
Acesse `http://localhost:3000`.

---

## 🔑 Credenciais de Acesso (Demonstração)

Na tela de login, há um botão de **"Preencher automaticamente"** ou utilize:
- **E-mail:** `admin@fitzone.com`
- **Senha:** `admin123`

---

## 📋 Funcionalidades Implementadas

### 1. Dashboard Executivo
- **Total de Alunos** e contagem de alunos ativos/inativos.
- **Professores Cadastrados** na equipe técnica.
- **Planos Disponíveis** para contratação.
- **Pagamentos Pendentes** e valor total acumulado a receber.
- Ações rápidas de atalho e tabelas com as últimas matrículas e pendências financeiras.

### 2. Cadastro e Gestão de Alunos (CRUD)
- Campos: Nome completo, CPF, Data de nascimento, Telefone, E-mail, Endereço, Data de cadastro e Status (ativo/inativo).
- **Regras:**
  - CPF não pode ser cadastrado duas vezes.
  - E-mail não pode ser cadastrado duas vezes.
  - Botão de alternar status (Ativo/Inativo) em 1 clique.
  - Busca em tempo real por nome, CPF ou e-mail.

### 3. Cadastro de Professores (CRUD)
- Campos: Nome, CPF, Telefone, E-mail e Especialidade (ex: Musculação, Pilates, Spinning).
- **Regras:**
  - CPF e E-mail únicos no sistema.
  - Bloqueio de exclusão acidental de professores com turmas/matrículas ativas.

### 4. Cadastro de Planos (CRUD)
- Campos: Nome do plano, Descrição, Valor mensal, Duração em meses e Status.
- Exemplos pré-cadastrados: *Plano Mensal*, *Plano Trimestral* e *Plano Anual VIP*.
- Possibilidade de ativar/desativar planos.

### 5. Matrículas de Alunos (CRUD)
- Seleção de Aluno, Plano e Professor responsável.
- Definição de Data de Início e cálculo automático da Data de Término de acordo com a duração do plano.
- **Regra Crítica:** **Um aluno pode ter apenas uma matrícula ATIVA por vez**. Caso já possua, o sistema bloqueia e emite alerta explicativo.
- Ao gerar uma matrícula ativa, o sistema cria automaticamente a fatura inicial no módulo de pagamentos.

### 6. Controle de Pagamentos (CRUD & Baixa Rápida)
- Campos: Aluno vinculado, Plano/Referência, Valor (R$), Data de Vencimento, Data de Pagamento e Status (*pago*, *pendente*, *atrasado*).
- **Regras:**
  - Não permite cadastrar pagamento sem selecionar um aluno.
  - Identificação inteligente de status **atrasado** se a data de vencimento expirou e não foi paga.
  - Botão de **"Baixar"** direto na listagem para confirmar recebimento e marcar como pago na data corrente.
  - Filtro por status (*Todos*, *Pendentes*, *Atrasados*, *Pagos*).

---

## 🏛️ Estrutura de Pastas e Arquitetura

```
aula/
├── index.html               # Página única da aplicação (SPA)
├── README.md                # Este documento de apresentação
├── docs/
│   └── ARQUITETURA.md       # Documento formal de Engenharia de Software
├── css/
│   ├── variables.css        # Variáveis de cores, tipografia e temas
│   ├── base.css             # Reset de CSS e utilitários
│   ├── layout.css           # Estrutura do Layout (Login, Sidebar, Header)
│   ├── components.css       # Estilos de Cards, Tabelas, Modais, Toasts
│   └── responsive.css       # Regras de adaptação mobile/tablet
└── js/
    ├── storage/
    │   └── db.js            # Camada de Dados (LocalStorage + Seed Data)
    ├── services/            # Camada de Negócio (Regras, validações)
    │   ├── authService.js
    │   ├── alunoService.js
    │   ├── professorService.js
    │   ├── planoService.js
    │   ├── matriculaService.js
    │   └── pagamentoService.js
    ├── ui/                  # Camada de Apresentação (Renderizadores)
    │   ├── formatters.js    # Máscaras de CPF, Telefone, Moeda
    │   ├── notification.js  # Sistema de Toasts (Sucesso/Erro)
    │   ├── modal.js         # Gerenciador de Modais Reutilizáveis
    │   └── views.js         # Telas de CRUD e Dashboard
    └── app.js               # Controlador Principal e Roteador
```

---

## 🎓 Aspectos Relevantes para a Disciplina

1. **Separação de Camadas (3-Tier)**: A interface nunca acessa o `localStorage` diretamente. Ela chama os `Services`, que aplicam as validações de negócio e delegam a persistência para o `DB`.
2. **Tratamento de Exceções**: Todas as violações de regras (CPF duplicado, matrícula ativa repetida, etc.) disparam mensagens claras ao usuário através de componentes visuais elegantes.
3. **Massa de Dados de Teste**: O sistema já vem com registros consistentes para demonstração imediata em banca avaliadora, com botão no cabeçalho para **"Restaurar Dados Demo"** a qualquer momento.
