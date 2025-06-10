document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('payment-form');
    const cardNumber = document.getElementById('card-number');
    const expiryDate = document.getElementById('expiry-date');
    const cvv = document.getElementById('cvv');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateForm()) {
            simulatePayment();
        }
    });

    cardNumber.addEventListener('input', function(e) {
        e.target.value = formatCardNumber(e.target.value);
    });

    expiryDate.addEventListener('input', function(e) {
        e.target.value = formatExpiryDate(e.target.value);
    });

    cvv.addEventListener('input', function(e) {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 3);
    });

    function validateForm() {
        let isValid = true;

        if (!validateCardNumber(cardNumber.value)) {
            alert('Please enter a valid card number');
            isValid = false;
        }

        if (!validateExpiryDate(expiryDate.value)) {
            alert('Please enter a valid expiry date (MM/YY)');
            isValid = false;
        }

        if (cvv.value.length !== 3) {
            alert('Please enter a valid 3-digit CVV');
            isValid = false;
        }

        return isValid;
    }

    function validateCardNumber(number) {
        const regex = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/;
        return regex.test(number.replace(/\s/g, ''));
    }

    function validateExpiryDate(date) {
        const regex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
        if (!regex.test(date)) return false;

        const [month, year] = date.split('/');
        const now = new Date();
        const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);

        return expiry > now;
    }

    function formatCardNumber(number) {
        return number.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').trim().slice(0, 19);
    }

    function formatExpiryDate(date) {
        return date.replace(/\D/g, '').replace(/^(\d{2})/, '$1/').trim().slice(0, 5);
    }

    function simulatePayment() {
        const payButton = form.querySelector('.pay-now');
        payButton.disabled = true;
        payButton.textContent = 'Processing...';

        setTimeout(() => {
            alert('Payment successful! Thank you for your purchase.');
            form.reset();
            payButton.disabled = false;
            payButton.textContent = 'Pay Now';
        }, 2000);
    }
});