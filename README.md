# Inmuno Flashcards

App de preguntas tipo flashcards para estudiar Inmunobiología, Virus, Hongos y Parásitos.
Replica el flujo de "Daily Anatomy":

1. **Elige tus temas**: toca uno o varios círculos. Cada uno muestra tu porcentaje de aciertos y cuántas preguntas has respondido (por ejemplo `4/6`).
2. **Comienza a aprender**: aparece una pregunta con 4 opciones.
3. **Enviar respuesta**: la opción correcta se pinta de verde ("¡Correcto! ¡Bien hecho!"). Si fallas, tu opción se pinta de rojo y se marca la correcta. Si la pregunta tiene explicación, aparece debajo.
4. **Próxima pregunta**, hasta ver tus **Resultados** con la lista de preguntas para repasar y el botón **Repasar errores**.

El progreso se guarda en el navegador del dispositivo. En el engrane (⚙) puedes elegir cuántas preguntas hay por sesión y reiniciar tu progreso.

## Cómo agregar preguntas

Todo el contenido está en [`preguntas.js`](preguntas.js). Cada pregunta se ve así:

```js
{
  pregunta: "¿Qué inmunoglobulina atraviesa la placenta?",
  correcta: "IgG",
  incorrectas: ["IgM", "IgA", "IgD"],
  explicacion: "Opcional. Se muestra después de responder.",
  imagen: "img/placenta.jpg"   // Opcional
}
```

- Las opciones se revuelven solas, así que no importa el orden.
- Si no pones `imagen`, se usa el dibujo del tema.
- Las preguntas que todavía no has visto o que fallaste salen primero.
- Las preguntas actuales son de ejemplo.

## Cómo abrirla

Es una página web estática (HTML, CSS y JavaScript), sin instalación.

- **En la computadora**: abre `index.html` en el navegador.
- **En el iPad o celular**: activa GitHub Pages (Settings → Pages → rama del proyecto, carpeta raíz) y abre el enlace que te da GitHub. En Safari puedes usar Compartir → "Agregar a pantalla de inicio" para usarla como app.
