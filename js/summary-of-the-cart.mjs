const summaryFormEl = document.forms.checkout;

formData();

async function formData() {
  if (!summaryFormEl) {
    console.warn('JS cannot run!!!');
    return;
  }

  summaryFormEl.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(summaryFormEl);
    const data = Object.fromEntries(formData);

    window.localStorage.setItem('shippingInfo', JSON.stringify(data));

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
