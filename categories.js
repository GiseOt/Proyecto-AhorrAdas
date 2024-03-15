// Function to initialize categories from localStorage or set default categories if there is no data in localStorage
let savedCategories = JSON.parse(localStorage.getItem("categories")) || [];

//default array for when there is no data loaded in the local storage
const defaultCategories = [
	{
		id: uuidv4(),
		categoryName: "Comida",
	},
	{
		id: uuidv4(),
		categoryName: "Servicios",
	},
	{
		id: uuidv4(),
		categoryName: "Trabajo",
	},
	{
		id: uuidv4(),
		categoryName: "Educación",
	},
	{
		id: uuidv4(),
		categoryName: "Salidas",
	},
];

//function to initialize program categories
const initializeCategories = () => {
	if (localStorage.getItem("categories") !== null) {
		savedCategories = JSON.parse(localStorage.getItem("categories"));
	} else {
		savedCategories = defaultCategories;
		localStorage.setItem("categories", JSON.stringify(savedCategories));
	}
	return savedCategories;
};

// Function to load categories in the DOM
const loadCategories = (categories) => {
	const categoriesTable = document.getElementById("categories__body");
	categoriesTable.innerHTML = "";

	if (savedCategories.length > 0) {
		categories.forEach((category) => {
			const categoryHTML = categoriesHTML(category);
			categoriesTable.insertAdjacentHTML("beforeend", categoryHTML);
		});
	}
	editPencilBtn__event();
	deleteBinBtn__event();
};

// FUNCTION TO FIND A CATEGORY BY ITS ID

const findCategoryById = (categoryId) => {
	return savedCategories.find((cat) => cat.id === categoryId);
};

//-----------------------------------------------------------------------

// EDIT FUNCTION

//// save the changes made in the edit option
const saveEditCategory = (categoryId) => {
	const category = findCategoryById(categoryId);
	if (category) {
		category.categoryName = categoriesEdit__input.value;

		localStorage.setItem("categories", JSON.stringify(savedCategories));
		loadCategories(savedCategories);
	} else {
	}
};

// event click for edit button (pencil)
const editPencilBtn__event = () => {
	const editPencil__btn = document.querySelectorAll(".editIcon");

	editPencil__btn.forEach((btn) => {
		btn.addEventListener("click", () => {
			const categoryId = btn.id.slice(7);

			modalCategory__edit(categoryId);
		});
	});
};
// function to display modal
const modalCategory__edit = (categoryId) => {
	const categoriesEdit__box = document.getElementById("categoriesEdit__box");
	const categoriesAdd__box = document.getElementById("categoriesAdd__box");
	categoriesEdit__box.classList.remove("hidden");
	categoriesAdd__box.classList.add("hidden");
	const category = findCategoryById(categoryId);
	if (category) {
		categoriesEdit__input.value = category.categoryName;
		const editCategory__btn = document.getElementById("editCategory");
		editCategory__btn.addEventListener("click", (e) => {
			e.preventDefault();
			saveEditCategory(categoryId);
			categoriesEdit__box.classList.add("hidden");
			categoriesAdd__box.classList.remove("hidden");
		});

		const closeEditCategory__btn = document.getElementById(
			"closeEditCategory__btn"
		);
		closeEditCategory__btn.addEventListener("click", () => {
			categoriesEdit__box.classList.add("hidden");
			categoriesAdd__box.classList.remove("hidden");
		});
	} else {
	}
};

//-----------------------------------------------------------

// DELETE FUNCTION

// event click for delete button (bin)
const deleteBinBtn__event = () => {
	const deleteBin__btn = document.querySelectorAll(".deleteIcon");
	deleteBin__btn.forEach((btn) => {
		btn.addEventListener("click", () => {
			const categoryIdBin = btn.id.slice(9);
			showModalDelete__cat(categoryIdBin);
		});
	});
};

// Function for displaying the elimination mode
const showModalDelete__cat = (categoryIdBin) => {
	const deleteModal = document.getElementById("modalDelete__cat");
	deleteModal.classList.add("block");
	deleteModal.classList.remove("hidden");

	const cancelButton = document.getElementById("cancelButton");
	const deleteButton = document.getElementById("deleteButton");

	cancelButton.addEventListener("click", () => {
		deleteModal.classList.remove("block");
		deleteModal.classList.add("hidden");
	});

	deleteButton.addEventListener("click", () => {
		savedCategories = savedCategories.filter(
			(category) => category.id !== categoryIdBin
		);
		localStorage.setItem("categories", JSON.stringify(savedCategories));
		deleteModal.classList.remove("block");
		deleteModal.classList.add("hidden");
		loadCategories(savedCategories);
	});
};

//-------------------------------------------------------

//event click to button add
const addButton__cat = document.getElementById("categoriesAdd__button");
if (addButton__cat) {
	addButton__cat.addEventListener("click", () => {
		const categoryNameInput = document.getElementById("categoriesAdd__input");
		const categoryName = categoryNameInput.value.trim();

		if (categoryName) {
			const newCategory = {
				id: uuidv4(),
				categoryName: categoryName,
			};
			savedCategories.push(newCategory);
			localStorage.setItem("categories", JSON.stringify(savedCategories));
			loadCategories(savedCategories);
			categoryNameInput.value = "";
		}
	});
}
// Function to generate the HTML of a category

const categoriesHTML = () => {
	const categoriesTable = document.getElementById("categories__body");
	if (!categoriesTable) return;
	categoriesTable.innerHTML = "";

	if (savedCategories.length > 0) {
		for (let category of savedCategories) {
			categoriesTable.innerHTML += `
                <div class="flex h-10 mb-8">
                    <div class="w-10/12">
                        <span class="pl-4">${category.categoryName}</span>
                    </div>
                    <div class="flex gap-6">
                        <button type="button" id="editIc-${category.id}" class="editIcon"><img class="h-6" src="./assets/image/edit.svg" alt="Editar"/></button>
                        <button type="button" id="deleteIc-${category.id}" class="deleteIcon"><img class="h-6" src="./assets/image/delete.svg" alt="Eliminar"/></button>
                    </div>
                </div>      
            `;
		}
	}

	editPencilBtn__event();
	deleteBinBtn__event();
};

//-----------------------------------------------------------------

// Function to load categories on page load
window.addEventListener("DOMContentLoaded", () => {
	const savedCategories = initializeCategories();
	loadCategories(savedCategories);
});
