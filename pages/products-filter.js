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
    'Juan Miguez', "O'Ventosela", 'Enate', 'Agerre', 'Gañeta',
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
    'Vega Verde', 'Viña Arnaiz', 'Viña Leiriña', 'Fizzy (Fizzante)', 'Primo',
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
