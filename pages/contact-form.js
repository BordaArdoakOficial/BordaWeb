(function () {
  var form = document.getElementById('contact-form');
  if (!form) return;

  var inEs = /\/es\//.test(location.pathname);
  var statusEl = document.getElementById('contact-form-status');
  var submitBtn = form.querySelector('button[type="submit"]');
  var submitLabel = submitBtn ? submitBtn.textContent : '';

  var TEXT = inEs
    ? {
        sending: 'Enviando...',
        success: 'Gracias, tu mensaje se ha enviado correctamente.',
        error: 'No se ha podido enviar el mensaje. Inténtalo de nuevo o escríbenos a info@bordaardoak.eus.'
      }
    : {
        sending: 'Bidaltzen...',
        success: 'Eskerrik asko, zure mezua ondo bidali da.',
        error: 'Ezin izan da mezua bidali. Saiatu berriro edo idatzi info@bordaardoak.eus helbidera.'
      };

  function showStatus(text, isError) {
    if (!statusEl) return;
    statusEl.textContent = text;
    statusEl.classList.toggle('is-error', !!isError);
    statusEl.hidden = false;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = TEXT.sending; }
    if (statusEl) statusEl.hidden = true;

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(form)
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.success) {
          showStatus(TEXT.success, false);
          form.reset();
        } else {
          showStatus(TEXT.error, true);
        }
      })
      .catch(function () {
        showStatus(TEXT.error, true);
      })
      .finally(function () {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = submitLabel; }
      });
  });
})();
