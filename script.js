// Efecto de "Me gusta" (como en Amino)
document.querySelectorAll('.post-actions button').forEach(button => {
    button.addEventListener('click', function() {
        if (this.querySelector('i').classList.contains('fa-heart')) {
            const icon = this.querySelector('i');
            if (icon.classList.contains('far')) {
                icon.classList.replace('far', 'fas');
                this.style.color = '#FF2D55'; // Rojo de Amino al dar like
            } else {
                icon.classList.replace('fas', 'far');
                this.style.color = '#555';
            }
        }
    });
});

// Simular carga de más posts
window.addEventListener('scroll', () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500) {
        console.log("Cargando más posts... (Simulación)");
        // Aquí iría la lógica para cargar más contenido
    }
});
