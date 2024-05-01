// JavaScript to toggle the portfolio section
document.getElementById('togglePortfolio').addEventListener('click', function() {
    var portfolioSection = document.getElementById('portfolioSection');
    if (portfolioSection.style.display === 'none') {
        portfolioSection.style.display = 'block';
    } else {
        portfolioSection.style.display = 'none';
    }
});

document.addEventListener('DOMContentLoaded', function() {
    var portfolioSection = document.getElementById('portfolioSection');
    document.getElementById('togglePortfolio').addEventListener('click', function() {
        portfolioSection.style.display = (portfolioSection.style.display === 'none') ? 'block' : 'none';
    });

    var contactForm = document.getElementById('contact');
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        var formData = new FormData(this);
        var from = formData.get('from').trim();
        var md = formData.get('md').trim();

        if (from && md) {
            contactForm.submit.disabled = true;
            fetch('/api/paperboy', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    var div = document.createElement('div');
                    div.textContent = 'Thank You!';
                    contactForm.parentNode.replaceChild(div, contactForm);
                } else {
                    throw new Error(data.message);
                }
            })
            .catch(error => {
                alert(error);
                contactForm.submit.disabled = false;
            });
        }
    });
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
            // Reset the form
            document.querySelector('.contact-form form').reset();
        }, 4000);
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

