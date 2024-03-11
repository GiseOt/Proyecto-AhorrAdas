// Seleccionar elementos del Html (dom)
const description = document.getElementById("new__description");
const amount = document.getElementById("new__rate");
const type = document.getElementById("new__type");
const category = document.getElementById("new__categorie");
const date = document.getElementById("new__date");

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

//*****************ʕ•́ᴥ•̀ʔっ****Edit Operation* ʕ•́ᴥ•̀ʔっ*****************//

// Función para encontrar una operación por su ID en el array savedOperations
const findOperationById = (operationId) => {
	return savedOperations.find((op) => op.id === operationId);
};

/*/******************************************************************* */
const editEvent = () => {
	const editButtons = document.querySelectorAll(".edit-operation-link");

	editButtons.forEach((button) => {
		button.addEventListener("click", () => {
			const operationId = button.id.slice(5); // Obtener el ID de la operación desde el ID del botón
			console.log("Este es mi ID:", operationId); // Verificar que se obtenga el ID correctamente
			showModalEdit(operationId); // Llamar a la función showModalEdit con el ID de la operación
		});
	});
};
const saveEditedOperation = (operationId) => {
	// Encuentra la operación correspondiente por su ID
	const operation = savedOperations.find((op) => op.id === operationId);
	if (operation) {
		// Actualiza la operación en la lista
		operation.description = descriptionEdit.value;
		operation.amount = rateEdit.value;
		operation.type = typeEdit.value;
		operation.category = categoryEdit.value;
		operation.date = dateEdit.value;
		console.log("Operación editada guardada con éxito. ID:", operationId);

		// Guardar cambios en el almacenamiento local
		localStorage.setItem("operations", JSON.stringify(savedOperations));
	} else {
		console.log("No encontré tu operación para editar");
	}
};

// Función para mostrar la modal de edición con los detalles de la operación

const descriptionEdit = document.getElementById("new__description--edit");
const rateEdit = document.getElementById("new__rate--edit");
const typeEdit = document.getElementById("new__type--edit");
const categoryEdit = document.getElementById("new__categorie--edit");
const dateEdit = document.getElementById("new__date--edit");

const showModalEdit = (operationId) => {
	const editModal = document.getElementById("editModal");
	editModal.classList.add("block");
	editModal.classList.remove("hidden");

	const operation = findOperationById(operationId);

	if (operation) {
		// Llena los campos de edición con los detalles de la operación
		descriptionEdit.value = operation.description;
		rateEdit.value = operation.amount;
		typeEdit.value = operation.type;
		categoryEdit.value = operation.category;
		dateEdit.value = operation.date;

		// Botón de "Editar"
		const saveButton = document.getElementById("save-edited-operation-button");
		// Agregar un evento de clic al botón de guardar
		saveButton.addEventListener("click", (e) => {
			e.preventDefault();
			// Llamar a la función para guardar la operación editada
			saveEditedOperation(operationId);
			// Ocultar la modal después de guardar
			editModal.classList.add("hidden");
			// Volver a generar la tabla de operaciones
			generateTable();
		});

		// Botón de cerrar
		const closeButtonModal = document.getElementById("close-modal-edit");
		closeButtonModal.addEventListener("click", () => {
			editModal.classList.add("hidden"); // Ocultar la modal
		});
	} else {
		console.log("Operación no encontrada");
	}
};

//*****************ʕ•́ᴥ•̀ʔっ****Remove Operation* ʕ•́ᴥ•̀ʔっ*****************//

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

// Función para mostrar la modal de eliminación con el ID de la operación a eliminar
const showModalDelete = (operationIdDelete) => {
	const deleteModal = document.getElementById("delete-modal-confirmation");
	deleteModal.classList.add("block");
	deleteModal.classList.remove("hidden");

	const cancelButton = document.getElementById("cancelButton");
	const deleteButton = document.getElementById("deleteButton");

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
	});
};

/*********************** Generate Operations Table ******************* */

// Genero la tabla
const generateTable = () => {
	const operationsTable = document.getElementById("operations");
	if (!operationsTable) return;
	operationsTable.innerHTML = "";
	if (savedOperations.length > 0) {
		for (let operation of savedOperations) {
			const amountType =
				operation.type === "ganancia" ? "text-green-400" : "text-red-400";
			const amountSign = operation.type === "ganancia" ? "+$" : "-$";
			operationsTable.innerHTML += `
<div class="flex justify-around pb-3">
    <div class="mt-9 min-w-[150px]"><span>${operation.description}</span></div>
    <div class="mt-9 min-w-[100px]"><span>${operation.category}</span></div>
    <div class="mt-9 min-w-[100px]"><span>${operation.date}</span></div>
    <div class="mt-9 ${amountType} min-w-[100px]"><span>${amountSign}${operation.amount}</span></div>
    <div class="mt-9 flex gap-6">
        <button class="edit-operation-link" id="edit-${operation.id}"><img src="./assets/image/edit.svg" alt="Piggy bank icon"  class="h-6"/></button>
        <button class="delete-operation" id="delete-${operation.id}"><img src="./assets/image/delete.svg" alt="delete" class="h-6"/></button> 
    </div>
</div>
`;
		}
	}

	deleteEvent();
	editEvent();
};

// llamo a  la función para evaluar el localStorage
evaluateLocalStorage();

/************************ Button to Add Table ************** */

const addButton = document.getElementById("add-operation");
if (addButton) {
	addButton.addEventListener("click", () => {
		const newOperation = {
			id: uuidv4(),
			description: description.value,
			category: category.value,
			date: date.value,
			amount: amount.value,
		};
		savedOperations.push(newOperation);
		localStorage.setItem("operations", JSON.stringify(savedOperations));
		generateTable();
	});
}

// ************************Hidden Operations/Image************* //

// Ocultar o mostrar la tabla de operaciones según si hay operaciones guardadas
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
