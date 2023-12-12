let menu = document.querySelector('#menu-icon');
let navlist = document.querySelector('.navlist');

menu.onclick = () => {
	menu.classList.toggle('bx-x');
	navlist.classList.toggle('open');
};

const sr = ScrollReveal ({
	distance: '65px',
	duration: 2600,
	delay: 450,
	reset: true
});

sr.reveal('.hero-text',{delay:200, origin:'top'});
sr.reveal('.hero-img',{delay:450, origin:'top'});
sr.reveal('.icons',{delay:500, origin:'left'});
sr.reveal('.scroll-down',{delay:500, origin:'right'});

sr.reveal('.image-content1 img ',{delay:200, origin:'top'});
sr.reveal('.image-content img',{delay:450, origin:'top'});
sr.reveal('.vision-section',{delay:500, origin:'left'});
sr.reveal('.scroll-down',{delay:500, origin:'right'});
sr.reveal('.call-to-action',{delay:500, origin:'right'});
sr.reveal('.about-container',{delay:500, origin:'right'});	

sr.reveal('.overall-container',{delay:200, origin:'top'});
sr.reveal('.search-bar',{delay:500, origin:'left'});
sr.reveal('.form-container',{delay:200, origin:'top'});
sr.reveal('.h1text',{delay:500, origin:'top'});