document.addEventListener('DOMContentLoaded', function() {
    // Toggle del menú en móvil
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');

    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    // Función de "Me gusta"
    const likeButtons = document.querySelectorAll('.post-actions button:first-child');
    
    likeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const icon = button.querySelector('i');
            if (icon.classList.contains('far')) {
                icon.classList.replace('far', 'fas');
                icon.style.color = 'red';
            } else {
                icon.classList.replace('fas', 'far');
                icon.style.color = '';
            }
        });
    });

    // Cerrar sidebar al hacer clic fuera (solo móvil)
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && !e.target.closest('#sidebar') && !e.target.closest('#menuToggle')) {
            sidebar.classList.remove('active');
        }
    });
});
