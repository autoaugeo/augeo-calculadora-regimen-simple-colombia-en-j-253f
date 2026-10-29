var RST_DATA = {
  regime: "Régimen Simple de Tributación (SIMPLE), Estatuto Tributario arts. 903 a 916",
  last_consulted: "2026-10-12",
  uvt: {
    year: 2026,
    value_cop: 52374,
    norm: "Resolución DIAN 000238 de 2025 (15 de diciembre de 2025)"
  },
  eligibility: {
    gross_income_ceiling_uvt: 100000,
    natural_person_annual_only_threshold_uvt: 3500
  },
  groups: [
    {
      id: "g1_tiendas",
      short: "Tiendas pequeñas, minimercados, micromercados y peluquería",
      article_ref: "art. 908 inc. 1 num. 1 ET (Ley 2277/2022 art. 44)",
      name: "Tiendas pequeñas, minimercados, micromercados y peluquería",
      annual_brackets_uvt: [
        {from: 0, to: 6000, consolidated_rate_pct: 1.2},
        {from: 6000, to: 15000, consolidated_rate_pct: 2.8},
        {from: 15000, to: 30000, consolidated_rate_pct: 4.4},
        {from: 30000, to: 100000, consolidated_rate_pct: 5.6}
      ],
      bimonthly_advance_brackets_uvt: [
        {from: 0, to: 1000, rate_pct: 1.2},
        {from: 1000, to: 2500, rate_pct: 2.8},
        {from: 2500, to: 5000, rate_pct: 4.4},
        {from: 5000, to: 16666, rate_pct: 5.6}
      ],
      consumption_tax_pct: null
    },
    {
      id: "g2_comercio_industria",
      short: "Comercio, servicios técnicos y mecánicos, industria y telecomunicaciones",
      article_ref: "art. 908 inc. 1 num. 2 ET (Ley 2277/2022 art. 44)",
      name: "Comercio al por mayor y al detal; servicios técnicos y mecánicos en los que predomina el factor material; industria, telecomunicaciones y demás actividades no incluidas en los otros grupos",
      annual_brackets_uvt: [
        {from: 0, to: 6000, consolidated_rate_pct: 1.6},
        {from: 6000, to: 15000, consolidated_rate_pct: 2.0},
        {from: 15000, to: 30000, consolidated_rate_pct: 3.5},
        {from: 30000, to: 100000, consolidated_rate_pct: 4.5}
      ],
      bimonthly_advance_brackets_uvt: [
        {from: 0, to: 1000, rate_pct: 1.6},
        {from: 1000, to: 2500, rate_pct: 2.0},
        {from: 2500, to: 5000, rate_pct: 3.5},
        {from: 5000, to: 16666, rate_pct: 4.5}
      ],
      consumption_tax_pct: null
    },
    {
      id: "g3_comidas_transporte",
      short: "Expendio de comidas y bebidas, y transporte",
      article_ref: "art. 908 inc. 1 num. 3 ET (Ley 2277/2022 art. 44)",
      name: "Expendio de comidas y bebidas, y actividades de transporte",
      annual_brackets_uvt: [
        {from: 0, to: 6000, consolidated_rate_pct: 3.1},
        {from: 6000, to: 15000, consolidated_rate_pct: 3.4},
        {from: 15000, to: 30000, consolidated_rate_pct: 4.0},
        {from: 30000, to: 100000, consolidated_rate_pct: 4.5}
      ],
      bimonthly_advance_brackets_uvt: [
        {from: 0, to: 1000, rate_pct: 3.1},
        {from: 1000, to: 2500, rate_pct: 3.4},
        {from: 2500, to: 5000, rate_pct: 4.0},
        {from: 5000, to: 16666, rate_pct: 4.5}
      ],
      consumption_tax_pct: 8,
      consumption_tax_note: "En los recibos del anticipo bimestral se adiciona el impuesto nacional al consumo, a la tarifa del 8 %, a la tarifa SIMPLE consolidada (art. 908 par. 4 ET, Ley 2277/2022 art. 44). Verifique con la DIAN si su actividad causa ese impuesto."
    },
    {
      id: "g_profesionales",
      short: "Servicios profesionales, consultoría y científicos (factor intelectual)",
      article_ref: "art. 908 inc. 1 num. 3 ET según Ley 2155/2021 art. 42 num. 3, revivido por la Sentencia C-540 de 2023",
      name: "Servicios profesionales, de consultoría y científicos en los que predomina el factor intelectual sobre el material, incluidas las profesiones liberales",
      annual_brackets_uvt: [
        {from: 0, to: 6000, consolidated_rate_pct: 5.9},
        {from: 6000, to: 15000, consolidated_rate_pct: 7.3},
        {from: 15000, to: 30000, consolidated_rate_pct: 12.0},
        {from: 30000, to: 100000, consolidated_rate_pct: 14.5}
      ],
      bimonthly_advance_brackets_uvt: [
        {from: 0, to: 1000, rate_pct: 5.9},
        {from: 1000, to: 2500, rate_pct: 7.3},
        {from: 2500, to: 5000, rate_pct: 12.0},
        {from: 5000, to: 16666, rate_pct: 14.5}
      ],
      consumption_tax_pct: null
    },
    {
      id: "g6_ciiu_4665_3830_3811",
      short: "Actividades CIIU 4665, 3830 y 3811",
      article_ref: "art. 908 inc. 1 num. 6 y par. 4 num. 6 ET (Ley 2277/2022 art. 44); exclusión art. 906 num. 11 ET (Ley 2277/2022 art. 43)",
      name: "Actividades CIIU 4665, 3830 y 3811",
      annual_brackets_uvt: [
        {from: 0, to: 100000, consolidated_rate_pct: 1.62}
      ],
      bimonthly_advance_brackets_uvt: [
        {from: 0, to: 16666, rate_pct: 1.62}
      ],
      consumption_tax_pct: null,
      net_profit_exclusion_pct: 3,
      condition_note: "El art. 906 num. 11 ET (Ley 2277/2022 art. 43) excluye del SIMPLE a quienes desarrollan estas actividades y obtienen utilidades netas superiores al 3 % del ingreso bruto. Con utilidades netas de 3 % o menos del ingreso bruto esa exclusión no se activa."
    }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = RST_DATA;
}
