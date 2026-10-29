var RST_DATA_REF = (typeof RST_DATA !== 'undefined') ? RST_DATA : require('./data.js');

function toUVT(cop, data) {
  var d = data || RST_DATA_REF;
  return cop / d.uvt.value_cop;
}

// Art. 908 ET: columnas "Igual o superior (UVT)" / "Inferior (UVT)": desde <= x < hasta.
// Un valor igual al límite del último tramo no cae en ningún tramo (devuelve null).
function findBracket(brackets, uvt) {
  if (!(uvt >= 0)) return null;
  for (var i = 0; i < brackets.length; i++) {
    var b = brackets[i];
    if (uvt >= b.from && uvt < b.to) return b;
  }
  return null;
}

function isEligible(annualCop, data) {
  var d = data || RST_DATA_REF;
  if (inputError(annualCop)) return false;
  return toUVT(annualCop, d) <d.eligibility.gross_income_ceiling_uvt;
}

function applyRate(amountCop, ratePct) {
  return Math.round(amountCop * Math.round(ratePct * 100) / 10000);
}

// Devuelve un código de error si la cifra no es un número finito mayor que cero; si no, null.
function inputError(cop) {
  if (typeof cop !== 'number' || !isFinite(cop)) return 'no_numerico';
  if (cop <= 0) return 'no_positivo';
  return null;
}

function annualTax(group, annualCop, data) {
  var d = data || RST_DATA_REF;
  var err = inputError(annualCop);
  if (err) return {uvt: null, bracket: null, ratePct: null, tax: null, error: err};
  var uvt = toUVT(annualCop, d);
  var bracket = findBracket(group.annual_brackets_uvt, uvt);
  if (!bracket) return {uvt: uvt, bracket: null, ratePct: null, tax: null, error: null};
  var rate = bracket.consolidated_rate_pct;
  return {uvt: uvt, bracket: bracket, ratePct: rate, tax: applyRate(annualCop, rate), error: null};
}

function bimonthlyAdvance(group, bimesterCop, data) {
  var d = data || RST_DATA_REF;
  var err = inputError(bimesterCop);
  if (err) return {uvt: null, bracket: null, ratePct: null, advance: null, error: err};
  var uvt = toUVT(bimesterCop, d);
  var bracket = findBracket(group.bimonthly_advance_brackets_uvt, uvt);
  if (!bracket) return {uvt: uvt, bracket: null, ratePct: null, advance: null, error: null};
  var rate = bracket.rate_pct;
  return {uvt: uvt, bracket: bracket, ratePct: rate, advance: applyRate(bimesterCop, rate), error: null};
}

// Art. 906 num. 11 ET (Ley 2277/2022 art. 43): no pueden optar por el SIMPLE quienes desarrollan
// las actividades CIIU 4665, 3830 y 3811 y obtienen utilidades netas superiores al 3 % del ingreso
// bruto. Utilidad de 3 % o menos del ingreso bruto no activa esta exclusión. Devuelve true solo si
// el grupo tiene la regla y la utilidad supera el porcentaje (comparación sin dividir).
function isExcludedByNetProfit(group, grossCop, netProfitCop) {
  if (!group || !(group.net_profit_exclusion_pct > 0)) return false;
  if (inputError(grossCop)) return false;
  if (typeof netProfitCop !== 'number' || !isFinite(netProfitCop)) return false;
  return netProfitCop * 100 > grossCop * group.net_profit_exclusion_pct;
}

// Lee la utilidad neta anual escrita por la persona (texto con formato colombiano: puntos de miles,
// coma decimal; también acepta un número). Devuelve {ok: true, value} con un valor finito >= 0, o
// {ok: false, error: 'no_numerico' | 'no_positivo'}. Vacío, texto, NaN e Infinity son no_numerico;
// un valor negativo es no_positivo. Nunca lanza.
function parseUtilidadNeta(raw) {
  var n;
  if (typeof raw === 'number') {
    n = raw;
  } else if (typeof raw === 'string') {
    var s = raw.replace(/[\s$]/g, '');
    if (!/^-?(\d{1,3}(\.\d{3})+|\d+)(,\d+)?$/.test(s)) return {ok: false, error: 'no_numerico'};
    n = Number(s.replace(/\./g, '').replace(',', '.'));
  } else {
    return {ok: false, error: 'no_numerico'};
  }
  if (typeof n !== 'number' || !isFinite(n)) return {ok: false, error: 'no_numerico'};
  if (n < 0) return {ok: false, error: 'no_positivo'};
  return {ok: true, value: n};
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {toUVT: toUVT, findBracket: findBracket, annualTax: annualTax,
    bimonthlyAdvance: bimonthlyAdvance, isEligible: isEligible,
    isExcludedByNetProfit: isExcludedByNetProfit, parseUtilidadNeta: parseUtilidadNeta};
}
