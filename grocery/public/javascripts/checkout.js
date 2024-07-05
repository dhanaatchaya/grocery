// Initialize Stripe.js with your publishable key
var stripe = Stripe('pk_test_51O687sSHirWlKuMeYVVIZvPR6q6zDZqetVZBupPzFpagoKeklFjWCEDnUkZ1bL7TbDETUIiK4OKyN1Wl6pbshrf100H91AbiqK');
var elements = stripe.elements();

// Create an instance of the card Element
var card = elements.create('card', {
    style: {
        base: {
            color: '#32325d',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
                color: '#aab7c4'
            }
        },
        invalid: {
            color: '#fa755a',
            iconColor: '#fa755a'
        }
    }
});

// Add an instance of the card Element into the `card-element` <div>
card.mount('#card-element');

// Handle real-time validation errors from the card Element.
card.on('change', function(event) {
    var displayError = document.getElementById('card-errors');
    if (event.error) {
        displayError.textContent = event.error.message;
        displayError.classList.remove('hidden');
    } else {
        displayError.textContent = '';
        displayError.classList.add('hidden');
    }
});

// Handle form submission.
var form = document.getElementById('checkout-form');
form.addEventListener('submit', function(event) {
    event.preventDefault();

    stripe.createToken(card).then(function(result) {
        if (result.error) {
            // Inform the user if there was an error
            var errorElement = document.getElementById('card-errors');
            errorElement.textContent = result.error.message;
            errorElement.classList.remove('hidden');
        } else {
            // Send the token to your server
            stripeTokenHandler(result.token);
        }
    });
});

// Submit the form with the token ID.
function stripeTokenHandler(token) {
    var form = document.getElementById('checkout-form');
    var hiddenInput = document.createElement('input');
    hiddenInput.setAttribute('type', 'hidden');
    hiddenInput.setAttribute('name', 'stripeToken');
    hiddenInput.setAttribute('value', token.id);
    form.appendChild(hiddenInput);

    // Submit the form
    form.submit();}
