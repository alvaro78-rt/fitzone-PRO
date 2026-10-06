/**
 * Serviço de Professores (Regras de Negócio e Validações)
 */

window.GymSystem = window.GymSystem || {};

GymSystem.ProfessorService = (function () {
  function cleanDoc(str) {
    return (str || '').replace(/\D/g, '');
  }

  function validarFormatoCPF(cpf) {
    const limpo = cleanDoc(cpf);
    return limpo.length === 11;
  }

  function validarFormatoEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test((email || '').trim());
  }

  return {
    listarTodos: function () {
      return GymSystem.DB.getAll('professores');
    },

    buscarPorId: function (id) {
      return GymSystem.DB.getById('professores', id);
    },

    filtrar: function (termo) {
      const lista = this.listarTodos();
      if (!termo || !termo.trim()) return lista;

      const t = termo.trim().toLowerCase();
      const tNumerico = cleanDoc(termo);

      return lista.filter(prof => {
        const nomeMatch = prof.nome.toLowerCase().includes(t);
        const emailMatch = prof.email.toLowerCase().includes(t);
        const espMatch = prof.especialidade.toLowerCase().includes(t);
        const cpfMatch = cleanDoc(prof.cpf).includes(tNumerico) || prof.cpf.includes(t);
        return nomeMatch || emailMatch || espMatch || cpfMatch;
      });
    },

    validarDados: function (dados, idEdicao = null) {
      const erros = [];

      if (!dados.nome || dados.nome.trim().length < 3) {
        erros.push('O nome do professor é obrigatório (mínimo 3 caracteres).');
      }

      if (!dados.cpf || !validarFormatoCPF(dados.cpf)) {
        erros.push('CPF inválido. Deve conter 11 dígitos numéricos.');
      }

      if (!dados.telefone || dados.telefone.trim().length < 8) {
        erros.push('O telefone do professor é obrigatório.');
      }

      if (!dados.email || !validarFormatoEmail(dados.email)) {
        erros.push('E-mail do professor inválido ou não informado.');
      }

      if (!dados.especialidade || dados.especialidade.trim().length < 2) {
        erros.push('A especialidade do professor é obrigatória.');
      }

      // CPF único
      const todos = this.listarTodos();
      const cpfLimpo = cleanDoc(dados.cpf);
      const cpfDuplicado = todos.find(p => cleanDoc(p.cpf) === cpfLimpo && p.id !== idEdicao);
      if (cpfDuplicado) {
        erros.push(`O CPF "${dados.cpf}" já está cadastrado para o professor ${cpfDuplicado.nome}.`);
      }

      // E-mail único
      const emailTratado = (dados.email || '').trim().toLowerCase();
      const emailDuplicado = todos.find(p => p.email.toLowerCase() === emailTratado && p.id !== idEdicao);
      if (emailDuplicado) {
        erros.push(`O e-mail "${dados.email}" já está cadastrado para o professor ${emailDuplicado.nome}.`);
      }

      return erros;
    },

    criar: function (dados) {
      const erros = this.validarDados(dados);
      if (erros.length > 0) {
        throw new Error(erros.join('\n'));
      }

      const novoProf = {
        nome: dados.nome.trim(),
        cpf: dados.cpf.trim(),
        telefone: dados.telefone.trim(),
        email: dados.email.trim().toLowerCase(),
        especialidade: dados.especialidade.trim()
      };

      return GymSystem.DB.insert('professores', novoProf);
    },

    atualizar: function (id, dados) {
      const erros = this.validarDados(dados, id);
      if (erros.length > 0) {
        throw new Error(erros.join('\n'));
      }

      const dadosAtualizados = {
        nome: dados.nome.trim(),
        cpf: dados.cpf.trim(),
        telefone: dados.telefone.trim(),
        email: dados.email.trim().toLowerCase(),
        especialidade: dados.especialidade.trim()
      };

      return GymSystem.DB.update('professores', id, dadosAtualizados);
    },

    excluir: function (id) {
      const prof = this.buscarPorId(id);
      if (!prof) throw new Error('Professor não encontrado.');

      // Verifica se há matrículas associadas ao professor
      const matriculas = GymSystem.DB.getAll('matriculas').filter(m => m.professorId === id && m.status === 'ativa');
      if (matriculas.length > 0) {
        throw new Error(`Não é possível excluir o professor pois ele é responsável por ${matriculas.length} matrícula(s) ativa(s). Reatribua as matrículas antes.`);
      }

      return GymSystem.DB.delete('professores', id);
    }
  };
})();
