document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('reservationForm');
    const placesRestantes = document.getElementById('placesRestantes');

    // Fonction pour animer le compteur de places
    function animateCounter(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const currentCount = Math.floor(progress * (end - start) + start);
            element.textContent = `Places restantes : ${currentCount}`;
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // Afficher le nombre de places restantes avec animation
    const updatePlacesRestantes = async () => {
        try {
            const response = await fetch('/api/event/stats');
            const stats = await response.json();
            const currentNumber = parseInt(placesRestantes.textContent.match(/\d+/) || [0]);
            animateCounter(placesRestantes, currentNumber, stats.placesRestantes, 1000);

            // Ajouter une classe si peu de places restantes
            if (stats.placesRestantes < 5) {
                placesRestantes.classList.add('places-limited');
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des statistiques:', error);
        }
    };

    // Animation de chargement du bouton
    function setLoadingState(button, loading) {
        if (loading) {
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Réservation en cours...';
            button.disabled = true;
        } else {
            button.innerHTML = '<i class="fas fa-calendar-check"></i> Réserver ma place';
            button.disabled = false;
        }
    }

    // Gérer la soumission du formulaire avec animations
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitButton = form.querySelector('button[type="submit"]');

        const formData = {
            name: form.name.value,
            email: form.email.value,
            phone: form.phone.value,
            message: form.message.value
        };

        try {
            setLoadingState(submitButton, true);

            const response = await fetch('/api/guests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                showMessage('success', 'Réservation effectuée avec succès !');
                form.reset();
                updatePlacesRestantes();

                // Animation de succès
                document.querySelector('.reservation-card').classList.add('success-animation');
                setTimeout(() => {
                    document.querySelector('.reservation-card').classList.remove('success-animation');
                }, 1000);
            } else {
                showMessage('error', data.error || 'Erreur lors de la réservation');
            }
        } catch (error) {
            showMessage('error', 'Erreur lors de la réservation');
            console.error('Erreur:', error);
        } finally {
            setLoadingState(submitButton, false);
        }
    });

    // Ajouter des animations sur les champs du formulaire
    const formInputs = form.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        // Animer le label quand le champ est en focus
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('input-focused');
        });

        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('input-focused');
            }
        });

        // Valider le format de l'email en temps réel
        if (input.type === 'email') {
            input.addEventListener('input', () => {
                const isValid = input.checkValidity();
                input.parentElement.classList.toggle('invalid-input', !isValid);
            });
        }
    });

    // Initialiser l'affichage des places restantes avec animation
    updatePlacesRestantes();
});
