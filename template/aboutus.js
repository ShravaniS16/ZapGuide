// Smooth scrolling for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Change active link on scroll
window.addEventListener('scroll', function () {
    let sections = document.querySelectorAll('section');
    let navLinks = document.querySelectorAll('nav ul li a');
    
    sections.forEach((section, i) => {
        let rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            navLinks.forEach(link => link.classList.remove('active'));
            navLinks[i].classList.add('active');
        }
    });
});

// Optional dropdown for nav links
let dropdownBtn = document.querySelector('.dropdown-btn');
let dropdownContent = document.querySelector('.dropdown-content');

dropdownBtn.addEventListener('click', function () {
    dropdownContent.classList.toggle('show');
});
