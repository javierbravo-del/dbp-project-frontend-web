export const SAMPLE_VISUALS = [
  {
    description: 'Ventas por medio de pago (barras, soles)',
    visual: {
      tipo: 'BARRAS',
      titulo: 'Ventas por medio de pago',
      formato: 'moneda',
      datos: [
        { etiqueta: 'Yape', valor: 1850 },
        { etiqueta: 'Efectivo', valor: 1240.5 },
        { etiqueta: 'Plin', valor: 760 },
        { etiqueta: 'Tarjeta', valor: 420 },
      ],
    },
  },
  {
    description: 'Ventas por día (líneas)',
    visual: {
      tipo: 'LINEAS',
      titulo: 'Ventas de la última semana',
      formato: 'moneda',
      datos: [
        { etiqueta: 'Lun', valor: 320 },
        { etiqueta: 'Mar', valor: 410 },
        { etiqueta: 'Mié', valor: 280 },
        { etiqueta: 'Jue', valor: 560 },
        { etiqueta: 'Vie', valor: 720 },
        { etiqueta: 'Sáb', valor: 980 },
        { etiqueta: 'Dom', valor: 610 },
      ],
    },
  },
  {
    description: 'Resumen del periodo (tarjetas)',
    visual: {
      tipo: 'TARJETAS',
      titulo: 'Resumen de los últimos 30 días',
      datos: [
        { etiqueta: 'Total vendido', valor: 'S/ 4,270.50', nota: '38 ventas' },
        { etiqueta: 'Ganancia', valor: 'S/ 1,310.20' },
        { etiqueta: 'Margen', valor: '30.7 %', nota: 'sobre lo vendido' },
      ],
    },
  },
  {
    description: 'Stock bajo (tabla)',
    visual: {
      tipo: 'TABLA',
      titulo: 'Para reponer pronto',
      columnas: [
        { clave: 'producto', titulo: 'Producto' },
        { clave: 'talla', titulo: 'Talla' },
        { clave: 'color', titulo: 'Color' },
        { clave: 'stock', titulo: 'Stock' },
      ],
      filas: [
        { producto: 'Polo básico', talla: 'M', color: 'Negro', stock: 2 },
        { producto: 'Polo básico', talla: 'S', color: 'Blanco', stock: 1 },
        { producto: 'Jean slim', talla: '30', color: 'Azul', stock: 3 },
      ],
    },
  },
  {
    description: 'Tipo desconocido: no debe dibujarse nada',
    visual: { tipo: 'PASTEL_3D', titulo: 'No existe', datos: [{ etiqueta: 'A', valor: 1 }] },
  },
]
