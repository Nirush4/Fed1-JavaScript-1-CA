const body = document.querySelector('body');
const successEl = document.querySelector('#success-el');
const orderSummaryContainerEl = document.querySelector(
  '#js-order-summary-container'
);

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
                     	&nbsp; <div><strong>${info.price.toFixed(
                        2
                      )}kr</strong></div>,
                     	&nbsp;  <div>Color: <strong>${
                        info.baseColor
                      }</strong></div>,
                      &nbsp; <div>Size: <strong>M</strong></div>,
                     	&nbsp; <div>Quantity:<strong>${
                        product.quantity
                      }</strong></div>
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

  if (target.href.includes('http')) {
    let cart = JSON.parse(window.localStorage.getItem('Cart')) || [];
    window.localStorage.setItem('Cart', JSON.stringify((cart = [])));
  }
});
