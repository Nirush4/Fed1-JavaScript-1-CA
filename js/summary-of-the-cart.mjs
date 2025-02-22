const summaryFormEl = document.forms.checkout;
const orderSummaryEl = document.querySelector('#order-summary');
const orderSummaryContainerEl = document.querySelector(
  '#js-order-summary-container'
);

// I need to get the cart ID and link it to the products..
getCartSummary();

function getCartSummary() {
  const cart = JSON.parse(window.localStorage.getItem('Cart')) || [];
  const productsList = JSON.parse(localStorage.getItem('products')) || [];
  const limitedSaleProducts =
    JSON.parse(localStorage.getItem('productsOnSale')) || [];
  let storedItem = window.localStorage.getItem('Cart');
  orderSummaryContainerEl.innerHTML = '';

  if (storedItem.length > 0) {
    const cart = JSON.parse(storedItem);

    setCartItemToLocalStorage(cart);
    cart.forEach((product) => {
      let positionProduct = [...productsList, ...limitedSaleProducts].findIndex(
        (value) => value.id === product.productId
      );
      let newCart = document.createElement('div');
      newCart.classList.add('c-summary-produckt-container');
      newCart.dataset.id = product.productId;

      let info = [...productsList, ...limitedSaleProducts][positionProduct];
      if (!info) {
        return;
      }

      newCart.innerHTML = `
            <div class="c-img-container">
                  <img src="${
                    info.image.url
                  }" alt="picture of a model with a red jacket" />
                </div>

                <div class="c-info-container">
                  <div class="c-header">${info.title}</div>
                  <div class="c-pcs">
                    <div>${info.price.toFixed(2)}kr</div>
                    <div>Color: ${info.baseColor}</div>
                    <div>Size: M</div>
                    <div>Quantity:${product.quantity}</div>
                  </div>
                    <div class="shopping-card-count-trash">
                    <i class="fa-regular fa-trash-can"></i>
                  </div>
                </div>

    `;
      orderSummaryContainerEl.appendChild(newCart);
    });
  }
}

function setCartItemToLocalStorage(cart = []) {
  window.localStorage.setItem('Cart', JSON.stringify(cart));
}

orderSummaryContainerEl.addEventListener('click', (event) => {
  let positionClick = event.target;

  if (positionClick.classList.contains('fa-trash-can')) {
    let closestParentWithDataId = positionClick.closest('[data-id]');
    let productId = closestParentWithDataId.dataset.id;
    removeItem(productId);
  }
});

function removeItem(productId) {
  const cart = JSON.parse(window.localStorage.getItem('Cart')) || [];

  let itemPositionInCart = cart.findIndex(
    (value) => value.productId === productId
  );
  if (itemPositionInCart >= 0) {
    cart.splice(itemPositionInCart, 1);
    setCartItemToLocalStorage(cart);
    getCartSummary();
  }
}

/// Morten is above this line of code
formData();

async function formData() {
  if (!summaryFormEl || !orderSummaryEl) {
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

    summaryFormEl.reset();
    window.location = '/payment-method.html';
  });
}
