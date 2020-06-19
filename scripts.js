const search = document.getElementById("search"),
submit = document.getElementById("submit"),
random = document.getElementById("random"),
mealsElement = document.getElementById("meals"),
resultHeading = document.getElementById("result-heading"),
single_mealElement = document.getElementById("single-meal");


//Fetch meal by ID

function getMealById(mealID){
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`).then(res => res.json()).then(data => {
        console.log(data);

        const meal = data.meals[0];

        addMealToDOM(meal);
    });
}


//fetch random meal
function getRandomMeal(){
    mealsElement.innerHTML = "";
    resultHeading.innerHTML = "";
    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`).then(res => res.json()).then( data => {
        const meal = data.meals[0];

        addMealToDOM(meal);
    });
}

function addMealToDOM(meal){
    const ingredients = [];

    for(let i = 1; i < 20; i++){
        if(meal[`strIngredient${i}`]){
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
        }else{
            break;
        }
    }

    single_mealElement.innerHTML = `
        <div class="single-meal">
            <h1>${meal.strMeal}</h1>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" >
            <div class="single-meal-info">
                ${meal.strCategory ? ` <p>${meal.strCategory} </p> ` : ''}
                ${meal.strArea ? ` <p>${meal.strArea} </p> ` : ''}
            </div>
            <div class="main">
                <p>${meal.strInstructions}</p>
                <h2>Ingredients</h2>
                <ul>
                    ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
                </ul>
            </div>
        </div>
    `
}

//fetch data from the API
function searchMeal(e){
    e.preventDefault();

    //Clear single meal
    single_mealElement.innerHTML = "";

    //get search term
    const term = search.value;
    if(term.trim()){
        fetch("https://www.themealdb.com/api/json/v1/1/search.php?s="+term).then(res => res.json()).then(data => {
            
        console.log(data)

        resultHeading.innerHTML = `<h2>Search Results for '${term}'</h2>`;

        if(data.meals === null){
            resultHeading.innerHTML = `<p> There are no search results. Try Again </p>`
        }else{
            mealsElement.innerHTML = data.meals.map(meal => `
            <div class="meal">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                <div class="meal-info" data-mealID=${meal.idMeal}>
                    <h3>${meal.strMeal}</h3>
                </div>
            </div>
            `)
            
            .join('');
            //custom html 5 attribute
        }
    
    });

    //Clear search text
    search.value = "";
    }else{
        alert("Please enter a value");
    }
}

//Event Listener
submit.addEventListener("submit",searchMeal);

random.addEventListener("click",getRandomMeal);

mealsElement.addEventListener("click", e => {
    const mealInfo = e.path.find(item =>{
        if(item.classList){
            return item.classList.contains("meal-info");
        }else{
            return false;
        }
    });

    if(mealInfo){
        const mealID = mealInfo.getAttribute("data-mealID");
        getMealById(mealID);
    }
});


