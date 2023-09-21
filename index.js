// Define constants for HTML elements
const search = document.getElementById("search");
const submit = document.getElementById("submit");
const mealEl = document.getElementById("meals");
const mealHeading = document.getElementById("mealHeading");
const suggestionsContainer = document.getElementById("suggestions");
const viewFavoritesButton = document.getElementById("viewFavorites");

// Initialize favorites array from local storage or create an empty array
const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// Function to search for meals
function searchMeal(e) {
  e.preventDefault();
  const searchInput = search.value.trim();
  if (searchInput) {
    fetchMeals(searchInput);
  }

  suggestionsContainer.innerHTML = ""; // Clear suggestions when Enter is pressed
}

// Function to fetch meals from the API
function fetchMeals(searchInput) {
  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchInput}`)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    })
    .then((data) => {
      displayMeals(data.meals);
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

// Function to display meals in the UI
function displayMeals(meals) {
  mealHeading.innerHTML = `<h2>Search result for "${search.value}"</h2>`;
  mealEl.innerHTML = meals
    .map(
      (meal) => `
      <div class="meal">
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <div class="meal-info" data-mealID="${meal.idMeal}">
          <h3>${meal.strMeal}</h3>
        </div>
        <button class="details">Details</button>
        <button class="favorites">${
          favorites.includes(meal.idMeal)
            ? "Remove from Favorites"
            : "Add to Favorites"
        }</button>
      </div>
    `
    )
    .join("");
}

// Function to handle the "Add to Favorites" button click
function toggleFavorite(mealID, buttonElement) {
  if (favorites.includes(mealID)) {
    // Remove the item from favorites
    const index = favorites.indexOf(mealID);
    favorites.splice(index, 1);
    buttonElement.textContent = "Add to Favorites";
    alert("Removed from favorites.");
  } else {
    // Add the item to favorites
    favorites.push(mealID);
    buttonElement.textContent = "Remove from Favorites";
    alert("Added to favorites.");
  }

  // Update local storage with the updated favorites array
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

// Event listeners
submit.addEventListener("submit", searchMeal);
search.addEventListener("input", debounce(suggest, 200));
mealEl.addEventListener("click", handleMealButtonClick);
viewFavoritesButton.addEventListener("click", viewFavorites);

// Function to handle meal button clicks (details and favorites)
function handleMealButtonClick(event) {
  const clickedElement = event.target;
  const mealInfo = clickedElement.parentElement.querySelector(".meal-info");
  const mealID = mealInfo.getAttribute("data-mealID");

  if (clickedElement.classList.contains("details")) {
    // Handle details button click
    window.location.href = `details.html?id=${mealID}`;
  } else if (clickedElement.classList.contains("favorites")) {
    // Handle favorites button click
    toggleFavorite(mealID, clickedElement);
  }
}

// Function to show favorites
function viewFavorites() {
  // Redirect to the favorites page
  window.location.href = "favorites.html";
}

// Debounce function
function debounce(func, delay) {
  let timeoutId;
  return function () {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, arguments);
    }, delay);
  };
}
// Add the suggest function to your code
function suggest() {
  const searchInput = search.value.trim();
  if (searchInput.length >= 2) {
    // Adjust the minimum length as needed
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchInput}`)
      .then((res) => res.json())
      .then((data) => {
        // Display search suggestions
        suggestionsContainer.innerHTML = "";
        if (data.meals !== null) {
          data.meals.forEach((meal) => {
            const suggestionItem = document.createElement("div");
            suggestionItem.classList.add("suggestion-item");
            suggestionItem.innerText = meal.strMeal;
            suggestionItem.addEventListener("click", () => {
              // When a suggestion is clicked, fill the search input and trigger a search
              search.value = meal.strMeal;
              fetchMeals(search.value); // Call fetchMeals to update search results
              suggestionsContainer.innerHTML = ""; // Clear suggestions
            });
            suggestionsContainer.appendChild(suggestionItem);
          });
        }
      });
  } else {
    suggestionsContainer.innerHTML = ""; // Clear suggestions if input is too short
  }
}
search.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault(); // Prevent the default form submission behavior
    searchMeal(e); // Call the searchMeal function when Enter is pressed
  }
});
