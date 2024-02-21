const agregarReportes = () => {
	let withReports = true; // Cambia a 'false' si no hay reportes

	// Seleccionamos los elementos relevantes
	const withoutReportsDiv = document.getElementById("without_reports");
	const withreportsDiv = document.getElementById("with_reports");

	// Si no hay reportes, ocultamos el div sin reportes y mostramos el div con reportes
	if (!hayReportes) {
		withoutReportsDiv.classList.add("hidden");
		withreportsDiv.classList.remove("hidden");
	} else {
		// Si hay reportes, mostramos el div sin reportes y ocultamos el div con reportes
		withoutReportsDiv.classList.remove("hidden");
		withreportsDiv.classList.add("hidden");
	}
};
