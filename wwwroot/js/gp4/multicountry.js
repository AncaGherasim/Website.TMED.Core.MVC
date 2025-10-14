document.addEventListener('DOMContentLoaded', () => {
    const toggleButtons = document.querySelectorAll('[data-button-toggle]');

    toggleButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const sectionName = event.currentTarget.dataset.buttonToggle;
            const list = document.getElementById(`${sectionName}List`);

            if (!list) return;

            const isExpanded = button.getAttribute('aria-expanded') === 'true';

            list.classList.toggle('expanded', !isExpanded);
            button.setAttribute('aria-expanded', (!isExpanded).toString());

            const buttonSpan = button.querySelector('span');
            if (buttonSpan) {
                buttonSpan.textContent = isExpanded ? 'See All' : 'Show Less';
            } 
        });
    });
});

