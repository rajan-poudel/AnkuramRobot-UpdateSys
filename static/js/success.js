const mainBody = document.querySelector('main')
const formInput = document.querySelector('.form-input')
const submitBtn = document.querySelector('button')
const input = document.querySelector('.form-input').querySelector('input')
const imgContainer = document.getElementById('component-img')

const validateEmail = (email) => {
  const atSign = email.indexOf('@')
  const dotPos = email.lastIndexOf('.')

  if (atSign > 0 && dotPos > atSign + 1 && dotPos < email.length - 1) {
    mainBody.innerHTML = `<div id="success-container">
      <div class="success-icon">
        <img src="assets/images/icon-success.svg" alt="">
      </div>
      <div class="success-content">
        <h1>Thanks for subscribing!</h1>
        <p>A confirmation email has been sent to <span>${email}</span>.
        Please open it and click the button inside to confirm your subscription.</p>
      </div>
      <button>Dismiss message</button>
    </div>`
    email.value = ''
  } else {
    const errorMsg = document.createElement('p')
    errorMsg.innerText = 'Valid email required'
    errorMsg.style.color = 'hsl(4, 100%, 67%)'
    errorMsg.style.fontSize = 'smaller'
    errorMsg.style.fontWeight = 700
    formInput.appendChild(errorMsg)

    setTimeout(() => {
      errorMsg.remove()
    }, 2000)
    email.value = ''
  }
}

const returnToNewletter = () => {
  mainBody.innerHTML = `<div id="component-container">
      <div id="component-content">
        <h1>Stay updated!</h1>
        <p>Join 60,000+ product managers receiving monthly updates on:</p>
        <ul class="newsletter-points">
          <li>Product discovery and building what matters</li>
          <li>Measuring to ensure updates are a success</li>
          <li>And much more!</li>
        </ul>
        <div class="form-input">
          <label for="">Email Address</label>
          <input type="text" name="" id="" placeholder="email@company.com">
        </div>
        <button type="submit">Subscribe to monthly newsletter</button>
      </div>
      <div id="component-img">
        <img src="assets/images/illustration-sign-up-desktop.svg" alt="">
      </div>
    </div>`
}

submitBtn.addEventListener('click', () => {
  validateEmail(input.value)
})

dismissBtn.addEventListener('click', returnToNewletter)

if (window.innerWidth <= 430) {
  imgContainer
    .querySelector('img')
    .setAttribute('src', 'assets/images/illustration-sign-up-mobile.svg')
}