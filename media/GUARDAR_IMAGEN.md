# Cómo agregar la imagen de Zarautz

La imagen de Zarautz (atardecer) que compartiste debe guardarse en:

```
media/images/hero/vineyard.png
```

## Pasos:

1. Descarga o guarda la imagen que compartiste
2. Renómbrala como `vineyard.png` (si no lo está)
3. Colócala en la carpeta `media/images/hero/`

Una vez lo hagas, la imagen aparecerá como fondo del home.

## Ubicación completa:

```
BordaWeb/
└── media/
    └── images/
        └── hero/
            └── vineyard.png  ← AQUÍ VA TU IMAGEN
```

Si necesitas cambiar la imagen más adelante, simplemente reemplaza este archivo.

## Nota Técnica

El CSS busca la imagen en este orden de prioridad:
1. `vineyard.png` (tu imagen)
2. Si no existe, usa el fallback de color de gradiente

Esto asegura que el sitio siempre se vea bien, incluso sin la imagen.
