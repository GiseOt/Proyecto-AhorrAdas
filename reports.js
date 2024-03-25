const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// ----------------OBTENER DATOS DE LS ---------------

let operationsData = JSON.parse(localStorage.getItem("operations")) || [];
console.log(operationsData);
//operationsData contiene los datos almacenados en el localStorage bajo la clave "operations"

//----------------------REPORTS / NAV SECTION DESKTOP --------------------

//REVISAR QUE FUNCIONE CUANDO SE PISE CON EL DE TRI
document.addEventListener("DOMContentLoaded", function () {
	const openReportsBtn = document.getElementById("openReports");
	const panelBalanceandFilter = document.getElementById(
		"balance--filtro__panel"
	);
	const panelOperations = document.getElementById("section-operations");
	const containerReports = document.getElementById("btn-reports");

	const openCategoriesBtn = document.getElementById("openCategories");
	const containerCategories = document.getElementById("categoriesAdd__box");

	const showReports = () => {
		containerReports.classList.remove("hidden");
		panelBalanceandFilter.classList.add("hidden");
		panelOperations.classList.add("hidden");
		containerCategories.classList.add("hidden");
		emptyOperations();
	};

	const showCategories = () => {
		containerCategories.classList.remove("hidden");
		panelBalanceandFilter.classList.add("hidden");
		panelOperations.classList.add("hidden");
		containerReports.classList.add("hidden");
		emptyOperations();
	};

	openReportsBtn.addEventListener("click", showReports);
	openCategoriesBtn.addEventListener("click", showCategories);
});

//--------------FUNCIONES CUANDO NO HAY REPORTES Y CUANDO SI HAY --------

const showEmptyReports = () => {
	document.getElementById("tableReports").classList.add("hidden");
	document.getElementById("imageReports").classList.remove("hidden");
};

const showFullReports = () => {
	document.getElementById("tableReports").classList.remove("hidden");
	document.getElementById("imageReports").classList.add("hidden");
};

//-----FUNCION PARA OBTENER INFO DE OPERACIONES CON LS Y FUNCIONES PROXIMAS A UTILIZAR --
// DEBE QUEDAR EN 1? SI SOLO HAY UNA OPERACION NO SE MUESTRA EN REPORTES?
const emptyOperations = () => {
	const operationsData = JSON.parse(localStorage.getItem("operations")) || [];
	if (operationsData.length <= 1) {
		showEmptyReports();
	} else {
		showFullReports();
		reportsDateGenerateTable();
		generateReportsTable();
		reportsGenerateTable();
	}
};

//--------FUNCION DONDE SE GENERAN Y ACUMULAN OPERACIONES DE GASTO Y GANANCIA---------

const typeSpeOperations = () => {
	const spendingOperations = [];
	const operationsData = JSON.parse(localStorage.getItem("operations")) || [];

	for (const operation of operationsData) {
		if (operation.type === "Gasto") {
			spendingOperations.push(operation);
		}
	}
	return spendingOperations;
};

const typeEarOperations = () => {
	const earningsOperations = [];
	const operationsData = JSON.parse(localStorage.getItem("operations")) || [];

	for (const operation of operationsData) {
		if (operation.type === "Ganancia") {
			earningsOperations.push(operation);
		}
	}
	return earningsOperations;
};

// ---------------- FUNCION CATEGORIA CON MAYOR GANANCIA ------/

const biggerEarnings = () => {
	const operationsData = JSON.parse(localStorage.getItem("operations")) || [];
	const totalsByCategory = operationsData.reduce((acc, operation) => {
		const group = acc[operation.category] || {
			category: operation.category,
			spending: 0,
			gain: 0,
			balance: 0,
		};

		if (operation.type === "Gasto") {
			group.spending += parseInt(operation.amount);
		} else {
			group.gain += parseInt(operation.amount);
		}

		group.balance = group.gain - group.spending;

		acc[operation.category] = group;
		return acc;
	}, {});

	let maxCategory = null;
	let maxBalance = -Infinity;

	for (const category in totalsByCategory) {
		if (totalsByCategory[category].balance > maxBalance) {
			maxBalance = totalsByCategory[category].balance;
			maxCategory = category;
		}
	}

	return maxCategory;
};

console.log(biggerEarnings, "soy Mayores Ganancias");

const biggerEarningsAmount = (category) => {
	const operationsData = JSON.parse(localStorage.getItem("operations")) || [];
	const operationsInCategory = operationsData.filter(
		(operation) =>
			operation.category === category && operation.type === "Ganancia"
	);
	if (operationsInCategory.length === 0) {
		return 0; // Devolver 0 si no hay operaciones en la categoría
	}
	const maxAmount = Math.max(
		...operationsInCategory.map((operation) => parseInt(operation.amount))
	);
	return maxAmount;
};

// ----------------FUNCION CATEGORIA CON MAYOR GASTO--------------------/

const biggerSpent = () => {
	const operationsData = JSON.parse(localStorage.getItem("operations")) || [];
	const spendingOperations = operationsData.filter(
		(operation) => operation.type === "Gasto"
	);
	const spendingByCategory = {};
	for (const operation of spendingOperations) {
		if (!spendingByCategory[operation.category]) {
			spendingByCategory[operation.category] = 0;
		}
		spendingByCategory[operation.category] += parseInt(operation.amount);
	}

	let maxCategory = null;
	let maxAmount = -Infinity;
	for (const category in spendingByCategory) {
		if (spendingByCategory[category] > maxAmount) {
			maxAmount = spendingByCategory[category];
			maxCategory = category;
		}
	}

	return maxCategory !== null ? maxCategory : "Sin gastos";
};

const biggerSpentAmount = () => {
	const operationsData = JSON.parse(localStorage.getItem("operations")) || [];
	const spendingOperations = operationsData.filter(
		(operation) => operation.type === "Gasto"
	);
	if (spendingOperations.length === 0) {
		return 0;
	}
	const maxAmount = Math.max(
		...spendingOperations.map((operation) => parseInt(operation.amount))
	);
	return maxAmount;
};

//---------- MES CON MAYOR BALANCE Y FUNCION PARA NOMBRE DE CADA MES----------/
const monthNames = {
	1: "Enero",
	2: "Febrero",
	3: "Marzo",
	4: "Abril",
	5: "Mayo",
	6: "Junio",
	7: "Julio",
	8: "Agosto",
	9: "Septiembre",
	10: "Octubre",
	11: "Noviembre",
	12: "Diciembre",
};

const biggerBalance = () => {
	const operationsData = JSON.parse(localStorage.getItem("operations")) || [];

	const earningsOperations = operationsData.filter(
		(operation) => operation.type === "Ganancia"
	);

	if (earningsOperations.length === 0) {
		return [];
	}
	const maxBalance = Math.max(
		...earningsOperations.map((operation) => parseInt(operation.amount))
	);

	const operationsWithMaxBalance = earningsOperations.filter(
		(operation) => parseInt(operation.amount) === maxBalance
	);

	const categoriesWithMaxBalance = operationsWithMaxBalance.map(
		(operation) => operation.category
	);

	return categoriesWithMaxBalance;
};

const biggerBalanceAmount = () => {
	const operationsData = JSON.parse(localStorage.getItem("operations")) || [];

	const earningsOperations = operationsData.filter(
		(operation) => operation.type === "Ganancia"
	);

	if (earningsOperations.length === 0) {
		return 0;
	}

	const maxBalance = Math.max(
		...earningsOperations.map((operation) => parseInt(operation.amount))
	);

	return maxBalance;
};

// -------------- MES CON MAYOR GANANCIA  -----------------/

const biggerDate = () => {
	const operationsData = JSON.parse(localStorage.getItem("operations")) || [];

	const earningsOperations = operationsData.filter(
		(operation) => operation.type === "Ganancia"
	);

	if (earningsOperations.length === 0) {
		return null;
	}

	const totalByDate = earningsOperations.reduce((acc, operation) => {
		const date = operation.date;
		const amount = parseInt(operation.amount);

		if (acc[date]) {
			acc[date] += amount;
		} else {
			acc[date] = amount;
		}

		return acc;
	}, {});

	const maxDate = Object.keys(totalByDate).reduce((max, current) =>
		totalByDate[max] > totalByDate[current] ? max : current
	);

	const maxMonthNumber = parseInt(maxDate.split("/")[1]);
	const maxMonthName = monthNames[maxMonthNumber];

	return maxMonthName;
};

const biggerDateAmount = () => {
	const earningsOperations = typeEarOperations();
	if (earningsOperations.length === 0) {
		return 0;
	}
	const totalByDate = earningsOperations.reduce((acc, operation) => {
		const date = operation.date;
		const amount = parseInt(operation.amount);
		acc[date] = acc[date] ? Math.max(acc[date], amount) : amount;
		return acc;
	}, {});

	const maxAmount = Math.max(...Object.values(totalByDate));
	return maxAmount;
};

// //----------------MES CON MAYOR GASTO----------------/

const biggerDateSpending = () => {
	const spendingOperations = typeSpeOperations();
	if (spendingOperations.length === 0) {
		return "Sin gastos";
	}

	let maxMonth = null;
	let maxAmount = -Infinity;

	for (let i = 0; i < spendingOperations.length; i++) {
		const amount = parseInt(spendingOperations[i].amount);
		const date = spendingOperations[i].date;
		const monthNumber = parseInt(date.split("/")[1]);
		const monthName = monthNames[monthNumber];
		if (amount > maxAmount) {
			maxAmount = amount;
			maxMonth = monthName;
		}
	}

	return maxMonth;
};

const biggerDateSpendingAmount = () => {
	const spendingOperations = typeSpeOperations();
	if (spendingOperations.length === 0) {
		return 0;
	}

	const totalByDate = spendingOperations.reduce((acc, operation) => {
		const date = operation.date;
		const amount = parseInt(operation.amount);

		if (acc[date]) {
			acc[date] += amount;
		} else {
			acc[date] = amount;
		}

		return acc;
	}, {});

	const maxAmount = Math.max(...Object.values(totalByDate));
	return maxAmount;
};

//-------------------TABLA RESUMEN-----------------
const generateReportsTable = () => {
	const categoryWithMaxEarnings = biggerEarnings();
	const arrayEarningsAmountReport = biggerEarningsAmount(
		categoryWithMaxEarnings
	);
	const arraySpendingReports = biggerSpent();
	const arraySpendingsAmountReport = biggerSpentAmount();
	const arrayBalanceReports = biggerBalance();
	const arrayBalanceFilteredAmount = biggerBalanceAmount();
	const arrayDateReports = biggerDate();
	const arrayDateFilteredAmount = biggerDateAmount();
	const arrayDateSpeReports = biggerDateSpending();
	const arrayDateSpendingFilteredAmount = biggerDateSpendingAmount();

	const tableSummaryReports = document.getElementById("tableSummaryReports");

	// Convertir los arrays en cadenas o tomar solo el primer elemento si es necesario
	const balanceReportText = Array.isArray(arrayBalanceReports)
		? arrayBalanceReports.join(", ")
		: arrayBalanceReports;
	const dateReportText = Array.isArray(arrayDateReports)
		? arrayDateReports.join(", ")
		: arrayDateReports;

	tableSummaryReports.innerHTML = `
        <tr class="pt-20"> 
            <td class="textReports pt-7 md:pr-32">Categoria con mayor ganancia:</td>
            <td class="text-[#FB923C]  pt-7 rounded">${categoryWithMaxEarnings}</td>
            <td class="md:pl-32 number text-lg pt-7 text-green-600">+$${arrayEarningsAmountReport}</td>
        </tr>
        <tr > 
            <td class="textReports pt-7 md:pr-32">Categoria con mayor gasto:</td>
            <td class="text-[#FB923C] pt-7 rounded">${arraySpendingReports}</td>
            <td class="md:pl-32 number pt-7 text-lg text-red-600">-$${arraySpendingsAmountReport}</td>
        </tr>
        <tr class=""> 
            <td class="textReports pt-7 md:pr-32">Categoria con mayor balance:</td>
            <td class="text-[#FB923C] pt-7  rounded">${balanceReportText}</td>
            <td class="md:pl-32 number pt-7 text-lg text-green-600">-$${arrayBalanceFilteredAmount}</td>
        </tr>
        <tr class=""> 
            <td class="textReports pt-7  md:pr-32">Mes con mayor ganancia:</td>
            <td class="pt-7 text-[#FB923C]">${dateReportText}</td>
            <td class="md:pl-32 number pt-7 text-lg text-green-600">-$${arrayDateFilteredAmount}</td>
        </tr>
        <tr class=""> 
            <td class="textReports pt-7 md:pr-32">Mes con mayor gasto:</td>
            <td class="pt-7 text-[#FB923C]">${arrayDateSpeReports}</td>
            <td class="md:pl-32 pt-7 number text-lg text-red-600">-$${arrayDateSpendingFilteredAmount}</td>
        </tr>
   

`;
};
generateReportsTable();

//-------------------- TOTALES POR CATEGORIA-----------------

const totalsByCategory = () => {
	const operationsData = JSON.parse(localStorage.getItem("operations")) || [];

	const totales = operationsData.reduce((acc, operation) => {
		const group = acc[operation.category] || {
			category: operation.category,
			spending: 0,
			gain: 0,
			balance: 0,
		};

		if (operation.type === "Gasto") {
			group.spending += parseInt(operation.amount);
		} else {
			group.gain += parseInt(operation.amount);
		}

		group.balance = group.gain - group.spending;

		acc[operation.category] = group;
		return acc;
	}, {});
	console.log(totales, "totales por categoria");
	return Object.values(totales);
};

//------TABLA TOTALES POR CATEGORIA------------------

const reportsGenerateTable = () => {
	const reportesPorCategoria = totalsByCategory();
	const tableBody = document.getElementById("categoryTableReports");

	// Limpiar contenido existente de la tabla
	tableBody.innerHTML = "";

	// Verificar si hay datos para mostrar
	if (reportesPorCategoria.length === 0) {
		const row = document.createElement("tr");
		row.innerHTML = "<td colspan='4'>No hay datos disponibles</td>";
		tableBody.appendChild(row);
		return; // Salir de la función si no hay datos
	}

	// Generar filas de la tabla
	reportesPorCategoria.forEach((reporte) => {
		const { category, spending, gain, balance } = reporte;
		const row = document.createElement("tr");
		row.classList.add("containerGenerate", "text-center", "text-base");

		row.innerHTML = `
            <td class="category text-lg">
                <span class="items-center text-[#FB923C]">${category}</span>
            </td>
            <td class="gain text-green-600 text-lg">+${gain}</td>
            <td class="spending text-lg text-red-600">-${spending}</td>
            <td class="balance text-lg ">${balance}</td>
        `;

		tableBody.appendChild(row);
	});
};

//-------------TOTALES POR MES---------------------
const obtenerTotalesPorMes = () => {
	const operationsData = JSON.parse(localStorage.getItem("operations")) || [];

	const totales = operationsData.reduce((acc, operation) => {
		const dateArray = operation.date.split("/");
		const monthNumber = parseInt(dateArray[1]);
		const monthName = monthNames[monthNumber];

		const group = acc[monthName] || {
			date: monthName,
			spending: 0,
			gain: 0,
			balance: 0,
		};

		if (operation.type === "Gasto") {
			group.spending += parseInt(operation.amount);
		} else {
			group.gain += parseInt(operation.amount);
		}

		group.balance = group.gain - group.spending;

		acc[monthName] = group;
		return acc;
	}, {});

	return Object.values(totales);
};

const reportsDateGenerateTable = () => {
	const reportesPorMes = obtenerTotalesPorMes();
	const elements = reportesPorMes.map((reporte) => {
		const { date, spending, gain, balance } = reporte;

		return `
            <tr class="containerDate text-center">
                <td>${date}</td>
                <td class="gainReports text-green-600">+${gain}</td>
                <td class="spending text-lg text-red-600">-${spending}</td>
                <td class="balance text-lg ">${balance}</td>
            </tr> 
        `;
	});

	document.getElementById("tableMonthReports").innerHTML = elements.join("");
};
reportsDateGenerateTable();

//----------------MENU HAMBURGUESA----------

document.addEventListener("DOMContentLoaded", function () {
	const toggleMenu = () => {
		const menu = document.getElementById("mobile-menu");
		menu.classList.toggle("hidden");
	};

	const btnMenu = document.getElementById("btn-menu-burger");
	btnMenu.addEventListener("click", toggleMenu);

	const btnBalances = document.getElementById("btn-balances-burger");
	const btnCategories = document.getElementById("btn-categories-burger");
	const btnReports = document.getElementById("btn-reports-burger");

	const panelBalanceandFilter = document.getElementById(
		"balance--filtro__panel"
	);
	const panelOperations = document.getElementById("section-operations");
	const containerReports = document.getElementById("btn-reports");
	const containerCategories = document.getElementById("categoriesAdd__box");

	const showBalances = () => {
		panelBalanceandFilter.classList.remove("hidden");
		panelOperations.classList.remove("hidden");
		containerReports.classList.add("hidden");
		containerCategories.classList.add("hidden");
		toggleMenu();
	};

	const showCategories = () => {
		panelBalanceandFilter.classList.add("hidden");
		panelOperations.classList.add("hidden");
		containerReports.classList.add("hidden");
		containerCategories.classList.remove("hidden");
		toggleMenu();
	};

	const showReports = () => {
		panelBalanceandFilter.classList.add("hidden");
		panelOperations.classList.add("hidden");
		containerReports.classList.remove("hidden");
		containerCategories.classList.add("hidden");
		emptyOperations();
		toggleMenu();
	};

	btnBalances.addEventListener("click", showBalances);
	btnCategories.addEventListener("click", showCategories);
	btnReports.addEventListener("click", showReports);
});

//-----------FUNCION ORDENAR POR FILTROS --------//

const newDate = (operation) => {
	const date = new Date(operation.date);
	return date.getTime();
};

const FiltersResult = () => {
	const operationsData = JSON.parse(localStorage.getItem("operations")) || [];
	const selectedValue = document.getElementById("filter-order").value;

	if (selectedValue === "MAS_RECIENTE") {
		operationsData.sort((a, b) => new Date(b.date) - new Date(a.date));
		return generateTable(operationsData);
	}

	if (selectedValue === "MENOS_RECIENTE") {
		operationsData.sort((a, b) => new Date(a.date) - new Date(b.date));
		return generateTable(operationsData);
	}

	if (selectedValue === "MAYOR_MONTO") {
		let operation = operationsData.sort((a, b) => b.amount - a.amount);
		return generateTable(operation);
	}

	if (selectedValue === "MENOR_MONTO") {
		let operation = operationsData.sort((a, b) => a.amount - b.amount);
		return generateTable(operation);
	}

	if (selectedValue === "A/Z") {
		const operation = operationsData.sort((a, b) => {
			if (a.description < b.description) {
				return -1;
			} else if (a.description > b.description) {
			} else {
				return 0;
			}
		});
		return generateTable(operation);
	}

	if (selectedValue === "Z/A") {
		const operation = operationsData.sort((a, b) => {
			if (a.description > b.description) {
				return -1;
			} else if (a.description < b.description) {
			} else {
				return 0;
			}
		});
		return generateTable(operation);
	}
};

document
	.getElementById("filter-order")
	.addEventListener("change", FiltersResult);

/////
const showFiltersButton = document.getElementById("show-filters");
const hideFiltersButton = document.getElementById("hide-filters");
const filtersSection = document.getElementById("filter-hidden");

hideFiltersButton.addEventListener("click", () => {
	filtersSection.classList.add("hidden");
	hideFiltersButton.classList.add("hidden");
	showFiltersButton.classList.remove("hidden");
});

showFiltersButton.addEventListener("click", () => {
	filtersSection.classList.remove("hidden");
	showFiltersButton.classList.add("hidden");
	hideFiltersButton.classList.remove("hidden");
});
