(function () {
  var DOMAIN = 'https://bordaardoak.eus';
  var inEs = /\/es\//.test(location.pathname);
  var base = window.WP_BLOG_BASE;
  var articleFile = inEs ? 'articulo.html' : 'artikulua.html';

  /* Updates the static fallback <head> tags (set by the build-time SEO pass)
     with the actual post being viewed, since this page is one template
     shared by every article via ?slug=. Without this every article would
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

  var TEXT = inEs
    ? {
        readMore: 'Leer más →',
        related: 'Otras Noticias',
        notFound: 'No se ha encontrado el artículo. ',
        backLink: 'Volver al blog',
        empty: 'Todavía no hay artículos publicados.',
        error: 'No se han podido cargar los artículos. Inténtalo más tarde.'
      }
    : {
        readMore: 'Irakurri gehiago →',
        related: 'Beste Berriak',
        notFound: 'Artikulua ez da aurkitu. ',
        backLink: 'Itzuli blogera',
        empty: 'Oraindik ez dago artikulurik argitaratuta.',
        error: 'Ezin izan dira artikuluak kargatu. Saiatu berriro geroago.'
      };

  function isPlaceholder(value) {
    return !value || /^PASTE_/.test(value);
  }

  function stripHtml(html) {
    var d = document.createElement('div');
    d.innerHTML = String(html || '');
    return (d.textContent || '').replace(/\s+/g, ' ').trim();
  }

  function formatDate(iso) {
    var d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    return String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0') + '/' + d.getFullYear();
  }

  function apiUrl(path) {
    return base.replace(/\/$/, '') + '/wp-json/wp/v2/' + path;
  }

  function mapPost(wp) {
    var media = wp._embedded && wp._embedded['wp:featuredmedia'] && wp._embedded['wp:featuredmedia'][0];
    var termGroups = (wp._embedded && wp._embedded['wp:term']) || [];
    var terms = termGroups.reduce(function (all, group) { return all.concat(group); }, []);
    var tags = terms.filter(function (t) { return t.taxonomy === 'post_tag'; }).map(function (t) { return t.name; });
    return {
      id: wp.id,
      slug: wp.slug,
      title: stripHtml(wp.title && wp.title.rendered),
      date: wp.date,
      tags: tags,
      image: (media && media.source_url) || '',
      excerpt: stripHtml(wp.excerpt && wp.excerpt.rendered).replace(/\[…\]\s*$/, '…'),
      content: (wp.content && wp.content.rendered) || ''
    };
  }

  /* WordPress ships images with a lazyload plugin: the real file lives in data-orig-src /
     data-srcset, while src/srcset point at a transparent placeholder sized to the image's
     box (so it reserves the space but never shows anything, since this site doesn't load
     that plugin's JS). Swap the real attributes back in so the image actually renders. */
  function fixLazyImages(container) {
    var imgs = container.querySelectorAll('img');
    Array.prototype.forEach.call(imgs, function (img) {
      var realSrc = img.getAttribute('data-orig-src') || img.getAttribute('data-src');
      var realSrcset = img.getAttribute('data-srcset');
      var realSizes = img.getAttribute('data-orig-sizes') || img.getAttribute('data-sizes');
      if (realSrc) img.setAttribute('src', realSrc);
      if (realSrcset) { img.setAttribute('srcset', realSrcset); } else { img.removeAttribute('srcset'); }
      if (realSizes && realSizes !== 'auto') { img.setAttribute('sizes', realSizes); } else { img.removeAttribute('sizes'); }
      img.classList.remove('lazyload');
      img.removeAttribute('width');
      img.removeAttribute('height');
    });
  }

  /* WordPress content sometimes contains plain paragraphs starting with "-" instead of
     a real list block. Group consecutive ones into an actual <ul><li> so they can be
     styled as wine-colored bullets instead of showing as literal dashes. */
  function convertDashParagraphsToLists(container) {
    var nodes = Array.prototype.slice.call(container.children);
    var i = 0;
    while (i < nodes.length) {
      var node = nodes[i];
      if (node.tagName === 'P' && /^-\s*\S/.test(node.textContent.trim())) {
        var group = [];
        var j = i;
        while (j < nodes.length && nodes[j].tagName === 'P' && /^-\s*\S/.test(nodes[j].textContent.trim())) {
          group.push(nodes[j]);
          j++;
        }
        var ul = document.createElement('ul');
        group.forEach(function (p) {
          var li = document.createElement('li');
          li.innerHTML = p.innerHTML.replace(/^\s*-\s*/, '');
          ul.appendChild(li);
        });
        group[0].parentNode.insertBefore(ul, group[0]);
        group.forEach(function (p) { p.remove(); });
        i = j;
      } else {
        i++;
      }
    }
  }

  function tagPills(tags) {
    return tags.map(function (t) { return '<span class="tag">' + t + '</span>'; }).join(' ');
  }

  function meta(post) {
    return '<div class="blog-meta">' + tagPills(post.tags) + '<span>' + formatDate(post.date) + '</span></div>';
  }

  function featuredCard(post) {
    var media = post.image ? '<div class="blog-featured-media"><img src="' + post.image + '" alt="' + post.title + '" /></div>' : '';
    return '<a class="blog-featured" href="' + articleFile + '?slug=' + encodeURIComponent(post.slug) + '">' + media +
      '<div class="blog-featured-body">' + meta(post) + '<h2>' + post.title + '</h2><p>' + post.excerpt + '</p>' +
      '<span class="read-more">' + TEXT.readMore + '</span></div></a>';
  }

  function postCard(post) {
    var media = post.image ? '<div class="blog-card-media"><img src="' + post.image + '" alt="' + post.title + '" /></div>' : '';
    return '<a class="blog-card" href="' + articleFile + '?slug=' + encodeURIComponent(post.slug) + '">' + media +
      '<div class="blog-card-body">' + meta(post) + '<h2>' + post.title + '</h2><p>' + post.excerpt + '</p>' +
      '<span class="read-more">' + TEXT.readMore + '</span></div></a>';
  }

  var featured = document.getElementById('blog-featured');
  var list = document.getElementById('blog-list');
  var detail = document.getElementById('article-detail');

  if (list) {
    if (isPlaceholder(base)) {
      list.innerHTML = '<p class="blog-empty-text">' + TEXT.empty + '</p>';
    } else {
      fetch(apiUrl('posts?_embed&per_page=12'))
        .then(function (r) { return r.json(); })
        .then(function (items) {
          var posts = (items || []).map(mapPost);
          if (!posts.length) { list.innerHTML = '<p class="blog-empty-text">' + TEXT.empty + '</p>'; return; }
          if (featured) {
            featured.innerHTML = featuredCard(posts[0]);
            list.innerHTML = posts.slice(1).map(postCard).join('');
          } else {
            list.innerHTML = posts.map(postCard).join('');
          }
        })
        .catch(function () { list.innerHTML = '<p class="blog-empty-text">' + TEXT.error + '</p>'; });
    }
  }

  if (detail) {
    var slug = new URLSearchParams(location.search).get('slug');
    if (!slug || isPlaceholder(base)) {
      detail.innerHTML = '<p>' + TEXT.notFound + '<a href="blog.html">' + TEXT.backLink + '</a>.</p>';
    } else {
      fetch(apiUrl('posts?slug=' + encodeURIComponent(slug) + '&_embed'))
        .then(function (r) { return r.json(); })
        .then(function (items) {
          var raw = items && items[0];
          if (!raw) { detail.innerHTML = '<p>' + TEXT.notFound + '<a href="blog.html">' + TEXT.backLink + '</a>.</p>'; return; }
          var post = mapPost(raw);
          var pageUrl = DOMAIN + (inEs ? '/es/' + articleFile : '/' + articleFile) + '?slug=' + encodeURIComponent(post.slug);
          var image = post.image || (DOMAIN + '/media/images/hero/fondo1.png');

          setSeo({
            title: post.title + ' | Borda Ardoak',
            description: post.excerpt || post.title,
            image: image,
            url: pageUrl,
            euUrl: DOMAIN + '/artikulua.html?slug=' + encodeURIComponent(post.slug),
            esUrl: DOMAIN + '/es/articulo.html?slug=' + encodeURIComponent(post.slug),
            jsonLd: {
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: post.title,
              image: image,
              datePublished: post.date,
              description: post.excerpt || undefined,
              author: { '@type': 'Organization', name: 'Borda Ardoak' },
              publisher: { '@type': 'Organization', name: 'Borda Ardoak', logo: { '@type': 'ImageObject', url: DOMAIN + '/media/logo/logo-footer.png' } },
              mainEntityOfPage: pageUrl
            }
          });

          document.getElementById('article-title').textContent = post.title;
          document.getElementById('article-meta').textContent = formatDate(post.date);
          document.getElementById('article-tags').innerHTML = tagPills(post.tags);
          var heroImg = document.getElementById('article-image');
          if (heroImg) {
            var heroWrap = heroImg.closest('.article-hero-image');
            var articleMain = heroWrap && heroWrap.closest('.article-main');
            if (post.image) {
              heroImg.src = post.image;
              heroImg.alt = post.title;
              if (heroWrap) heroWrap.style.display = '';
              if (articleMain) articleMain.classList.remove('no-hero');
            } else {
              if (heroWrap) heroWrap.style.display = 'none';
              if (articleMain) articleMain.classList.add('no-hero');
            }
          }
          var contentEl = document.getElementById('article-content');
          contentEl.innerHTML = post.content;
          fixLazyImages(contentEl);
          convertDashParagraphsToLists(contentEl);

          var relatedSection = document.getElementById('related-posts');
          var relatedList = document.getElementById('related-posts-list');
          fetch(apiUrl('posts?_embed&per_page=4&exclude=' + post.id))
            .then(function (r) { return r.json(); })
            .then(function (relItems) {
              var related = (relItems || []).map(mapPost).slice(0, 3);
              if (related.length && relatedList) {
                relatedList.innerHTML = related.map(postCard).join('');
              } else if (relatedSection) {
                relatedSection.style.display = 'none';
              }
            })
            .catch(function () { if (relatedSection) relatedSection.style.display = 'none'; });
        })
        .catch(function () { detail.innerHTML = '<p>' + TEXT.error + '</p>'; });
    }
  }
})();
