// Ejemplo: Añadir funcionalidad de "Me gusta"
document.addEventListener('DOMContentLoaded', () => {
    const likeButtons = document.querySelectorAll('.post-actions button:first-child');
    
    likeButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.classList.toggle('liked');
            if (button.classList.contains('liked')) {
                button.innerHTML = '<i class="fas fa-heart" style="color:red;"></i> Me gusta';
            } else {
                button.innerHTML = '<i class="fas fa-heart"></i> Me gusta';
            }
        });
    });
});
