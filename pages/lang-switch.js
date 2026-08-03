(function () {
  var euToEs = {
    'home.html': 'home.html',
    'produktuak.html': 'productos.html',
    'produktua.html': 'producto.html',
    'catalogoak.html': 'catalogos.html',
    'katalogoa.html': 'catalogo.html',
    'zerbitzuak.html': 'servicios.html',
    'nor-gara.html': 'quienes-somos.html',
    'blog.html': 'blog.html',
    'artikulua.html': 'articulo.html',
    'rrss.html': 'rrss.html',
    'kontaktua.html': 'contacto.html',
    'lege-oharra.html': 'aviso-legal.html',
    'cookies-politika.html': 'politica-cookies.html',
    'pribatutasun-politika.html': 'politica-privacidad.html',
    '404.html': '404.html'
  };
  var esToEu = {};
  Object.keys(euToEs).forEach(function (eu) { esToEu[euToEs[eu]] = eu; });

  var path = location.pathname;
  var file = path.split('/').pop() || 'home.html';
  var inEs = /\/es\//.test(path);
  var search = location.search || '';

  var euFile = inEs ? (esToEu[file] || 'home.html') : file;
  var esFile = inEs ? file : (euToEs[file] || 'home.html');

  var euHref = (inEs ? '../' + euFile : euFile) + search;
  var esHref = (inEs ? esFile : 'es/' + esFile) + search;

  document.querySelectorAll('[data-lang="eu"]').forEach(function (a) {
    a.setAttribute('href', euHref);
    if (!inEs) a.classList.add('lang-active');
  });
  document.querySelectorAll('[data-lang="es"]').forEach(function (a) {
    a.setAttribute('href', esHref);
    if (inEs) a.classList.add('lang-active');
  });
})();
