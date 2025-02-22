const body = document.querySelector('body');
const successEl = document.querySelector('#success-el');
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
  if (storedItem.length > 0) {
    const cart = JSON.parse(storedItem);

    setCartItemToLocalStorage(cart);
    cart.forEach((product) => {
      let positionProduct = [...productsList, ...limitedSaleProducts].findIndex(
        (value) => value.id === product.productId
      );
      let newCart = document.createElement('div');
      newCart.classList.add('c-line-progress');
      newCart.dataset.id = product.productId;

      let info = [...productsList, ...limitedSaleProducts][positionProduct];
      if (!info) {
        return;
      }

      newCart.innerHTML = `
        <div>
            <div class="c-info-container">
               <div class="c-header">${info.title}:</div>
                   <div class="c-pcs">
                      <div>${info.price.toFixed(2)}kr</div>
                      <div>Color: ${info.baseColor}</div>
                      <div>Size: M</div>
                      <div>Quantity:${product.quantity}</div>
                    </div>
                </div>
            </div>
        </div>
        

    `;
      successEl.appendChild(newCart);
    });
  }
}

function setCartItemToLocalStorage(cart = []) {
  window.localStorage.setItem('Cart', JSON.stringify(cart));
}

document.body.addEventListener('click', (event) => {
  const target = event.target;

  // Check if the clicked element is an anchor (<a>) and has an href attribute
  if (target.tagName.toLowerCase() === 'a' && target.href) {
    // Check if the href contains 'http' (to ensure it's an external link)
    if (target.href.includes('http')) {
      // Clear the cart in localStorage by setting it to an empty array
      window.localStorage.setItem('cart', JSON.stringify([]));
    }
  }
});
