//FUNCTION WITH HTML TO INJECT

const htmlInject = (categoryName) => {
	return `
      <div class="flex h-10 mb-8">  
        <div class="w-10/12">  
          <span class="pl-4">${categoryName}</span>
        </div>
        <div class="flex gap-6">
          <a href="editCategories.html" class="mr-4 is-size-7 edit-link"><img class="h-6" src="./assets/image/edit.svg" alt="Editar" /></a>
          <a href="#" class="is-size-7 delete-link"><img class="h-6" src="./assets/image/delete.svg" alt="Eliminar" /></a>
        </div>
      </div>
    `;
};

const valueLocalStorage = () => {
	if (localStorage.getItem("categories") !== null) {
		savedCategories = JSON.parse(localStorage.getItem("categories"));
	} else {
		const defaultCategoriesHTML = `
			<div id="newCategory" class="flex h-10 flex-row mb-8">
				<span class="pl-4 w-10/12">Comida</span>
				<div class="flex gap-8">
					<a href="editCategories.html"><img class="h-6" src="./assets/image/edit.svg" alt="Editar"/></a>
					<a href=""><img class="h-6" src="./assets/image/delete.svg" alt="Eliminar"/></a>
				</div>
			</div>

			<div id="newCategory" class="flex h-10 flex-row mb-8">
				<span class="pl-4 w-10/12">Alquiler</span>
				<div class="flex gap-8">
					<a href="editCategories.html"><img class="h-6" src="./assets/image/edit.svg" alt="Editar"/></a>
					<a href=""><img class="h-6" src="./assets/image/delete.svg" alt="Eliminar"/></a>
				</div>
			</div>
		`;

		// Insert the default HTML in the category container
		document.getElementById("categories").innerHTML = defaultCategoriesHTML;
	}

	// Generate HTML for saved categories (even if they are the default categories)
	savedCategories.forEach((categoryName) => {
		document
			.getElementById("categories")
			.insertAdjacentHTML("beforeend", htmlInject(categoryName));
	});
};

const addCategory = () => {
	const categoryName = document
		.getElementById("categoriesAdd__input")
		.value.trim();

	if (categoryName) {
		const htmlInjectTemplate = htmlInject(categoryName);

		document
			.getElementById("categories")
			.insertAdjacentHTML("beforeend", htmlInjectTemplate);

		// Save the category in localStorage after inserting it in the DOM
		savedCategories.push(categoryName);
		localStorage.setItem("categories", JSON.stringify(savedCategories));
	}
};

// LOAD IN THE LOCAL STORAGE THE NAME OF THE CATEGORY TO APPEAR IN THE EDIT SECTOR

const categoryName = document
	.getElementById("categoriesAdd__input")
	.value.trim();
localStorage.setItem("editedCategoryName", categoryName);

// FUNCTION TO CANCEL EDITING

document
	.getElementById("categoriesAdd__button")
	.addEventListener("click", addCategory);

valueLocalStorage();

// const backToCategoriesHtml = () => {
// 	window.location.href = "categories.html";
// };

function backToCategoriesHtml() {
	window.location.href = "categories.html";
}

//FUNCTION TO EDIT THE CATEGORY

//NO ANDA

const editCategory = () => {
	const newCategoryName = document
		.getElementById("categoriesEdit__input")
		.value.trim();
	if (newCategoryName) {
		window.location.href =
			"createCategory.html?editedCategoryName=" +
			encodeURIComponent(newCategoryName);
	} else {
		alert("Por favor, introduce un nombre de categoría válido.");
	}
};

const getQueryParam = (name) => {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	return urlParams.get(name);
};

//FUNCTION TO CLEAN THE LOCALSTORAGE
