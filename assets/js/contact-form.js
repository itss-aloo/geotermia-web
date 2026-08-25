(function() {
	'use strict';

	function initializeContactForm() {
		var form = document.querySelector('#contact-form');

		if (!form || form.dataset.formspreeReady === 'true')
			return;

		var submitButton = form.querySelector('input[type="submit"]'),
			status = form.querySelector('.form-status'),
			defaultButtonText = submitButton.value,
			isSubmitting = false;

		form.dataset.formspreeReady = 'true';

		form.addEventListener('submit', function(event) {
			event.preventDefault();

			if (isSubmitting)
				return;

			isSubmitting = true;
			submitButton.disabled = true;
			submitButton.value = 'Enviando…';
			status.hidden = true;
			status.className = 'form-status';

			Promise.resolve()
				.then(function() {
					return fetch('https://formspree.io/f/maewropb', {
						method: 'POST',
						body: new FormData(form),
						headers: {
							'Accept': 'application/json'
						}
					});
				})
				.then(function(response) {
					if (!response.ok)
						throw new Error('Formspree request failed');

					form.reset();
					status.textContent = 'Mensaje enviado correctamente. Nos pondremos en contacto contigo lo antes posible.';
					status.classList.add('is-success');
				})
				.catch(function() {
					status.textContent = 'No se ha podido enviar el mensaje. Inténtalo de nuevo.';
					status.classList.add('is-error');
				})
				.then(function() {
					status.hidden = false;
					isSubmitting = false;
					submitButton.disabled = false;
					submitButton.value = defaultButtonText;
				});
		});
	}

	if (document.readyState === 'loading')
		document.addEventListener('DOMContentLoaded', initializeContactForm, { once: true });
	else
		initializeContactForm();
})();
