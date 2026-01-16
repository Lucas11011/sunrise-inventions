(() => {
	// Flag that JavaScript is running so CSS can enable animations
	document.documentElement.classList.add('has-js');
	const revealEls = document.querySelectorAll('.reveal');

	if (!('IntersectionObserver' in window)) {
		// Fallback: show everything instantly when the API isn't supported
		revealEls.forEach((el) => el.classList.add('is-visible'));
		return;
	}

	// Observe each reveal element and fade it in when it enters the viewport
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add('is-visible');
					observer.unobserve(entry.target);
				}
			});
		},
		{
			threshold: 0.2,
			rootMargin: '0px 0px -5% 0px'
		}
	);

	revealEls.forEach((el) => observer.observe(el));

	// Update footer year automatically
	const yearEl = document.getElementById('year');
	if (yearEl) {
		yearEl.textContent = new Date().getFullYear();
	}

    // Copy-to-clipboard for email address
	const copyButtons = document.querySelectorAll('[data-copy-email]');
	const copyToClipboard = async (text) => {
		if (navigator.clipboard?.writeText) {
			await navigator.clipboard.writeText(text);
			return true;
		}

		const helper = document.createElement('textarea');
		helper.value = text;
		helper.setAttribute('readonly', '');
		helper.style.position = 'absolute';
		helper.style.left = '-9999px';
		document.body.appendChild(helper);
		helper.select();
		helper.setSelectionRange(0, helper.value.length);

		let success = false;
		try {
			success = document.execCommand('copy');
		} catch (error) {
			success = false;
		} finally {
			document.body.removeChild(helper);
		}

		return success;
	};

	copyButtons.forEach((button) => {
		button.addEventListener('click', async () => {
			const email = button.dataset.copyEmail;
			if (!email) return;

			const feedback = button.nextElementSibling?.classList.contains('copy-feedback')
				? button.nextElementSibling
				: null;

			const copied = await copyToClipboard(email);
			button.classList.toggle('copied', copied);

			if (feedback) {
				feedback.textContent = copied ? 'Copied!' : 'Copy unavailable';
				feedback.classList.add('is-visible');
			}

			setTimeout(() => {
				button.classList.remove('copied');
				if (feedback) {
					feedback.classList.remove('is-visible');
					feedback.textContent = '';
				}
			}, 2000);
		});
	});
})();
