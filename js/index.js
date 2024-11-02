import { menuArray } from './data.js'

const menuContainer = document.getElementById('menu')
const orderSummary = document.getElementById('order-summary')
const orderList = document.getElementById('order-list')
const orderBtn = document.getElementById('order-btn')
const paymentModal = document.getElementById('payment-modal')
const paymentForm = document.getElementById('payment-form')

// Array to store the current order items
const currentOrder = []


// Event to initialize the menu and set up listeners when the page loads
document.addEventListener('DOMContentLoaded', () => {
  renderMenu()

  menuContainer.addEventListener('click', handlePlusButton)
  orderBtn.addEventListener('click', openPaymentModal)
})


// Function that generates the menu HTML from `menuArray` and inserts it into the DOM
function renderMenu() {
  const menuHTML = menuArray.map(({ name, ingredients, id, price, emoji }) =>
    `<article class="menu-item">
        <span class="menu-item__emoji">${emoji}</span>
        <h2 class="menu-item__name">${name}</h2>
        <p class="menu-item__description">${ingredients}</p>
        <span class="menu-item__price">$${price}</span>
        <button type="button" class="add-btn" id="add-btn" data-order="${id}" aria-label="Add ${name} to Order">+</button>
      </article>`
  ).join('')

  menuContainer.innerHTML = menuHTML
}


// Handles the "+" button event to add an item to the order
function handlePlusButton(e) {
  // Gets the ID of the pressed button's item
  const addBtn = e.target.dataset.order
  if (addBtn) {
    const itemId = addBtn
    addItemToOrder(itemId)
  }

  // Shows the order summary if there are items in the order
  if (currentOrder.length > 0) {
    orderSummary.classList.remove('hidden')
  }
}


// Adds an item to the `currentOrder` array and updates the order display
function addItemToOrder(itemId) {
  const menuItem = menuArray.filter(item => item.id === itemId)[0]
  currentOrder.push(menuItem)
  generateOrder()
}


// Generates the order HTML and inserts it into the DOM, along with the total
function generateOrder() {
  const orderItemsHTML = currentOrder.map(({ name, price }) => {
    return `<li class="order__item">
            <p class="order__name">${name}</p>
            <button type="button" class="remove-btn">Remove</button>
            <p class="order__price">$${price}</p>
          </li>`
  }).join('')

  // Creates the total HTML and inserts it after the items
  const totalItem = calculateTotal()
  orderList.innerHTML = orderItemsHTML
  orderList.insertAdjacentHTML('beforeend', totalItem)

  // Sets up the "Remove" buttons for each item in the order
  const removeButtons = orderList.querySelectorAll('.remove-btn')
  removeButtons.forEach((button, index) => {
    button.addEventListener('click', () => removeItemsFromOrder(index))
  })
}


// Calculates the total for the current order and generates the HTML to display it
function calculateTotal() {
  const total = currentOrder.reduce((acc, curr) => acc + curr.price, 0)

  return `<li class="order__item order__item--total" id="order__total">
            <p class="order__name">Total price:</p>
            <p class="order__price">$${total}</p>
          </li>`
}


// Removes an item from the order and updates the order summary
function removeItemsFromOrder(index) {
  currentOrder.splice(index, 1)
  generateOrder()

  if (currentOrder.length === 0) {
    orderSummary.classList.add('hidden')
  }
}


// Opens the payment modal and sets up the listener for the payment form submission
function openPaymentModal() {
  paymentModal.showModal()
  paymentForm.addEventListener('submit', handlePaymentSubmit)
}


// Handles the payment form submission and displays a confirmation
function handlePaymentSubmit(e) {
  e.preventDefault()
  const paymentFormData = new FormData(paymentForm)
  const customerName = paymentFormData.get("name")
  paymentModal.close()
  showOrderConfirmation(customerName)
  resetPaymentForm()
  orderSummary.classList.add('hidden')
}


// Displays a confirmation message after successful payment
function showOrderConfirmation(customerName) {
  const confirmationHTML = document.createElement('SECTION')
  confirmationHTML.classList.add('confirmation')
  confirmationHTML.innerHTML = 
    `<p class="confirmation__message">Thanks, ${customerName}! Your order is on its way!</p>`
  
  menuContainer.appendChild(confirmationHTML)

  setTimeout(() => {
    confirmationHTML.remove()
    clearOrder()
  }, 3000);
}


// Clears the current order,empties the displayed order list, and hides the order summary
function clearOrder() {
  currentOrder.length = 0
  orderList.innerHTML = ``
  orderSummary.classList.add('hidden')
}


// Rsets the payment form fields
function resetPaymentForm() {
  paymentForm.reset()
}

