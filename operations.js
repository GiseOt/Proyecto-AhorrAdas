// Seleccionar elementos del Html (dom)
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
const PanelBalanceandFilter = document.getElementById("balance--filtro__panel"); //desaparece al hacer click
const PanelOperations = document.getElementById("section-operations"); //desaparece al hacer click

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

// Función para evaluar si hay operaciones guardadas en el localStorage
const evaluateLocalStorage = () => {
	if (localStorage.getItem("operations") !== null) {
		savedOperations = JSON.parse(localStorage.getItem("operations"));
	} else {
		localStorage.setItem("operations", JSON.stringify(savedOperations));
	}
	generateTable();
};

//*********************Edit Operation****ʕ•́ᴥ•̀ʔっ************************//

// Busca la operación que esta guardada en savedOperations //identifica mi operacion a traves del id
const findOperationById = (operationId) => {
	return savedOperations.find((op) => op.id === operationId);
};

/*/******************************************************************* */
const editEvent = () => {
	const editButtons = document.querySelectorAll(".edit-operation-link"); // Obtener todos los botones de edición (lapiz)

	editButtons.forEach((button) => {
		button.addEventListener("click", () => {
			const operationId = button.id.slice(5); // click en cada boton + id de la operación
			console.log("Este es mi ID:", operationId); //
			showModalEdit(operationId); //Activa mi modal al hacer click
		});
	});
};
//Función para guardar mi edición
const saveEditedOperation = (operationId) => {
	// Encuentra la operación correspondiente por su ID
	const operation = savedOperations.find((op) => op.id === operationId);
	if (operation) {
		// Actualiza la operación por la editada // mis input de edicion . value
		operation.description = descriptionEdit.value;
		operation.amount = rateEdit.value;
		operation.type = typeEdit.value;
		operation.category = categoryEdit.value;
		operation.date = convertDate(dateEdit.value);
		console.log("Operación editada guardada con éxito. ID:", operationId);

		// Guardar cambios en el almacenamiento local
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

//Muestro mi modal
const showModalEdit = (operationId) => {
	const editModal = document.getElementById("editModal");
	editModal.classList.add("block");
	editModal.classList.remove("hidden");
	PanelBalanceandFilter.classList.add("hidden");
	PanelOperations.classList.add("hidden");

	const operation = findOperationById(operationId);

	if (operation) {
		// Llena los campos de edición con los detalles de la operación
		descriptionEdit.value = operation.description;
		rateEdit.value = operation.amount;
		typeEdit.value = operation.type;
		categoryEdit.value = operation.category;
		dateEdit.value = convertDateBack(operation.date);
		

		// Botón de "Editar"
		const saveButton = document.getElementById("save-edited-operation-button");
		// Agregar un evento de clic al botón de guardar
		saveButton.dataset.operationId = operationId; // Agregamos el ID de la operación al botón de guardar
	} else {
		console.log("Operación no encontrada");
	}
};

// Evento de mi botón de editar
document
	.getElementById("save-edited-operation-button")
	.addEventListener("click", (e) => {
		e.preventDefault();
		// Obtener el ID de la operación
		const operationId = e.target.dataset.operationId;
		// Llamar a la función para guardar la operación editada
		saveEditedOperation(operationId);
		// Ocultar la modal después de guardar
		const editModal = document.getElementById("editModal");
		editModal.classList.add("hidden");
		// Mostrar los paneles de balance y filtro, y la tabla de operaciones
		PanelBalanceandFilter.classList.remove("hidden");
		PanelOperations.classList.remove("hidden");
		// Generar la tabla y mostrar las operaciones
		generateTable();
		displayOperations();
	});

// Botón de cerrar modal
const closeButtonModal = document.getElementById("close-modal-edit");
closeButtonModal.addEventListener("click", () => {
	const editModal = document.getElementById("editModal");
	editModal.classList.add("hidden"); // Ocultar la modal
	// Mostrar los paneles de balance y filtro, y la tabla de operaciones
	PanelBalanceandFilter.classList.remove("hidden");
	PanelOperations.classList.remove("hidden");
	// Generar la tabla y mostrar las operaciones
	generateTable();
	displayOperations();
});

//*********************Remove Operation* *******ʕ•́ᴥ•̀ʔっ**************//

const deleteEvent = () => {
	const deleteButtons = document.querySelectorAll(".delete-operation");

	deleteButtons.forEach((button) => {
		button.addEventListener("click", () => {
			const operationIdDelete = button.id.slice(7);
			console.log("soy el id DELETE", operationIdDelete);
			showModalDelete(operationIdDelete); // Llamar a la función showModalDelete con el ID de la operación a eliminar
		});
	});
};

// () Muestra la modal de eliminación con el ID de la operación a eliminar
const showModalDelete = (operationIdDelete) => {
	const deleteModal = document.getElementById("delete-modal-confirmation");
	deleteModal.classList.add("block");
	deleteModal.classList.remove("hidden");

	const cancelButton = document.getElementById("cancel-Button");
	const deleteButton = document.getElementById("delete-Button");

	// Agregar event listener al botón "Cancelar"
	cancelButton.addEventListener("click", () => {
		deleteModal.classList.remove("block");
		deleteModal.classList.add("hidden");
	});

	// Agregar event listener al botón "Eliminar"
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

// Genero la tabla
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

// llamo a mi función para evaluar el localStorage
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

// Ocultar o mostrar la tabla de operaciones según  operaciones guardadas
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

// Llamar a displayOperations al cargar el DOM
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

//Botones
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
		// Limpiar los campos de entrada
		description.value = "";
		amount.value = "";
		type.value = "";
		category.value = "";
		date.value = "";

		// Mostrar la sección de nueva operación
		divNewOperation.classList.remove("hidden");
		PanelBalanceandFilter.classList.add("hidden");
		PanelOperations.classList.add("hidden");
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
		filteredOperations = savedOperations; // Mostrar todas las operaciones sin filtrar
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
	// Fecha parseada
	const formattedDate = convertDate(selectedDate);

	// Hasta la más reciente
	const filteredDate = savedOperations.filter(
		(operacion) => operacion.date >= formattedDate
	);

	generateTable(filteredDate);
};

inputDate.addEventListener("change", (e) => {
	filterDateFrom(e.target.value);
});
