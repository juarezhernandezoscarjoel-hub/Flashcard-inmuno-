# Inmuno Flashcards

App de preguntas tipo flashcards para estudiar Inmunobiología, Virus, Hongos y Parásitos.
Replica el flujo de "Daily Anatomy":

1. **Elige tus temas**: toca uno o varios círculos. Cada uno muestra tu porcentaje de aciertos y cuántas preguntas has respondido (por ejemplo `4/6`).
2. **Comienza a aprender**: aparece una pregunta con 4 opciones.
3. **Enviar respuesta**: la opción correcta se pinta de verde ("¡Correcto! ¡Bien hecho!"). Si fallas, tu opción se pinta de rojo y se marca la correcta. Si la pregunta tiene explicación, aparece debajo.
4. **Próxima pregunta**, hasta ver tus **Resultados** con la lista de preguntas para repasar y el botón **Repasar errores**.

### Estaciones

Las preguntas de los temas que elijas se reparten en **3 estaciones** (puedes cambiarlo a 2, 4 o 5 en el engrane ⚙):

- Cada estación trae una parte distinta de las preguntas. Al terminar las 3 ya viste todas, y la siguiente ronda se vuelve a revolver.
- Cada pregunta tiene un **apartado** (Morfología, Funcionamiento, Consecuencias…). A veces una estación se enfoca en uno o dos apartados y a veces los mezcla.
- **Si fallas una pregunta, vuelve a salir** unas 3 preguntas después (etiqueta "Otra vez"). También sale en la siguiente estación (etiqueta "Repaso") hasta que la contestes bien en otra estación.

El progreso se guarda en el navegador del dispositivo. En el engrane también puedes reiniciar tu progreso.

## Cómo agregar preguntas

Todo el contenido está en [`preguntas.js`](preguntas.js). Cada pregunta se ve así:

```js
{
  apartado: "Funcionamiento",
  pregunta: "¿Qué inmunoglobulina atraviesa la placenta?",
  correcta: "IgG",
  incorrectas: ["IgM", "IgA", "IgD"],
  explicacion: "Opcional. Se muestra después de responder.",
  imagen: "img/placenta.jpg"   // Opcional
}
```

- Las opciones se revuelven solas, así que no importa el orden.
- Si no pones `imagen`, se usa el dibujo del tema.
- Las preguntas actuales son de ejemplo.

## Cómo abrirla

Es una página web estática (HTML, CSS y JavaScript), sin instalación.

- **En la computadora**: abre `index.html` en el navegador.
- **En el iPad o celular**: activa GitHub Pages (Settings → Pages → rama del proyecto, carpeta raíz) y abre el enlace que te da GitHub. En Safari puedes usar Compartir → "Agregar a pantalla de inicio" para usarla como app.
