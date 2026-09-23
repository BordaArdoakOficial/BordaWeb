/* ---- render-products.js ---- */
(function () {
  var DOMAIN = 'https://bordaardoak.eus';
  var inEs = /-es\/?$/.test(location.pathname);
  var lang = inEs ? 'es' : 'eu';
  var imgPrefix = '';
  var detailPage = inEs ? '/producto-es/' : 'produktua.html';
  var listPage = inEs ? '/productos-es/' : 'produktuak.html';

  /* Updates the static fallback <head> tags (set by the build-time SEO pass)
     with the actual product being viewed, since this page is one template
     shared by every product via ?slug=. Without this every product would
     share the same generic title/description/canonical in search results. */
  function setSeo(opts) {
    document.title = opts.title;
    var descTag = document.querySelector('meta[name="description"]');
    if (descTag) descTag.setAttribute('content', opts.description);
    [['meta[property="og:title"]', opts.title], ['meta[name="twitter:title"]', opts.title],
     ['meta[property="og:description"]', opts.description], ['meta[name="twitter:description"]', opts.description],
     ['meta[property="og:url"]', opts.url], ['meta[property="og:image"]', opts.image], ['meta[name="twitter:image"]', opts.image]
    ].forEach(function (pair) {
      var el = document.querySelector(pair[0]);
      if (el) el.setAttribute('content', pair[1]);
    });
    var canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', opts.url);
    var hreflangEu = document.querySelector('link[hreflang="eu"]');
    var hreflangEs = document.querySelector('link[hreflang="es"]');
    var hreflangDefault = document.querySelector('link[hreflang="x-default"]');
    if (hreflangEu) hreflangEu.setAttribute('href', opts.euUrl);
    if (hreflangEs) hreflangEs.setAttribute('href', opts.esUrl);
    if (hreflangDefault) hreflangDefault.setAttribute('href', opts.euUrl);
    var ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.textContent = JSON.stringify(opts.jsonLd);
    document.head.appendChild(ld);
  }
  var notFoundHtml = inEs
    ? '<p>Producto no encontrado. <a href="' + listPage + '">Volver a productos</a>.</p>'
    : '<p>Produktua ez da aurkitu. <a href="' + listPage + '">Itzuli produktuetara</a>.</p>';

  /* Canonical type/dok keys stored on each product are language-neutral; these
     tables translate them to the label shown on cards and matched against the
     facet checkboxes in products-filter.js (whose values differ by language). */
  var TYPE_LABELS = {
    urtekoak: { eu: 'Urtekoak', es: 'Del año' },
    onduak: { eu: 'Onduak', es: 'Crianza' },
    erreserbak: { eu: 'Erreserbak', es: 'Reservas' },
    zuriak: { eu: 'Zuriak', es: 'Blancos' },
    gorriak: { eu: 'Gorriak', es: 'Rosados' },
    sagardoak: { eu: 'Sagardoak', es: 'Sidras' },
    txakolinak: { eu: 'Txakoliñak', es: 'Txakolis' },
    cavak: { eu: 'Cavak', es: 'Cavas' },
    garagardoak: { eu: 'Garagardoak', es: 'Cervezas' },
    freskagarriak: { eu: 'Freskagarriak', es: 'Refrescos' },
    likoreak: { eu: 'Likoreak', es: 'Licores' },
    kafea: { eu: 'Kafea', es: 'Café' },
    infusioak: { eu: 'Infusioak', es: 'Infusiones' },
    esneak: { eu: 'Esneak / Esnekiak', es: 'Lácteos' },
    patatak: { eu: 'Patatak', es: 'Patatas' },
    kontserbak: { eu: 'Kontserbak', es: 'Conservas' },
    ostalaritza: { eu: 'Ostalaritza', es: 'Hostelería' },
    olioak: { eu: 'Olioak', es: 'Aceites' }
  };
  var DOK_LABELS = {
    rioja: { eu: 'Rioja', es: 'Rioja' },
    navarra: { eu: 'Navarra', es: 'Navarra' },
    bierzo: { eu: 'Bierzo', es: 'Bierzo' },
    'ribera-duero': { eu: 'Ribera del Duero', es: 'Ribera del Duero' },
    rueda: { eu: 'Rueda', es: 'Rueda' },
    somontano: { eu: 'Somontano', es: 'Somontano' },
    'rias-baixas': { eu: 'Rias Baixas', es: 'Rias Baixas' },
    valdeorras: { eu: 'Valdeorras', es: 'Valdeorras' },
    ribeiro: { eu: 'Ribeiro', es: 'Ribeiro' },
    besteak: { eu: 'Besteak', es: 'Otros' }
  };
  function typeLabel(key) { return key && TYPE_LABELS[key] ? TYPE_LABELS[key][lang] : ''; }
  function dokLabel(key) { return key && DOK_LABELS[key] ? DOK_LABELS[key][lang] : (key || ''); }

  /* "Upategia/Bodega" (winery/cellar) only makes sense for wine-ish products;
     everything else (beer, soft drinks, coffee...) reuses the same `winery`
     field for its brand, so the label shown next to it should say
     Marka/Marca there instead. */
  var WINERY_TYPES = { urtekoak: 1, onduak: 1, erreserbak: 1, zuriak: 1, gorriak: 1, cavak: 1, txakolinak: 1, sagardoak: 1 };
  function wineryFieldLabel(type) {
    var isWinery = !!WINERY_TYPES[type];
    if (isWinery) return inEs ? 'Bodega' : 'Upategia';
    return inEs ? 'Marca' : 'Marka';
  }

  /* Same priority order as the Mota/DOK/Upategia facets in products-filter.js,
     so the grid lists products grouped by type, then D.O., then winery. */
  var TYPE_ORDER = [
    'urtekoak', 'onduak', 'erreserbak', 'zuriak', 'gorriak',
    'sagardoak', 'txakolinak', 'cavak', 'garagardoak', 'freskagarriak', 'likoreak', 'kafea', 'infusioak',
    'esneak', 'patatak', 'kontserbak', 'ostalaritza', 'olioak'
  ];
  var DOK_ORDER = ['rioja', 'navarra', 'bierzo', 'ribera-duero', 'rueda', 'somontano', 'rias-baixas', 'valdeorras', 'ribeiro', 'besteak'];
  function rank(order, v) {
    var i = order.indexOf(v);
    return i === -1 ? order.length : i;
  }

  /* Optional manual `order` weight (default 0) lets a few products within the
     same type be grouped before/after the rest — e.g. coffee capsules after
     bagged coffee, and coffee machines last of all within "Kafea". */
  var data = (window.PRODUCTS_DATA || []).slice().sort(function (a, b) {
    return rank(TYPE_ORDER, a.type) - rank(TYPE_ORDER, b.type) ||
      (a.order || 0) - (b.order || 0) ||
      rank(DOK_ORDER, a.dok) - rank(DOK_ORDER, b.dok) ||
      (a.winery || '').localeCompare(b.winery || '');
  });

  function attr(s) {
    return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  }

  function productCard(p) {
    var category = typeLabel(p.type);
    var sizeClass = p.size === 4 ? ' size-4' : p.size === 2 ? ' size-2' : '';
    return '<a class="product-card' + sizeClass + '" href="' + detailPage + '?slug=' + p.slug + '"' +
      ' data-category="' + attr(category) + '" data-name="' + attr(p.name.toLowerCase()) + '"' +
      ' data-type="' + attr(category) + '" data-dok="' + attr(dokLabel(p.dok)) + '" data-winery="' + attr(p.winery || '') + '">' +
      '<img src="' + imgPrefix + p.image + '" alt="' + attr(p.name) + '" loading="lazy" />' +
      '<div class="product-body">' +
      '<span class="tag">' + category + '</span>' +
      '<h3>' + p.name + '</h3>' +
      '</div></a>';
  }

  var grid = document.getElementById('products-grid');
  if (grid) {
    grid.innerHTML = data.map(productCard).join('');
  }

  var detail = document.getElementById('product-detail');
  if (detail) {
    var slug = new URLSearchParams(location.search).get('slug');
    var product = data.filter(function (p) { return p.slug === slug; })[0];

    if (!product) {
      detail.innerHTML = notFoundHtml;
    } else {
      var category = typeLabel(product.type);
      var excerpt = (product.excerpt && product.excerpt[lang]) || '';
      var description = (product.description && product.description[lang]) || '';
      var absImage = DOMAIN + '/media/' + product.image.replace(/^(\.\.\/)+media\//, '');
      var pageUrl = DOMAIN + (inEs ? detailPage : '/' + detailPage) + '?slug=' + encodeURIComponent(slug);

      setSeo({
        title: product.name + ' | Borda Ardoak',
        description: excerpt || description || (product.name + ' — ' + category + ', ' + dokLabel(product.dok) + '.'),
        image: absImage,
        url: pageUrl,
        euUrl: DOMAIN + '/produktua.html?slug=' + encodeURIComponent(slug),
        esUrl: DOMAIN + '/producto-es/?slug=' + encodeURIComponent(slug),
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          image: absImage,
          description: excerpt || description || undefined,
          category: category || undefined,
          brand: product.winery ? { '@type': 'Brand', name: product.winery } : undefined,
          url: pageUrl
        }
      });

      document.getElementById('product-image').src = imgPrefix + product.image;
      document.getElementById('product-image').alt = product.name;
      document.getElementById('product-tag').textContent = category;
      document.getElementById('product-name').textContent = product.name;
      document.getElementById('product-description').textContent = description;

      var excerptEl = document.getElementById('product-excerpt');
      if (excerptEl) excerptEl.textContent = excerpt;

      var metaEl = document.getElementById('product-meta');
      if (metaEl) {
        var metaRows = [
          { label: inEs ? 'Tipo' : 'Mota', value: category },
          { label: 'DOK', value: dokLabel(product.dok) },
          { label: wineryFieldLabel(product.type), value: product.winery }
        ].filter(function (r) { return r.value; });
        metaEl.innerHTML = metaRows.map(function (r) {
          return '<li><span>' + r.label + '</span><strong>' + r.value + '</strong></li>';
        }).join('');
      }

      /* Prefer showing the rest of the same producer's range (e.g. every
         other David Moreno wine) over just "same type" — a shopper picking
         one bottle from a bodega usually wants to see what else it makes. If
         the product has no winery/brand, fall back to same-type, capped so
         the section doesn't balloon to an entire category. */
      var related = product.winery
        ? data.filter(function (p) { return p.winery === product.winery && p.slug !== product.slug; })
        : data.filter(function (p) { return p.type === product.type && p.slug !== product.slug; }).slice(0, 3);

      var relatedSection = document.getElementById('related-products');
      var relatedGrid = document.getElementById('related-products-grid');
      if (related.length && relatedGrid) {
        relatedGrid.innerHTML = related.map(productCard).join('');
      } else if (relatedSection) {
        relatedSection.style.display = 'none';
      }
    }
  }
})();


/* ---- products-filter.js ---- */
/* Faceted product filter with a left sidebar (Amazon-style): search by name +
   vertical checkbox groups. Works on any page with #products-grid containing
   .product-card elements (dynamic EU render or static ES markup). Facets
   (Mota/Tipo, DOK, Upategia/Bodega) use a fixed taxonomy so the sidebar
   always shows the full list; products are matched via data-type, data-dok
   and data-winery attributes. Also data-name for the search. */
(function () {
  var grid = document.getElementById('products-grid');
  if (!grid) return;

  var facetsEl = document.getElementById('product-facets');
  var searchEl = document.getElementById('product-search');
  var emptyEl = document.getElementById('products-empty');
  var activeEl = document.getElementById('active-filters');
  var clearBtn = document.getElementById('facets-clear');
  var toggleBtn = document.getElementById('filters-toggle');
  var sidebar = document.getElementById('products-sidebar');
  var layout = document.querySelector('.products-layout');
  var loadMoreBtn = document.getElementById('products-load-more');

  var PAGE_SIZE = 50;
  var visibleLimit = PAGE_SIZE;

  /* Checking/clearing a facet can hide most of the grid, shrinking the page
     height under the current scroll position — the browser then clamps
     scroll to the new bottom, which reads as an unwanted jump down. Scroll
     back to the top of the results whenever the filter selection changes. */
  function scrollToResultsTop() {
    if (layout) layout.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  var isES = (document.documentElement.lang || 'eu').toLowerCase().indexOf('es') === 0;

  var FACETS = [
    { key: 'type', label: isES ? 'Tipo' : 'Mota' },
    { key: 'dok', label: 'DOK' },
    { key: 'winery', label: isES ? 'Bodega' : 'Upategia' }
  ];
  var clearLabel = isES ? 'Limpiar filtros' : 'Garbitu iragazkiak';

  /* Fixed option lists for Mota/Tipo, DOK and Upategia/Bodega, so the sidebar
     always shows the full taxonomy regardless of which values the current
     products use. "type" is a flat list of top-level categories where
     "Ardoak/Vinos" is itself a checkbox followed by its nested wine subtypes
     (Urtekoak..Gorriak); no other category has subgroups. Winery names are
     proper nouns, so they're shared between eu/es. */
  /* Generic words ("Bodegas", "Txakolina", "Sidrería", "Champagne"...) are
     trimmed off — the facet already says Upategia/Bodega, so repeating it in
     every option just adds noise. */
  var FIXED_WINERIES = [
    'David Moreno', 'Pierola (Fernández de Piérola)', 'Luis Cañas',
    'Eguren Ugarte', 'Sonsierra', 'Gómez de Segura', 'Carlos Bujanda',
    'Beronia', 'Azpilicueta', 'Heras Cordón', 'Faustino (FyA)',
    'Marqués de Antaño (García Carrión)', 'Carlos Martínez Cañas', 'Abel Estebas (Cordovin)',
    'Castillo Lagomar', 'Labraz', 'Gontés', 'Goren', 'Vado de la Reina', 'Vobiscum',
    'Inurrieta', 'Castillo de Monjardín', 'Lasierpe', 'Ledea',
    'Teófilo Reyes', 'Traslascuesta', 'Roa',
    'Tarsus', 'Chapirete', 'Animoso',
    'Cyatho', 'Mayor de Castilla', 'Valdihuete',
    'Luna Beberide', 'Paixar', 'La Recuperada', 'Zaramendil', 'Quinta da Peza',
    'Marqués de Vizhoja',
    'Juan Miguez', "o'ventosela", 'Enate', 'Agerre', 'Gañeta',
    'Gaintza', 'Ulacia', 'Arregi', 'Mokoroa',
    'Aizpurua', 'Ameztoi', 'Katxina', 'Txomin Etxaniz',
    'Talai Berri', 'K5', 'Aburuza', 'Saizar',
    'Gaztañaga', 'Zapiain', 'Trabanco', 'Vallformosa', 'Mistinguett',
    'Rimarts', 'Jaume Serra', 'Codorníu', 'Juvé & Camps',
    'Moët & Chandon', 'Veuve Clicquot', 'G.H. Mumm',
    'Louis Roederer', 'Delavenne', 'SANDUA', 'Ybarra', 'Frutanea', 'Frutos Secos',
    /* Added with the second product batch (gorriak, esneak, kontserbak, zuriak besteak/ribeiro): */
    'Cresta Rosa (Aguja)', 'Don Luciano', 'La cacciatora', 'Matteus',
    'Asturiana', 'Cola Cao', 'Euskal Herria', 'Maribel', 'Vermeiren',
    'El Palacio', 'Gran Leiriña', 'Haritz', 'Hiru 3 racimos', 'K Pilota',
    'Martin Cendoya', 'Monasterio de Yuso', 'Saltaviñas', 'Ugarte',
    'Vega Verde', 'Viña Arnaiz', 'Viña Leiriña', 'Fizzy (Fizzante)', 'primo',
    /* Added with the cervezas/refrescos/café batch: */
    'Corona', 'Franziskaner', 'Leffe', 'Mahou', 'Modelo', 'Stella Artois',
    'Budweiser', 'Hoegaarden', 'Pacífico', '7UP', 'Aquarius', 'Euskola', 'Kas',
    'Coca-Cola', 'Fanta', 'La Casera', 'Nestea', 'Don Simón', 'Cinzano',
    'La Brasileña', 'Expobar', 'Orhi Markibar',
    /* Added with the conservas batch: */
    'La Explanada', 'Nardin', 'Zubelzu'
  ];

  var FIXED_FACET_ITEMS = {
    type: isES
      ? [
          { value: 'Vinos', children: ['Del año', 'Crianza', 'Reservas', 'Blancos', 'Rosados'] },
          'Sidras', 'Txakolis', 'Cavas', 'Cervezas', 'Refrescos', 'Licores', 'Café', 'Infusiones',
          'Lácteos', 'Patatas', 'Conservas', 'Hostelería', 'Aceites'
        ]
      : [
          { value: 'Ardoak', children: ['Urtekoak', 'Onduak', 'Erreserbak', 'Zuriak', 'Gorriak'] },
          'Sagardoak', 'Txakoliñak', 'Cavak', 'Garagardoak', 'Freskagarriak', 'Likoreak', 'Kafea', 'Infusioak',
          'Esneak / Esnekiak', 'Patatak', 'Kontserbak', 'Ostalaritza', 'Olioak'
        ],
    dok: isES
      ? ['Rioja', 'Navarra', 'Bierzo', 'Ribera del Duero', 'Rueda', 'Somontano', 'Rias Baixas', 'Valdeorras', 'Ribeiro', 'Otros']
      : ['Rioja', 'Navarra', 'Bierzo', 'Ribera del Duero', 'Rueda', 'Somontano', 'Rias Baixas', 'Valdeorras', 'Ribeiro', 'Besteak'],
    winery: FIXED_WINERIES
  };

  function facetOptionHtml(key, v, nested) {
    return '<label class="facet-option' + (nested ? ' is-nested' : '') + '"><input type="checkbox" data-facet="' + key +
      '" value="' + esc(v) + '" /><span>' + esc(v) + '</span></label>';
  }

  var cards = Array.prototype.slice.call(grid.querySelectorAll('.product-card'));
  var query = '';
  var selected = {};
  FACETS.forEach(function (f) { selected[f.key] = []; });

  /* Remember the filter/search state per listing page (eu produktuak.html vs
     es productos.html get separate keys) so that clicking into a product and
     coming back with the browser's Back button restores it instead of
     starting over. sessionStorage clears itself when the tab closes, which
     is the right lifetime here — it shouldn't outlive the visit. */
  var STORAGE_KEY = 'borda-product-filters:' + location.pathname;
  function saveFilterState() {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ query: query, selected: selected }));
    } catch (e) { /* storage unavailable (private mode, quota...) — ignore */ }
  }
  function loadFilterState() {
    try {
      var raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;')
      .replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function cardVal(card, key) {
    return (card.getAttribute('data-' + key) || '').trim();
  }
  function closest(el, sel) {
    while (el && el.nodeType === 1) {
      if (el.matches && el.matches(sel)) return el;
      el = el.parentNode;
    }
    return null;
  }

  /* Parent/child facet options (only "Ardoak/Vinos" today): checking the
     parent has to select every child too, or it filters to a value no
     product actually has and the list goes empty. PARENT_CHILDREN drives that
     cascade; CHILD_TO_PARENT is the reverse lookup so renderActive() can
     collapse "Ardoak + all 5 children" down to a single chip. */
  var PARENT_CHILDREN = {};
  var CHILD_TO_PARENT = {};

  /* Check/uncheck one value (ticking its checkbox + updating `selected`).
     setFacetValueCascade additionally cascades to every child when `val` is
     a parent (e.g. Ardoak -> Urtekoak, Onduak, Erreserbak, Zuriak, Gorriak),
     so the resulting selection always matches real product type values. */
  function setFacetValue(key, val, checked) {
    var arr = selected[key];
    var idx = arr.indexOf(val);
    if (checked && idx === -1) arr.push(val);
    else if (!checked && idx !== -1) arr.splice(idx, 1);
    if (!facetsEl) return;
    var cbs = facetsEl.querySelectorAll('input[data-facet="' + key + '"]');
    for (var i = 0; i < cbs.length; i++) {
      if (cbs[i].value === val) cbs[i].checked = checked;
    }
  }
  function setFacetValueCascade(key, val, checked) {
    setFacetValue(key, val, checked);
    var children = PARENT_CHILDREN[key] && PARENT_CHILDREN[key][val];
    if (children) children.forEach(function (v) { setFacetValue(key, v, checked); });
  }

  /* ---- Build facet groups in the sidebar ---- */
  if (facetsEl) {
    var html = '';
    FACETS.forEach(function (f) {
      var items = FIXED_FACET_ITEMS[f.key];
      var opts;
      if (items) {
        opts = items.map(function (it) {
          if (typeof it === 'string') return facetOptionHtml(f.key, it, false);
          PARENT_CHILDREN[f.key] = PARENT_CHILDREN[f.key] || {};
          PARENT_CHILDREN[f.key][it.value] = it.children;
          CHILD_TO_PARENT[f.key] = CHILD_TO_PARENT[f.key] || {};
          it.children.forEach(function (v) { CHILD_TO_PARENT[f.key][v] = it.value; });
          return facetOptionHtml(f.key, it.value, false) +
            it.children.map(function (v) { return facetOptionHtml(f.key, v, true); }).join('');
        }).join('');
      } else {
        var vals = [];
        cards.forEach(function (c) {
          var v = cardVal(c, f.key);
          if (v && vals.indexOf(v) === -1) vals.push(v);
        });
        if (!vals.length) return;
        vals.sort(function (a, b) { return a.localeCompare(b); });
        opts = vals.map(function (v) { return facetOptionHtml(f.key, v, false); }).join('');
      }
      html += '<div class="facet-group" data-facet-key="' + f.key + '">' +
        '<h3 class="facet-group-title">' + esc(f.label) +
          '<span class="count" hidden>0</span></h3>' +
        '<div class="facet-options">' + opts + '</div>' +
        '</div>';
    });
    facetsEl.innerHTML = html;

    /* Pre-select facets from the URL (?type=Zuriak&type=Gorriak...), so links
       from other pages (e.g. the home category carousel) land already filtered.
       A link with explicit facets is a fresh navigation and wins over any
       remembered state; otherwise fall back to what was saved (e.g. from
       clicking a product and coming back with Back). */
    var urlParams = new URLSearchParams(location.search);
    var hasUrlFacets = FACETS.some(function (f) { return urlParams.getAll(f.key).length; });
    var restored = hasUrlFacets ? null : loadFilterState();

    if (restored && restored.selected) {
      FACETS.forEach(function (f) {
        (restored.selected[f.key] || []).forEach(function (v) { setFacetValueCascade(f.key, v, true); });
      });
      if (restored.query) {
        query = restored.query;
        if (searchEl) searchEl.value = restored.query;
      }
    } else {
      FACETS.forEach(function (f) {
        urlParams.getAll(f.key).forEach(function (v) { setFacetValueCascade(f.key, v, true); });
      });
    }
    saveFilterState();

    facetsEl.addEventListener('change', function (e) {
      var cb = e.target;
      if (!cb || cb.type !== 'checkbox') return;
      var key = cb.getAttribute('data-facet');
      setFacetValueCascade(key, cb.value, cb.checked);
      updateCounts();
      renderActive();
      apply();
      saveFilterState();
      scrollToResultsTop();
    });
  }

  function uncheck(key, val) {
    if (!facetsEl) return;
    var cbs = facetsEl.querySelectorAll('input[data-facet="' + key + '"]');
    for (var i = 0; i < cbs.length; i++) {
      if (cbs[i].value === val) cbs[i].checked = false;
    }
  }

  function anySelected() {
    for (var i = 0; i < FACETS.length; i++) {
      if (selected[FACETS[i].key].length) return true;
    }
    return false;
  }

  function clearAll() {
    FACETS.forEach(function (f) {
      selected[f.key].slice().forEach(function (v) { uncheck(f.key, v); });
      selected[f.key] = [];
    });
    updateCounts();
    renderActive();
    apply();
    saveFilterState();
    scrollToResultsTop();
  }

  function updateCounts() {
    if (facetsEl) {
      FACETS.forEach(function (f) {
        var group = facetsEl.querySelector('.facet-group[data-facet-key="' + f.key + '"]');
        if (!group) return;
        var n = selected[f.key].length;
        var badge = group.querySelector('.count');
        badge.textContent = n;
        badge.hidden = n === 0;
      });
    }
    if (clearBtn) clearBtn.hidden = !anySelected();
  }

  /* ---- Active filter chips ---- */
  function renderActive() {
    if (!activeEl) return;
    var chips = [];
    FACETS.forEach(function (f) {
      selected[f.key].forEach(function (v) {
        /* A child whose parent is also selected (e.g. "Onduak" once "Ardoak"
           is checked) is redundant here — the parent's own chip already
           covers it, and removing that one chip should clear the whole
           group via setFacetValueCascade. */
        var parent = CHILD_TO_PARENT[f.key] && CHILD_TO_PARENT[f.key][v];
        if (parent && selected[f.key].indexOf(parent) !== -1) return;
        chips.push('<span class="active-filter">' + esc(v) +
          '<button type="button" data-facet="' + f.key + '" data-value="' + esc(v) + '" aria-label="X">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>' +
          '</button></span>');
      });
    });
    if (chips.length) {
      chips.push('<button type="button" class="clear-all">' + esc(clearLabel) + '</button>');
    }
    activeEl.innerHTML = chips.join('');
  }

  if (activeEl) {
    activeEl.addEventListener('click', function (e) {
      var btn = closest(e.target, 'button');
      if (!btn) return;
      if (btn.classList.contains('clear-all')) {
        clearAll();
        return;
      }
      var key = btn.getAttribute('data-facet');
      var val = btn.getAttribute('data-value');
      setFacetValueCascade(key, val, false);
      updateCounts();
      renderActive();
      apply();
      saveFilterState();
      scrollToResultsTop();
    });
  }

  if (clearBtn) clearBtn.addEventListener('click', clearAll);

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', function () {
      sidebar.classList.toggle('is-open');
    });
  }

  if (searchEl) {
    searchEl.addEventListener('input', function () {
      query = searchEl.value.trim().toLowerCase();
      apply();
      saveFilterState();
    });
  }

  /* ---- Apply search + facets ---- */
  function apply() {
    var visible = 0;
    var shown = 0;
    var isFiltering = !!query || anySelected();
    cards.forEach(function (c) {
      var name = (c.getAttribute('data-name') || c.textContent || '').toLowerCase();
      var show = !query || name.indexOf(query) !== -1;
      if (show) {
        for (var i = 0; i < FACETS.length; i++) {
          var sel = selected[FACETS[i].key];
          if (sel.length && sel.indexOf(cardVal(c, FACETS[i].key)) === -1) {
            show = false;
            break;
          }
        }
      }
      /* Only paginate the unfiltered "all products" view — while searching or
         filtering, show every match so results never get hidden by the cap. */
      if (show && !isFiltering) {
        shown++;
        if (shown > visibleLimit) show = false;
      }
      c.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    if (emptyEl) emptyEl.hidden = visible !== 0;
    if (loadMoreBtn) loadMoreBtn.hidden = isFiltering || visibleLimit >= cards.length;
  }

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', function () {
      visibleLimit += PAGE_SIZE;
      apply();
    });
  }

  updateCounts();
  renderActive();
  apply();
})();


/* ---- render-catalogs.js ---- */
(function () {
  var DOMAIN = 'https://bordaardoak.eus';
  var inEs = /-es\/?$/.test(location.pathname);
  var lang = inEs ? 'es' : 'eu';
  var pdfPrefix = '';
  var detailPage = inEs ? '/catalogo-es/' : 'katalogoa.html';
  var listPage = inEs ? '/catalogos-es/' : 'catalogoak.html';

  /* Updates the static fallback <head> tags (set by the build-time SEO pass)
     with the actual catalog being viewed, since this page is one template
     shared by every catalog via ?slug=. */
  function setSeo(opts) {
    document.title = opts.title;
    var descTag = document.querySelector('meta[name="description"]');
    if (descTag) descTag.setAttribute('content', opts.description);
    [['meta[property="og:title"]', opts.title], ['meta[name="twitter:title"]', opts.title],
     ['meta[property="og:description"]', opts.description], ['meta[name="twitter:description"]', opts.description],
     ['meta[property="og:url"]', opts.url]
    ].forEach(function (pair) {
      var el = document.querySelector(pair[0]);
      if (el) el.setAttribute('content', pair[1]);
    });
    var canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', opts.url);
    var hreflangEu = document.querySelector('link[hreflang="eu"]');
    var hreflangEs = document.querySelector('link[hreflang="es"]');
    var hreflangDefault = document.querySelector('link[hreflang="x-default"]');
    if (hreflangEu) hreflangEu.setAttribute('href', opts.euUrl);
    if (hreflangEs) hreflangEs.setAttribute('href', opts.esUrl);
    if (hreflangDefault) hreflangDefault.setAttribute('href', opts.euUrl);
  }
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

      setSeo({
        title: d.title + ' | Borda Ardoak',
        description: d.description,
        url: DOMAIN + (inEs ? detailPage : '/' + detailPage) + '?slug=' + encodeURIComponent(cat.slug),
        euUrl: DOMAIN + '/katalogoa.html?slug=' + encodeURIComponent(cat.slug),
        esUrl: DOMAIN + '/catalogo-es/?slug=' + encodeURIComponent(cat.slug)
      });

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


/* ---- category-slider.js ---- */
(function () {
  var sliders = document.querySelectorAll('.category-slider');
  if (!sliders.length) return;

  sliders.forEach(function (slider) {
    var track = slider.querySelector('.category-track');
    if (!track) return;

    var offset = 0;
    var paused = false;
    var lastTime = null;
    var speed = 45; // pixels per second

    slider.addEventListener('mouseenter', function () { paused = true; });
    slider.addEventListener('mouseleave', function () { paused = false; });
    slider.addEventListener('touchstart', function () { paused = true; }, { passive: true });
    slider.addEventListener('touchend', function () { paused = false; });

    function step(timestamp) {
      if (lastTime === null) lastTime = timestamp;
      var delta = (timestamp - lastTime) / 1000;
      lastTime = timestamp;

      if (!paused) {
        offset += speed * delta;
        var half = track.scrollWidth / 2;
        if (half > 0 && offset >= half) offset -= half;
        track.style.transform = 'translateX(' + (-offset) + 'px)';
      }

      requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  });
})();


/* ---- contact-form.js ---- */
(function () {
  var form = document.getElementById('contact-form');
  if (!form) return;

  var inEs = /-es\/?$/.test(location.pathname);
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


/* ---- cookie-consent.js ---- */
(function () {
  var STORAGE_KEY = 'bordaardoak_cookie_consent';

  if (localStorage.getItem(STORAGE_KEY)) return;

  var inEs = /-es\/?$/.test(location.pathname);
  var policyHref = inEs ? '/politica-cookies-es/' : 'cookies-politika.html';

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


/* ---- scroll-top.js ---- */
(function () {
  var btn = document.querySelector('.scroll-top');
  if (!btn) return;

  var toggle = function () {
    btn.classList.toggle('is-visible', window.scrollY > 400);
  };

  toggle();
  window.addEventListener('scroll', toggle, { passive: true });
})();


/* ---- contact-map-loader.js ---- */
(function () {
  var el = document.getElementById('contact-map');
  if (!el) return;

  function initMap() {
    var store = [parseFloat(el.dataset.storeLat), parseFloat(el.dataset.storeLng)];
    var warehouse = [parseFloat(el.dataset.warehouseLat), parseFloat(el.dataset.warehouseLng)];

    var map = L.map(el, { scrollWheelZoom: false });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    L.marker(store).addTo(map).bindPopup(el.dataset.storeLabel);
    L.marker(warehouse).addTo(map).bindPopup(el.dataset.warehouseLabel);
    map.fitBounds([store, warehouse], { padding: [40, 40] });
  }

  if (typeof L !== 'undefined') { initMap(); return; }

  var css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  document.head.appendChild(css);

  var script = document.createElement('script');
  script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
  script.onload = initMap;
  document.head.appendChild(script);
})();
