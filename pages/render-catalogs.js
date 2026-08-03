(function () {
  var inEs = /\/es\//.test(location.pathname);
  var lang = inEs ? 'es' : 'eu';
  var pdfPrefix = inEs ? '../' : '';
  var detailPage = inEs ? 'catalogo.html' : 'katalogoa.html';
  var listPage = inEs ? 'catalogos.html' : 'catalogoak.html';
  var viewLabel = inEs ? 'Ver Catálogo' : 'Ikusi Katalogoa';
  var emptyHtml = inEs
    ? '<p>Ahora mismo no hay catálogos disponibles.</p>'
    : '<p>Une honetan ez dago katalogorik eskuragarri.</p>';
  var notFoundHtml = inEs
    ? '<p>Catálogo no encontrado. <a href="' + listPage + '">Volver a catálogos</a>.</p>'
    : '<p>Katalogoa ez da aurkitu. <a href="' + listPage + '">Itzuli katalogoetara</a>.</p>';

  var data = window.CATALOGS_DATA || [];

  function catalogListCard(cat) {
    var d = cat[lang];
    return '<a class="card catalog-list-card" href="' + detailPage + '?slug=' + cat.slug + '">' +
      '<span class="eyebrow">' + d.edition + '</span>' +
      '<h2 style="margin:0.5rem 0 0.75rem;">' + d.title + '</h2>' +
      '<p style="color:var(--muted);">' + d.description + '</p>' +
      '<span class="button" style="margin-top:1rem;">' + viewLabel + '</span>' +
      '</a>';
  }

  var list = document.getElementById('catalogs-list');
  if (list) {
    list.innerHTML = data.length ? data.map(catalogListCard).join('') : emptyHtml;
  }

  var detail = document.getElementById('catalog-detail');
  if (detail) {
    var slug = new URLSearchParams(location.search).get('slug');
    var cat = data.filter(function (c) { return c.slug === slug; })[0];

    if (!cat) {
      detail.innerHTML = notFoundHtml;
    } else {
      var d = cat[lang];
      var pdfPath = pdfPrefix + cat.pdfPath;
      document.title = d.title + ' | Borda Ardoak';
      document.getElementById('catalog-eyebrow').textContent = d.edition;
      document.getElementById('catalog-title').textContent = d.title;
      document.getElementById('catalog-description').textContent = d.description;
      document.getElementById('catalog-view').href = pdfPath;

      /* Use the browser's own PDF viewer toolbar (not a custom one): it has
         working zoom, page navigation and crisp re-rendering at any zoom
         level out of the box, across multi-page PDFs — a hand-rolled zoom
         control kept breaking one of those (page scroll, reload flicker, or
         blurry scaled rendering). */
      var iframeEl = document.getElementById('catalog-iframe');
      iframeEl.src = pdfPath + '#toolbar=1&navpanes=0';
      iframeEl.title = d.title;
    }
  }
})();
