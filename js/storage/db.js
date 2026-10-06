/**
 * Camada de Acesso a Dados (DAO / Repositório / Armazenamento)
 * Utiliza LocalStorage para persistência no navegador, simulando um banco de dados relacional
 * com suporte a transações simples e carga de dados de teste (Seed Data).
 */

window.GymSystem = window.GymSystem || {};

GymSystem.DB = (function () {
  const STORAGE_KEY = 'GYM_SYSTEM_DATABASE_V1';

  // Dados iniciais para demonstração acadêmica
  const SEED_DATA = {
    users: [
      {
        id: 'usr-1',
        name: 'Prof. Carlos Eduardo',
        email: 'admin@fitzone.com',
        password: 'admin123',
        role: 'Administrador'
      }
    ],
    alunos: [
      {
        id: 'alu-1',
        nome: 'Mariana Costa Ramos',
        cpf: '123.456.789-01',
        dataNascimento: '1998-05-14',
        telefone: '(11) 98765-4321',
        email: 'mariana.costa@email.com',
        endereco: 'Av. Paulista, 1500 - Bela Vista, SP',
        dataCadastro: '2025-01-10',
        status: 'ativo'
      },
      {
        id: 'alu-2',
        nome: 'Lucas Ferreira Mendes',
        cpf: '234.567.890-12',
        dataNascimento: '1995-11-23',
        telefone: '(11) 97654-3210',
        email: 'lucas.mendes@email.com',
        endereco: 'Rua Augusta, 420 - Consolação, SP',
        dataCadastro: '2025-01-15',
        status: 'ativo'
      },
      {
        id: 'alu-3',
        nome: 'Beatriz Almeida Santos',
        cpf: '345.678.901-23',
        dataNascimento: '2001-03-30',
        telefone: '(11) 96543-2109',
        email: 'beatriz.santos@email.com',
        endereco: 'Rua Domingos de Morais, 850 - Vila Mariana, SP',
        dataCadastro: '2025-02-01',
        status: 'ativo'
      },
      {
        id: 'alu-4',
        nome: 'Rodrigo Henrique Lima',
        cpf: '456.789.012-34',
        dataNascimento: '1989-08-19',
        telefone: '(11) 95432-1098',
        email: 'rodrigo.lima@email.com',
        endereco: 'Rua Vergueiro, 2200 - Liberdade, SP',
        dataCadastro: '2025-02-10',
        status: 'inativo'
      },
      {
        id: 'alu-5',
        nome: 'Camila Fernandes Rocha',
        cpf: '567.890.123-45',
        dataNascimento: '1997-12-05',
        telefone: '(11) 94321-0987',
        email: 'camila.rocha@email.com',
        endereco: 'Av. Rebouças, 1100 - Pinheiros, SP',
        dataCadastro: '2025-03-01',
        status: 'ativo'
      }
    ],
    professores: [
      {
        id: 'prf-1',
        nome: 'Alexandre Pires',
        cpf: '678.901.234-56',
        telefone: '(11) 93210-9876',
        email: 'alexandre.pires@fitzone.com',
        especialidade: 'Musculação e Hipertrofia'
      },
      {
        id: 'prf-2',
        nome: 'Juliana Paes',
        cpf: '789.012.345-67',
        telefone: '(11) 92109-8765',
        email: 'juliana.paes@fitzone.com',
        especialidade: 'Pilates e Postura'
      },
      {
        id: 'prf-3',
        nome: 'Fernando Silveira',
        cpf: '890.123.456-78',
        telefone: '(11) 91098-7654',
        email: 'fernando.silveira@fitzone.com',
        especialidade: 'Spinning & Cross Training'
      }
    ],
    planos: [
      {
        id: 'pln-1',
        nome: 'Plano Mensal',
        descricao: 'Acesso total à academia com renovação mensal sem fidelidade.',
        valorMensal: 119.90,
        duracaoMeses: 1,
        status: 'ativo'
      },
      {
        id: 'pln-2',
        nome: 'Plano Trimestral',
        descricao: 'Acesso completo por 3 meses com 15% de desconto no valor mensal.',
        valorMensal: 99.90,
        duracaoMeses: 3,
        status: 'ativo'
      },
      {
        id: 'pln-3',
        nome: 'Plano Anual VIP',
        descricao: 'Acesso total por 12 meses, incluindo aulas de dança, spinning e avaliação física.',
        valorMensal: 79.90,
        duracaoMeses: 12,
        status: 'ativo'
      }
    ],
    matriculas: [
      {
        id: 'mat-1',
        alunoId: 'alu-1',
        planoId: 'pln-3',
        professorId: 'prf-1',
        dataInicio: '2025-01-10',
        dataTermino: '2026-01-10',
        status: 'ativa'
      },
      {
        id: 'mat-2',
        alunoId: 'alu-2',
        planoId: 'pln-2',
        professorId: 'prf-3',
        dataInicio: '2025-01-15',
        dataTermino: '2025-04-15',
        status: 'ativa'
      },
      {
        id: 'mat-3',
        alunoId: 'alu-3',
        planoId: 'pln-1',
        professorId: 'prf-2',
        dataInicio: '2025-02-01',
        dataTermino: '2025-03-01',
        status: 'ativa'
      },
      {
        id: 'mat-4',
        alunoId: 'alu-4',
        planoId: 'pln-1',
        professorId: 'prf-1',
        dataInicio: '2024-11-01',
        dataTermino: '2024-12-01',
        status: 'cancelada'
      }
    ],
    pagamentos: [
      {
        id: 'pag-1',
        alunoId: 'alu-1',
        planoId: 'pln-3',
        valor: 79.90,
        dataVencimento: '2025-01-10',
        dataPagamento: '2025-01-08',
        status: 'pago'
      },
      {
        id: 'pag-2',
        alunoId: 'alu-1',
        planoId: 'pln-3',
        valor: 79.90,
        dataVencimento: '2025-02-10',
        dataPagamento: '2025-02-10',
        status: 'pago'
      },
      {
        id: 'pag-3',
        alunoId: 'alu-2',
        planoId: 'pln-2',
        valor: 99.90,
        dataVencimento: '2025-02-15',
        dataPagamento: '',
        status: 'atrasado'
      },
      {
        id: 'pag-4',
        alunoId: 'alu-3',
        planoId: 'pln-1',
        valor: 119.90,
        dataVencimento: '2025-03-01',
        dataPagamento: '',
        status: 'pendente'
      },
      {
        id: 'pag-5',
        alunoId: 'alu-5',
        planoId: 'pln-2',
        valor: 99.90,
        dataVencimento: '2025-03-15',
        dataPagamento: '',
        status: 'pendente'
      }
    ]
  };

  /**
   * Obtém a base inteira do localStorage ou inicializa com Seed Data
   */
  function getDatabase() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        saveDatabase(SEED_DATA);
        return JSON.parse(JSON.stringify(SEED_DATA));
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Erro ao ler LocalStorage:', e);
      return JSON.parse(JSON.stringify(SEED_DATA));
    }
  }

  /**
   * Grava os dados completos no localStorage
   */
  function saveDatabase(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Erro ao gravar no LocalStorage:', e);
    }
  }

  /**
   * Gera um ID único simples
   */
  function generateId(prefix = 'id') {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`;
  }

  return {
    /**
     * Retorna todos os registros de uma tabela
     */
    getAll: function (collectionName) {
      const db = getDatabase();
      return db[collectionName] ? [...db[collectionName]] : [];
    },

    /**
     * Busca um registro por ID
     */
    getById: function (collectionName, id) {
      const db = getDatabase();
      const list = db[collectionName] || [];
      return list.find(item => item.id === id) || null;
    },

    /**
     * Insere um novo registro
     */
    insert: function (collectionName, item) {
      const db = getDatabase();
      if (!db[collectionName]) {
        db[collectionName] = [];
      }
      const newItem = {
        id: item.id || generateId(collectionName.substr(0, 3)),
        ...item
      };
      db[collectionName].push(newItem);
      saveDatabase(db);
      return newItem;
    },

    /**
     * Atualiza um registro existente
     */
    update: function (collectionName, id, updatedFields) {
      const db = getDatabase();
      const list = db[collectionName] || [];
      const index = list.findIndex(item => item.id === id);

      if (index === -1) {
        throw new Error(`Registro com ID ${id} não encontrado na tabela ${collectionName}.`);
      }

      list[index] = {
        ...list[index],
        ...updatedFields,
        id: id // garante que o ID não mude
      };

      db[collectionName] = list;
      saveDatabase(db);
      return list[index];
    },

    /**
     * Exclui um registro por ID
     */
    delete: function (collectionName, id) {
      const db = getDatabase();
      const list = db[collectionName] || [];
      const filtered = list.filter(item => item.id !== id);

      if (filtered.length === list.length) {
        throw new Error(`Registro com ID ${id} não encontrado para exclusão.`);
      }

      db[collectionName] = filtered;
      saveDatabase(db);
      return true;
    },

    /**
     * Restaura os dados para o padrão de demonstração
     */
    resetToDefaults: function () {
      saveDatabase(SEED_DATA);
      return JSON.parse(JSON.stringify(SEED_DATA));
    }
  };
})();
