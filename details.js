document.addEventListener("DOMContentLoaded", () => {
  // Get the meal ID from the URL (You can use URLSearchParams or any other method)
  const urlParams = new URLSearchParams(window.location.search);
  const mealID = urlParams.get("id");

  // Fetch meal details based on the mealID
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then((res) => res.json())
    .then((data) => {
      const mealDetails = data.meals[0]; // Assuming only one meal is returned

      // Display meal details on the details page
      const container = document.querySelector(".container");
      const mealTitle = document.querySelector(".menuDetail");
      const mealImg = document.querySelector(".innerImg");
      const mealContent = document.querySelector(".contentLeft");
      const mealHeading = document.querySelector(".mealHeading");
      const Instructions = document.querySelector(".Instructions");

      console.log(mealDetails);
      mealImg.src = `${mealDetails.strMealThumb}`;
      mealHeading.innerHTML = `<h1>${mealDetails.strMeal}</h1>`;
      Instructions.textContent = `${mealDetails.strInstructions}`;
      // mealTitle.textContent = `${mealDetails.strMeal}`;
      // container.appendChild(mealTitle);

      // Add more elements to display other details like ingredients, instructions, etc.
      const ingredients = document.querySelector(".ingredients");
      const ingredientList = document.getElementById("ingredient-list");
      const measureList = document.getElementById("measure-list");
      const ingredientsArr = [];
      const measuresArr = [];
      for (let i = 1; i <= 20; i++) {
        const ingredient = mealDetails[`strIngredient${i}`];
        const measure = mealDetails[`strMeasure${i}`];

        // Check if both ingredient and measure exist
        if (ingredient && measure) {
          const ingredientItem = document.createElement("div");
          ingredientItem.className = "ingredient-item";
          ingredientItem.textContent = ingredient;

          const measureItem = document.createElement("div");
          measureItem.className = "measure-item";
          measureItem.textContent = measure;

          ingredientList.appendChild(ingredientItem);
          measureList.appendChild(measureItem);
        }
      }
      console.log(ingredientsArr + " " + measuresArr);

      // const ul = document.createElement("ul");
      // // Add each pair as a list item
      // ingredientsArr.forEach((pair) => {
      //   const li = document.createElement("li");
      //   li.textContent = pair;
      //   ul.appendChild(li);
      // });
      // ingredients.appendChild(ul);
    });
});
