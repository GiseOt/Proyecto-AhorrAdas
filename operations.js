// Selecting Html elements (dom)
const description = document.getElementById("new__description");
const amount = document.getElementById("new__rate");
const type = document.getElementById("new__type");
const category = document.getElementById("new__categorie");
const date = document.getElementById("new__date");
const typeVale = document.getElementById("new__type");
const expenses = document.getElementById("balance-expenses");
const earnings = document.getElementById("balance-earnings");
const balanceTotal = document.getElementById("balance-total");
const divNewOperation = document.getElementById("createOperation");
const PanelBalanceandFilter = document.getElementById("balance--filtro__panel"); //disappears when clicked
const PanelOperations = document.getElementById("section-operations"); //disappears when clicked

/****************************** Date ****************************************** */

const convertDate = (date) => {
	let rawDate = date.replaceAll("-", "/");
	let dateArray = rawDate.split("/");

	let newdate = dateArray[2] + "/" + dateArray[1] + "/" + dateArray[0];
	return newdate;
};

//************************* Unformat Date************************ */
const convertDateBack = (date) => {
	let dateArray = date.split("/");
	let newDate = dateArray[2] + "-" + dateArray[1] + "-" + dateArray[0];
	return newDate;
};

//************************* Local Storage ********************************************************** */

let savedOperations = JSON.parse(localStorage.getItem("operations")) || [];

// Function to evaluate if there are operations saved in the localStorage
const evaluateLocalStorage = () => {
	if (localStorage.getItem("operations") !== null) {
		savedOperations = JSON.parse(localStorage.getItem("operations"));
	} else {
		localStorage.setItem("operations", JSON.stringify(savedOperations));
	}
	generateTable();
};

//*********************Edit Operation****ʕ•́ᴥ•̀ʔっ************************//

// Finds the operation saved in savedOperations //identifies my operation through the id
const findOperationById = (operationId) => {
	return savedOperations.find((op) => op.id === operationId);
};

/*/******************************************************************* */
const editEvent = () => {
	const editButtons = document.querySelectorAll(".edit-operation-link"); // / Get all edit buttons (pencil)

	editButtons.forEach((button) => {
		button.addEventListener("click", () => {
			const operationId = button.id.slice(5); // click on each button + operation id
			console.log("Este es mi ID:", operationId); //
			showModalEdit(operationId); //Activates my modal on click
		});
	});
};
// Function to save my edition
const saveEditedOperation = (operationId) => {
	// Finds the corresponding operation by its ID
	const operation = savedOperations.find((op) => op.id === operationId);
	if (operation) {
		// Update the operation with the edited one // my edition inputs . value
		operation.description = descriptionEdit.value;
		operation.amount = rateEdit.value;
		operation.type = typeEdit.value;
		operation.category = categoryEdit.value;
		operation.date = convertDate(dateEdit.value);

		// Save changes to Local Storage
		localStorage.setItem("operations", JSON.stringify(savedOperations));
		generateTable();
		displayOperations();
		calculateBalance();
	} else {
		console.log("No encontré tu operación para editar");
	}
};

const descriptionEdit = document.getElementById("new__description--edit");
const rateEdit = document.getElementById("new__rate--edit");
const typeEdit = document.getElementById("new__type--edit");
const categoryEdit = document.getElementById("new__categorie--edit");
const dateEdit = document.getElementById("new__date--edit");

//Show my modal
const showModalEdit = (operationId) => {
	const editModal = document.getElementById("editModal");
	editModal.classList.add("block");
	editModal.classList.remove("hidden");
	PanelBalanceandFilter.classList.add("hidden");
	PanelOperations.classList.add("hidden");

	const operation = findOperationById(operationId);

	if (operation) {
		//  Fill edit fields with operation details
		descriptionEdit.value = operation.description;
		rateEdit.value = operation.amount;
		typeEdit.value = operation.type;
		categoryEdit.value = operation.category;
		dateEdit.value = convertDateBack(operation.date);

		// Edit button
		const saveButton = document.getElementById("save-edited-operation-button");
		// Add click event to save button
		saveButton.dataset.operationId = operationId; //// Add operation ID to save button
	} else {
		console.log("Operación no encontrada");
	}
};

// Edit button event
document
	.getElementById("save-edited-operation-button")
	.addEventListener("click", (e) => {
		e.preventDefault();
		// Get operation ID
		const operationId = e.target.dataset.operationId;
		// Call function to save edited operation
		saveEditedOperation(operationId);
		// Hide modal after saving
		const editModal = document.getElementById("editModal");
		editModal.classList.add("hidden");
		//Show balance and filter panels, and operations table
		PanelBalanceandFilter.classList.remove("hidden");
		PanelOperations.classList.remove("hidden");
		// //Show balance and filter panels, and operations table
		generateTable();
		displayOperations();
	});

// Close modal button
const closeButtonModal = document.getElementById("close-modal-edit");
closeButtonModal.addEventListener("click", () => {
	const editModal = document.getElementById("editModal");
	editModal.classList.add("hidden"); // Hide modal
	// //Show balance and filter panels, and operations table
	PanelBalanceandFilter.classList.remove("hidden");
	PanelOperations.classList.remove("hidden");
	// //Show balance and filter panels, and operations table
	generateTable();
	displayOperations();
});

//*********************Remove Operation* *******ʕ•́ᴥ•̀ʔっ**************//

const deleteEvent = () => {
	const deleteButtons = document.querySelectorAll(".delete-operation");

	deleteButtons.forEach((button) => {
		button.addEventListener("click", () => {
			const operationIdDelete = button.id.slice(7);
			showModalDelete(operationIdDelete); // Call showModalDelete function with the ID of the operation to delete
		});
	});
};

// () Shows delete modal with ID of the operation to delete
const showModalDelete = (operationIdDelete) => {
	const deleteModal = document.getElementById("delete-modal-confirmation");
	deleteModal.classList.add("block");
	deleteModal.classList.remove("hidden");

	const cancelButton = document.getElementById("cancel-Button");
	const deleteButton = document.getElementById("delete-Button");

	// // Add event listener to "Cancel" button
	cancelButton.addEventListener("click", () => {
		deleteModal.classList.remove("block");
		deleteModal.classList.add("hidden");
	});

	// // Add event listener to "Delete" button
	deleteButton.addEventListener("click", () => {
		savedOperations = savedOperations.filter(
			(operation) => operation.id !== operationIdDelete
		);
		localStorage.setItem("operations", JSON.stringify(savedOperations));
		generateTable();
		deleteModal.classList.remove("block");
		deleteModal.classList.add("hidden");
		displayOperations();
		calculateBalance();
	});
};

/*********************** Generate Operations Table ******************* */

// Generate the table
const generateTable = (operations = savedOperations) => {
	const operationsTable = document.getElementById("operations");
	if (!operationsTable) return;
	operationsTable.innerHTML = "";
	if (operations.length > 0) {
		for (let operation of operations) {
			const amountType =
				operation.type === "Ganancia" ? "text-green-600" : "text-red-600";
			const amountSign = operation.type == "Ganancia" ? "+$" : "-$";
			operationsTable.innerHTML += `
<div class="flex justify-around pb-3 text-center items-center">
    <div class="mt-9 w-1/5 md:w-auto md:min-w-[150px] overflow-auto text-base md:text-xl"><span>${operation.description}</span></div>
    <div class="mt-9 md:min-w-[100px] bg-orange-100 text-orange-400 rounded-lg text-base md:text-xl"><span>${operation.category}</span></div>
    <div class="mt-9 md:min-w-[100px] hidden md:block text-base md:text-xl"><span>${operation.date}</span></div>
    <div class="mt-9 ${amountType} md:min-w-[100px] text-base md:text-xl"><span>${amountSign}${operation.amount}</span></div>
    <div class="mt-9 flex gap-2 md:gap-6">
        <button class="edit-operation-link" id="edit-${operation.id}"><img src="./assets/image/edit.svg" alt="Piggy bank icon" class="h-6"/></button>
        <button class="delete-operation" id="delete-${operation.id}"><img src="./assets/image/delete.svg" alt="delete" class="h-6"/></button> 
    </div>
</div>
`;
		}
	}

	deleteEvent();
	editEvent();
};

// Call my function to evaluate Local Storage
evaluateLocalStorage();

/************************ Button to Add Table ***********************/

const addButton = document.getElementById("add-operation");
if (addButton) {
	addButton.addEventListener("click", () => {
		const newOperation = {
			id: uuidv4(),
			description: description.value,
			category: category.value,
			date: convertDate(date.value),
			amount: amount.value,
			type: type.value,
		};
		savedOperations.push(newOperation);
		localStorage.setItem("operations", JSON.stringify(savedOperations));
		generateTable();
		//actualizarBalance();
	});
}

// ************************Hidden Operations/Image*****************/

// Hide or show operations table based on saved operations
const displayOperations = () => {
	const operationsElement = document.getElementById("operations");
	const divOpsElement = document.getElementById("div-ops");
	const withoutOperationsElement =
		document.getElementById("without-operations");

	if (savedOperations.length === 0) {
		operationsElement?.classList.add("hidden");
		divOpsElement?.classList.add("hidden");
		withoutOperationsElement?.classList.remove("hidden");
	} else {
		operationsElement?.classList.remove("hidden");
		divOpsElement?.classList.remove("hidden");
		withoutOperationsElement?.classList.add("hidden");
	}
};

// Call displayOperations when DOM loaded
document.addEventListener("DOMContentLoaded", displayOperations);

/*********************** Section Balance******************* */

const calculateBalance = () => {
	let accumulatedEarnings = 0;
	let accumulatedExpenses = 0;

	accumulatedEarnings = savedOperations.reduce((total, { amount, type }) => {
		if (type === "Ganancia") {
			return total + parseInt(amount);
		} else {
			return total;
		}
	}, accumulatedEarnings);

	accumulatedExpenses = savedOperations.reduce((total, { amount, type }) => {
		if (type === "Gasto") {
			return total + parseInt(amount);
		} else {
			return total;
		}
	}, accumulatedExpenses);

	let resultBalance = accumulatedEarnings - accumulatedExpenses;

	earnings.innerText = accumulatedEarnings;
	expenses.innerText = accumulatedExpenses;
	balanceTotal.innerText = resultBalance;
};

calculateBalance();

/********************************Show New Operation**************************** */

//Buttons
const btnOpenNewOperation = document.getElementById("newOperation--link");
const btnCloseNewOperation = document.getElementById("newOperation-hidden");
const cancelNewOperation = document.getElementById("cancelnweOperation");

document.addEventListener("DOMContentLoaded", function () {
	const divNewOperation = document.getElementById("createOperation");
	const PanelBalanceandFilter = document.getElementById(
		"balance--filtro__panel"
	);
	const PanelOperations = document.getElementById("section-operations");
	const btnOpenNewOperation = document.getElementById("newOperation--link");
	const btnCloseNewOperation = document.getElementById("newOperation-hidden");
	//const cancelNewOperation = document.getElementById("cancelnweOperation");

	const showNewOperation = () => {
		// Clear input fields
		description.value = "";
		amount.value = "";
		type.value = "";
		category.value = "";
		date.value = "";

		// Show new operation section
		divNewOperation.classList.remove("hidden");
		PanelBalanceandFilter.classList.add("hidden");
		PanelOperations.classList.add("hidden");

		updateCategories();
	};

	btnOpenNewOperation.addEventListener("click", showNewOperation);

	const hideNewOperation = () => {
		divNewOperation.classList.add("hidden");
		PanelBalanceandFilter.classList.remove("hidden");
		PanelOperations.classList.remove("hidden");
	};

	const openCategoriesBtn = document.getElementById("openCategories");
	const openReportsBtn = document.getElementById("openReports");

	openCategoriesBtn.addEventListener("click", () => {
		hideNewOperation();
	});

	openReportsBtn.addEventListener("click", () => {
		hideNewOperation();
	});

	btnCloseNewOperation.addEventListener("click", hideNewOperation);
});
/********************* Section Filter***************************** */

/**Filter by Type**/
const selectedType = document.getElementById("filterType");

const filterType = (operationType) => {
	let filteredOperations;

	if (operationType === "Todos") {
		filteredOperations = savedOperations; // Show all operations unfiltered
	} else {
		filteredOperations = savedOperations.filter(
			(operacion) => operacion.type === operationType
		);
	}

	generateTable(filteredOperations);
};

selectedType.addEventListener("change", (e) => {
	filterType(e.target.value);
});

/** Filtered Date **/

const inputDate = document.getElementById("InputDate");

const filterDateFrom = (selectedDate) => {
	// Parsed date
	const formattedDate = convertDate(selectedDate);

	// Up to the most recent
	const filteredDate = savedOperations.filter(
		(operacion) => operacion.date >= formattedDate
	);

	generateTable(filteredDate);
};

inputDate.addEventListener("change", (e) => {
	filterDateFrom(e.target.value);
});
