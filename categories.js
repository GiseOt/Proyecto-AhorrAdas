// Function to generate the HTML of a category
const htmlInject = (categoryName) => {
	return `
        <div class="flex h-10 mb-8">  
            <div class="w-10/12">  
                <span id="uuidv4()" class="pl-4">${categoryName}</span>
            </div>
            <div class="flex gap-6">
                <a href="editCategories.html" id="uuidv4()" class="mr-4 is-size-7 edit-link"><img class="h-6" src="./assets/image/edit.svg" alt="Editar" /></a>
                <a href="#" id="uuidv4()" class="is-size-7 delete-link"><img class="h-6" src="./assets/image/delete.svg" alt="Eliminar" /></a>
            </div>
        </div>
    `;
};

// Function to initialize categories from localStorage or set default categories if there is no data in localStorage
const initializeCategories = () => {
	let savedCategories = [];
	if (localStorage.getItem("categories") !== null) {
		savedCategories = JSON.parse(localStorage.getItem("categories"));
	} else {
		savedCategories = ["Comida", "Alquiler"]; // Default categories
		localStorage.setItem("categories", JSON.stringify(savedCategories));
	}
	return savedCategories;
};

// Function to load categories in the DOM
const loadCategories = (categories) => {
	const categoriesContainer = document.getElementById("categories");
	categoriesContainer.innerHTML = ""; // Clean the container before loading the categories

	categories.forEach((categoryName) => {
		const categoryHTML = htmlInject(categoryName);
		categoriesContainer.insertAdjacentHTML("beforeend", categoryHTML);
	});
};

// Function to add a new category
const addCategory = () => {
	const categoryNameInput = document.getElementById("categoriesAdd__input");
	const categoryName = categoryNameInput.value.trim();

	if (categoryName) {
		const savedCategories = initializeCategories();
		savedCategories.push(categoryName);
		localStorage.setItem("categories", JSON.stringify(savedCategories));

		loadCategories(savedCategories);
		categoryNameInput.value = ""; // Clear input field after adding category
	}
};

// Event listener for the add category button
document
	.getElementById("categoriesAdd__button")
	.addEventListener("click", addCategory);

// Function to load categories on page load
window.addEventListener("DOMContentLoaded", () => {
	const savedCategories = initializeCategories();
	loadCategories(savedCategories);
});

// Function to return to the category page
function backToCategoriesHtml() {
	window.location.href = "categories.html";
}
