/**
 * Gerenciador de Modais Reutilizáveis
 */

window.GymSystem = window.GymSystem || {};

GymSystem.Modal = (function () {
  let modalOverlay = null;
  let modalTitle = null;
  let modalBody = null;
  let modalFooter = null;
  let currentOnConfirm = null;

  function initElements() {
    if (!modalOverlay) {
      modalOverlay = document.getElementById('global-modal');
      modalTitle = document.getElementById('modal-title');
      modalBody = document.getElementById('modal-body');
      modalFooter = document.getElementById('modal-footer');

      const closeBtn = document.getElementById('modal-close-btn');
      if (closeBtn) {
        closeBtn.addEventListener('click', close);
      }

      // Fechar ao clicar fora
      modalOverlay.addEventListener('click', function (e) {
        if (e.target === modalOverlay) {
          close();
        }
      });
    }
  }

  function open(options = {}) {
    initElements();

    modalTitle.textContent = options.title || 'Informação';
    modalBody.innerHTML = options.bodyHtml || '';

    // Limpa footer anterior
    modalFooter.innerHTML = '';

    // Botão Cancelar
    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.className = 'btn btn-secondary';
    cancelBtn.textContent = options.cancelText || 'Cancelar';
    cancelBtn.addEventListener('click', () => {
      if (options.onCancel) options.onCancel();
      close();
    });
    modalFooter.appendChild(cancelBtn);

    // Botão Confirmar/Salvar
    if (options.confirmText) {
      const confirmBtn = document.createElement('button');
      confirmBtn.type = 'button';
      confirmBtn.className = `btn ${options.confirmDanger ? 'btn-danger' : 'btn-primary'}`;
      confirmBtn.textContent = options.confirmText;
      confirmBtn.id = 'modal-confirm-btn';

      confirmBtn.addEventListener('click', () => {
        if (options.onConfirm) {
          const shouldClose = options.onConfirm();
          if (shouldClose !== false) {
            close();
          }
        } else {
          close();
        }
      });
      modalFooter.appendChild(confirmBtn);
    }

    modalOverlay.classList.add('open');

    // Executa callback se houver após renderizar o corpo
    if (options.afterOpen) {
      options.afterOpen(modalBody);
    }
  }

  function close() {
    initElements();
    modalOverlay.classList.remove('open');
    currentOnConfirm = null;
  }

  function confirmDialog(title, message, onConfirmCallback, isDanger = true) {
    open({
      title: title || 'Confirmação',
      bodyHtml: `<p style="font-size: 14.5px; color: var(--text-secondary); line-height: 1.6;">${message}</p>`,
      confirmText: 'Confirmar',
      confirmDanger: isDanger,
      onConfirm: onConfirmCallback
    });
  }

  return {
    open: open,
    close: close,
    confirm: confirmDialog
  };
})();
