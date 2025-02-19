const paymentMethodEl = document.forms.paymentMethod;

formData();

async function formData() {
  if (!paymentMethodEl) {
    console.warn('JS cannot run!!!');
    return;
  }

  paymentMethodEl.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(paymentMethodEl);
    const data = Object.fromEntries(formData);

    window.localStorage.setItem('paymentMethod', JSON.stringify(data));

    sendDataToAPI(data);

    async function sendDataToAPI(data) {
      try {
        const res = await fetch('https://dummyjson.com/products/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        const json = await res.json();

        return json;
      } catch (error) {
        console.error(error?.message);
      }
      return 'Success';
    }
    window.location = '/payment-method.html';

    summaryFormEl.reset();
  });
}
