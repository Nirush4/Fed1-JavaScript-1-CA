'use strict';

import { createHTML, clearNode } from './utils.mjs';
import { API_URL, ERROR_MESSAGE_DEFAULT, CURRENCY } from './constants.mjs';

const containerEl = document.querySelector('#js-products-section');
const sortByEl = document.querySelector('#js-sort-by');
const inputSearch = document.querySelector('#search-input');
const jacketSection = document.querySelector('.section-filter');
const clrBlack = document.querySelector('#blackColor');
const clrBlue = document.querySelector('#blueColor');
const clrGray = document.querySelector('#grayColor');
const clrRed = document.querySelector('#redColor');
const clrRestBtn = document.querySelector('#clr-reset-btn');

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
  jacketSection.scrollIntoView();

  const inputVal = event.target.value;
  const filteredProductsSearch = products.filter(({ title }) =>
    title.trim().toLowerCase().includes(inputVal.trim().toLowerCase())
  );

  createProductsListEl(filteredProductsSearch);
});

sortByEl.addEventListener('change', (event) => {
  const val = event.target.value;

  if (val === 'asc') {
    sortByPriceDescending(mensJackets);
  } else if (val === 'desc') {
    sortByPriceAscending(mensJackets);
  }

  createProductsListEl(mensJackets);
});

const productsList = JSON.parse(localStorage.getItem('products'));
const mensJackets = productsList.filter((product) => {
  return product.gender === 'Male';
});

window.localStorage.setItem('Mens Jackets', JSON.stringify(mensJackets));

clrBlack.addEventListener('click', () => {
  const blackProducts = mensJackets.filter(
    (product) => product.baseColor === 'Black'
  );
  createProductsListEl(blackProducts);
});
clrBlue.addEventListener('click', () => {
  const blueProducts = mensJackets.filter(
    (product) => product.baseColor === 'Blue'
  );
  createProductsListEl(blueProducts);
});
clrGray.addEventListener('click', () => {
  const grayProducts = mensJackets.filter(
    (product) => product.baseColor === 'Gray'
  );
  createProductsListEl(grayProducts);
});
clrRed.addEventListener('click', () => {
  const redProducts = mensJackets.filter(
    (product) => product.baseColor === 'Red'
  );
  createProductsListEl(redProducts);
});

clrRestBtn.addEventListener('click', () => {
  createProductsListEl(mensJackets);
});

async function getProducts() {
  clearNode(containerEl);
  createLoadingSkeleton();

  try {
    const response = await fetch(API_URL);
    const { data } = await response.json();
    products = data;

    window.localStorage.setItem('products', JSON.stringify(products));

    sortByPriceDescending();
    createProductsListEl(mensJackets);
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
            <button class="c-add-to-cart" data-id="${id}" id="js-add-to-cart-${id}">Add to Cart</button>

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

async function createProductsListEl(list = []) {
  clearNode(containerEl);

  try {
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
      containerEl.append(newEl);
    });
  } catch (error) {
    console.error(ERROR_MESSAGE_DEFAULT, error?.message);
  }
}

function sortByPriceDescending(list = []) {
  list.sort((a, b) => a.price - b.price);
}

function sortByPriceAscending(list = []) {
  list.sort((a, b) => b.price - a.price);
}
