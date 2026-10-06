/**
 * Serviço de Matrículas (Regras de Negócio e Validações)
 */

window.GymSystem = window.GymSystem || {};

GymSystem.MatriculaService = (function () {
  /**
   * Calcula a data de término com base na data de início e meses de duração
   */
  function calcularDataTermino(dataInicioStr, duracaoMeses) {
    if (!dataInicioStr || !duracaoMeses) return '';
    const d = new Date(dataInicioStr + 'T00:00:00');
    d.setMonth(d.getMonth() + parseInt(duracaoMeses, 10));
    return d.toISOString().split('T')[0];
  }

  return {
    calcularDataTermino: calcularDataTermino,

    listarTodas: function () {
      const matriculas = GymSystem.DB.getAll('matriculas');
      const alunos = GymSystem.DB.getAll('alunos');
      const planos = GymSystem.DB.getAll('planos');
      const professores = GymSystem.DB.getAll('professores');

      // Enriquece com os dados relacionais para facilitar a visualização
      return matriculas.map(m => {
        const aluno = alunos.find(a => a.id === m.alunoId) || { nome: 'Aluno Removido' };
        const plano = planos.find(p => p.id === m.planoId) || { nome: 'Plano Removido', valorMensal: 0 };
        const professor = professores.find(pr => pr.id === m.professorId) || { nome: 'Não Atribuído' };

        return {
          ...m,
          alunoNome: aluno.nome,
          planoNome: plano.nome,
          planoValor: plano.valorMensal,
          professorNome: professor.nome
        };
      });
    },

    buscarPorId: function (id) {
      return GymSystem.DB.getById('matriculas', id);
    },

    validarDados: function (dados, idEdicao = null) {
      const erros = [];

      if (!dados.alunoId) {
        erros.push('Selecione um aluno para a matrícula.');
      }

      if (!dados.planoId) {
        erros.push('Selecione um plano para a matrícula.');
      }

      if (!dados.professorId) {
        erros.push('Selecione um professor responsável.');
      }

      if (!dados.dataInicio) {
        erros.push('A data de início da matrícula é obrigatória.');
      }

      if (!dados.dataTermino) {
        erros.push('A data de término da matrícula é obrigatória.');
      } else if (dados.dataInicio && dados.dataTermino < dados.dataInicio) {
        erros.push('A data de término não pode ser anterior à data de início.');
      }

      // Validação de aluno ativo
      if (dados.alunoId) {
        const aluno = GymSystem.DB.getById('alunos', dados.alunoId);
        if (aluno && aluno.status === 'inativo') {
          erros.push(`O aluno ${aluno.nome} está inativo no sistema. Ative o aluno antes de matriculá-lo.`);
        }
      }

      // Regra de Negócio: "Um aluno pode ter apenas uma matrícula ativa."
      const statusMatricula = dados.status || 'ativa';
      if (statusMatricula === 'ativa' && dados.alunoId) {
        const todas = GymSystem.DB.getAll('matriculas');
        const matriculaAtivaExistente = todas.find(m => 
          m.alunoId === dados.alunoId && 
          m.status === 'ativa' && 
          m.id !== idEdicao
        );

        if (matriculaAtivaExistente) {
          const aluno = GymSystem.DB.getById('alunos', dados.alunoId);
          const nomeAluno = aluno ? aluno.nome : 'selecionado';
          erros.push(`Regra de Negócio: O aluno "${nomeAluno}" já possui uma matrícula ATIVA (Início: ${matriculaAtivaExistente.dataInicio} até ${matriculaAtivaExistente.dataTermino}). Um aluno pode ter apenas uma matrícula ativa por vez.`);
        }
      }

      return erros;
    },

    criar: function (dados) {
      const erros = this.validarDados(dados);
      if (erros.length > 0) {
        throw new Error(erros.join('\n'));
      }

      const novaMatricula = {
        alunoId: dados.alunoId,
        planoId: dados.planoId,
        professorId: dados.professorId,
        dataInicio: dados.dataInicio,
        dataTermino: dados.dataTermino,
        status: dados.status || 'ativa'
      };

      const matriculaCriada = GymSystem.DB.insert('matriculas', novaMatricula);

      // Gera automaticamente a primeira fatura de pagamento se for matrícula ativa
      if (novaMatricula.status === 'ativa') {
        const plano = GymSystem.DB.getById('planos', dados.planoId);
        if (plano) {
          GymSystem.DB.insert('pagamentos', {
            alunoId: dados.alunoId,
            planoId: dados.planoId,
            valor: plano.valorMensal,
            dataVencimento: dados.dataInicio,
            dataPagamento: '',
            status: 'pendente'
          });
        }
      }

      return matriculaCriada;
    },

    atualizar: function (id, dados) {
      const erros = this.validarDados(dados, id);
      if (erros.length > 0) {
        throw new Error(erros.join('\n'));
      }

      const dadosAtualizados = {
        alunoId: dados.alunoId,
        planoId: dados.planoId,
        professorId: dados.professorId,
        dataInicio: dados.dataInicio,
        dataTermino: dados.dataTermino,
        status: dados.status || 'ativa'
      };

      return GymSystem.DB.update('matriculas', id, dadosAtualizados);
    },

    cancelar: function (id) {
      const mat = this.buscarPorId(id);
      if (!mat) throw new Error('Matrícula não encontrada.');
      return GymSystem.DB.update('matriculas', id, { status: 'cancelada' });
    },

    excluir: function (id) {
      return GymSystem.DB.delete('matriculas', id);
    }
  };
})();
