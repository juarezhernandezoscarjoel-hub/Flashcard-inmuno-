/*
  EXTRA · conceptos generales del PDF "Flashcards · Virus, hongos y parásitos".
  Cómo agregar o editar preguntas: ver README.md.
*/
window.TEMAS = window.TEMAS || [];
window.TEMAS.push({
  id: "extra",
  nombre: "Extra",
  subtemas: [
    {
      id: "extra-generales", nombre: "Conceptos generales", icono: "anticuerpo", color: "#7d5ce6",
      preguntas: [
        { apartado: "Diagnóstico", grupo: "IgM vs IgG", pregunta: "¿Qué indica una IgM positiva?",
          correcta: "Infección aguda o reciente; es el primer anticuerpo en aparecer",
          incorrectas: ["Infección pasada, memoria o vacunación"] },
        { apartado: "Diagnóstico", grupo: "IgM vs IgG", pregunta: "¿Qué indica una IgG positiva?",
          correcta: "Infección pasada, memoria inmunológica o vacunación",
          incorrectas: ["Infección aguda o reciente, el primer anticuerpo"] },
        { apartado: "Funcionamiento", pregunta: "¿Qué hacen normalmente p53 y pRb?",
          correcta: "Son antioncoproteínas que frenan la división celular",
          incorrectas: ["Activan la división celular de forma descontrolada", "Son enzimas que replican el ADN de los virus", "Forman la cápside que protege a los virus", "Transportan el oxígeno en la sangre"] },
        { apartado: "Conceptos", grupo: "Relaciones entre especies", pregunta: "¿Qué es el mutualismo?",
          correcta: "Beneficio mutuo y dependencia entre especies",
          incorrectas: ["Uno se beneficia sin dañar al otro", "Uno vive a costa del otro y lo daña", "Ninguno de los dos se afecta"] },
        { apartado: "Conceptos", grupo: "Relaciones entre especies", pregunta: "¿Qué es el comensalismo?",
          correcta: "Uno se beneficia sin dañar al otro (ej. flora normal)",
          incorrectas: ["Beneficio mutuo y dependencia entre especies", "Uno vive a costa del otro y lo daña", "Ambos compiten por el mismo recurso"] },
        { apartado: "Consecuencias", pregunta: "¿Cómo es la meningitis bacteriana?",
          correcta: "Inicio súbito con fiebre, rigidez de nuca y fotofobia",
          incorrectas: ["Inicio insidioso y buen estado general del paciente", "Crónica y solo en pacientes inmunodeprimidos", "Aguda, pero siempre leve y autolimitada", "Sin fiebre ni rigidez de nuca, de curso lento"] },
        { apartado: "Consecuencias", pregunta: "¿Qué agentes causan la meningitis bacteriana?",
          correcta: "S. pneumoniae en adultos y N. meningitidis en jóvenes",
          incorrectas: ["Enterovirus y virus del herpes simple 2", "Cryptococcus neoformans y Candida albicans", "Naegleria fowleri y Acanthamoeba", "Plasmodium falciparum y Toxoplasma"] },
        { apartado: "Casos", pregunta: "Cefalea severa, rigidez de nuca y fotofobia de inicio repentino: ¿diagnóstico sospechoso?",
          correcta: "Meningitis bacteriana (neumococo o meningococo)",
          incorrectas: ["Meningitis viral por enterovirus (Coxsackie)", "Encefalitis herpética por VHS-1", "Meningitis criptocócica en VIH", "Meningoencefalitis amebiana primaria"] }
      ]
    }
  ]
});
