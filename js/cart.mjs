const productSection = document.querySelector("#js-products-section");
const cartIcon = document.querySelector("#js-cart-icon");
const shoppingCartEl = document.querySelector("#js-shopping-cart");
const closeCartBtn = document.querySelector("#js-close-cart");
const productsList = JSON.parse(localStorage.getItem("products")) || [];
const limitedSaleProducts =
  JSON.parse(localStorage.getItem("productsOnSale")) || [];
const cartProductList = document.querySelector("#js-cart-product-list");
const displayTotalPrice = document.querySelector("#js-total-price");
const cartIconSpan = document.querySelector("#js-icon-cart-span");

let cart = [];

function setCartItemToLocalStorage() {
  window.localStorage.setItem("Cart", JSON.stringify(cart));
}

cartIcon.addEventListener("click", () => {
  shoppingCartEl.classList.toggle("open");
});

closeCartBtn.addEventListener("click", () => {
  shoppingCartEl.classList.remove("open");
});

productSection.addEventListener("click", (event) => {
  let positionClick = event.target;
  if (positionClick.classList.contains("c-add-to-cart")) {
    let productId = positionClick.dataset.id;
    addToCart(productId);
  }
  addToCartHTML();
});

window.addEventListener("load", () => {
  let storedItem = window.localStorage.getItem("Cart", JSON.stringify(cart));
  if (storedItem) {
    cart = JSON.parse(storedItem);
  }
  addToCartHTML();
  debugger;
});

function addToCart(productId) {
  let itemPositionInCart = cart.findIndex(
    (value) => value.productId === productId
  );
  if (itemPositionInCart === -1) {
    cart.push({
      productId: productId,
      quantity: 1,
    });
  } else {
    cart[itemPositionInCart].quantity += 1;
  }
  setCartItemToLocalStorage();
}

function calcTotal() {
  const newTotal = cart.reduce((total, cartItem) => {
    let jacket = [...productsList, ...limitedSaleProducts].find(
      (jacket) => jacket.id === cartItem.productId
    );
    return total + jacket.price * cartItem.quantity;
  }, 0);
  return newTotal;
}

const addToCartHTML = () => {
  cartProductList.innerHTML = "";
  let totalQuantity = 0;
  if (cart.length > 0) {
    cart.forEach((jacket) => {
      totalQuantity += jacket.quantity;
      let newCart = document.createElement("div");
      newCart.classList.add("shopping-card-col-1");
      newCart.dataset.id = jacket.productId;
      let positionProduct = [...productsList, ...limitedSaleProducts].findIndex(
        (value) => value.id === jacket.productId
      );
      let info = [...productsList, ...limitedSaleProducts][positionProduct];
      const totalPrice = info.price * jacket.quantity; //
      newCart.innerHTML = `
          <div class="shopping-card-img-div">
            <img src="${info.image.url}" alt="A man with a jacket">
           </div>
           <div class="shopping-card-text-div">
              <h3>${info.title}</h3>
                <p>${totalPrice.toFixed(2)}</p>
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
    displayTotalPrice.innerHTML = calcTotal().toFixed(2) + " kr";
  } else {
    displayTotalPrice.innerHTML = "0 kr";
  }
  cartIconSpan.textContent = totalQuantity;
  if (totalQuantity > 0) {
    cartIconSpan.classList.remove("hidden");
  } else if (totalQuantity === 0) {
    cartIconSpan.classList.add("hidden");
  }
};

cartProductList.addEventListener("click", (event) => {
  let positionClick = event.target;
  if (positionClick.classList.contains("quantity-btn")) {
    let closestParentWithDataId = positionClick.closest("[data-id]");
    let productId = closestParentWithDataId.dataset.id;
    let type = "minus";
    if (positionClick.classList.contains("fa-plus")) {
      type = "plus";
    }
    changeQuantity(productId, type);
  }
  if (positionClick.classList.contains("fa-trash-can")) {
    let closestParentWithDataId = positionClick.closest("[data-id]");
    let productId = closestParentWithDataId.dataset.id;
    removeItem(productId);
  }
});

function removeItem(productId) {
  let itemPositionInCart = cart.findIndex(
    (value) => value.productId === productId
  );
  if (itemPositionInCart >= 0) {
    cart.splice(itemPositionInCart, 1);
    setCartItemToLocalStorage();
  }
  addToCartHTML();
}

function changeQuantity(productId, type) {
  let itemPositionInCart = cart.findIndex(
    (value) => value.productId === productId
  );
  if (itemPositionInCart >= 0) {
    switch (type) {
      case "plus":
        cart[itemPositionInCart].quantity += 1;
        setCartItemToLocalStorage();
        break;

      default:
        let valueChange = cart[itemPositionInCart].quantity - 1;
        if (valueChange > 0) {
          cart[itemPositionInCart].quantity = valueChange;
          setCartItemToLocalStorage();
        } else {
          cart.splice(itemPositionInCart, 1);
          setCartItemToLocalStorage();
        }
        break;
    }
  }
  addToCartHTML();
}

//// Section 2

const productSectionTwo = document.querySelector("#section-3");

productSectionTwo.addEventListener("click", (event) => {
  let positionClick = event.target;
  if (positionClick.classList.contains("c-add-to-cart-2")) {
    let productId = positionClick.dataset.id;
    addToCart(productId);
  }
  addToCartHTML();
});
