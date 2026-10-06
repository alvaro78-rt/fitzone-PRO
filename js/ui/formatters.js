/**
 * Utilitários de Formatação de Dados e Máscaras de Entrada
 */

window.GymSystem = window.GymSystem || {};

GymSystem.Formatters = (function () {
  return {
    /**
     * Formata número para moeda brasileira (ex: R$ 119,90)
     */
    formatMoeda: function (valor) {
      const num = parseFloat(valor) || 0;
      return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    },

    /**
     * Formata data YYYY-MM-DD para DD/MM/YYYY
     */
    formatDataBR: function (dataIso) {
      if (!dataIso) return '-';
      const partes = dataIso.split('-');
      if (partes.length === 3) {
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
      }
      return dataIso;
    },

    /**
     * Aplica máscara de CPF visualmente (000.000.000-00)
     */
    formatCPF: function (cpf) {
      if (!cpf) return '-';
      const clean = cpf.replace(/\D/g, '');
      if (clean.length !== 11) return cpf;
      return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    },

    /**
     * Aplica máscara em tempo real no campo de CPF
     */
    aplicarMascaraCPF: function (input) {
      if (!input) return;
      input.addEventListener('input', function (e) {
        let v = e.target.value.replace(/\D/g, '');
        if (v.length > 11) v = v.substring(0, 11);
        v = v.replace(/(\d{3})(\d)/, '$1.$2');
        v = v.replace(/(\d{3})(\d)/, '$1.$2');
        v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        e.target.value = v;
      });
    },

    /**
     * Aplica máscara em tempo real no campo de Telefone ((11) 99999-9999)
     */
    aplicarMascaraTelefone: function (input) {
      if (!input) return;
      input.addEventListener('input', function (e) {
        let v = e.target.value.replace(/\D/g, '');
        if (v.length > 11) v = v.substring(0, 11);
        if (v.length > 10) {
          v = v.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
        } else if (v.length > 6) {
          v = v.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
        } else if (v.length > 2) {
          v = v.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
        }
        e.target.value = v;
      });
    }
  };
})();
