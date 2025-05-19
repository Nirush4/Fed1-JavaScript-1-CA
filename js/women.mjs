'use strict';

import { createHTML, clearNode } from './utils.mjs';
import { API_URL, ERROR_MESSAGE_DEFAULT, CURRENCY } from './constants.mjs';

const containerEl = document.querySelector('#js-products-section');
const sortByEl = document.querySelector('#js-sort-by');
const inputSearch = document.querySelector('#search-input');
const jacketSection = document.querySelector('.section-filter');
const clrBlack = document.querySelector('#blackColor');
const clrGreen = document.querySelector('#greenColor');
const clrPurple = document.querySelector('#purpleColor');
const clrYellow = document.querySelector('#yellowColor');
const clrRestBtn = document.querySelector('#clr-reset-btn');

let products = [];

setupTest();

async function setupTest() {
  clearNode(containerEl);

  const productsList = await getProductsTest();
  const femaleJackets = productsList.filter((product) => {
    return product.gender === 'Female';
  });
  window.localStorage.setItem('Female Jackets', JSON.stringify(femaleJackets));
  window.localStorage.setItem('products', JSON.stringify(productsList));
  createProductsListEl(femaleJackets);
}

async function getProductsTest() {
  try {
    const response = await fetch(API_URL);
    const { data } = await response.json();

    return data;
  } catch (error) {
    console.error(ERROR_MESSAGE_DEFAULT, error?.message);
  }
}

function setup() {
  if (!containerEl || !sortByEl) {
    console.error('JS cannot run!!!');
  } else {
    getProducts();
  }
}

inputSearch.addEventListener('input', (event) => {
  jacketSection.scrollIntoView();
  const productsList = JSON.parse(localStorage.getItem('products'));

  const inputVal = event.target.value;
  const filteredProductsSearch = productsList.filter(({ title }) =>
    title.trim().toLowerCase().includes(inputVal.trim().toLowerCase())
  );

  createProductsListEl(filteredProductsSearch);
});

sortByEl.addEventListener('change', (event) => {
  const femaleJackets = JSON.parse(
    window.localStorage.getItem('Female Jackets')
  );

  const val = event.target.value;

  if (val === 'asc') {
    sortByPriceDescending(femaleJackets);
  } else if (val === 'desc') {
    sortByPriceAscending(femaleJackets);
  }

  createProductsListEl(femaleJackets);
});

const productsList = JSON.parse(localStorage.getItem('products'));
const femaleJackets = JSON.parse(window.localStorage.getItem('Female Jackets'));

window.localStorage.setItem('Female Jackets', JSON.stringify(femaleJackets));

clrBlack.addEventListener('click', () => {
  const femaleJackets = JSON.parse(
    window.localStorage.getItem('Female Jackets')
  );

  const blackProducts = femaleJackets.filter(
    (product) => product.baseColor === 'Black'
  );
  createProductsListEl(blackProducts);
});

clrGreen.addEventListener('click', () => {
  const femaleJackets = JSON.parse(
    window.localStorage.getItem('Female Jackets')
  );

  const greenProducts = femaleJackets.filter(
    (product) => product.baseColor === 'Green'
  );
  createProductsListEl(greenProducts);
});

clrPurple.addEventListener('click', () => {
  const femaleJackets = JSON.parse(
    window.localStorage.getItem('Female Jackets')
  );

  const purpleProducts = femaleJackets.filter(
    (product) => product.baseColor === 'Purple'
  );
  createProductsListEl(purpleProducts);
});

clrYellow.addEventListener('click', () => {
  const femaleJackets = JSON.parse(
    window.localStorage.getItem('Female Jackets')
  );

  const yellowProducts = femaleJackets.filter(
    (product) => product.baseColor === 'Yellow'
  );
  createProductsListEl(yellowProducts);
});

clrRestBtn.addEventListener('click', () => {
  const femaleJackets = JSON.parse(
    window.localStorage.getItem('Female Jackets')
  );

  createProductsListEl(femaleJackets);
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
    createProductsListEl(femaleJackets);
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
