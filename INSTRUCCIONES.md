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

### 2. Agregar Catálogo PDF

- Sube tu catálogo a: `media/pdf/Katalogoa2025-2.pdf`
- Las páginas ya tienen links al PDF

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
