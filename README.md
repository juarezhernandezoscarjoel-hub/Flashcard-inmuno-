# Inmuno Flashcards

App de preguntas tipo flashcards para estudiar **Inmunobiología, Virus, Hongos y Parásitos**.
Replica el flujo de "Daily Anatomy": eliges temas, respondes preguntas con 4 opciones y ves tu avance.

Las **362 preguntas** salen del PDF "Flashcards · Virus, hongos y parásitos" (semanas 08 a 11).

## Cómo se usa

1. **Elige tus temas.** La pantalla de inicio está dividida en grupos (Virus, Hongos, Parásitos, Extra). Dentro de cada grupo hay un círculo por tema. Hay dos tipos:
   - **Por sección** (Genoma y estructura, Inmunidad antiviral, Diagnóstico…).
   - **Por organismo** (Herpes, VIH, Candida, Plasmodium, Giardia…), para estudiar solo ese virus, hongo o parásito.
   - Puedes tocar varios círculos, o usar **"Elegir todos"** para marcar un grupo completo.
2. **Comienza a aprender.** Sale una pregunta con dibujo y 4 opciones. La eliges y tocas **Enviar respuesta**.
3. Si aciertas se pinta de verde ("¡Correcto!"); si fallas se pinta de rojo y se marca la correcta.
4. Al terminar ves tus **Resultados** y puedes **Repasar errores**.

### Estaciones

Las preguntas de lo que elijas se reparten en **3 estaciones** (configurable 2–5 en el engrane ⚙):

- Cada estación trae una parte distinta, revuelta por **apartado** (Morfología, Funcionamiento, Consecuencias, Transmisión…). A veces una estación se enfoca en uno o dos apartados y a veces los mezcla. Si eliges pocas preguntas, se usan menos estaciones.
- **Si fallas una pregunta, vuelve a salir** unas 3 preguntas después ("Otra vez") y también en la siguiente estación ("Repaso"), hasta que la contestes bien en otra estación.
- **Las opciones falsas cambian cada vez**, para que no te aprendas cuáles sobran sino la respuesta correcta.

El progreso se guarda en el navegador del dispositivo. En el engrane también puedes reiniciar tu progreso.

## Dónde están las preguntas

Todo el contenido está en la carpeta [`preguntas/`](preguntas/): `virus.js`, `hongos.js`, `parasitos.js` y `extra.js`.

Cada archivo agrega un **grupo** con sus **subtemas** (los círculos). Una pregunta se ve así:

```js
{
  apartado: "Funcionamiento",        // agrupa por tipo dentro de las estaciones
  grupo: "Marcador de hepatitis",    // opcional, ver abajo
  tambien: ["vih"],                  // opcional: también aparece en ese círculo
  pregunta: "¿Qué inmunoglobulina atraviesa la placenta?",
  correcta: "IgG",
  incorrectas: ["IgM", "IgA", "IgD", "IgE"],   // puedes poner más de 3
  excluir: ["IgE"],                  // opcional: respuestas que nunca deben salir aquí
  explicacion: "Opcional: se muestra después de responder.",
  imagen: "img/placenta.jpg"         // opcional; si no hay, se usa el dibujo del tema
}
```

- Las **opciones falsas cambian cada vez**: pon varias en `incorrectas` (se eligen 3 al azar). Las preguntas con el mismo `grupo` también se prestan sus respuestas correctas como opciones falsas.
- `tambien` hace que una pregunta aparezca en otro círculo sin repetir el texto. Así, por ejemplo, las preguntas de Candida repartidas en varias secciones se juntan en el círculo "Candida".
- Para un **círculo por organismo** que solo reúne preguntas de otras secciones, se deja con `preguntas: []` y las preguntas lo referencian con `tambien`.

Para agregar un subtema (círculo) nuevo, copia uno dentro de `subtemas` y cambia `id` (sin espacios ni acentos), `nombre`, `icono` y `color`.
Iconos disponibles: `virus`, `hongo`, `levadura`, `parasito`, `gusano`, `ameba`, `eritrocito`, `celula`, `bacteria`, `adn`, `anticuerpo`, `lupa` (o la ruta de una imagen). El `color` (hex) tiñe el dibujo.

## Cómo abrirla

Es una página web estática (HTML, CSS y JavaScript), sin instalación.

- **En la computadora**: abre `index.html` en el navegador.
- **En el iPad o celular**: activa GitHub Pages (Settings → Pages → rama del proyecto, carpeta raíz) y abre el enlace que te da GitHub. En Safari puedes usar Compartir → "Agregar a pantalla de inicio" para usarla como app.
