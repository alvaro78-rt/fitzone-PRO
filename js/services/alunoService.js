/**
 * Serviço de Alunos (Regras de Negócio e Validações)
 */

window.GymSystem = window.GymSystem || {};

GymSystem.AlunoService = (function () {
  /**
   * Remove formatação do CPF para comparação segura
   */
  function cleanDoc(str) {
    return (str || '').replace(/\D/g, '');
  }

  /**
   * Validação de formato básico de CPF
   */
  function validarFormatoCPF(cpf) {
    const limpo = cleanDoc(cpf);
    return limpo.length === 11;
  }

  /**
   * Validação de formato de email
   */
  function validarFormatoEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test((email || '').trim());
  }

  return {
    /**
     * Retorna todos os alunos cadastrados
     */
    listarTodos: function () {
      return GymSystem.DB.getAll('alunos');
    },

    /**
     * Busca aluno por ID
     */
    buscarPorId: function (id) {
      return GymSystem.DB.getById('alunos', id);
    },

    /**
     * Filtra alunos por termo de busca (Nome, CPF ou E-mail)
     */
    filtrar: function (termo) {
      const lista = this.listarTodos();
      if (!termo || !termo.trim()) return lista;

      const t = termo.trim().toLowerCase();
      const tNumerico = cleanDoc(termo);

      return lista.filter(aluno => {
        const nomeMatch = aluno.nome.toLowerCase().includes(t);
        const emailMatch = aluno.email.toLowerCase().includes(t);
        const cpfMatch = cleanDoc(aluno.cpf).includes(tNumerico) || aluno.cpf.includes(t);
        return nomeMatch || emailMatch || cpfMatch;
      });
    },

    /**
     * Valida os campos obrigatórios e regras de unicidade de aluno
     */
    validarDados: function (dados, idEdicao = null) {
      const erros = [];

      // Campos obrigatórios
      if (!dados.nome || dados.nome.trim().length < 3) {
        erros.push('O nome completo é obrigatório (mínimo 3 caracteres).');
      }

      if (!dados.cpf || !validarFormatoCPF(dados.cpf)) {
        erros.push('CPF inválido. Deve conter 11 dígitos numéricos.');
      }

      if (!dados.dataNascimento) {
        erros.push('A data de nascimento é obrigatória.');
      }

      if (!dados.telefone || dados.telefone.trim().length < 8) {
        erros.push('O telefone de contato é obrigatório.');
      }

      if (!dados.email || !validarFormatoEmail(dados.email)) {
        erros.push('E-mail inválido ou não informado.');
      }

      if (!dados.endereco || dados.endereco.trim().length < 3) {
        erros.push('O endereço residencial é obrigatório.');
      }

      // Regra de Negócio 1: O CPF não pode ser cadastrado duas vezes
      const todosAlunos = this.listarTodos();
      const cpfLimpo = cleanDoc(dados.cpf);
      const cpfDuplicado = todosAlunos.find(a => cleanDoc(a.cpf) === cpfLimpo && a.id !== idEdicao);
      if (cpfDuplicado) {
        erros.push(`O CPF "${dados.cpf}" já está cadastrado para o aluno ${cpfDuplicado.nome}.`);
      }

      // Regra de Negócio 2: O e-mail não pode ser cadastrado duas vezes
      const emailTratado = (dados.email || '').trim().toLowerCase();
      const emailDuplicado = todosAlunos.find(a => a.email.toLowerCase() === emailTratado && a.id !== idEdicao);
      if (emailDuplicado) {
        erros.push(`O e-mail "${dados.email}" já está cadastrado para o aluno ${emailDuplicado.nome}.`);
      }

      return erros;
    },

    /**
     * Cria um novo aluno respeitando todas as regras de negócio
     */
    criar: function (dados) {
      const erros = this.validarDados(dados);
      if (erros.length > 0) {
        throw new Error(erros.join('\n'));
      }

      const novoAluno = {
        nome: dados.nome.trim(),
        cpf: dados.cpf.trim(),
        dataNascimento: dados.dataNascimento,
        telefone: dados.telefone.trim(),
        email: dados.email.trim().toLowerCase(),
        endereco: dados.endereco.trim(),
        dataCadastro: dados.dataCadastro || new Date().toISOString().split('T')[0],
        status: dados.status || 'ativo'
      };

      return GymSystem.DB.insert('alunos', novoAluno);
    },

    /**
     * Atualiza dados de um aluno existente
     */
    atualizar: function (id, dados) {
      const erros = this.validarDados(dados, id);
      if (erros.length > 0) {
        throw new Error(erros.join('\n'));
      }

      const dadosAtualizados = {
        nome: dados.nome.trim(),
        cpf: dados.cpf.trim(),
        dataNascimento: dados.dataNascimento,
        telefone: dados.telefone.trim(),
        email: dados.email.trim().toLowerCase(),
        endereco: dados.endereco.trim(),
        status: dados.status || 'ativo'
      };

      if (dados.dataCadastro) {
        dadosAtualizados.dataCadastro = dados.dataCadastro;
      }

      return GymSystem.DB.update('alunos', id, dadosAtualizados);
    },

    /**
     * Alterna o status do aluno entre 'ativo' e 'inativo'
     */
    alternarStatus: function (id) {
      const aluno = this.buscarPorId(id);
      if (!aluno) throw new Error('Aluno não encontrado.');

      const novoStatus = aluno.status === 'ativo' ? 'inativo' : 'ativo';
      return GymSystem.DB.update('alunos', id, { status: novoStatus });
    },

    /**
     * Exclui um aluno (verifica se há matrículas ativas ou pagamentos pendentes)
     */
    excluir: function (id) {
      const aluno = this.buscarPorId(id);
      if (!aluno) throw new Error('Aluno não encontrado.');

      // Verifica se há matrículas ativas
      const matriculas = GymSystem.DB.getAll('matriculas').filter(m => m.alunoId === id && m.status === 'ativa');
      if (matriculas.length > 0) {
        throw new Error(`Não é possível excluir o aluno pois ele possui ${matriculas.length} matrícula(s) ativa(s). Cancele a matrícula primeiro.`);
      }

      return GymSystem.DB.delete('alunos', id);
    }
  };
})();
