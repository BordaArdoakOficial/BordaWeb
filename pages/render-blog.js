(function () {
  var inEs = /\/es\//.test(location.pathname);
  var base = window.WP_BLOG_BASE;
  var articleFile = inEs ? 'articulo.html' : 'artikulua.html';

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

          document.title = post.title + ' | Borda Ardoak';
          document.getElementById('article-title').textContent = post.title;
          document.getElementById('article-meta').textContent = formatDate(post.date);
          document.getElementById('article-tags').innerHTML = tagPills(post.tags);
          var heroImg = document.getElementById('article-image');
          if (heroImg) {
            var heroWrap = heroImg.closest('.article-hero-image');
            if (post.image) {
              heroImg.src = post.image;
              heroImg.alt = post.title;
              if (heroWrap) heroWrap.style.display = '';
            } else if (heroWrap) {
              heroWrap.style.display = 'none';
            }
          }
          document.getElementById('article-content').innerHTML = post.content;

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
