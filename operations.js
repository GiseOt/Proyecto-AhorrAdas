const description = document.getElementById("new__description");
const amount = document.getElementById("new__rate");
const type = document.getElementById("new__type");
const category = document.getElementById("new__categorie");
const date = document.getElementById("new__date");

//************************* Local Storage ********************************************************** */
let savedOperations = JSON.parse(localStorage.getItem("operations")) || [];

const evaluateLocalStorage = () => {
	if (localStorage.getItem("operations") !== null) {
		savedOperations = JSON.parse(localStorage.getItem("operations"));
	} else {
		localStorage.setItem("operations", JSON.stringify(savedOperations));
	}
	generateTable();
};

//*********************** Generate Operations Table ******************* */
const generateTable = () => {
	const operationsTable = document.getElementById("operations");
	if (!operationsTable) return;
	operationsTable.innerHTML = "";
	if (savedOperations.length > 0) {
		for (let operation of savedOperations) {
			const amountType =
				operation.type === "Ganancia" ? "text-green-400" : "text-red-400";
			const amountSign = operation.type === "Ganancia" ? "+$" : "-$";

			operationsTable.innerHTML += `
<div class="flex justify-around pb-3">
    <div class="mt-9 min-w-[150px]"><span>${operation.description}</span></div>
    <div class="mt-9 min-w-[100px]"><span>${operation.category}</span></div>
    <div class="mt-9 min-w-[100px]"><span>${operation.date}</span></div>
    <div class="mt-9 ${amountType} min-w-[100px]"><span>${amountSign}${operation.amount}</span></div>

    <div class="mt-9 flex gap-6">
        <button><img src="./assets/image/edit.svg" alt="Piggy bank icon" class="h-6 edit-operation-link"/></button>
        <button><img src="./assets/image/delete.svg" alt="delete" class="h-6 delete-operation"/></button> 
    </div>
</div>
`;
		}
	}
};

generateTable();
evaluateLocalStorage();

//************************ Button to Add Table ************** */
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

document.addEventListener("DOMContentLoaded", function () {
	evaluateLocalStorage();
});

// ************************Hidden Operations / Image************* //

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

// Llama a displayOperations al cargar el DOM porque si no aparece la class vacia
document.addEventListener("DOMContentLoaded", function () {
	displayOperations();
});
