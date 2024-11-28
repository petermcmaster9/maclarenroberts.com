const mobileMenuButton = document.querySelector(".toggle-button");
const navList = document.querySelector(".navbar-links");
const navLinks = document.querySelectorAll(".navbar-links a");
const navBrand = document.querySelector(".navbar-img");

mobileMenuButton.addEventListener("click", function() {
    navList.classList.toggle("active");
});

navLinks.forEach(function(link) {
    link.addEventListener("click", function() {
        navList.classList.remove("active");
    });
});

navBrand.addEventListener("click", function() {
    navList.classList.remove("active");
});