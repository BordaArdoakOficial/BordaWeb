import re, os, json

REPO = "/home/zer0/projects/BordaWeb"
OUT = "/tmp/claude-1000/-home-zer0/726a4d12-c200-4ad2-b548-b6923ac55290/scratchpad/es-pages"

# ES filename -> (new WP slug, WP page title)
ES_PAGES = {
    "home.html":               ("home-es", "Home ES"),
    "productos.html":          ("productos-es", "Productos ES"),
    "producto.html":           ("producto-es", "Producto ES"),
    "catalogos.html":          ("catalogos-es", "Catalogos ES"),
    "catalogo.html":           ("catalogo-es", "Catalogo ES"),
    "servicios.html":          ("servicios-es", "Servicios ES"),
    "quienes-somos.html":      ("quienes-somos-es", "Quienes somos ES"),
    "blog.html":                ("blog-es", "Blog ES"),
    "articulo.html":            ("articulo-es", "Articulo ES"),
    "rrss.html":                 ("rrss-es", "RRSS ES"),
    "contacto.html":            ("contacto-es", "Contacto ES"),
    "aviso-legal.html":         ("aviso-legal-es", "Aviso legal ES"),
    "politica-cookies.html":    ("politica-cookies-es", "Politica cookies ES"),
    "politica-privacidad.html": ("politica-privacidad-es", "Politica privacidad ES"),
}

# EU filename (as used in EU hrefs) -> real EU WP slug
EU_SLUGS = {
    "home.html": "home-html",
    "produktuak.html": "produktuak-html",
    "produktua.html": "produktua-html",
    "catalogoak.html": "catalogoak-html",
    "katalogoa.html": "katalogoa-html",
    "zerbitzuak.html": "zerbitzuak-html",
    "nor-gara.html": "nor-gara-html",
    "blog.html": "blog-html",
    "artikulua.html": "artikuculua-html",
    "rrss.html": "rrss-html",
    "kontaktua.html": "kontaktua-html",
    "lege-oharra.html": "lege-oharra-html",
    "cookies-politika.html": "cookies-politika-html",
    "pribatutasun-politika.html": "pribatutasun-politika-html",
}

# ES filename -> its EU counterpart filename (for the lang-switch EU link)
ES_TO_EU_FILE = {
    "home.html": "home.html",
    "productos.html": "produktuak.html",
    "producto.html": "produktua.html",
    "catalogos.html": "catalogoak.html",
    "catalogo.html": "katalogoa.html",
    "servicios.html": "zerbitzuak.html",
    "quienes-somos.html": "nor-gara.html",
    "blog.html": "blog.html",
    "articulo.html": "artikulua.html",
    "rrss.html": "rrss.html",
    "contacto.html": "kontaktua.html",
    "aviso-legal.html": "lege-oharra.html",
    "politica-cookies.html": "cookies-politika.html",
    "politica-privacidad.html": "pribatutasun-politika.html",
}

def extract_body(html):
    start = html.index('<div id="top">')
    end_marker = 'aria-label="Ir arriba">'
    end_idx = html.index(end_marker)
    # extend to the closing </a> of the scroll-top anchor
    close_idx = html.index('</a>', end_idx) + len('</a>')
    return html[start:close_idx]

results = {}
for fname, (slug, title) in ES_PAGES.items():
    path = os.path.join(REPO, "pages", "es", fname)
    html = open(path, encoding="utf-8").read()
    body = extract_body(html)

    # fix media/pdf paths: ../../media -> ../media, ../../content not applicable in body
    body = body.replace("../../media/", "../media/")

    # rewrite internal nav/footer hrefs (bare ES filenames) to absolute new ES slugs
    for es_fname, (es_slug, _) in ES_PAGES.items():
        body = re.sub(
            r'href="' + re.escape(es_fname) + r'(\?[^"]*)?"',
            lambda m, s=es_slug: 'href="/' + s + '/' + (m.group(1) or '') + '"',
            body
        )

    # lang-switch links: EU -> real eu slug, ES -> self (active)
    eu_file = ES_TO_EU_FILE[fname]
    eu_slug = EU_SLUGS[eu_file]
    body = body.replace(
        '<a href="#" data-lang="eu" class="lang-switch-link">EU</a>',
        '<a href="/' + eu_slug + '/" data-lang="eu" class="lang-switch-link">EU</a>'
    )
    body = body.replace(
        '<a href="#" data-lang="es" class="lang-switch-link">ES</a>',
        '<a href="#" data-lang="es" class="lang-switch-link lang-active">ES</a>'
    )

    out_path = os.path.join(OUT, slug + ".html")
    open(out_path, "w", encoding="utf-8").write(body)
    results[fname] = {"slug": slug, "title": title, "len": len(body)}

json.dump(results, open(os.path.join(OUT, "_manifest.json"), "w"), indent=2, ensure_ascii=False)
for k, v in results.items():
    print(k, "->", v["slug"], v["len"])
