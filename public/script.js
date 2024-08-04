async function populateLandingPage(productInfo) {
    try {
        showLoadingSpinner();

        const response = await fetch('/api/generate-content', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productInfo),
        });

        const data = await response.json();

        document.getElementById('headline').innerText = data.headline;
        document.getElementById('description').innerText = data.description;
        document.getElementById('price-display').innerText = `$${data.price}`;
        document.getElementById('cta').innerText = data.cta;
        document.getElementById('purpose-display').innerText = `Purpose: ${data.purpose}`;
        document.getElementById('positive-effect-display').innerText = `Positive Effects: ${data.positiveEffect}`;

        // Display the generated image
        const productImage = document.getElementById('product-image');
        productImage.src = data.imageURL;
        productImage.alt = `Image of ${productInfo.name}`;

        // Show landing page with transition animation
        document.getElementById('input-form-container').classList.add('hidden');
        const landingPage = document.getElementById('landing-page-container');
        landingPage.classList.remove('hidden');
        landingPage.classList.add('fade-in');
    } catch (error) {
        console.error('Error populating landing page:', error);
    } finally {
        hideLoadingSpinner();
    }
}

function showLoadingSpinner() {
    document.getElementById('loading-spinner').classList.remove('hidden');
    document.getElementById('submit-button').disabled = true;
}

function hideLoadingSpinner() {
    document.getElementById('loading-spinner').classList.add('hidden');
    document.getElementById('submit-button').disabled = false;
}

// Handle form submission
document.getElementById('product-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const purpose = document.getElementById('purpose').value;
    const positiveEffect = document.getElementById('positiveEffect').value;
    const price = document.getElementById('price').value;

    const productInfo = { name, purpose, positiveEffect, price };
    populateLandingPage(productInfo);
});

document.getElementById('try-again-button').addEventListener('click', function () {
    document.getElementById('product-form').reset();
    document.getElementById('landing-page-container').classList.add('hidden');
    document.getElementById('input-form-container').classList.remove('hidden');
});
