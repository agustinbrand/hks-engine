# Product Badge Module

Badge de certificación que incluye el nombre del producto dinámicamente.

## Uso mínimo
```json
{
  "id": "product-badge",
  "enabled": true,
  "show_on": "product",
  "config": {}
}
```

Esto mostrará: **CERTIFICADO POR [NOMBRE DEL PRODUCTO]**

## Personalización
```json
{
  "config": {
    "text_before": "APROBADO POR ANMAT:",
    "background": "#26a69a",
    "text_color": "#ffffff",
    "show_icon": true
  }
}
```

## Posiciones disponibles

- `product-name`: Arriba del nombre (default)
- `product-price`: Arriba del precio
- `add-to-cart`: Arriba del botón de compra
