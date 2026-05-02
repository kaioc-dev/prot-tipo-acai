document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.cat-btn');
    const sections = document.querySelectorAll('.menu-section');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove a classe active de todos os botões
            buttons.forEach(btn => btn.classList.remove('active'));
            // Adiciona a classe active no botão clicado
            button.classList.add('active');

            // Pega o alvo (categoria) do botão clicado
            const targetId = button.getAttribute('data-target');

            // Esconde todas as seções
            sections.forEach(section => {
                section.classList.remove('active');
            });

            // Mostra apenas a seção correspondente
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });
});
