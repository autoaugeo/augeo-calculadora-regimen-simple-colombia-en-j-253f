// Fixtures for calc.js. Expected values are written out as literals taken
// from data/rst_rules.json (UVT 2026 = 52.374 COP); rates are in basis points
// (1,2 % = 120) so the expectation does not reuse the code under test.
const assert = require('node:assert');
const calc = require('../calc.js');
const data = require('../data.js');

const UVT = 52374;

// [from, to, annual bp] and [from, to, advance bp] per group, from rst_rules.json.
const GROUPS = {
  g1_tiendas: {
    annual: [[0, 6000, 120], [6000, 15000, 280], [15000, 30000, 440], [30000, 100000, 560]],
    adv: [[0, 1000, 120], [1000, 2500, 280], [2500, 5000, 440], [5000, 16666, 560]],
  },
  g2_comercio_industria: {
    annual: [[0, 6000, 160], [6000, 15000, 200], [15000, 30000, 350], [30000, 100000, 450]],
    adv: [[0, 1000, 160], [1000, 2500, 200], [2500, 5000, 350], [5000, 16666, 450]],
  },
  g3_comidas_transporte: {
    annual: [[0, 6000, 310], [6000, 15000, 340], [15000, 30000, 400], [30000, 100000, 450]],
    adv: [[0, 1000, 310], [1000, 2500, 340], [2500, 5000, 400], [5000, 16666, 450]],
  },
  g_profesionales: {
    annual: [[0, 6000, 590], [6000, 15000, 730], [15000, 30000, 1200], [30000, 100000, 1450]],
    adv: [[0, 1000, 590], [1000, 2500, 730], [2500, 5000, 1200], [5000, 16666, 1450]],
  },
  g6_ciiu_4665_3830_3811: {
    annual: [[0, 100000, 162]],
    adv: [[0, 16666, 162]],
  },
};

let passed = 0;
let failed = 0;
const failures = [];

function check(name, fn) {
  try {
    fn();
    passed++;
    console.log('ok   ' + name);
  } catch (e) {
    failed++;
    failures.push({name: name, expected: e.expected, actual: e.actual, message: e.message.split('\n')[0]});
    console.log('FAIL ' + name + ' -> ' + e.message.split('\n')[0]);
  }
}

const expectTax = (cop, bp) => Math.round((cop * bp) / 10000);
const rateOf = (bp) => bp / 100;

// toUVT
check('toUVT: valor de la UVT registrado', () => assert.strictEqual(data.uvt.value_cop, 52374));
check('toUVT: 1 UVT = 1', () => assert.strictEqual(calc.toUVT(52374, data), 1));
check('toUVT: 6.000 UVT en pesos = 6000', () => assert.strictEqual(calc.toUVT(314244000, data), 6000));
check('toUVT: 100.000 UVT en pesos = 100000', () => assert.strictEqual(calc.toUVT(5237400000, data), 100000));
check('toUVT: media UVT = 0,5', () => assert.strictEqual(calc.toUVT(26187, data), 0.5));
check('toUVT: 0 pesos = 0', () => assert.strictEqual(calc.toUVT(0, data), 0));

// Per group: every bracket, inside and at both boundaries.
function checkTable(kind, groupId, rows) {
  const group = data.groups.find((g) => g.id === groupId);
  assert.ok(group, 'grupo ausente en data.js: ' + groupId);
  const run = kind === 'annual' ? calc.annualTax : calc.bimonthlyAdvance;
  const key = kind === 'annual' ? 'tax' : 'advance';
  const label = kind === 'annual' ? 'anual' : 'anticipo';
  rows.forEach((row, i) => {
    const from = row[0];
    const to = row[1];
    const bp = row[2];
    const cases = [];
    // inside: middle UVT of the bracket (whole UVT)
    cases.push(['dentro', Math.round((from + to) / 2) * UVT, bp]);
    // art. 908 ET: "Igual o superior (UVT)" / "Inferior (UVT)": desde <= x < hasta
    if (i === 0) cases.push(['1 UVT', 1 * UVT, bp]);
    if (i > 0) {
      // exactly at this bracket's lower limit: this (upper) bracket's rate
      cases.push(['exacto en ' + from + ' UVT', from * UVT, bp]);
      // one peso below the lower limit: the previous bracket's rate
      cases.push(['1 peso bajo ' + from + ' UVT', from * UVT - 1, rows[i - 1][2]]);
    }
    // one peso below the upper limit still belongs to this bracket
    cases.push(['1 peso bajo ' + to + ' UVT', to * UVT - 1, bp]);
    cases.forEach((c) => {
      check(label + ' ' + groupId + ' tramo ' + (i + 1) + ' ' + c[0], () => {
        const r = run(group, c[1], data);
        assert.strictEqual(r.error, null);
        assert.strictEqual(r.ratePct, rateOf(c[2]));
        assert.strictEqual(r[key], expectTax(c[1], c[2]));
        assert.ok(Number.isFinite(r[key]));
      });
    });
  });
}

Object.keys(GROUPS).forEach((id) => {
  checkTable('annual', id, GROUPS[id].annual);
  checkTable('adv', id, GROUPS[id].adv);
});

check('todos los grupos de data.js están cubiertos', () => {
  assert.deepStrictEqual(data.groups.map((g) => g.id).sort(), Object.keys(GROUPS).sort());
});

// Concrete hand-derivable cases
check('g2 anual 200.000.000 COP -> 1,6 % = 3.200.000', () => {
  const r = calc.annualTax(data.groups.find((g) => g.id === 'g2_comercio_industria'), 200000000, data);
  assert.strictEqual(r.tax, 3200000);
});
check('g_profesionales anual 1.000.000.000 COP (19.093 UVT) -> 12 % = 120.000.000', () => {
  const r = calc.annualTax(data.groups.find((g) => g.id === 'g_profesionales'), 1000000000, data);
  assert.strictEqual(r.ratePct, 12);
  assert.strictEqual(r.tax, 120000000);
});

// Bimonthly advance: one bracket per group, plain literals
[
  ['g1_tiendas', 30000000, 1.2, 360000],
  ['g2_comercio_industria', 80000000, 2.0, 1600000],
  ['g3_comidas_transporte', 200000000, 4.0, 8000000],
  ['g_profesionales', 20000000, 5.9, 1180000],
  ['g6_ciiu_4665_3830_3811', 500000000, 1.62, 8100000],
].forEach((c) => {
  check('anticipo bimestral ' + c[0] + ' ' + c[1] + ' COP -> ' + c[3], () => {
    const g = data.groups.find((x) => x.id === c[0]);
    const r = calc.bimonthlyAdvance(g, c[1], data);
    assert.strictEqual(r.ratePct, c[2]);
    assert.strictEqual(r.advance, c[3]);
  });
});

// Eligibility ceiling: 100.000 UVT
check('elegible: 99.999 UVT', () => assert.strictEqual(calc.isEligible(UVT * 99999, data), true));
check('no elegible: 100.000 UVT exactos', () => assert.strictEqual(calc.isEligible(UVT * 100000, data), false));
check('no elegible: sobre el tope', () => assert.strictEqual(calc.isEligible(UVT * 100001, data), false));
Object.keys(GROUPS).forEach((id) => {
  check('sobre el tope anual no hay impuesto: ' + id, () => {
    const g = data.groups.find((x) => x.id === id);
    const r = calc.annualTax(g, UVT * 100000 + 1, data);
    assert.strictEqual(r.tax, null);
    assert.strictEqual(r.bracket, null);
  });
  check('sobre el último tramo del anticipo no hay anticipo: ' + id, () => {
    const g = data.groups.find((x) => x.id === id);
    const r = calc.bimonthlyAdvance(g, UVT * 16666 + 1, data);
    assert.strictEqual(r.advance, null);
    assert.strictEqual(r.bracket, null);
  });
});

// Exactly at the top limit of the last bracket: no bracket ("sobre el tope"), no rate invented.
Object.keys(GROUPS).forEach((id) => {
  const g = data.groups.find((x) => x.id === id);
  check('exacto en el tope anual (100.000 UVT) no hay tramo: ' + id, () => {
    const r = calc.annualTax(g, UVT * 100000, data);
    assert.strictEqual(r.error, null);
    assert.strictEqual(r.bracket, null);
    assert.strictEqual(r.ratePct, null);
    assert.strictEqual(r.tax, null);
  });
  check('exacto en el tope del anticipo (16.666 UVT) no hay tramo: ' + id, () => {
    const r = calc.bimonthlyAdvance(g, UVT * 16666, data);
    assert.strictEqual(r.error, null);
    assert.strictEqual(r.bracket, null);
    assert.strictEqual(r.ratePct, null);
    assert.strictEqual(r.advance, null);
  });
});

// Invalid input: defined error, never NaN
const BAD = [
  ['cero', 0, 'no_positivo'],
  ['negativo', -1000, 'no_positivo'],
  ['texto', 'abc', 'no_numerico'],
  ['NaN', NaN, 'no_numerico'],
  ['undefined', undefined, 'no_numerico'],
  ['null', null, 'no_numerico'],
  ['Infinity', Infinity, 'no_numerico'],
];
const g2 = data.groups.find((g) => g.id === 'g2_comercio_industria');
BAD.forEach((b) => {
  check('entrada inválida (' + b[0] + '): anual -> error ' + b[2], () => {
    const r = calc.annualTax(g2, b[1], data);
    assert.strictEqual(r.error, b[2]);
    assert.strictEqual(r.tax, null);
    assert.strictEqual(r.uvt, null);
  });
  check('entrada inválida (' + b[0] + '): anticipo -> error ' + b[2], () => {
    const r = calc.bimonthlyAdvance(g2, b[1], data);
    assert.strictEqual(r.error, b[2]);
    assert.strictEqual(r.advance, null);
    assert.strictEqual(r.uvt, null);
  });
  check('entrada inválida (' + b[0] + '): no elegible', () => {
    assert.strictEqual(calc.isEligible(b[1], data), false);
  });
});

// Art. 906 num. 11 ET (Ley 2277/2022 art. 43): CIIU 4665, 3830 y 3811 con utilidades netas
// SUPERIORES al 3 % del ingreso bruto no pueden optar; 3 % o menos no activa la exclusión.
const ciiu = data.groups.find((g) => g.id === 'g6_ciiu_4665_3830_3811');
const GROSS = 1000000000;
[
  ['2,9 %', 29000000, false],
  ['3 % exacto', 30000000, false],
  ['3,1 %', 31000000, true],
  ['0 (sin utilidad)', 0, false],
  ['pérdida', -5000000, false],
  ['100 %', GROSS, true],
].forEach((c) => {
  check('art. 906 num. 11: utilidad ' + c[0] + ' del ingreso bruto -> excluido = ' + c[2], () => {
    assert.strictEqual(calc.isExcludedByNetProfit(ciiu, GROSS, c[1]), c[2]);
  });
});
check('art. 906 num. 11: ingreso pequeño, 3 de 100 no excluye y 4 de 100 sí', () => {
  assert.strictEqual(calc.isExcludedByNetProfit(ciiu, 100, 3), false);
  assert.strictEqual(calc.isExcludedByNetProfit(ciiu, 100, 4), true);
});
check('art. 906 num. 11: otro grupo con 31 % de utilidad no se excluye', () => {
  const other = data.groups.find((g) => g.id === 'g2_comercio_industria');
  assert.strictEqual(calc.isExcludedByNetProfit(other, GROSS, 310000000), false);
});
check('art. 906 num. 11: entradas inválidas no excluyen ni lanzan', () => {
  assert.strictEqual(calc.isExcludedByNetProfit(ciiu, 0, 5), false);
  assert.strictEqual(calc.isExcludedByNetProfit(ciiu, 'x', 5), false);
  assert.strictEqual(calc.isExcludedByNetProfit(ciiu, GROSS, NaN), false);
  assert.strictEqual(calc.isExcludedByNetProfit(ciiu, GROSS, undefined), false);
  assert.strictEqual(calc.isExcludedByNetProfit(undefined, GROSS, 31000000), false);
});
check('art. 906 num. 11: el grupo CIIU trae el 3 % en data.js', () => {
  assert.strictEqual(ciiu.net_profit_exclusion_pct, 3);
  assert.strictEqual(data.groups.filter((g) => g.net_profit_exclusion_pct).length, 1);
});

// parseUtilidadNeta: entrada de la utilidad neta, sin DOM.
[['texto', 'abc', 'no_numerico'], ['vacío', '', 'no_numerico'], ['solo espacios', '   ', 'no_numerico'],
  ['cadena NaN', 'NaN', 'no_numerico'], ['NaN', NaN, 'no_numerico'], ['undefined', undefined, 'no_numerico'],
  ['null', null, 'no_numerico'], ['Infinity', Infinity, 'no_numerico'], ['cadena Infinity', 'Infinity', 'no_numerico'],
  ['-Infinity', -Infinity, 'no_numerico'], ['objeto', {}, 'no_numerico'],
  ['negativo texto', '-5.000.000', 'no_positivo'], ['negativo número', -1, 'no_positivo']].forEach((c) => {
  check('parseUtilidadNeta (' + c[0] + ') -> ' + c[2], () => {
    const r = calc.parseUtilidadNeta(c[1]);
    assert.deepStrictEqual(r, {ok: false, error: c[2]});
  });
});
check('parseUtilidadNeta: formatos válidos', () => {
  assert.deepStrictEqual(calc.parseUtilidadNeta('29.000.000'), {ok: true, value: 29000000});
  assert.deepStrictEqual(calc.parseUtilidadNeta('$ 30.000.000,50'), {ok: true, value: 30000000.5});
  assert.deepStrictEqual(calc.parseUtilidadNeta('0'), {ok: true, value: 0});
  assert.deepStrictEqual(calc.parseUtilidadNeta(31000000), {ok: true, value: 31000000});
});
[[29000000, false], [30000000, false], [31000000, true]].forEach((c) => {
  check('parseUtilidadNeta + art. 906 num. 11: ' + c[0] + ' sobre 1.000 millones (' + c[0] / 10000000 + ' %) excluye=' + c[1], () => {
    const r = calc.parseUtilidadNeta(String(c[0]));
    assert.strictEqual(r.ok, true);
    assert.strictEqual(calc.isExcludedByNetProfit(ciiu, GROSS, r.value), c[1]);
  });
});

// Ningún archivo del repositorio cita el artículo equivocado ni invierte el sentido de la norma.
const fs = require('node:fs');
const WRONG_ART = 'art. 905 ' + 'num. 11';
const WRONG_VERB = 'exige para estas actividades ' + 'utilidades netas';
['README.md', 'SOURCES.md', 'data.js', 'data/rst_rules.json'].forEach((p) => {
  check('texto legal: ' + p + ' sin el art. 905 num. 11 ni "exige" utilidades', () => {
    const t = fs.readFileSync(__dirname + '/../' + p, 'utf8');
    assert.ok(!t.includes(WRONG_ART) && !t.includes(WRONG_VERB));
  });
});

// data.js vs data/rst_rules.json, value by value.
const rules = JSON.parse(require('node:fs').readFileSync(__dirname + '/../data/rst_rules.json', 'utf8'));
check('datos: UVT (año, valor, norma) igual a rst_rules.json', () => {
  assert.strictEqual(data.uvt.year, rules.uvt.year);
  assert.strictEqual(data.uvt.value_cop, rules.uvt.value_cop);
  assert.strictEqual(data.uvt.norm, rules.uvt.norm);
});
check('datos: fecha de consulta igual a rst_rules.json', () => assert.strictEqual(data.last_consulted, rules.last_consulted));
check('datos: umbrales de elegibilidad iguales', () => {
  assert.strictEqual(data.eligibility.gross_income_ceiling_uvt, rules.eligibility.gross_income_ceiling_uvt);
  assert.strictEqual(data.eligibility.natural_person_annual_only_threshold_uvt, rules.eligibility.natural_person_annual_only_threshold_uvt);
});
check('datos: mismos grupos y en el mismo orden', () => {
  assert.deepStrictEqual(data.groups.map((g) => g.id), rules.groups.map((g) => g.id));
});
rules.groups.forEach((rg, i) => {
  const dg = data.groups[i];
  check('datos: grupo ' + rg.id + ' igual a rst_rules.json', () => {
    assert.ok(dg, 'grupo ausente en data.js');
    assert.strictEqual(dg.consumption_tax_pct, rg.consumption_tax_pct);
    assert.strictEqual(dg.article_ref, rg.article_ref);
    assert.strictEqual(dg.net_profit_exclusion_pct, rg.net_profit_exclusion_pct);
    assert.strictEqual(dg.condition_note, rg.condition_note);
    assert.strictEqual(dg.consumption_tax_note, rg.consumption_tax_note);
    assert.strictEqual(dg.name, rg.name);
    assert.strictEqual(dg.annual_brackets_uvt.length, rg.annual_brackets_uvt.length);
    assert.strictEqual(dg.bimonthly_advance_brackets_uvt.length, rg.bimonthly_advance_brackets_uvt.length);
    rg.annual_brackets_uvt.forEach((b, j) => {
      const d = dg.annual_brackets_uvt[j];
      assert.strictEqual(d.from, b.from);
      assert.strictEqual(d.to, b.to);
      assert.strictEqual(d.consolidated_rate_pct, b.consolidated_rate_pct);
    });
    rg.bimonthly_advance_brackets_uvt.forEach((b, j) => {
      const d = dg.bimonthly_advance_brackets_uvt[j];
      assert.strictEqual(d.from, b.from);
      assert.strictEqual(d.to, b.to);
      assert.strictEqual(d.rate_pct, b.rate_pct);
    });
  });
});

console.log('\n' + (passed + failed) + ' casos: ' + passed + ' ok, ' + failed + ' fallan');
if (failed === 0) {
  console.log('FALLAN: ninguno');
} else {
  console.log('FALLAN:');
  failures.forEach((f) => {
    console.log('- ' + f.name);
    if (f.expected !== undefined || f.actual !== undefined) {
      console.log('  esperado: ' + JSON.stringify(f.expected));
      console.log('  obtenido: ' + JSON.stringify(f.actual));
    } else {
      console.log('  ' + f.message);
    }
  });
  process.exit(1);
}
