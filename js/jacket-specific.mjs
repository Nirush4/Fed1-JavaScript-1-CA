import { createHTML, clearNode } from './utils.mjs';
import { API_URL, ERROR_MESSAGE_DEFAULT, CURRENCY } from './constants.mjs';

const containerEl = document.querySelector('#product-details');
const onSaleSection = document.querySelector('#section-3');

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
  clearNode(containerEl);
  containerEl.appendChild(detailsEl);
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
                      <button class="c-add-to-cart-2" id="js-add-to-cart-${id}">Add to Cart</button>
             </div>
    </article>
 `;
}

const productsList = JSON.parse(localStorage.getItem('products'));
const onSaleProductList = productsList.filter((product) => {
  return product.onSale;
});

const limitedSale = onSaleProductList.slice(0, 6);

createproductTemplateOnSale(limitedSale);

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

// function breadcrumbsTemplate({ id = '' }) {
//   const detailsUrl = `/jacket-specific.html?id=${id}`;

//   return `<a href="/index.html">Home</a> <a href="${detailsUrl}" class="products-breadcrumbs">Products</a>`;
// }

// async function createBreadcrumbs(productId) {
//   const { id } = await fetchProductDetails(productId);

//   const template = breadcrumbsTemplate({
//     id,
//   });

//   const detailsEl = createHTML(template);
//   clearNode(productsBreadcrumbs);
//   productsBreadcrumbs.appendChild(detailsEl);
// }

// createBreadcrumbs(productId);

// function breadcrumbsTemplate({ id = '' }) {
//   const detailsUrl = `/jacket-specific.html?id=${id}`;
//   return `
//     <a href="/index.html">Home</a>
//     <a href="${detailsUrl}" class="products-breadcrumbs">Products</a>
//   `;
// }

// // function createHTML(template) {
// //   // Create a new element and insert the template HTML into it
// //   const el = document.createElement('div');
// //   el.innerHTML = template;
// //   return el.firstElementChild; // returns the first child of the created element (the anchor tags)
// // }

// async function createBreadcrumbs(productId) {
//   try {
//     const { id } = await fetchProductDetails(productId);

//     const template = breadcrumbsTemplate({ id });
//     const detailsEl = createHTML(template);

//     const productsBreadcrumbs = document.getElementById('breadcrumbs'); // Ensure the element exists in the DOM
//     debugger;
//     if (!productsBreadcrumbs) {
//       console.error('Breadcrumb container not found');
//       return;
//     }

//     // Clear the existing breadcrumbs and append the new one
//     productsBreadcrumbs.innerHTML = ''; // or clearNode() if it's a custom function
//     productsBreadcrumbs.appendChild(detailsEl);
//   } catch (error) {
//     console.error('Error creating breadcrumbs:', error);
//   }
// }

// // Call the createBreadcrumbs function with a valid productId (make sure productId is defined somewhere)
// const productId = '123'; // Example productId, replace with actual
// createBreadcrumbs(productId);
