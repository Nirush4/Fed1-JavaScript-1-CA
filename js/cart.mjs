const productSection = document.querySelector("#js-products-section");
const cartIcon = document.querySelector("#js-cart-icon");
const shoppingCartEl = document.querySelector("#js-shopping-cart");
const closeCartBtn = document.querySelector("#js-close-cart");
const productsList = JSON.parse(localStorage.getItem("products"));
const cartProductList = document.querySelector("#js-cart-product-list");
const displayTotalPrice = document.querySelector("#js-total-price");

let cart = [];

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
  addToCartHTML(cart);
});

function addToCart(productId) {
  let itemPositionInCart = cart.findIndex(
    (value) => value.productId == productId
  );

  if (itemPositionInCart === -1) {
    // If item is not in cart, add it
    cart.push({
      productId: productId,
      quantity: 1,
    });
  } else {
    // If item exists, increase its quantity
    cart[itemPositionInCart].quantity += 1;
  }
  window.localStorage.setItem("Cart", JSON.stringify(cart));
}

function calcTotal() {
  const newTotal = cart.reduce((total, cartItem) => {
    let jacket = productsList.find((jacket) => jacket.id == cartItem.productId);
    return total + jacket.price * cartItem.quantity;
  }, 0);
  return newTotal;
}

const addToCartHTML = () => {
  cartProductList.innerHTML = "";
  if (cart.length > 0) {
    cart.forEach((jacket) => {
      let newCart = document.createElement("div");
      newCart.classList.add("shopping-card-col-1");
      newCart.dataset.id = jacket.productId;

      let positionProduct = productsList.findIndex(
        (value) => value.id == jacket.productId
      );

      let info = productsList[positionProduct];
      const totalPrice = info.price * jacket.quantity; //

      newCart.innerHTML = `
          <div class="shopping-card-img-div">
                                    <img src="${
                                      info.image.url
                                    }" alt="A man with a jacket">
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
        break;

      default:
        let valueChange = cart[itemPositionInCart].quantity - 1;
        if (valueChange > 0) {
          cart[itemPositionInCart].quantity = valueChange;
        } else {
          cart.splice(itemPositionInCart, 1);
        }
        break;
    }
  }
  addToCartHTML();
}
