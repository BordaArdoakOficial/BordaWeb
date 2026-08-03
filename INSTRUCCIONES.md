# Instrucciones para Borda Ardoak

## ✅ Lo que está completo

- [x] Estructura HTML de todas las páginas
- [x] Estilos CSS (base + específicos por página)
- [x] Enlaces internos funcionando
- [x] Fuentes (Google Fonts - Outfit)
- [x] Footer mejorado con estilos correctos
- [x] Placeholders SVG para imágenes
- [x] Carpetas de medios organizadas

## 🔄 Próximos Pasos

### 1. Reemplazar Placeholders de Imágenes

Las imágenes actualmente son placeholders SVG. Necesitas reemplazarlas con las reales:

**Imágenes Importantes:**
- `media/images/hero/vineyard.svg` → Debes subir `vineyard.png` (1600x900 mínimo)
  - O simplemente elimina el SVG y crea un PNG con el mismo nombre
- `media/images/sections/products.svg` → Reemplaza con `products.png` (400x300)
- `media/images/sections/store.svg` → Reemplaza con `store.png` (400x300)

**Imágenes de Nor Gara:**
- `media/norgara/denda.jpg` - Foto de la tienda
- `media/norgara/almacen.jpg` - Foto del almacén
- `media/norgara/almacen2.jpg` - Segunda foto del almacén

### 1b. Imágenes del Blog

Cada artículo del blog tiene una imagen. Los placeholders actuales dicen "AQUÍ PON LA IMAGEN":

- `media/images/blog/txakolina.svg` → sube tu foto como `txakolina.jpg` (1200x675)
- `media/images/blog/kontserbak.svg` → sube tu foto como `kontserbak.jpg` (1200x675)
- `media/images/blog/katalogoa.svg` → sube tu foto como `katalogoa.jpg` (1200x675)

Después cambia la ruta en `content/blog-data.js` (campo `image` de cada artículo, de `.svg` a `.jpg`). En `pages/es/blog.html` las imágenes están puestas directamente en el HTML.

### 2. Agregar Catálogo PDF

- Catálogos actuales: `media/pdf/Katalogoa-Zarautz-2026.pdf` y `media/pdf/Katalogoa-Donostia-2026.pdf`
- Para añadir/actualizar catálogos, edita `content/catalogs-data.js` (título, descripción y ruta al PDF)

### 3. Ver el Sitio Localmente

#### Opción A: Abrir directamente
- Navega a: `pages/home.html`
- Abre con tu navegador
- Prueba todos los enlaces

#### Opción B: Usar un servidor local
```bash
# Si tienes Python 3
python -m http.server 8000

# Si tienes Python 2
python -m SimpleHTTPServer 8000

# O con Node.js (npm)
npx http-server
```

Luego abre: `http://localhost:8000/pages/home.html`

### 4. Para WordPress

Si vas a usar esto con WordPress:

1. **Copia el HTML** - Copia el contenido de cada página HTML
2. **Crea las páginas** - En WordPress, crea páginas para cada sección
3. **Pega el contenido** - En el editor, cambia a "HTML" y pega el contenido
4. **Sube imágenes** - Sube todas las imágenes a la biblioteca de medios
5. **Actualiza rutas** - Reemplaza las rutas relativas por URLs de WordPress
   - Ejemplo: `../media/images/hero/vineyard.svg` → `https://tudominio.com/wp-content/uploads/vineyard.png`

### 4b. RRSS (Instagram, Facebook, YouTube, TikTok)

La página `rrss.html` muestra las últimas publicaciones de cada red social directamente incrustadas (no solo un enlace).

- **Instagram, Facebook y TikTok**: usan los widgets oficiales de cada plataforma (son solo HTML/JS, se pegan tal cual en WordPress sin cambios). Para activarlos, edita `content/social-data.js`: pega el enlace directo de la publicación en `postUrl` y cambia `ready` a `true`. Instrucciones detalladas de cómo copiar cada enlace están en los comentarios del propio archivo.
- **YouTube**: en el sitio estático funciona igual que las demás (enlace manual). En **WordPress** puede ser automático de verdad — usa `wordpress/rrss-youtube-shortcode.php`: pega su contenido en `functions.php` (o mejor, en el plugin gratuito "Code Snippets") y añade el shortcode `[rrss_youtube]` donde quieras que aparezca. WordPress consulta solo el feed público del canal (sin clave ni login) y siempre muestra el último vídeo subido, sin tocar nada más.

### 5. Personalizar Contenido

Puedes editar cualquier archivo HTML para cambiar:
- Títulos
- Descripciones
- Precios
- Contactos
- Enlaces

Todo es HTML puro, sin dependencias complejas.

## 📁 Estructura Final

```
BordaWeb/
├── pages/              ← TUS PÁGINAS (abre home.html)
├── media/              ← TUS IMÁGENES Y PDFS
│   ├── images/
│   │   ├── hero/
│   │   └── sections/
│   ├── norgara/
│   └── pdf/
├── assets/             ← Backup de CSS
├── README.md           ← Info general
└── INSTRUCCIONES.md    ← Este archivo
```

## 🎨 Colores del Sitio

Si necesitas personalizar:
- **Primario (Burdeos)**: #722F37
- **Fondo (Crema)**: #FDFCFB
- **Texto (Negro oscuro)**: #1A1A1A
- **Muted (Gris)**: #6B7280
- **Border (Gris claro)**: #E5E7EB

Estos se definen en `pages/style.css` como variables CSS (`:root`)

## ❓ Preguntas Frecuentes

**P: ¿Puedo cambiar los colores?**
R: Sí, edita `:root` en `pages/style.css`

**P: ¿Cómo cambio la fuente?**
R: Busca 'Outfit' en `pages/style.css` y reemplaza con otra de Google Fonts

**P: ¿El sitio es responsive?**
R: Sí, tiene media queries para dispositivos móviles

**P: ¿Qué navegadores soporta?**
R: Chrome, Firefox, Safari, Edge (versiones recientes)

## 📞 Contacto

Archivo de contacto: `pages/kontaktua.html`

Actualiza los datos de contacto según sea necesario.
