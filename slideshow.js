let slideIndex = 0;
const slides = document.getElementsByClassName("slide-bg");
let timeoutId = null;

function showSlides() {
    for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove("fade");
        slides[i].style.opacity = "0";
    }
    slideIndex++;
    if (slideIndex > slides.length) { slideIndex = 1; }
    slides[slideIndex-1].classList.add("fade");
    slides[slideIndex-1].style.opacity = "1";
    timeoutId = setTimeout(showSlides, 5000);
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", showSlides);
} else {
    showSlides();
}