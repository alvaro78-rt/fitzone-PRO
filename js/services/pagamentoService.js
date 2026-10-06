/**
 * Serviço de Controle de Pagamentos (Regras de Negócio e Validações)
 */

window.GymSystem = window.GymSystem || {};

GymSystem.PagamentoService = (function () {
  /**
   * Obtém a data de hoje no formato YYYY-MM-DD
   */
  function hojeStr() {
    return new Date().toISOString().split('T')[0];
  }

  return {
    listarTodos: function () {
      const pagamentos = GymSystem.DB.getAll('pagamentos');
      const alunos = GymSystem.DB.getAll('alunos');
      const planos = GymSystem.DB.getAll('planos');
      const hoje = hojeStr();

      return pagamentos.map(p => {
        const aluno = alunos.find(a => a.id === p.alunoId) || { nome: 'Aluno Removido' };
        const plano = planos.find(pl => pl.id === p.planoId) || { nome: 'Avulso/Outro' };

        // Atualização dinâmica: se estiver pendente e o vencimento já passou, considera atrasado
        let statusCalculado = p.status;
        if (p.status === 'pendente' && p.dataVencimento < hoje) {
          statusCalculado = 'atrasado';
        }

        return {
          ...p,
          status: statusCalculado,
          alunoNome: aluno.nome,
          planoNome: plano.nome
        };
      });
    },

    buscarPorId: function (id) {
      return GymSystem.DB.getById('pagamentos', id);
    },

    validarDados: function (dados) {
      const erros = [];

      // Regra de Negócio: Não permitir pagamento sem aluno cadastrado
      if (!dados.alunoId) {
        erros.push('Regra de Negócio: Não é permitido cadastrar pagamento sem selecionar um aluno.');
      } else {
        const aluno = GymSystem.DB.getById('alunos', dados.alunoId);
        if (!aluno) {
          erros.push('Aluno informado não existe no cadastro do sistema.');
        }
      }

      const valor = parseFloat(dados.valor);
      if (isNaN(valor) || valor <= 0) {
        erros.push('O valor do pagamento deve ser maior que zero.');
      }

      if (!dados.dataVencimento) {
        erros.push('A data de vencimento é obrigatória.');
      }

      if (dados.status === 'pago' && !dados.dataPagamento) {
        dados.dataPagamento = hojeStr();
      }

      return erros;
    },

    criar: function (dados) {
      const erros = this.validarDados(dados);
      if (erros.length > 0) {
        throw new Error(erros.join('\n'));
      }

      const novoPagamento = {
        alunoId: dados.alunoId,
        planoId: dados.planoId || '',
        valor: parseFloat(dados.valor),
        dataVencimento: dados.dataVencimento,
        dataPagamento: dados.dataPagamento || '',
        status: dados.status || 'pendente'
      };

      return GymSystem.DB.insert('pagamentos', novoPagamento);
    },

    atualizar: function (id, dados) {
      const erros = this.validarDados(dados);
      if (erros.length > 0) {
        throw new Error(erros.join('\n'));
      }

      const dadosAtualizados = {
        alunoId: dados.alunoId,
        planoId: dados.planoId || '',
        valor: parseFloat(dados.valor),
        dataVencimento: dados.dataVencimento,
        dataPagamento: dados.dataPagamento || '',
        status: dados.status
      };

      return GymSystem.DB.update('pagamentos', id, dadosAtualizados);
    },

    /**
     * Ação rápida: Registrar recebimento / marcar como pago
     */
    registrarPagamentoRecebido: function (id) {
      const pag = this.buscarPorId(id);
      if (!pag) throw new Error('Pagamento não encontrado.');

      return GymSystem.DB.update('pagamentos', id, {
        status: 'pago',
        dataPagamento: hojeStr()
      });
    },

    excluir: function (id) {
      return GymSystem.DB.delete('pagamentos', id);
    }
  };
})();
