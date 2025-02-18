import { createHTML, clearNode } from './utils.mjs';
import { API_URL, ERROR_MESSAGE_DEFAULT, CURRENCY } from './constants.mjs';
// import { addToCart } from './cart.mjs';

const containerEl = document.querySelector('#js-products-section');
const sortByEl = document.querySelector('#js-sort-by');
const filterEl = document.querySelector('#js-filter-by');
const inputSearch = document.querySelector('#search-input');
const Section2 = document.querySelector('.section-2');
const Section3 = document.querySelector('.section-3');

let products = [];

setup();

function setup() {
  if (!containerEl || !sortByEl) {
    console.error('JS cannot run!!!');
  } else {
    getProducts();
  }
}

inputSearch.addEventListener('input', (event) => {
  Section2.scrollIntoView();

  const inputVal = event.target.value;
  const filteredProductsSearch = products.filter(({ title }) =>
    title.trim().toLowerCase().includes(inputVal.trim().toLowerCase())
  );

  createProductsListEl(filteredProductsSearch);
});

sortByEl.addEventListener('change', (event) => {
  const val = event.target.value;

  if (val === 'asc') {
    sortByPriceDescending();
  } else if (val === 'desc') {
    sortByPriceAscending();
  }

  createProductsListEl(products);
});

filterEl.addEventListener('change', (event) => {
  const val = event.target.value;

  if (val === 'Male' || val === 'Female') {
    filterProductsByGender(val);
  } else {
    createProductsListEl(products); // Pass the original products list when no gender filter is selected
  }
});

function filterProductsByGender(gender) {
  const list = products;
  const filteredProducts = list.filter((product) => {
    return product.gender === gender;
  });
  createProductsListEl(filteredProducts);
  console.log(filteredProducts);
}

async function getProducts() {
  clearNode(containerEl);
  createLoadingSkeleton();

  try {
    const response = await fetch(API_URL);
    const { data } = await response.json();
    products = data;

    window.localStorage.setItem('products', JSON.stringify(products));

    sortByPriceDescending();
    createProductsListEl(products);
  } catch (error) {
    console.error(ERROR_MESSAGE_DEFAULT, error?.message);
  }
}

const productsList = JSON.parse(localStorage.getItem('products'));
const onSaleProductList = productsList.filter((product) => {
  return product.onSale;
});

const limitedSale = onSaleProductList.slice(0, 6);

createproductTemplateOnSale(limitedSale);

// discountedAmount(limitedSale);

// function discountedAmount(limitedSale) {
//   limitedSale.forEach((product) => {
//     createLoadingSkeleton(5);
//     const discountPercentage =
//       ((product.price - product.discountedPrice) / product.price) * 100;
//     console.log('discountPercent for product:', discountPercentage + '%');
//     return discountPercentage;
//   });
// }

function productTemplate({
  id,
  title = 'Unknown Item',
  imgUrl,
  imgAl,
  price = 0,
  description = 'Missing description',
  index,
}) {
  const detailsUrl = `/jacket-specific.html?id=${id}`;
  return `
  <article class="section-2-gallery animate__animated animate__fadeInUp animate__delay-${index}s">

            <div class="section-2-gallery-img-1 section-2-gallery-common">
                <div class="section-2-img-div">
                    <a href="${detailsUrl}">
                        <img src="${imgUrl}" alt="${imgAl}" >
                    </a>
                </div>
                <p class="section-2-gallery-text-p">${title}</p>
                <div class="c-product-preview-rating">
                <span>&#9733;</span>
                <span>&#9733;</span>
                <span>&#9733;</span>
                <span>&#9733;</span>
                <span>&#9734;</span>
                <span class="reviews">(123 reviews)</span>
            </div>
            <span class="section-2-gallery-text-price">${price} ${CURRENCY}</span>
            <button class="c-add-to-cart" id="js-add-to-cart-${id}">Add to Cart</button>

    </article>
 `;
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

                <div class="section-3-content-main-1"> 
                     <a href="${detailsUrl}" class="section-3-content-1">
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
                      </a>
                      <button class="c-add-to-cart-2" id="js-add-to-cart-${id}">Add to Cart</button>
                </div>
    </article>
 `;
}

function SkeletonTemplate() {
  return `
  <article class="c-product-preview-details">
    <div class="c-product-preview-image">
      <div class="skeleton skeleton-image"></div>
    </div>
    <div class="c-product-preview-info">
      <div class="skeleton skeleton-title"></div>
      <div class="skeleton skeleton-rating"></div>
      <div class="skeleton skeleton-price"></div>
      <div class="skeleton skeleton-description"></div>
      <div class="skeleton skeleton-button"></div>
    </div>
  </article>
 `;
}

function createLoadingSkeleton(count = 3) {
  [...Array(count)].forEach(() => {
    const template = SkeletonTemplate();
    const newEl = createHTML(template);
    containerEl.append(newEl);
  });
}

function createProductsListEl(list = products) {
  clearNode(containerEl);

  list.forEach(({ id, title, image, price, description }) => {
    const template = productTemplate({
      id,
      title,
      imgUrl: image.url,
      imgAl: image.alt,
      price,
      description,
    });

    const newEl = createHTML(template);
    const btn = newEl.querySelector('button');

    btn.addEventListener('click', () => {
      addToCart({
        id,
        title,
        imgUrl: image.url,
        price,
      });
    });

    containerEl.append(newEl);
  });
}

function createproductTemplateOnSale(list = products) {
  clearNode(Section3);

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
    Section3.append(newElOnSale);
  });
}

function sortByPriceDescending(list = products) {
  list.sort((a, b) => a.price - b.price);
}

function sortByPriceAscending(list = products) {
  list.sort((a, b) => b.price - a.price);
}

// Example usage:
// filterProductsByGender('male');
// filterProductsByGender('female');
// filterProductsByGender('unisex');
