document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  // Obtener los elementos del formulario
  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const message = document.getElementById('message');
  const formMessage = document.getElementById('formMessage');
  
  // Obtener los elementos de error
  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');
  
  // Resetear mensajes de error
  nameError.classList.remove('show');
  emailError.classList.remove('show');
  messageError.classList.remove('show');
  formMessage.className = 'form-message';
  
  let isValid = true;
  
  // Validar nombre
  if (name.value.trim() === '') {
    nameError.classList.add('show');
    isValid = false;
    name.focus();
  }
  
  // Validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    emailError.classList.add('show');
    isValid = false;
    if (!name.value.trim()) name.focus();
    else email.focus();
  }
  
  // Validar mensaje
  if (message.value.trim() === '') {
    messageError.classList.add('show');
    isValid = false;
    if (!name.value.trim()) name.focus();
    else if (!emailRegex.test(email.value)) email.focus();
    else message.focus();
  }
  
  if (isValid) {
    // Mostrar mensaje de carga
    formMessage.textContent = 'Enviando mensaje...';
    formMessage.classList.add('success');
    
    // Preparar los datos del formulario
    const formData = new FormData();
    formData.append('Name', name.value.trim());
    formData.append('Email', email.value.trim());
    formData.append('Message', message.value.trim());
    
    // Enviar los datos usando Formspree
    fetch('https://formspree.io/f/myzegdwg', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error en el envío: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (data.ok) {
        // Mostrar mensaje de éxito
        formMessage.textContent = '¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.';
        formMessage.classList.add('success');
        
        // Limpiar el formulario
        e.target.reset();
        
        // Enfocar el primer campo para la siguiente entrada
        name.focus();
      } else {
        throw new Error('Error en la respuesta del servidor');
      }
    })
    .catch(error => {
      // Mostrar mensaje de error más específico
      formMessage.textContent = `Error al enviar el mensaje: ${error.message}. Por favor, intente nuevamente.`;
      formMessage.classList.add('error');
      console.error('Error detallado:', error);
    });
  } else {
    formMessage.textContent = 'Por favor, corrija los errores antes de enviar el formulario.';
    formMessage.classList.add('error');
  }
});

// Validación en tiempo real
const inputs = document.querySelectorAll('.form-group input, .form-group textarea');
inputs.forEach(input => {
  input.addEventListener('input', function() {
    const errorElement = document.getElementById(this.id + 'Error');
    if (this.value.trim() === '') {
      errorElement.classList.add('show');
    } else if (this.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value)) {
      errorElement.classList.add('show');
    } else {
      errorElement.classList.remove('show');
    }
  });
}); 