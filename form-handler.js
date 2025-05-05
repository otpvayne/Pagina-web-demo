document.addEventListener('DOMContentLoaded', () => {
  const formulario = document.getElementById('formulario');
  const estado = document.getElementById('estado');

  formulario.addEventListener('submit', async (e) => {
    e.preventDefault();
    estado.textContent = 'Enviando...';

    const formData = new FormData(formulario);

    try {
      const response = await fetch('/api/formulario', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        estado.textContent = '¡Formulario enviado correctamente!';
        formulario.reset();
      } else {
        const error = await response.text();
        estado.textContent = `Error: ${error}`;
      }
    } catch (error) {
      console.error(error);
      estado.textContent = 'Ocurrió un error al enviar el formulario.';
    }
  });
});
