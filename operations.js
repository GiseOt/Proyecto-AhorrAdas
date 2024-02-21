const descripcion = document.getElementById("new__description");
const monto = document.getElementById("new__rate");
const tipo = document.getElementById("new__type");
const categoria = document.getElementById("new__categorie");
const fecha = document.getElementById("new__date");

let operacionesGuardadas =
	JSON.parse(localStorage.getItem("operaciones")) || [];

const evaluarLocalStorage = () => {
	if (localStorage.getItem("operaciones") !== null) {
		operacionesGuardadas = JSON.parse(localStorage.getItem("operaciones"));
	} else {
		localStorage.setItem("operaciones", JSON.stringify(operacionesGuardadas));
	}
	generarTabla();
};

const generarTabla = () => {
	const operacionesTabla = document.getElementById("operations");
	if (!operacionesTabla) return;
	operacionesTabla.innerHTML = " ";
	if (operacionesGuardadas.length > 0) {
		for (let operacion of operacionesGuardadas) {
			operacionesTabla.innerHTML += `
            
                
                <div class="flex text-center">
                    <div class="flex-1  justify-center gap-16 mt-9 pb-5"><span>${operacion.descripcion}</span></div>
                    <div class="flex-1 flex justify-center gap-16 mt-9 pb-5"><span>${operacion.categoria}</span></div>
                    <div class="flex-1 flex justify-center gap-16 mt-9 pb-5"><span>${operacion.fecha}</span></div>
                    <div class="flex-1 flex justify-center gap-16 mt-9 pb-5"><span>${operacion.monto}</span></div>
    
                    <div class ="mt-9 flex gap-6">
                        <a href=""><img
							src="./assets/image/edit.svg"
							alt="Logo alcancía de cerdito"
							class="h-6"
						/></a>
                        <a href=""><img
							src="./assets/image/delete.svg"
							alt="delete"
							class="h-6 delete-operation"
                            id="delete"
						/></a>
                    </div>
                </div>`;
		}
	}
};

evaluarLocalStorage();

const botonAgregar = document.getElementById("add-operation"); //boton agregar operacion
if (botonAgregar) {
	//si está el botón agregar...se hace esto
	botonAgregar.addEventListener("click", () => {
		const nuevaOperacion = {
			id: uuidv4(),
			descripcion: descripcion.value,
			categoria: categoria.value,
			fecha: fecha.value,
			monto: monto.value,
		};
		operacionesGuardadas.push(nuevaOperacion); //agrega operacion
		localStorage.setItem("operaciones", JSON.stringify(operacionesGuardadas));
		generarTabla();
	});
}

document.addEventListener("DOMContentLoaded", function () {
	evaluarLocalStorage();
});
