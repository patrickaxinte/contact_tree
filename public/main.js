// JavaScript to toggle the portfolio section
document.getElementById('togglePortfolio').addEventListener('click', function() {
    var portfolioSection = document.getElementById('portfolioSection');
    if (portfolioSection.style.display === 'none') {
        portfolioSection.style.display = 'block';
    } else {
        portfolioSection.style.display = 'none';
    }
});

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function setRandomGradient() {
    var color1 = getRandomColor();
    var color2 = getRandomColor();
    document.body.style.background = 'linear-gradient(to right, ' + color1 + ', ' + color2 + ') !important';

}

// Set a random gradient background on load and each refresh
window.onload = setRandomGradient;

document.addEventListener('DOMContentLoaded', function() {
    setRandomGradient();
    console.log('Random gradient set');
});

// JavaScript to handle form submission and display message
document.querySelector('.contact-form form').addEventListener('submit', function(event) {
    event.preventDefault();
    var formData = new FormData(this);
    fetch('/send', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        var formMessage = document.getElementById('formMessage');
        formMessage.innerText = data.message;
        formMessage.classList.add('show-message');
        // Remove the message after 4 seconds
        setTimeout(function() {
            formMessage.classList.remove('show-message');
        }, 4000);
    })
    .catch(error => {
        console.error('Error:', error);
    });
});




