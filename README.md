# Calculadora del Régimen Simple de Tributación (RST) de Colombia: biblioteca JavaScript

This project is built and maintained by an automated agent system.

**English summary:** a small, dependency-free JavaScript library that computes the annual consolidated tax and the bimonthly advance (anticipo) of Colombia's Régimen Simple de Tributación (SIMPLE) for five activity groups, using the 2026 UVT (COP 52,374). Rates and brackets live in `data.js` and `data/rst_rules.json`, with every figure traced to an official source in `SOURCES.md`. Run the tests with `node tests/run_fixtures.js`. It is an informational tool, not tax advice, and it is independent: not affiliated with the DIAN.

## Qué calcula

- **Impuesto anual consolidado** del Régimen Simple (art. 908 del Estatuto Tributario) según el grupo de actividad y los ingresos brutos anuales en pesos.
- **Anticipo bimestral** (art. 908 par. 4 ET) según el grupo y los ingresos brutos del bimestre.
- **Elegibilidad por tope de ingresos**: ingresos brutos inferiores a 100.000 UVT (art. 905 num. 2 ET).
- **Exclusión por utilidad neta** (`isExcludedByNetProfit`): el art. 906 num. 11 ET (Ley 2277/2022 art. 43) excluye del SIMPLE a quienes desarrollan las actividades CIIU 4665, 3830 y 3811 y obtienen utilidades netas superiores al 3 % del ingreso bruto. Con utilidades netas de 3 % o menos del ingreso bruto la exclusión no se activa.

Grupos incluidos (ids de `data.js`): `g1_tiendas`, `g2_comercio_industria`, `g3_comidas_transporte`, `g_profesionales` y `g6_ciiu_4665_3830_3811`. Los grupos de educación y salud (numerales 4 y 5, inexequibles por la Sentencia C-540 de 2023) no se ofrecen.

**UVT usada:** UVT 2026 = $52.374 (Resolución DIAN 000238 de 2025). **Fecha de consulta de las fuentes:** 2026-10-12.

Convención: un valor igual al límite entre dos tramos se asigna al tramo superior (desde <= x < hasta), y los encabezados "Igual o superior (UVT)" e "Inferior (UVT)" se leyeron en el texto de la Ley 2277 de 2022, art. 44, publicado en el Normograma de la DIAN (tablas del art. 908 ET). Un valor igual al límite del último tramo (100.000 UVT anual, 16.666 UVT bimestral) no cae en ningún tramo y no se calcula.

## Uso

La biblioteca es JavaScript plano (CommonJS), sin dependencias. También funciona en el navegador cargando `data.js` antes de `calc.js`.

```js
const data = require('./data.js');
const calc = require('./calc.js');

const grupo = data.groups.find((g) => g.id === 'g2_comercio_industria');

// Impuesto anual sobre 200.000.000 COP de ingresos brutos
const anual = calc.annualTax(grupo, 200000000, data);
console.log(anual.ratePct, anual.tax); // 1.6 3200000

// Anticipo de un bimestre con 80.000.000 COP de ingresos
const bimestre = calc.bimonthlyAdvance(grupo, 80000000, data);
console.log(bimestre.ratePct, bimestre.advance); // 2 1600000

// Tope de elegibilidad (100.000 UVT)
console.log(calc.isEligible(200000000, data)); // true
```

Funciones: `toUVT(cop, data)`, `findBracket(brackets, uvt)`, `annualTax(group, annualCop, data)`, `bimonthlyAdvance(group, bimesterCop, data)`, `isEligible(annualCop, data)`, `isExcludedByNetProfit(group, grossCop, netProfitCop)` y `parseUtilidadNeta(raw)`.

`parseUtilidadNeta` lee la utilidad neta escrita con formato colombiano (`"$ 30.000.000,50"`) o como número y devuelve `{ok: true, value}` o `{ok: false, error: "no_numerico" | "no_positivo"}`; vacío, texto, NaN e Infinity son `no_numerico`, un negativo es `no_positivo`, y nunca lanza.

```js
const ciiu = data.groups.find((g) => g.id === 'g6_ciiu_4665_3830_3811');
calc.isExcludedByNetProfit(ciiu, 1000000000, 30000000); // false (3 % exacto)
calc.isExcludedByNetProfit(ciiu, 1000000000, 31000000); // true (3,1 %)
```

Cada resultado trae `uvt`, `bracket`, `ratePct`, el impuesto (`tax` o `advance`) y `error`. Si la cifra no es un número finito, `error` es `"no_numerico"`; si es cero o negativa, `"no_positivo"`; en ambos casos el monto es `null`, nunca `NaN`. Si el monto supera el último tramo, `bracket` y el impuesto son `null`.

El impuesto nacional al consumo del 8 % que se adiciona en los recibos del anticipo (art. 908 par. 4 ET) no se suma en el resultado: figura en `consumption_tax_pct` del grupo `g3_comidas_transporte` para que quien use la biblioteca lo tenga en cuenta.

## Pruebas

Solo hace falta Node.js, sin paquetes ni red:

```
node tests/run_fixtures.js
```

Al final imprime el total de casos y un bloque `FALLAN` (con el detalle de cada caso que falla). El script comprueba cada tramo de cada grupo (dentro del tramo y en ambos límites), casos de entrada inválida, el tope de elegibilidad y que `data.js` coincida valor por valor con `data/rst_rules.json`. Termina con código distinto de cero si algún caso falla.

## Estructura

- `calc.js`: funciones de cálculo.
- `data.js`: tarifas, tramos y UVT usados por `calc.js`.
- `data/rst_rules.json`: las mismas reglas con notas, normas y reglas adicionales (descuentos, actividades múltiples, grupos inexequibles).
- `SOURCES.md`: fuente, artículo y fecha de consulta de cada cifra, y lo que no se pudo verificar.
- `tests/run_fixtures.js`: pruebas con valores esperados escritos como literales.

## Fuentes

Todas las cifras proceden de normas y doctrina oficiales detalladas en `SOURCES.md`, por ejemplo:

- UVT 2026: Resolución DIAN 000238 de 2025.
- Ley 2277 de 2022, arts. 42 a 46 y 74.
- Sentencia C-540 de 2023 de la Corte Constitucional.

**Advertencia sobre las fuentes (sources caveat):** las fuentes son páginas del Normograma de la DIAN (leyes, un decreto, una resolución y conceptos de la DIAN). El texto consolidado del Estatuto Tributario (arts. 903 a 916) no se pudo leer en la consulta del 2026-10-12, así que cada regla se apoya en la ley que la modificó o en el decreto o concepto que la cita. No se verificó el texto literal consolidado de varios numerales y parágrafos (ver `SOURCES.md`), ni los descuentos del art. 912 inc. 1; la herramienta no los usa. / The consolidated Estatuto Tributario text could not be read, so each rule rests on the law that amended it or on a decree or DIAN concept that cites it.

## Sitio web / Live site

La calculadora gratuita en el navegador: https://augeo-calculadora-regimen-simple-colombia-253f.pages.dev/

## Avisos

- **Herramienta informativa, no constituye asesoría tributaria ni contable. Verifique con la DIAN o un contador.**
- Herramienta independiente, sin afiliación con la DIAN.
- Las tarifas y la UVT corresponden al año gravable 2026 y a la fecha de consulta indicada; cambian con la normativa. Revise `SOURCES.md` antes de depender de un resultado.
- Este repositorio fue generado con asistencia de IA. Su contenido se comprueba con las pruebas automáticas incluidas.

## Licencia

MIT, ver `LICENSE`.
