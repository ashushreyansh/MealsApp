// Assuming you have a function to fetch meal details by ID, similar to your fetchMealDetails function
function fetchMealDetails(mealID) {
  return fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // Return the meal details
      return data.meals[0];
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

// Assuming you have a function to create HTML elements for favorite items, similar to your createFavoriteItemElement function
function createFavoriteItemElement(mealDetails) {
  const favoriteItem = document.createElement("li");
  favoriteItem.classList.add("favorite-item");

  // Create HTML structure for displaying meal details, e.g., name and image
  favoriteItem.innerHTML = `
    <h3>${mealDetails.strMeal}</h3>
    <img src="${mealDetails.strMealThumb}" alt="${mealDetails.strMeal}" />
    <button class="remove-favorite">Remove from Favorites</button>
  `;
  const removeButton = favoriteItem.querySelector(".remove-favorite");
  removeButton.addEventListener("click", () => {
    // Get the meal's ID
    const mealID = mealDetails.idMeal;

    // Remove the meal's ID from the favorites array in local storage
    const favoritesData = JSON.parse(localStorage.getItem("favorites")) || [];
    const updatedFavorites = favoritesData.filter((id) => id !== mealID);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));

    // Remove the favorite item from the UI
    favoriteItem.remove();
  });
  return favoriteItem;
}

document.addEventListener("DOMContentLoaded", () => {
  const favoritesList = document.getElementById("favorites-list");

  // Load favorites from local storage
  const favoritesData = JSON.parse(localStorage.getItem("favorites")) || [];

  // Render the favorites list
  favoritesData.forEach((mealID) => {
    // Fetch meal details using the mealID
    fetchMealDetails(mealID)
      .then((mealDetails) => {
        // Create HTML elements for the favorite item
        const favoriteItem = createFavoriteItemElement(mealDetails);

        // Append the favorite item to the favoritesList
        favoritesList.appendChild(favoriteItem);
      })
      .catch((error) => {
        console.error("Error fetching meal details:", error);
      });
  });
});
