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
})();
