# Fuentes de data/rst_rules.json

Fecha de consulta de todas las fuentes: **2026-10-12**.
UVT usada: **UVT 2026 = $52.374** (año gravable 2026).

Herramienta independiente, sin afiliación con la DIAN. Las fuentes son páginas del Normograma de la DIAN (normograma.dian.gov.co): leyes, un decreto, una resolución y conceptos de la DIAN. El texto consolidado del Estatuto Tributario (arts. 903 a 916) no se pudo leer en esta consulta (la página del Normograma se corta antes y el sitio del Senado no respondió); por eso cada regla se apoya en la ley que la modificó o en el decreto o concepto que la cita.

## Claves de fuentes

(Todas se consultaron en el Normograma de la DIAN; aquí se citan por nombre, sin enlaces.)

- **N-L2277**: Ley 2277 de 2022, arts. 42 a 46 y 74.
- **N-L2155**: Ley 2155 de 2021, arts. 41 y 42.
- **N-D1545**: Decreto 1545 de 2024 (considerandos que citan los arts. 906, 909, 910, 912 y 914 ET).
- **N-UVT**: Resolución DIAN 000238 de 2025.
- **N-O977**: Concepto DIAN 000977 int. 131 de 2023.
- **N-O978**: Concepto DIAN 000978 de 2024.
- **N-O4637**: Oficio DIAN 004637 de 2024 (transcribe la Sentencia C-540 de 2023).
- **N-O15659**: Concepto DIAN 015659 de 2026.

## Exclusión del art. 906 num. 11 ET (texto literal)

Ley 2277 de 2022, art. 43 (N-L2277): «Adiciónese un numeral 11 al Artículo 906 del Estatuto Tributario, así:»

> «11. Las personas naturales o jurídicas que desarrollen las actividades económicas CIIU 4665, 3830 y 3811 que obtengan utilidades netas superiores al tres (3%) del ingreso bruto.»

Confirmado en un segundo texto oficial: considerandos del Decreto 1545 de 2024 (N-D1545).

Lectura que aplica la herramienta: es un supuesto de exclusión: la Ley 2277 art. 43 adiciona el numeral 11 al art. 906 ET. Utilidades netas **superiores** al 3 % del ingreso bruto: excluido; utilidades netas del 3 % o menos del ingreso bruto: esa exclusión no se activa.

## UVT {#uvt}

| Valor | Norma | Artículo | URL | Consultado |
|---|---|---|---|---|
| UVT 2026 = $52.374 | Resolución DIAN 000238 de 2025 | art. 1.2.1: «Fijar en cincuenta y dos mil trescientos setenta y cuatro pesos ($52.374) el valor de la Unidad de Valor Tributario -UVT que regirá durante el año 2026» | N-UVT | 2026-10-12 |

## Requisitos, topes y reglas

| Valor | Norma | Artículo | URL | Consultado |
|---|---|---|---|---|
| 100.000 UVT, tope de ingresos brutos | Ley 2155 de 2021 art. 41 | art. 905 num. 2 ET: «Que en el año gravable anterior hubieren obtenido ingresos brutos, ordinarios o extraordinarios, inferiores a 100.000 UVT.» | N-L2155 | 2026-10-12 |
| 12.000 UVT, tope especial de servicios profesionales: marcado inexequible, valor `null` | Ley 2277 de 2022 art. 42 | inciso añadido al num. 2 del art. 905 ET, marcado «<Inciso INEXEQUIBLE>» en el Normograma | N-L2277 | 2026-10-12 |
| Exclusión CIIU 4665, 3830 y 3811 con utilidades netas > 3 % del ingreso bruto | Ley 2277 de 2022 art. 43 | art. 906 num. 11 ET (texto literal arriba) | N-L2277, N-D1545 | 2026-10-12 |
| 3.500 UVT: personas naturales solo declaración anual | Ley 2277 de 2022 art. 45 | art. 910 par. 3 ET | N-L2277, N-D1545 | 2026-10-12 |
| 3.500 UVT y numeral 1 del art. 908: no responsables de IVA | Ley 2277 de 2022 art. 74 | art. 437 par. 4 ET | N-L2277 | 2026-10-12 |
| Plazo de inscripción: último día hábil de febrero | Ley 2155 de 2021 | art. 909 inc. 1 ET, citado por N-D1545 | N-D1545 | 2026-10-12 |
| 1 mes calendario de retardo para exclusión | ET | art. 914 ET, citado por N-D1545 | N-D1545 | 2026-10-12 |
| SIMPLE sustituye la renta e integra consumo e ICA consolidado | ET | art. 903, citado por N-O977 | N-O977 | 2026-10-12 |
| IVA no integrado | DIAN | Concepto 977 int. 131 de 2023 | N-O977 | 2026-10-12 |
| Varias actividades: tarifa más alta | DIAN | Concepto 015659 de 2026 sobre art. 908 par. 5 (paráfrasis de la DIAN) | N-O15659 | 2026-10-12 |

## Tarifas anuales y anticipos bimestrales (art. 908 ET)

Grupos 1, 2, 3 y CIIU: **Ley 2277 de 2022, art. 44** (modifica el inciso 1 y el parágrafo 4 del art. 908), N-L2277. Las tablas están en texto en el Normograma. Filas leídas (columnas «Igual o superior (UVT)», «Inferior (UVT)», tarifa):

| Grupo | Anual | Bimestral (par. 4) |
|---|---|---|
| num. 1 tiendas | 0-6.000: 1,2 %; 6.000-15.000: 2,8 %; 15.000-30.000: 4,4 %; 30.000-100.000: 5,6 % | 0-1.000: 1,2 %; 1.000-2.500: 2,8 %; 2.500-5.000: 4,4 %; 5.000-16.666: 5,6 % |
| num. 2 comercio e industria | 1,6 %; 2,0 %; 3,5 %; 4,5 % en los mismos tramos | 1,6 %; 2,0 %; 3,5 %; 4,5 % |
| num. 3 comidas y transporte | 3,1 %; 3,4 %; 4,0 %; 4,5 % | 3,1 %; 3,4 %; 4,0 %; 4,5 % |
| num. 6 CIIU 4665, 3830 y 3811 | 1,62 % | 1,62 % |

Servicios profesionales: la Sentencia C-540 de 2023 «DECLARAR INEXEQUIBLES los numerales 4° y 5 del artículo 908 del Estatuto Tributario» y «se revive el numeral 3° del artículo 42 de la Ley 2155 de 2021» (N-O4637, N-O978). La tabla revivida (5,9 %, 7,3 %, 12 %, 14,5 %; anticipo igual con tramos 1.000 / 2.500 / 5.000 / 16.666 UVT) se tomó del Concepto DIAN 978 de 2024 (N-O978), que la transcribe para los años gravables 2024 y siguientes, porque la tabla de la Ley 2155 aparece como imagen en el Normograma.

**Convención de límites de tramo.** Confirmada en un texto oficial: las tablas de la Ley 2277 de 2022 art. 44 (N-L2277) encabezan las columnas «Igual o superior (UVT)» e «Inferior (UVT)», tanto en el inciso 1 como en el parágrafo 4. Límite inferior incluido, superior excluido (desde <= x < hasta). Un valor igual al límite del último tramo (100.000 UVT anual, 16.666 UVT bimestral) no cae en ningún tramo. Para la tabla de servicios profesionales, el Concepto 978 rotula «Desde 0 hasta menos de 6.000», la misma convención.

**Impuesto nacional al consumo del 8 %**: N-L2277 art. 44, par. 4: «En los recibos electrónicos de pago del anticipo bimestral SIMPLE se adicionará la tarifa correspondiente al impuesto nacional al consumo, a la tarifa del ocho por ciento (8%) por concepto de impuesto al consumo a la tarifa SIMPLE consolidada.»

## Descuentos

Art. 912 inc. 2 ET (Ley 2277 de 2022 art. 46, N-L2277 y N-D1545): descuento optativo y excluyente del gravamen a los movimientos financieros, hasta el 0,004 % de los ingresos netos. La herramienta no calcula descuentos.

## No verificado (la calculadora NO lo usa ni lo afirma)

- Texto literal consolidado de los arts. 903, 904, 905, 906 (numerales 1 a 10), 907, 908 (parágrafos 1, 5 y 6), 911 y 913 a 916 del ET: no se leyó. El sitio dice que no es la lista completa de requisitos y causales.
- Descuento del 0,5 % por pagos electrónicos y descuento por aportes a pensión (art. 912 inc. 1): sin cita literal; se retiraron de los datos (`null`).
- Excepción de sociedades nuevas respecto del tope de ingresos y alcance del impuesto al consumo sobre transporte: sin cita literal; retirados.
- Si el impuesto al consumo se causa en una actividad concreta: la herramienta no lo suma y pide verificar con la DIAN.
- Fuentes no oficiales (blogs, Contadia, Actualícese) no se usan como base de ninguna cifra.
