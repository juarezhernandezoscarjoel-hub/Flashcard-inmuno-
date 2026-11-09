/*
  PREGUNTAS DE LAS FLASHCARDS
  ===========================
  Aquí va todo el contenido. Para agregar una pregunta, copia un bloque { ... }
  dentro de "preguntas" del tema que quieras:

    {
      pregunta: "Texto de la pregunta",
      correcta: "La respuesta correcta",
      incorrectas: ["Opción mala 1", "Opción mala 2", "Opción mala 3"],
      explicacion: "Opcional: se muestra después de responder.",
      imagen: "img/mi-imagen.jpg"   // Opcional: si no hay, se usa el dibujo del tema.
    },

  Las opciones se revuelven solas cada vez, así que no importa el orden.

  Para crear un tema nuevo, copia un bloque de tema completo y cambia
  "id" (sin espacios ni acentos), "nombre" e "icono".
  Iconos disponibles: "anticuerpo", "virus", "hongo", "parasito"
  (también puedes poner la ruta de una imagen, por ejemplo "img/tema.png").

  Las preguntas actuales son de EJEMPLO para probar la app.
*/

window.TEMAS = [
  {
    id: "inmunobiologia",
    nombre: "Inmunobiología",
    icono: "anticuerpo",
    preguntas: [
      {
        pregunta: "¿Qué célula presenta antígenos de forma más eficiente a los linfocitos T vírgenes?",
        correcta: "Célula dendrítica",
        incorrectas: ["Neutrófilo", "Mastocito", "Plaqueta"],
        explicacion: "Las células dendríticas capturan el antígeno en los tejidos, migran al ganglio linfático y lo presentan con moléculas coestimuladoras (CD80/CD86) para activar a los linfocitos T vírgenes."
      },
      {
        pregunta: "¿Cuál es la primera inmunoglobulina que se produce en una respuesta primaria?",
        correcta: "IgM",
        incorrectas: ["IgG", "IgA", "IgE"],
        explicacion: "La IgM es la primera en aparecer. Es un pentámero con gran capacidad para activar el complemento."
      },
      {
        pregunta: "¿Qué inmunoglobulina atraviesa la placenta?",
        correcta: "IgG",
        incorrectas: ["IgM", "IgA", "IgD"],
        explicacion: "La IgG cruza la placenta gracias al receptor FcRn y protege al recién nacido durante sus primeros meses."
      },
      {
        pregunta: "Las células NK destruyen células que perdieron la expresión de:",
        correcta: "MHC clase I",
        incorrectas: ["MHC clase II", "CD4", "Receptor de complemento CR1"],
        explicacion: "Es la hipótesis de lo «propio ausente»: el MHC I envía una señal inhibitoria a la célula NK. Si falta (algo común en células infectadas por virus o tumorales), la NK se activa."
      },
      {
        pregunta: "¿Qué citocinas inducen un estado antiviral en las células vecinas en las primeras horas de una infección?",
        correcta: "Interferones tipo I (α y β)",
        incorrectas: ["IL-4", "IL-5", "TGF-β"],
        explicacion: "Los interferones tipo I activan genes que bloquean la replicación viral, como la PKR y la 2'-5' oligoadenilato sintetasa."
      },
      {
        pregunta: "Los linfocitos T CD4+ reconocen péptidos presentados por:",
        correcta: "MHC clase II",
        incorrectas: ["MHC clase I", "CD1", "Receptores tipo Toll"],
        explicacion: "CD4 se une al MHC II de las células presentadoras de antígeno. CD8, en cambio, se une al MHC I."
      }
    ]
  },
  {
    id: "virus",
    nombre: "Virus",
    icono: "virus",
    preguntas: [
      {
        pregunta: "¿Cuál es el principal mecanismo efector para eliminar células infectadas por virus?",
        correcta: "Linfocitos T CD8+ citotóxicos",
        incorrectas: ["Eosinófilos", "IgE y mastocitos", "Basófilos"],
        explicacion: "Los linfocitos T CD8+ reconocen péptidos virales en el MHC I y matan a la célula infectada con perforina y granzimas."
      },
      {
        pregunta: "El VIH infecta principalmente a las células que expresan:",
        correcta: "CD4",
        incorrectas: ["CD8", "CD19", "CD56"],
        explicacion: "La glicoproteína gp120 del VIH se une a CD4 y usa CCR5 o CXCR4 como correceptor."
      },
      {
        pregunta: "¿Cuál de estos virus tiene genoma de ADN?",
        correcta: "Virus del herpes simple",
        incorrectas: ["Virus de la influenza", "VIH", "Virus del dengue"],
        explicacion: "Los herpesvirus tienen ADN de doble cadena. Influenza, VIH y dengue son virus de ARN."
      },
      {
        pregunta: "Un mecanismo de evasión inmune típico de los herpesvirus es:",
        correcta: "Disminuir la expresión de MHC clase I",
        incorrectas: ["Producir una cápsula de polisacárido", "Formar esporas", "Cambiar a forma de levadura"],
        explicacion: "Al bajar el MHC I, la célula infectada se vuelve invisible para los linfocitos T CD8+."
      },
      {
        pregunta: "Un anticuerpo neutralizante actúa principalmente:",
        correcta: "Bloqueando la unión del virus a su receptor celular",
        incorrectas: ["Activando eosinófilos", "Degradando el ADN viral dentro de la célula", "Inhibiendo la transcripción del hospedero"],
        explicacion: "La neutralización impide que el virus se adhiera y entre a la célula. La IgA cumple esta función en las mucosas y la IgG en la sangre."
      },
      {
        pregunta: "El cambio antigénico mayor (shift), por reordenamiento de segmentos del genoma, es característico de:",
        correcta: "Virus de la influenza A",
        incorrectas: ["Virus de la hepatitis B", "Virus del sarampión", "Poliovirus"],
        explicacion: "El genoma segmentado de la influenza A permite intercambiar segmentos entre cepas (por ejemplo, de aves y humanos). Así surgen subtipos nuevos que pueden causar pandemias."
      }
    ]
  },
  {
    id: "hongos",
    nombre: "Hongos",
    icono: "hongo",
    preguntas: [
      {
        pregunta: "¿Qué respuesta T cooperadora es la más importante contra Candida en las mucosas?",
        correcta: "Th17",
        incorrectas: ["Th2", "Treg", "Tfh"],
        explicacion: "La IL-17 recluta neutrófilos e induce péptidos antimicrobianos. Por eso los defectos en Th17 causan candidiasis mucocutánea crónica."
      },
      {
        pregunta: "¿Qué receptor de reconocimiento de patrones detecta los β-glucanos de la pared de los hongos?",
        correcta: "Dectina-1",
        incorrectas: ["TLR3", "TLR9", "RIG-I"],
        explicacion: "La dectina-1 es un receptor de lectina tipo C. TLR3 y RIG-I detectan ARN viral, y TLR9 detecta ADN con motivos CpG."
      },
      {
        pregunta: "¿Cuál es la célula de defensa más importante contra la aspergilosis invasiva?",
        correcta: "Neutrófilo",
        incorrectas: ["Linfocito B", "Eosinófilo", "Mastocito"],
        explicacion: "Los neutrófilos destruyen las hifas. La neutropenia es el principal factor de riesgo para la aspergilosis invasiva."
      },
      {
        pregunta: "¿Qué hongo dimórfico se ve en tejido como levadura con gemación múltiple en «timón de barco»?",
        correcta: "Paracoccidioides brasiliensis",
        incorrectas: ["Histoplasma capsulatum", "Candida albicans", "Aspergillus fumigatus"],
        explicacion: "La célula madre rodeada de múltiples gemaciones es característica de la paracoccidioidomicosis."
      },
      {
        pregunta: "Cryptococcus neoformans evade la fagocitosis principalmente gracias a:",
        correcta: "Su cápsula de polisacárido",
        incorrectas: ["La formación de hifas septadas", "La producción de toxina A", "La variación antigénica de sus pili"],
        explicacion: "La cápsula de glucuronoxilomanano es antifagocítica y se observa con tinta china."
      },
      {
        pregunta: "¿Qué hongo oportunista causa neumonía en pacientes con VIH y CD4 menores de 200/µL?",
        correcta: "Pneumocystis jirovecii",
        incorrectas: ["Sporothrix schenckii", "Trichophyton rubrum", "Malassezia furfur"],
        explicacion: "Con CD4 menores de 200/µL se da profilaxis con trimetoprim-sulfametoxazol."
      }
    ]
  },
  {
    id: "parasitos",
    nombre: "Parásitos",
    icono: "parasito",
    preguntas: [
      {
        pregunta: "¿Qué respuesta inmune predomina contra los helmintos?",
        correcta: "Th2 (IL-4, IL-5 e IL-13)",
        incorrectas: ["Th1 (IFN-γ)", "Th17 (IL-17)", "Solo células NK"],
        explicacion: "La respuesta Th2 induce IgE, activa eosinófilos y mastocitos y aumenta la secreción de moco y la motilidad intestinal."
      },
      {
        pregunta: "¿Qué célula destruye helmintos recubiertos de IgE mediante citotoxicidad dependiente de anticuerpos (ADCC)?",
        correcta: "Eosinófilo",
        incorrectas: ["Neutrófilo", "Linfocito T CD8+", "Plaqueta"],
        explicacion: "Los eosinófilos liberan proteína básica mayor y proteína catiónica, que dañan el tegumento del parásito."
      },
      {
        pregunta: "Trypanosoma brucei evade la respuesta de anticuerpos mediante:",
        correcta: "Variación antigénica de su glicoproteína de superficie (VSG)",
        incorrectas: ["Formación de una cápsula", "Esporulación", "Bloqueo del MHC clase II"],
        explicacion: "Al cambiar su VSG, el parásito escapa a los anticuerpos de cada oleada. Por eso la parasitemia sube y baja en ciclos."
      },
      {
        pregunta: "¿Qué inmunoglobulina aumenta típicamente en las infecciones por helmintos?",
        correcta: "IgE",
        incorrectas: ["IgA", "IgD", "IgM"],
        explicacion: "La IL-4 induce el cambio de clase a IgE. Además, suele haber eosinofilia."
      },
      {
        pregunta: "¿Qué forma de Plasmodium entra al humano con la picadura del mosquito Anopheles?",
        correcta: "Esporozoíto",
        incorrectas: ["Merozoíto", "Gametocito", "Ooquiste"],
        explicacion: "Los esporozoítos viajan al hígado. Ahí se multiplican y salen como merozoítos que invaden los eritrocitos."
      },
      {
        pregunta: "¿Qué respuesta controla la infección por Leishmania dentro de los macrófagos?",
        correcta: "Th1 con IFN-γ, que activa al macrófago",
        incorrectas: ["Th2 con IL-4", "IgE y eosinófilos", "Solo el complemento"],
        explicacion: "El IFN-γ activa la producción de óxido nítrico en el macrófago y elimina al parásito. Una respuesta Th2 favorece la enfermedad."
      }
    ]
  }
];
