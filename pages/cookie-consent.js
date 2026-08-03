(function () {
  var STORAGE_KEY = 'bordaardoak_cookie_consent';

  if (localStorage.getItem(STORAGE_KEY)) return;

  var inEs = /\/es\//.test(location.pathname);
  var policyHref = inEs ? 'politica-cookies.html' : 'cookies-politika.html';

  var text = inEs
    ? 'Utilizamos cookies propias y de terceros para mejorar tu experiencia de navegación. Puedes aceptarlas, rechazar las no esenciales o consultar más información en nuestra <a href="' + policyHref + '">Política de Cookies</a>.'
    : 'Gure/hirugarrenen cookieak erabiltzen ditugu zure nabigazio-esperientzia hobetzeko. Onar ditzakezu, ez-funtsezkoak ezetsi edo informazio gehiago kontsultatu gure <a href="' + policyHref + '">Cookien Politikan</a>.';

  var acceptLabel = inEs ? 'Aceptar todas' : 'Onartu Guztiak';
  var rejectLabel = inEs ? 'Rechazar' : 'Ezetsi';

  var banner = document.createElement('div');
  banner.className = 'cookie-consent';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-live', 'polite');
  banner.setAttribute('aria-label', inEs ? 'Aviso de cookies' : 'Cookien jakinarazpena');
  banner.innerHTML =
    '<p class="cookie-consent-text">' + text + '</p>' +
    '<div class="cookie-consent-actions">' +
    '<button type="button" class="button-secondary" data-cookie-action="reject">' + rejectLabel + '</button>' +
    '<button type="button" class="button" data-cookie-action="accept">' + acceptLabel + '</button>' +
    '</div>';

  document.body.appendChild(banner);
  requestAnimationFrame(function () {
    banner.classList.add('is-visible');
  });

  banner.addEventListener('click', function (e) {
    var action = e.target.getAttribute('data-cookie-action');
    if (!action) return;
    localStorage.setItem(STORAGE_KEY, action);
    banner.classList.remove('is-visible');
    setTimeout(function () { banner.remove(); }, 400);
  });
})();
