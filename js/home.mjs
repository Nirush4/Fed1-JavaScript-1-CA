import { createHTML, clearNode } from './utils.mjs';
import { API_URL, ERROR_MESSAGE_DEFAULT, CURRENCY } from './constants.mjs';
// import { addToCart } from './cart.mjs';

const containerEl = document.querySelector('#js-products-section');
const sortByEl = document.querySelector('#js-sort-by');
const filterEl = document.querySelector('#js-filter-by');
const inputSearch = document.querySelector('#search-input');
const heroSection = document.querySelector('#hero-img');
const Section1 = document.querySelector('.section-1');
const Section2 = document.querySelector('.section-2');
const Section3 = document.querySelector('.section-3');
const Section4 = document.querySelector('.section-4');
const Section5 = document.querySelector('.section-5');

console.log(containerEl);
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
  } else if (val === 'dec') {
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

    console.log(products);

    sortByPriceDescending();
    createProductsListEl(products);
  } catch (error) {
    console.error(ERROR_MESSAGE_DEFAULT, error?.message);
  }
}

function productTemplate({
  id,
  title = 'Unknown Item',
  imgUrl,
  imgAl,
  price = 0,
  description = 'Missing description',
  index,
}) {
  const detailsUrl = `/product-details.html?id=${id}`;
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

function productTemplateBesteller({
  id,
  title = 'Unknown Item',
  imgUrl,
  imgAl,
  price = 0,
  description = 'Missing description',
  index,
}) {
  const detailsUrl = `/product-details.html?id=${id}`;
  return `
  <section class="section-3 common-div" aria-label="section-3">
            <h2 class="section-3-title">
                Best Seller
            </h2>
            <div class="section-3-content-holder">

                <div class="section-3-content-main-1">
                    <div class="section-3-content-1 section-3-common">
                        <div class="section-3-content-text-1">
                            <div class="section-3-star-main-div-1">
                                <i class="fa-solid fa-star" class="section-3-content-stars"></i>
                                <i class="fa-solid fa-star" class="section-3-content-stars"></i>
                                <i class="fa-solid fa-star" class="section-3-content-stars"></i>
                                <i class="fa-solid fa-star" class="section-3-content-stars"></i>
                                <i class="fa-solid fa-star" id="section-3-content-stars-white"></i>
                            </div>
                            <p class="section-3-content-item-name-1">Beta SL Jakke</p>
                            <div class="section-3-content-item-price-list-1">
                                <span class="section-3-content-item-price-new-1">2.200kr</span>
                                <span class="section-3-content-item-price-old-1">2.400kr</span>
                            </div>
                        </div>
                    </div>
                </div>
    </section>
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
