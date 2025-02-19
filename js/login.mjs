const loginFormEl = document.forms.loginForm;

formData();

async function formData() {
  if (!loginFormEl) {
    console.warn('JS cannot run!!!');
    return;
  }

  loginFormEl.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(loginFormEl);
    const data = Object.fromEntries(formData);

    window.localStorage.setItem('Login', JSON.stringify(data));

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

    loginFormEl.reset();
    window.location = '/index.html';
  });
}
