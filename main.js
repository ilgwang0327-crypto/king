document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generateBtn');
    const randomNumberSpan = document.getElementById('randomNumber');

    generateBtn.addEventListener('click', () => {
        const randomNumber = Math.floor(Math.random() * 10) + 1;
        randomNumberSpan.textContent = randomNumber;
    });
});