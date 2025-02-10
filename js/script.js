document.addEventListener('DOMContentLoaded', () => {
  const shoppingCard = document.querySelector('.shopping-card')
  const shoppingCardNumber = document.querySelector('#shoppping-card-number')
  const shoppingCardOverlay = document.querySelector('.shopping-card-overlay')
  const addToCard = document.querySelector('#add-to-card-2')

  shoppingCardNumber.addEventListener('click', () => {
    shoppingCard.classList.add('open')
  })
  shoppingCardNumber.addEventListener('click', () => {
    shoppingCardOverlay.classList.add('open')
  })
  shoppingCardOverlay.addEventListener('click', () => {
    shoppingCard.classList.remove('open')
    shoppingCardOverlay.classList.remove('open')
  })
  addToCard.addEventListener('click', () => {
    shoppingCardNumber.classList.add('add-number')
  })
})
