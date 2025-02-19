const contactFormEl = document.forms.contactForm;

formData();

async function formData() {
  if (!contactFormEl) {
    console.warn('JS cannot run!!!');
    return;
  }

  contactFormEl.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(contactFormEl);
    const data = Object.fromEntries(formData);

    window.localStorage.setItem('Contact', JSON.stringify(data));

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

    contactFormEl.reset();
  });
}
