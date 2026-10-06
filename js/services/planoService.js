/**
 * Serviço de Planos (Regras de Negócio e Validações)
 */

window.GymSystem = window.GymSystem || {};

GymSystem.PlanoService = (function () {
  return {
    listarTodos: function () {
      return GymSystem.DB.getAll('planos');
    },

    listarAtivos: function () {
      return this.listarTodos().filter(p => p.status === 'ativo');
    },

    buscarPorId: function (id) {
      return GymSystem.DB.getById('planos', id);
    },

    validarDados: function (dados, idEdicao = null) {
      const erros = [];

      if (!dados.nome || dados.nome.trim().length < 3) {
        erros.push('O nome do plano é obrigatório (mínimo 3 caracteres).');
      }

      if (!dados.descricao || dados.descricao.trim().length < 5) {
        erros.push('A descrição do plano é obrigatória.');
      }

      const valor = parseFloat(dados.valorMensal);
      if (isNaN(valor) || valor <= 0) {
        erros.push('O valor mensal deve ser um número positivo maior que zero.');
      }

      const duracao = parseInt(dados.duracaoMeses, 10);
      if (isNaN(duracao) || duracao <= 0) {
        erros.push('A duração deve ser informada em meses inteiros (mínimo 1 mês).');
      }

      // Evitar nomes duplicados
      const todos = this.listarTodos();
      const nomeTratado = (dados.nome || '').trim().toLowerCase();
      const nomeDuplicado = todos.find(p => p.nome.toLowerCase() === nomeTratado && p.id !== idEdicao);
      if (nomeDuplicado) {
        erros.push(`Já existe um plano cadastrado com o nome "${dados.nome}".`);
      }

      return erros;
    },

    criar: function (dados) {
      const erros = this.validarDados(dados);
      if (erros.length > 0) {
        throw new Error(erros.join('\n'));
      }

      const novoPlano = {
        nome: dados.nome.trim(),
        descricao: dados.descricao.trim(),
        valorMensal: parseFloat(dados.valorMensal),
        duracaoMeses: parseInt(dados.duracaoMeses, 10),
        status: dados.status || 'ativo'
      };

      return GymSystem.DB.insert('planos', novoPlano);
    },

    atualizar: function (id, dados) {
      const erros = this.validarDados(dados, id);
      if (erros.length > 0) {
        throw new Error(erros.join('\n'));
      }

      const dadosAtualizados = {
        nome: dados.nome.trim(),
        descricao: dados.descricao.trim(),
        valorMensal: parseFloat(dados.valorMensal),
        duracaoMeses: parseInt(dados.duracaoMeses, 10),
        status: dados.status || 'ativo'
      };

      return GymSystem.DB.update('planos', id, dadosAtualizados);
    },

    alternarStatus: function (id) {
      const plano = this.buscarPorId(id);
      if (!plano) throw new Error('Plano não encontrado.');

      const novoStatus = plano.status === 'ativo' ? 'inativo' : 'ativo';
      return GymSystem.DB.update('planos', id, { status: novoStatus });
    },

    excluir: function (id) {
      const plano = this.buscarPorId(id);
      if (!plano) throw new Error('Plano não encontrado.');

      // Verifica se há matrículas ativas usando este plano
      const matriculas = GymSystem.DB.getAll('matriculas').filter(m => m.planoId === id && m.status === 'ativa');
      if (matriculas.length > 0) {
        throw new Error(`Não é possível excluir o plano "${plano.nome}" pois existem ${matriculas.length} matrícula(s) ativa(s) vinculada(s). Você pode desativar o plano.`);
      }

      return GymSystem.DB.delete('planos', id);
    }
  };
})();
