// JavaScript to toggle the portfolio section
document.getElementById('togglePortfolio').addEventListener('click', function() {
    var portfolioSection = document.getElementById('portfolioSection');
    if (portfolioSection.style.display === 'none') {
        portfolioSection.style.display = 'block';
    } else {
        portfolioSection.style.display = 'none';
    }
});