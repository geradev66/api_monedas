
const numero = document.querySelector('#numero')
const boton = document.querySelector('#convertir')
const resultado = document.querySelector('#resultado')
const seleccionMoneda = document.querySelector('#seleccion_moneda')
const myChartCanvas = document.querySelector("#myChart")
let datosAPI;

async function convertidor() {
    try {
        const respuesta = await fetch('https://mindicador.cl/api/');
        const data = await respuesta.json();

        datosAPI = data; // Guardar los datos globalmente

        llenarOpciones(data); // Llenar el dropdown con opciones

        return data; // Retorna los datos procesados
    } catch (error) {
        console.error('Error al obtener los datos:', error.message);
    }
}


// Función para llenar las opciones del dropdown
function llenarOpciones(data) {
    // Vaciar las opciones existentes
    seleccionMoneda.innerHTML = '';

    // Obtener monedas a partir de los datos
    const { dolar, bitcoin } = data;
    const monedas = { dolar, bitcoin };

    // Crear y agregar opciones
    Object.entries(monedas).forEach(([key]) => {
        const opcion = document.createElement('option');
        opcion.value = key;
        opcion.textContent = `${key.toUpperCase()}`;
        seleccionMoneda.appendChild(opcion);
    });
}



convertidor()

boton.addEventListener('click', ()=>{
    const seleccion = seleccionMoneda.value
    conversion(seleccion,datosAPI)
}) 
    
function conversion(valorSeleccionado,datos){
    const seleccion = parseFloat(document.querySelector('#moneda').value);
    if(!seleccion){
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Ingresa una cantidad valida!"
          });
    }else{
        if(datos && valorSeleccionado in datos){
            const resultadoFinal = seleccion / datos[valorSeleccionado].valor
            resultado.innerHTML= `<h2>$${resultadoFinal.toFixed(2)}</h2>`
        }
    }
    
}


/* Gráfica */

async function renderGrafica(){

    
    const data = await convertidor() 
    const config = {
        type: 'line',
        data: {
            labels: ['Dólar', 'Bitcoin'], // Etiquetas
            datasets: [
                {
                    label: 'Valor actual en CLP',
                    data: [data.dolar.valor, data.bitcoin.valor], // Valores de las monedas
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderWidth: 2,
                },
            ],
        },
        options: {
            responsive: true,
        },
    };
    
    new Chart(myChartCanvas, config);

 
}


renderGrafica()





