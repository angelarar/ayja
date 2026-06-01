document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.getElementById("navbar");
    const menuToggle = document.getElementById("menu-toggle");
    const navMenu = document.getElementById("nav-menu");
    const menuIcon = menuToggle ? menuToggle.querySelector("i") : null;

    // 1. Control de la barra de navegación al hacer scroll (Efecto opaco)
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    // 2. Desplegar / Colapsar menú móvil
    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", () => {
            navMenu.classList.toggle("active");
            
            if (menuIcon) {
                if (navMenu.classList.contains("active")) {
                    menuIcon.classList.remove("fa-bars");
                    menuIcon.classList.add("fa-xmark");
                } else {
                    menuIcon.classList.remove("fa-xmark");
                    menuIcon.classList.add("fa-bars");
                }
            }
        });
    }

    // 3. Desplazamiento suave (Smooth Scroll) compatible con Stacking de Escritorio
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                // Forzar el cierre del menú móvil si está abierto
                if (navMenu) navMenu.classList.remove("active");
                if (menuIcon) {
                    menuIcon.classList.remove("fa-xmark");
                    menuIcon.classList.add("fa-bars");
                }

                // SOLUCIÓN PARA GRAN FORMATO Y MÓVIL:
                // Temporalmente desactivamos el sticky para calcular la posición real de origen
                // o usamos scrollIntoView con comportamiento nativo.
                const navHeight = navbar.offsetHeight;
                
                // Guardamos el estilo sticky actual
                const originalStyle = targetElement.style.position;
                // Lo volvemos relativo por un milisegundo para engañar al navegador y obtener la posición real
                targetElement.style.position = 'relative';
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                // Restauramos su propiedad original para que no se rompa el diseño
                targetElement.style.position = originalStyle;

                // Restamos la altura del menú para que el título no quede tapado
                const offsetPosition = targetPosition - navHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
});

// CONTROL DE ENVÍO DE FORMULARIO A GOOGLE SHEETS
document.querySelector('.contacto-formulario form').addEventListener('submit', function(e) {
    e.preventDefault(); // Evita que la página se recargue por defecto

    const submitBtn = this.querySelector('.btn-enviar');
    const originalText = submitBtn.textContent;
    
    // Cambia el estado del botón para avisar al usuario
    submitBtn.textContent = "Enviando...";
    submitBtn.disabled = true;

    // Captura los datos del formulario
    const formData = new FormData(this);
    
    // URL de tu Google Apps Script (Reemplaza con tu URL real de /exec)
    const scriptURL = 'https://script.google.com/macros/s/AKfycbyyR586Rq1a9t6VJp0K9-a5VC2BakwWims42cFHZaTZZ94E6vaRlbtVJVEWm3gUniTo/exec';

    fetch(scriptURL, { method: 'POST', body: formData })
        .then(response => {
            submitBtn.textContent = "¡Mensaje Enviado con Éxito!";
            submitBtn.style.backgroundColor = "#10b981"; // Cambia a verde de éxito
            this.reset(); // Limpia los campos del formulario
            
            // Regresa el botón a su estado original después de 4 segundos
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.backgroundColor = "";
                submitBtn.disabled = false;
            }, 4000);
        })
        .catch(error => {
            console.error('Error:', error);
            submitBtn.textContent = "Error al enviar, intenta de nuevo";
            submitBtn.style.backgroundColor = "#ef4444"; // Rojo de error
            submitBtn.disabled = false;
        });
});