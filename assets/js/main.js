// main.js

//DOM
document.addEventListener('DOMContentLoaded', function () {

    //pasamos a variables los datos del formulario
    const nombre = document.getElementById('nombre');
    const apellido = document.getElementById('apellido');
    const correo = document.getElementById('correo');
    const edad = document.getElementById('edad');
    const fecha = document.getElementById('fecha');
    const enviarBtn = document.querySelector('button[type="button"]');
    const agregarCampoBtn = document.getElementById('agregarCampoBtn');
    const form = document.getElementById('reservaForm');

    // Crear el objeto "reserva"
    const reserva = {};

    // Definir el Proxy para el objeto "reserva"
    const reservaProxy = new Proxy(reserva, {

        //metodo set, para que podamos validar la edad cada vez que se envie el formulario
        //y se trate de registrar un
        set: function (target, prop, value) {
            if (prop === 'edad' && value < 18) {
                alert('Debes ser mayor de 18 años para hacer una reserva.');
                return false; // Evitar la asignación de valor
            }
            target[prop] = value;
            return true; // Confirmar la asignación de valor
        }

    });

    //funcion para generar id unicos
    function generarIdUnico(longitud) {
        //caracteres permitidos para el ID
        const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let resultado = '';
        const caracteresLength = caracteres.length;
        //recorremos los caraceteres y tomamos la cantidad que pasemos de parametro y tomamos esa cantidad de caracteres
        for (let i = 0; i < longitud; i++) {
            resultado += caracteres.charAt(Math.floor(Math.random() * caracteresLength));
        }
        return resultado;
    }

    const mostrarAtributosBtn = document.getElementById('mostrarAtributosBtn');
    mostrarAtributosBtn.style.display = 'none'; // Ocultar el botón inicialmente
    
    //cada vez que se envia el formulario
    enviarBtn.addEventListener('click', function (event) {

        //prevenimos el envio, para poder hacer validaciones
        event.preventDefault(); 
        
        // Obtener los valores del formulario
        //usamos trim para quitar espacios al inicio y al final
        const nombreVal = nombre.value.trim();
        const apellidoVal = apellido.value.trim();
        const correoVal = correo.value.trim();
        const edadVal = parseInt(edad.value.trim(), 10);
        const fechaVal = fecha.value.trim();

        // Asignar los valores al objeto "reserva" a través del Proxy
        reservaProxy.nombre = nombreVal;
        reservaProxy.apellido = apellidoVal;
        reservaProxy.correo = correoVal;
        reservaProxy.edad = edadVal;
        reservaProxy.fecha = fechaVal;

        // Verificar si la edad fue correctamente asignada
        if (reservaProxy.edad >= 18) {

            //SYMBOLS
    
            //crear symbol
            const idReserva = Symbol('id');

            //asignar id
            reservaProxy[idReserva] = generarIdUnico(6);

            //acceder a la propiedad simbolizada
            console.log('Id del usuario:', reservaProxy[idReserva]);
        
            // Mostrar el botón "Mostrar Atributos"
            mostrarAtributosBtn.style.display = 'inline-block';

            alert('Reserva realizada con éxito!');
            console.log('Objeto reserva:', reservaProxy);
        }

    });

    agregarCampoBtn.addEventListener('click', function () {
        const nombreCampo = prompt('Ingrese el nombre del nuevo campo:');
        const tipoCampo = prompt('Ingrese el tipo del nuevo campo (text, num, date):');

        if (!nombreCampo || !tipoCampo) {
            alert('Debe ingresar tanto el nombre como el tipo del campo.');
            return;
        }

        let tipoInput;
        switch (tipoCampo.toLowerCase()) {
            case 'text':
                tipoInput = 'text';
                break;
            case 'num':
                tipoInput = 'number';
                break;
            case 'date':
                tipoInput = 'date';
                break;
            default:
                alert('Tipo de campo no válido. Use "text", "num" o "date".');
                return;
        }

        const nuevoCampoDiv = document.createElement('div');
        nuevoCampoDiv.classList.add('row', 'mb-2');
        nuevoCampoDiv.innerHTML = `
            <div class="col">
                <label for="${nombreCampo}" class="form-label">${nombreCampo.charAt(0).toUpperCase() + nombreCampo.slice(1)}</label>
                <input type="${tipoInput}" name="${nombreCampo}" class="form-control" id="${nombreCampo}">
            </div>
        `;
        form.insertBefore(nuevoCampoDiv, form.lastElementChild);

        // Añadir el nuevo campo al objeto reserva
        Object.defineProperty(reservaProxy, nombreCampo, {
            set: function (value) {
                Reflect.set(reserva, nombreCampo, value);
            },
            get: function () {
                return Reflect.get(reserva, nombreCampo);
            },
            configurable: true,
            enumerable: true
        });
    });


    mostrarAtributosBtn.addEventListener('click', function () {
        // Obtener y mostrar los atributos del objeto "reserva" utilizando Reflect
        const atributos = Reflect.ownKeys(reservaProxy);
        console.log('Atributos del objeto reserva:', atributos);
    });

});
