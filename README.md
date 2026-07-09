# Borda Ardoak - Sitio Web Estático HTML

Esta es la estructura simplificada del sitio web de Borda Ardoak usando HTML, CSS y medios estáticos.

## Estructura de Carpetas

```
BordaWeb/
├── pages/              # Páginas HTML y CSS (la raíz de trabajo)
│   ├── home.html       # Página de inicio
│   ├── produktuak.html # Página de productos
│   ├── nor-gara.html   # Página de nosotros
│   ├── zerbitzuak.html # Página de servicios
│   ├── katalogoak.html # Página de catálogos
│   ├── kontaktua.html  # Página de contacto
│   ├── blog.html       # Blog
│   ├── lege-oharra.html        # Aviso legal
│   ├── cookies-politika.html   # Política de cookies
│   ├── pribatutasun-politika.html # Política de privacidad
│   ├── style.css       # Estilos base (compartidos por todas las páginas)
│   └── [página].css    # Estilos específicos de cada página
├── media/              # Recursos multimedia
│   ├── images/
│   │   ├── hero/       # Imágenes del hero/banner
│   │   │   └── vineyard.svg (placeholder)
│   │   └── sections/   # Imágenes de secciones
│   │       ├── products.svg (placeholder)
│   │       └── store.svg (placeholder)
│   ├── norgara/        # Imágenes de la sección Nor Gara
│   └── pdf/            # PDFs (catálogos, etc.)
├── assets/             # Backup de estilos (mismo contenido que pages/*.css)
├── content/            # Archivo de contenido (no usado actualmente)
└── .git/               # Control de versiones
```

## Instrucciones

### Para Trabajar Localmente

1. Abre cualquier archivo HTML en tu navegador (ej: `pages/home.html`)
2. Todos los CSS se cargan desde la misma carpeta de pages
3. Los enlaces internos son relativos: `home.html`, `produktuak.html`, etc.

### Imágenes Necesarias

El sitio actualmente usa **placeholders SVG**. Necesitas reemplazar:

- **media/images/hero/vineyard.png** - Fondo del hero (1600x900 mínimo)
- **media/images/sections/products.png** - Imagen de productos (400x300)
- **media/images/sections/store.png** - Imagen de denda (400x300)
- **media/norgara/denda.jpg** - Foto de la denda
- **media/norgara/almacen.jpg** - Foto del almacén
- **media/norgara/almacen2.jpg** - Segunda foto del almacén
- **media/pdf/Katalogoa2025-2.pdf** - Catálogo en PDF

Ver `media/README.md` para más detalles.

### Para Usar con WordPress

1. Copia todo el contenido de la carpeta `pages/` 
2. Crea las páginas en WordPress
3. Sube las imágenes a la biblioteca de medios
4. Actualiza las rutas en los HTML para que apunten a las URLs de WordPress

### Fuentes

El sitio usa **Google Fonts - Outfit** (300, 400, 500, 600, 700 pesos).

Los links de las fuentes están incluidos en todas las páginas HTML.

## Notas

- ✅ Todos los enlaces internos funcionan
- ✅ Los estilos se cargan correctamente
- ✅ El footer tiene estilos mejorados
- ⏳ Falta reemplazar placeholders SVG con imágenes reales
- ⏳ Falta agregar imágenes de "Nor Gara"
- ⏳ Falta crear/agregar el catálogo PDF

## Colores Principales

- Primario: #722F37 (Burdeos)
- Fondo: #FDFCFB (Crema)
- Texto: #1A1A1A (Negro oscuro)
- Muted: #6B7280 (Gris)
- Borde: #E5E7EB (Gris claro)
