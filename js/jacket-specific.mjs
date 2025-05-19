import { createHTML, clearNode } from './utils.mjs';
import { API_URL, ERROR_MESSAGE_DEFAULT, CURRENCY } from './constants.mjs';

const cartIcon = document.querySelector('#js-cart-icon');
const shoppingCartEl = document.querySelector('#js-shopping-cart');
const closeCartBtn = document.querySelector('#js-close-cart');
const cartProductList = document.querySelector('#js-cart-product-list');
const displayTotalPrice = document.querySelector('#js-total-price');
const cartIconSpan = document.querySelector('#js-icon-cart-span');
const productDetailsSection = document.querySelector('#product-details');
const inputQuantity = document.querySelector('#quantity');
const onSaleSection = document.querySelector('#section-3');

const containerEl = document.querySelector('#product-details');
const clearCartBtn = document.querySelector('#js-clear-cart-btn');

setup();
setupCart();

async function setup() {
  clearNode(containerEl);

  const id = getId();
  await renderProductDetails(id);

  const products = await getProducts();
  const onSaleProducts = products
    .filter((product) => product.onSale)
    .slice(0, 6);

  setSaleProductsToLS(onSaleProducts);

  createproductTemplateOnSale(onSaleProducts);
  getCartSaleItemToLocalStorage();
}

async function getProducts() {
  try {
    const response = await fetch(API_URL);
    const { data } = await response.json();

    return data;
  } catch (error) {
    console.error(ERROR_MESSAGE_DEFAULT, error?.message);
  }
}

function setupCart() {
  let storedItem = window.localStorage.getItem('Cart');
  if (storedItem) {
    const cart = JSON.parse(storedItem);
    setCartItemToLocalStorage(cart);
    addToCartHTML();
  }
}

function setSaleProductsToLS(products = []) {
  window.localStorage.setItem('productsOnSale', JSON.stringify(products));
}

function setCartItemToLocalStorage(cart = []) {
  window.localStorage.setItem('Cart', JSON.stringify(cart));
}

function getCartSaleItemToLocalStorage() {
  JSON.parse(localStorage.getItem('productsOnSale'));
  addToCartHTML();
}

cartIcon.addEventListener('click', () => {
  shoppingCartEl.classList.toggle('open');
});

closeCartBtn.addEventListener('click', () => {
  shoppingCartEl.classList.remove('open');
});

onSaleSection.addEventListener('click', (event) => {
  let positionClick = event.target;
  if (positionClick.classList.contains('c-add-to-cart-2')) {
    let productId = positionClick.dataset.id;
    addToCart(productId);
  }
  addToCartHTML();
});

function addToCart(productId, quantity = 1) {
  const cart = JSON.parse(window.localStorage.getItem('Cart')) || [];

  let itemPositionInCart = cart.findIndex(
    (item) => item.productId === productId
  );

  if (itemPositionInCart === -1) {
    cart.push({
      productId: productId,
      quantity: quantity,
    });
  } else {
    cart[itemPositionInCart].quantity += quantity;
  }

  setCartItemToLocalStorage(cart);
}

function calcTotal() {
  const productsList = JSON.parse(localStorage.getItem('products')) || [];
  const limitedSaleProducts =
    JSON.parse(localStorage.getItem('productsOnSale')) || [];
  const cart = JSON.parse(window.localStorage.getItem('Cart')) || [];
  const newTotal = cart.reduce((total, cartItem) => {
    let jacket = [...productsList, ...limitedSaleProducts].find(
      (jacket) => jacket.id === cartItem.productId
    );

    return jacket ? total + jacket.price * cartItem.quantity : 0;
  }, 0);
  return newTotal;
}

function addToCartHTML() {
  const cart = JSON.parse(window.localStorage.getItem('Cart')) || [];
  const productsList = JSON.parse(localStorage.getItem('products')) || [];
  const limitedSaleProducts =
    JSON.parse(localStorage.getItem('productsOnSale')) || [];
  cartProductList.innerHTML = '';
  let totalQuantity = 0;
  if (cart.length > 0) {
    cart.forEach((jacket) => {
      totalQuantity += jacket.quantity;
      let newCart = document.createElement('div');
      newCart.classList.add('shopping-card-col-1');
      newCart.dataset.id = jacket.productId;
      let positionProduct = [...productsList, ...limitedSaleProducts].findIndex(
        (value) => value.id === jacket.productId
      );
      let info = [...productsList, ...limitedSaleProducts][positionProduct];

      if (!info) {
        return;
      }
      const totalPrice = info.price * jacket.quantity; //
      newCart.innerHTML = `
          <div class="shopping-card-img-div">
            <img src="${info.image.url}" alt="A man with a jacket">
           </div>
           <div class="shopping-card-text-div">
              <h3>${info.title}</h3>
               <div class="cart-price-container">
              <p>(${info.price.toFixed(2)})</p>
                <p>${totalPrice.toFixed(2)}kr</p>
              </div>
                <p>Color:${info.baseColor}</p>
                  <div class="shopping-card-count">
                    <div class="shopping-card-count-text">
                      <div>
                        <i class="fa-solid fa-minus quantity-btn"></i>
                      </div>
                      <p>${jacket.quantity}</p>
                      <div> <i class="fa-solid fa-plus quantity-btn"></i></div>
                  </div>
                   <div class="shopping-card-count-trash">
                    <i class="fa-regular fa-trash-can"></i>
                  </div>
                </div>
    `;

      cartProductList.appendChild(newCart);
    });
    displayTotalPrice.innerHTML = calcTotal().toFixed(2) + ' kr';
  } else {
    displayTotalPrice.innerHTML = '0 kr';
  }
  cartIconSpan.textContent = totalQuantity;
  if (totalQuantity > 0) {
    cartIconSpan.classList.remove('hidden');
  } else if (totalQuantity === 0) {
    cartIconSpan.classList.add('hidden');
  }
}

cartProductList.addEventListener('click', (event) => {
  let positionClick = event.target;

  if (positionClick.classList.contains('quantity-btn')) {
    let closestParentWithDataId = positionClick.closest('[data-id]');
    let productId = closestParentWithDataId.dataset.id;
    let type = 'minus';
    if (positionClick.classList.contains('fa-plus')) {
      type = 'plus';
    }
    changeQuantity(productId, type);
  }
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
  }
  addToCartHTML();
}

function changeQuantity(productId, type) {
  const cart = JSON.parse(window.localStorage.getItem('Cart')) || [];

  let itemPositionInCart = cart.findIndex(
    (value) => value.productId === productId
  );
  if (itemPositionInCart >= 0) {
    switch (type) {
      case 'plus':
        cart[itemPositionInCart].quantity += 1;
        setCartItemToLocalStorage(cart);
        break;

      default:
        let valueChange = cart[itemPositionInCart].quantity - 1;
        if (valueChange > 0) {
          cart[itemPositionInCart].quantity = valueChange;
          setCartItemToLocalStorage(cart);
        } else {
          cart.splice(itemPositionInCart, 1);
          setCartItemToLocalStorage(cart);
        }
        break;
    }
  }
  addToCartHTML();
}

async function fetchProductDetails(productId = '') {
  const Id = getId();

  try {
    if (!Id) {
      throw new Error('No product id was provided.');
    }

    const response = await fetch(`${API_URL}/${Id}`);
    const { data } = await response.json();

    return data;
  } catch (error) {
    console.error(ERROR_MESSAGE_DEFAULT, error?.message);
  }
}

function getId() {
  const parameterString = window.location.search;
  const searchParameters = new URLSearchParams(parameterString);
  const productId = searchParameters.get('id');

  return productId;
}

function detailsTemplate({
  id = '',
  primaryImgUrl = 'https://placehold.co/400x500',
  title = 'Unknown Product',
  price = 0,
  description = "This product doesn't have a description",
  alt = 'No Description present',
}) {
  const detailsUrl = `/jacket-specific.html?id=${id}`;
  return `
    <article class="product-details">
      <div class="product-images">
       <a href="${detailsUrl}">
        <img
          src="${primaryImgUrl}"
          alt="${alt}"
          class="main-image"
        />
      </a>
      </div>

      <div class="product-info">
        <h2 class="product-title">${title}</h2>
        <p class="product-price">${price} ${CURRENCY}</p>
        <p class="product-description">${description}</p>

        <form class="purchase-options" name="addToCartForm" id="js-product-cart-form" data-id="${id}">
          <input name="id" value="${id}" hidden/>
          <input name="imgUrl" value="${primaryImgUrl}" hidden/>
          <input name="price" value="${price}" hidden/>
          <input name="title" value="${title}" hidden/>

          <div class="form-group">
            <label for="size">Size:</label>
            <select id="size" name="size" class="select-size">
              <option value="s">Small</option>
              <option value="m">Medium</option>
              <option value="l">Large</option>
              <option value="xl">XL</option>
            </select>
          </div>

          <div class="form-group">
            <label for="quantity">Quantity:</label>
            <input
              type="number"
              id="quantity"
              data-id="${id}"
              name="quantity"
              min="1"
              value="1"
              class="input-quantity"
            />
          </div>

          <button type="submit" data-id="${id}"class="add-to-cart">Add to Cart</button>
        </form>
      </div>
    </article>
  `;
}

async function renderProductDetails(productId) {
  const { image, title, price, description, id } = await fetchProductDetails(
    productId
  );

  const template = detailsTemplate({
    id,
    primaryImgUrl: image.url,
    alt: image.alt,
    title,
    price,
    description,
  });

  const detailsEl = createHTML(template);
  clearNode(containerEl);
  containerEl.appendChild(detailsEl);
  getCartSaleItemToLocalStorage();

  const form = document.querySelector('form[name="addToCartForm"]');

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const productId = formData.get('id');
    const size = formData.get('size');
    const quantity = parseInt(formData.get('quantity'));

    addToCart(productId, quantity);
    addToCartHTML();
  });
}

function productTemplateOnSale({
  id,
  title = 'Unknown Item',
  imgUrl,
  imgAl,
  price = 0,
  discountedPrice = 0,
  description = 'Missing description',
  discountPercentage = 0,
  index,
}) {
  const detailsUrl = `/jacket-specific.html?id=${id}`;
  return `

  <article  aria-label="section-3">
            <div class="section-3-content-holder">

            <a href="${detailsUrl}" class="section-3-content-1">
                <div class="section-3-content-main-1"> 
                        <img src="${imgUrl}" alt="${imgAl}" >
                        <span class="discount-percentage">-${discountPercentage}%</span>
                      <div class="section-3-content-text-1">
                        <p class="section-3-content-item-name-1">${title}</p>
                             <div class="c-product-preview-rating">
                                  <span>&#9733;</span>
                                  <span>&#9733;</span>
                                  <span>&#9733;</span>
                                  <span>&#9733;</span>
                                  <span>&#9734;</span>
                                  <span class="reviews-2">(123 reviews)</span>
                              </div>
                            <div class="section-3-content-item-price-list-1">
                                <span class="section-3-content-item-price-new-1">${discountedPrice} ${CURRENCY}</span>
                                <span class="section-3-content-item-price-old-1">${price} ${CURRENCY}</span>
                            </div>
                        </div>

                  </div>
              </a>
                      <button class="c-add-to-cart-2" data-id="${id}" id="js-add-to-cart-${id}">Add to Cart</button>
             </div>
    </article>
 `;
}

function createproductTemplateOnSale(list = products) {
  clearNode(onSaleSection);

  list.forEach(({ id, title, image, price, description, discountedPrice }) => {
    const discountPercentage = ((price - discountedPrice) / price) * 100;
    const template = productTemplateOnSale({
      id,
      title,
      imgUrl: image.url,
      imgAl: image.alt,
      price,
      description,
      discountedPrice,
      discountPercentage: discountPercentage.toFixed(0),
    });

    const newElOnSale = createHTML(template);
    onSaleSection.append(newElOnSale);
  });
}

clearCartBtn.addEventListener('click', () => {
  let cart = JSON.parse(window.localStorage.getItem('Cart')) || [];
  window.localStorage.setItem('Cart', JSON.stringify((cart = [])));
  addToCartHTML();
});
