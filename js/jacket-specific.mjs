import { createHTML, clearNode } from './utils.mjs';
import { API_URL, ERROR_MESSAGE_DEFAULT, CURRENCY } from './constants.mjs';

const containerEl = document.querySelector('#product-details');

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
renderProductDetails();

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
  return `
    <article class="product-details">
      <div class="product-images">
        <img
          src="${primaryImgUrl}"
          alt="${alt}"
          class="main-image"
        />
      </div>

      <div class="product-info">
        <h2 class="product-title">${title}</h2>
        <p class="product-price">${price} ${CURRENCY}</p>
        <p class="product-description">${description}</p>

        <form class="purchase-options" name="addToCartForm">
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
              name="quantity"
              min="1"
              value="1"
              class="input-quantity"
            />
          </div>

          <button type="submit" class="add-to-cart">Add to Cart</button>
        </form>
      </div>
    </article>
  `;
}

async function renderProductDetails(productId) {
  const { image, title, price, description } = await fetchProductDetails(
    productId
  );

  const template = detailsTemplate({
    primaryImgUrl: image.url,
    alt: image.alt,
    title,
    price,
    description,
  });

  const detailsEl = createHTML(template);
  //   const detailsElWithListener = addFormHandlerToDetailsEl(detailsEl);
  clearNode(containerEl);
  containerEl.appendChild(detailsEl);
}
