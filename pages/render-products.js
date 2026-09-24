(function () {
  var DOMAIN = 'https://bordaardoak.eus';
  var inEs = /\/es\//.test(location.pathname);
  var lang = inEs ? 'es' : 'eu';
  var imgPrefix = inEs ? '../' : '';
  var detailPage = inEs ? 'producto.html' : 'produktua.html';
  var listPage = inEs ? 'productos.html' : 'produktuak.html';

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
      '<h3 title="' + attr(p.name) + '">' + p.name + '</h3>' +
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
      var pageUrl = DOMAIN + (inEs ? '/es/' + detailPage : '/' + detailPage) + '?slug=' + encodeURIComponent(slug);

      setSeo({
        title: product.name + ' | Borda Ardoak',
        description: excerpt || description || (product.name + ' — ' + category + ', ' + dokLabel(product.dok) + '.'),
        image: absImage,
        url: pageUrl,
        euUrl: DOMAIN + '/produktua.html?slug=' + encodeURIComponent(slug),
        esUrl: DOMAIN + '/es/producto.html?slug=' + encodeURIComponent(slug),
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
