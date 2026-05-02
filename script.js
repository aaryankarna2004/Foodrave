const verifyOverlay = document.getElementById("verifyOverlay");
const humanCheck = document.getElementById("humanCheck");
const captchaCode = document.getElementById("captchaCode");
const captchaInput = document.getElementById("captchaInput");
const refreshCaptcha = document.getElementById("refreshCaptcha");
const enterSite = document.getElementById("enterSite");
const verifyError = document.getElementById("verifyError");

const searchHotel = document.getElementById("searchHotel");
const filterRating = document.getElementById("filterRating");
const hotelCards = document.querySelectorAll(".hotel-card");

const starPicker = document.querySelectorAll("#starPicker span");
const reviewerName = document.getElementById("reviewerName");
const hotelName = document.getElementById("hotelName");
const reviewText = document.getElementById("reviewText");
const submitReview = document.getElementById("submitReview");
const reviewsList = document.getElementById("reviewsList");

let selectedRating = 0;

function generateCaptcha() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";

  for (let i = 0; i < 5; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }

  captchaCode.textContent = code;
}

refreshCaptcha.addEventListener("click", generateCaptcha);

enterSite.addEventListener("click", function () {
  const inputValue = captchaInput.value.trim().toUpperCase();
  const actualCode = captchaCode.textContent.trim().toUpperCase();

  if (!humanCheck.checked) {
    verifyError.textContent = "Please confirm that you are human.";
    return;
  }

  if (inputValue === "") {
    verifyError.textContent = "Please enter the security code.";
    return;
  }

  if (inputValue !== actualCode) {
    verifyError.textContent = "Incorrect code. Please try again.";
    generateCaptcha();
    captchaInput.value = "";
    return;
  }

  verifyError.textContent = "";
  verifyOverlay.style.display = "none";
});

function filterHotels() {
  const searchValue = searchHotel.value.toLowerCase();
  const ratingValue = filterRating.value;

  hotelCards.forEach(function (card) {
    const name = card.dataset.name.toLowerCase();
    const rating = parseInt(card.dataset.rating);

    const matchSearch = name.includes(searchValue);
    const matchRating = ratingValue === "all" || rating >= parseInt(ratingValue);

    if (matchSearch && matchRating) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

searchHotel.addEventListener("input", filterHotels);
filterRating.addEventListener("change", filterHotels);

starPicker.forEach(function (star) {
  star.addEventListener("click", function () {
    selectedRating = parseInt(this.dataset.value);

    starPicker.forEach(function (s) {
      if (parseInt(s.dataset.value) <= selectedRating) {
        s.classList.add("active");
      } else {
        s.classList.remove("active");
      }
    });
  });
});

function createStars(rating) {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

submitReview.addEventListener("click", function () {
  const name = reviewerName.value.trim();
  const hotel = hotelName.value.trim();
  const review = reviewText.value.trim();

  if (name === "" || hotel === "" || review === "" || selectedRating === 0) {
    alert("Please fill all fields and select a rating.");
    return;
  }

  const reviewCard = document.createElement("div");
  reviewCard.className = "review-card";

  const date = new Date().toLocaleDateString();

  reviewCard.innerHTML = `
    <div class="review-top">
      <div>
        <h4>${hotel}</h4>
        <div class="review-meta">Reviewed by ${name}</div>
      </div>
      <div>
        <div class="stars">${createStars(selectedRating)}</div>
        <div class="review-meta">${date}</div>
      </div>
    </div>
    <p class="review-text">${review}</p>
  `;

  if (reviewsList.querySelector(".empty-state")) {
    reviewsList.innerHTML = "";
  }

  reviewsList.prepend(reviewCard);

  reviewerName.value = "";
  hotelName.value = "";
  reviewText.value = "";
  selectedRating = 0;

  starPicker.forEach(function (s) {
    s.classList.remove("active");
  });
});

generateCaptcha();