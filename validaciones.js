


/*se declara array de concatenacion de errores en los distintos campos de el fromulario*/




var strerror = ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"];
/* 

Correspondencia del array strerror con los respectivos campos del formulario

strerror[]
---------------------
|nombre          | 0 | 
|----------------|---|
|apellidos       | 1 |
|----------------|---|	
|nif       	     | 2 |
|----------------|---|	
|fecha nacimineto| 3 |
|----------------|---|	
|domicilio       | 4 |
|----------------|---|	
|provincia       | 5 |
|----------------|---|	
|cp              | 6 |
|----------------|---|	
|localidad       | 7 |
|----------------|---|	
|tlfn1           | 8 |
|----------------|---|	
|tlfn2           | 9 |
|----------------|---|	
|email           | 10|
|----------------|---|	
|equipo          | 11|
|----------------|---|	
|socio           | 12|
|----------------|---|	
|cliente         | 13|
|----------------|---|	
|terminos        | 14| 
----------------------
 
   
*/





/*funciones auxiliares de validacion llamadas por otras funciones */


function validaFecha(date){
	var validaciones;
	 var regex = /\d{2}\/\d{2}\/\d{4}/;
	if (!regex.test(date)){
	    validaciones = "Debe introducir una fecha valida";
	}
	else{
			var arr = date.split("/");	
			if(arr[1] == "02"){
				if(((arr[2] % 4 == 0) && (arr[2] % 100 == 0)) || (arr[2] % 400 == 0)){
					if(arr[0] == "29"){
						validaciones = "ok";
					}
				}
				else
				{
				    if (arr[0] == "29") {
				        validaciones = "Debe introducir una fecha valida";
				    }
				    else {
				        validaciones = "ok";
				    }
				}
			}
			else{
				validaciones = "ok";
			}
	}

    return validaciones;

}



function validaNif(value) 
{
   value = value.toUpperCase();

   // Comprobamos el formato
   if (!value.match('((^[A-Z]{1}[0-9]{7}[A-Z0-9]{1}$|^[T]{1}[A-Z0-9]{8}$)|^[0-9]{8}[A-Z]{1}$)')) {
      
      return false;
   }

   // Validamos la letra del NIF
   if (/^[0-9]{8}[A-Z]{1}$/.test(value)) {
      return ("TRWAGMYFPDXBNJZSQVHLCKE".charAt(value.substring(8, 0) % 23) === value.charAt(8));
   }

   // Letras especiales (Inicio K, L o M)
   if (/^[KLM]{1}/.test(value)) {
      digits = value.substring(1, 8);
      sumaImpar = 0;
      sumaPar = 0;

      for (cont = 0; cont < digits.length; cont = cont + 2) {
         if (cont < 6) {
            sumaImpar += 1 * digits[cont + 1];
         }
         dobleImpar = 2 * digits[cont];
         sumaPar += Math.floor((dobleImpar % 10) + (dobleImpar / 10));
      }

      sumaTotal = sumaPar + sumaImpar;
      sumaTotal = Math.floor((10 - (sumaTotal % 10)) % 10);

      return (value.charAt(8) === "JABCDEFGHI".charAt(sumaTotal));
   }

   return false;
}

function validaNie(value)
{
   value = value.toUpperCase();


   // Validamos si la estructura es correcta
   if (!value.match('((^[A-Z]{1}[0-9]{7}[A-Z0-9]{1}$|^[T]{1}[A-Z0-9]{8}$)|^[0-9]{8}[A-Z]{1}$)')) {
      return false;
   }

   // Test con letra T
   if (/^[T]{1}/.test(value)) {
      return (value[8] === /^[T]{1}[A-Z0-9]{8}$/.test(value));
   }

   // Comprobamos dígito de control para las letras X,Y y Z
   if (/^[XYZ]{1}/.test(value)) {
      return (value[8] === "TRWAGMYFPDXBNJZSQVHLCKE".charAt(value.replace('X', '0').replace('Y', '1').replace('Z', '2').substring(0, 8) % 23));
   }

   return false;
}



/*FUNCIONES DE VALIDACION PRINCIPALES*/



function validarNombre() {

   var nombre = document.getElementById('txtNombre').value;


   expr = /^([a-zA-Z  ÑñÁáÉéÍíÓóÚú]{3,50})+$/;

    if (!expr.test(nombre)) {
        strerror[0] = "1";

        document.getElementById('txtNombre').style.borderColor = "#C8175E";
        document.getElementById('txtNombre').style.backgroundColor = "#E8ACBE";
        document.getElementById('lblErrorNombre').style.visibility = "visible";
        document.getElementById('lblErrorNombre').innerHTML = "Debe introducir un Nombre";
    }
    else {

        strerror[0] = "0";

        document.getElementById('txtNombre').style.borderColor = "";
        document.getElementById('txtNombre').style.border = "";
        document.getElementById('txtNombre').style.backgroundColor = "";
        
        document.getElementById('lblErrorNombre').style.visibility = "hidden";
        document.getElementById('lblErrorNombre').innerHTML = "";
    }
}


function validarApellido() {

    var apellido = document.getElementById('txtapellidos').value;


    expr = /^([a-zA-Z ÑñÁáÉéÍíÓóÚú]{3,50})+$/;

    if (!expr.test(apellido)) {
        strerror[1] = "1";
        document.getElementById('txtapellidos').style.borderColor = "#C8175E";
        document.getElementById('txtapellidos').style.backgroundColor = "#E8ACBE";
        document.getElementById('lblErrorApellidos').style.visibility = "visible";
        document.getElementById('lblErrorApellidos').innerHTML = "Debe introducir un Apellido";

    }
    else {
        strerror[1] = "0";
        document.getElementById('txtapellidos').style.borderColor = "";
        document.getElementById('lblErrorApellidos').innerHTML = ""
        document.getElementById('txtapellidos').style.border = "";
        document.getElementById('txtapellidos').style.backgroundColor = "";

    }
}

function validarMail() {
    var email = document.getElementById('txtEmail').value
    expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    if (!expr.test(email)) {

        strerror[10] = "1";


        var ErrorEmail = document.getElementById('lblErrorEmail');
        ErrorEmail.innerHTML = " El e-mail " + email + " no está en un formato válido";
        ErrorEmail.style.visibility = "visible";

        document.getElementById('txtEmail').style.borderColor = "#C8175E";
        document.getElementById('txtEmail').style.backgroundColor = "#E8ACBE";
    }
    else {

        var ErrorEmail = document.getElementById('lblErrorEmail');
        ErrorEmail.innerHTML = "";
        ErrorEmail.style.visibility = "Hidden";

        document.getElementById('txtEmail').style.borderColor = "";
        document.getElementById('txtEmail').style.border = "";
        document.getElementById('txtEmail').style.backgroundColor = "";

        strerror[10] = "0";
    }
}


function validarNIF() {
    var NIF = document.getElementById('txtNIF').value;
    if (validaNif(NIF) == false) {
        if (validaNie(NIF) == false) {

            strerror[2] = "1";

            var ErrorNIF = document.getElementById('lblErrorNIF');
            ErrorNIF.innerHTML = "Introduzca un NIF válido";
            ErrorNIF.style.visibility = "visible";

            document.getElementById('txtNIF').style.borderColor = "#C8175E";
            document.getElementById('txtNIF').style.backgroundColor = "#E8ACBE";

            return false;

        }
        else {

            strerror[2] = "0";

            var ErrorNIF = document.getElementById('lblErrorNIF');
            ErrorNIF.innerHTML = "";
            ErrorNIF.style.visibility = "Hidden";

            document.getElementById('txtNIF').style.borderColor = "";
            document.getElementById('txtNIF').style.border = "";
            document.getElementById('txtNIF').style.backgroundColor = "";

        }
    }
    else {

        strerror[2] = "0";
        
        var ErrorNIF = document.getElementById('lblErrorNIF');
        ErrorNIF.innerHTML = "";
        ErrorNIF.style.visibility = "Hidden";

        document.getElementById('txtNIF').style.borderColor = "";
        document.getElementById('txtNIF').style.border = "";
        document.getElementById('txtNIF').style.backgroundColor = "";
    }

    return true;
}

function validarChkBx() {

    var checkbox = document.getElementById('ChckbxTerminos');
    if (checkbox.checked == false) {
        

        var ErrorEmail = document.getElementById('lblTerminos');
        ErrorEmail.innerHTML = "Debe aceptar los terminos y condiciones legales";
        ErrorEmail.style.visibility = "visible";

        strerror[14] = "1";
    }
    else {
        var ErrorEmail = document.getElementById('lblTerminos');
        ErrorEmail.innerHTML = "";
        ErrorEmail.style.visibility = "Hidden";

        strerror[14] = "0";
    }
}


function validarrbSocio() {

    var SocioS = document.getElementById('rbSocioS').checked;
    var SocioN = document.getElementById('rbSocioN').checked;
    if (SocioS == false && SocioN == false) {

        document.getElementById('lblErrorRadio').innerHTML = "Debe seleccionar una opción";
        document.getElementById('lblErrorRadio').style.visibility = "visible";

        strerror[12] = "1";
    }
    else {

        document.getElementById('lblErrorRadio').innerHTML = "";
        document.getElementById('lblErrorRadio').style.visibility = "hidden";

        strerror[12] = "0";
    }

}

function validarrbCliente() {

    var ClieAS = document.getElementById('rbAS').checked;
    var ClieAN = document.getElementById('rbAN').checked;
    if (ClieAS == false && ClieAN == false) {
        document.getElementById('lblErrorClie').innerHTML = "Debe seleccionar una opción";
        document.getElementById('lblErrorClie').style.visibility = "visible";

        strerror[13] = "1";

    }
    else {


        document.getElementById('lblErrorClie').innerHTML = "";
        document.getElementById('lblErrorClie').style.visibility = "hidden";

        strerror[13] = "0";
    }

}

function validarTelefono1() {
    var telefono = document.getElementById('txt1Telefono').value;
    if (telefono == "") {



        document.getElementById('txt1Telefono').style.borderColor = "#C8175E";
        document.getElementById('txt1Telefono').style.backgroundColor = "#E8ACBE";

        document.getElementById('lblErrorTelefono1').innerHTML = "Debe introducir un teléfono";
        document.getElementById('lblErrorTelefono1').style.visibility = "visible";
        strerror[8] = "1";

    }
    else {
        expr = /^([0-9]{9})+$/;
        if (!expr.test(telefono)) {


            document.getElementById('txt1Telefono').style.borderColor = "#C8175E";
            document.getElementById('txt1Telefono').style.backgroundColor = "#E8ACBE";

            document.getElementById('lblErrorTelefono1').innerHTML = "El formato del teléfono introducido es erroneo";
            document.getElementById('lblErrorTelefono1').style.visibility = "visible";

            strerror[8] = "1";
        }
        else {

            strerror[8] = "0";
            document.getElementById('txt1Telefono').style.borderColor = "";
            document.getElementById('txt1Telefono').style.border = "";
            document.getElementById('txt1Telefono').style.backgroundColor = "";

            document.getElementById('lblErrorTelefono1').innerHTML = "";
            document.getElementById('lblErrorTelefono1').style.visibility = "Hidden";
        }
    }
}

function validarTelefono2() {
    var telefono2 = document.getElementById('txt2Telefono').value;
    if (telefono2 != "") {
        expr = /^([0-9]{9})+$/;
        if (!expr.test(telefono2)) {


            document.getElementById('txt2Telefono').style.borderColor = "#C8175E";
            document.getElementById('txt2Telefono').style.backgroundColor = "#E8ACBE";

            document.getElementById('lblErrorTelefono2').innerHTML = "El formato del teléfono 2 es erroneo";
            document.getElementById('lblErrorTelefono2').style.visibility = "visible";
            strerror[9] = "1";
        }
        else {
            document.getElementById('txt2Telefono').style.borderColor = "";
            document.getElementById('txt2Telefono').style.border = "";
            document.getElementById('txt2Telefono').style.backgroundColor = "";

            document.getElementById('lblErrorTelefono2').innerHTML = "";
            document.getElementById('lblErrorTelefono2').style.visibility = "Hidden";
            strerror[9] = "0";
        }
    }
    else {
        document.getElementById('txt2Telefono').style.borderColor = "";
        document.getElementById('txt2Telefono').style.border = "";
        document.getElementById('txt2Telefono').style.backgroundColor = "";

        document.getElementById('lblErrorTelefono2').innerHTML = "";
        document.getElementById('lblErrorTelefono2').style.visibility = "Hidden";
        strerror[9] = "0";
    }
}

function validarDireccion() {



    if (document.getElementById('txtDireccion').value == "") {



        document.getElementById('txtDireccion').style.borderColor = "#C8175E";
        document.getElementById('txtDireccion').style.backgroundColor = "#E8ACBE";

        document.getElementById('lblErrorDireccion').innerHTML = "Debe introducir una dirección";
        document.getElementById('lblErrorDireccion').style.visibility = "visible";

        strerror[4] = "1";
        
    }
    else {

        document.getElementById('txtDireccion').style.borderColor = "";
        document.getElementById('txtDireccion').style.border = "";
        document.getElementById('txtDireccion').style.backgroundColor = "";

        document.getElementById('lblErrorDireccion').innerHTML = "";
        document.getElementById('lblErrorDireccion').style.visibility = "Hidden";

        strerror[4] = "0";

    }

}

function validarLocalidad() {

 if (document.getElementById('txtLocalidad').value == "") {



        document.getElementById('txtLocalidad').style.borderColor = "#C8175E";
        document.getElementById('txtLocalidad').style.backgroundColor = "#E8ACBE";

        document.getElementById('lblErrLoc').innerHTML = "Debe introducir una Localidad";
        document.getElementById('lblErrLoc').style.visibility = "visible";

        strerror[7] = "1";
        
    }
    else {

        document.getElementById('txtLocalidad').style.borderColor = "";
        document.getElementById('txtLocalidad').style.border = "";
        document.getElementById('txtLocalidad').style.backgroundColor = "";

        document.getElementById('lblErrLoc').innerHTML = "";
        document.getElementById('lblErrLoc').style.visibility = "Hidden";

        strerror[7] = "0";

    }
    
}

function validarCP(){
    var CP = document.getElementById('txtCP').value;
    if (CP == "" || CP.length < 5) {



        document.getElementById('txtCP').style.borderColor = "#C8175E";
        document.getElementById('txtCP').style.backgroundColor = "#E8ACBE";

        document.getElementById('lblErrProv').innerHTML = "Debe introducir un C.P";
        document.getElementById('lblErrProv').style.visibility = "visible";
        strerror[6] = "1";

    }
    else {
        expr = /^([0-9]{5})+$/;
        if (!expr.test(CP)) {


            document.getElementById('txtCP').style.borderColor = "#C8175E";
            document.getElementById('txtCP').style.backgroundColor = "#E8ACBE";

            document.getElementById('lblErrProv').innerHTML = "El formato del C.P introducido es erroneo";
            document.getElementById('lblErrProv').style.visibility = "visible";

            strerror[6] = "1";
        }
        else {

            strerror[6] = "0";
            document.getElementById('txtCP').style.borderColor = "";
            document.getElementById('txtCP').style.border = "";
            document.getElementById('txtCP').style.backgroundColor = "";

            document.getElementById('lblErrProv').innerHTML = "";
            document.getElementById('lblErrProv').style.visibility = "Hidden";
        }
        validarCPconProvincia();
    }
  
}

function validarProvincia() {

    if (document.getElementById('ddlProvincia').value == "-1" || (document.getElementById('ddlProvincia').value == "")) {
        document.getElementById('ddlProvincia').style.borderColor = "#C8175E";
        document.getElementById('ddlProvincia').style.backgroundColor = "#E8ACBE";

        document.getElementById('lblErrProv').innerHTML = "Debe seleccionar una Provincia";
        document.getElementById('lblErrProv').style.visibility = "visible";

        strerror[5] = "1";

    }
    else {



        document.getElementById('ddlProvincia').style.borderColor = "";
        document.getElementById('ddlProvincia').style.border = "";
        document.getElementById('lblErrProv').innerHTML = "";
        document.getElementById('ddlProvincia').style.backgroundColor = "";
        document.getElementById('txtCP').placeholder = document.getElementById('ddlProvincia').value;

        strerror[5] = "0";
    }


}

function validarCPconProvincia() {

    if (((document.getElementById('ddlProvincia').value != "-1") || (document.getElementById('ddlProvincia').value != "")) && (document.getElementById('txtCP').value != "")) {
       
        var sub = document.getElementById('ddlProvincia').value;
        var cp = document.getElementById('txtCP').value
        var cad

        if (sub.length < 2) {
            cad = cp.substring(1, 2);
        }
        else {
            cad = cp.substring(0, 2);
        }



        if (cad != sub) {
            document.getElementById('txtCP').style.borderColor = "#C8175E";
            document.getElementById('txtCP').style.backgroundColor = "#E8ACBE";

            document.getElementById('lblErrProv').innerHTML = "El C.P no coincide con la Provincia";
            document.getElementById('lblErrProv').style.visibility = "visible";

            strerror[6] = "1";
        }
        else {

            document.getElementById('txtCP').style.borderColor = "";
            document.getElementById('txtCP').style.backgroundColor = "";

            document.getElementById('lblErrProv').innerHTML = "";
            document.getElementById('lblErrProv').style.visibility = "hidden";

            strerror[6] = "0";
        }

    } 


}


function validaMesFechNa() {
    if ((document.getElementById('ddlMesFnac').value < 0) || (document.getElementById('ddlMesFnac').value == "")) {
        document.getElementById('lblErrorFechaNa').innerHTML = "Debe introducir un mes válido";
        document.getElementById('lblErrorFechaNa').style.visibility = "visible";
        document.getElementById('ddlMesFnac').style.borderColor = "#C8175E";
        document.getElementById('ddlMesFnac').style.backgroundColor = "#E8ACBE";
    }
    else {
        document.getElementById('lblErrorFechaNa').innerHTML = "";
        document.getElementById('lblErrorFechaNa').style.visibility = "Hidden";
        document.getElementById('ddlMesFnac').style.borderColor = "";
        document.getElementById('ddlMesFnac').style.backgroundColor = "";
    }
    if ((document.getElementById('txtDiaNa').value != "") && (document.getElementById('txtAnNa').value != "") && (document.getElementById('ddlMesFnac').value > 0)) {
        validarFechaNa()
    }
}

function validarFechaNa() {

    var dia = document.getElementById('txtDiaNa').value;
    var mes = document.getElementById('ddlMesFnac').value;
    var anio = document.getElementById('txtAnNa').value;
    var diasMes = ["","31", "29", "31", "30", "31", "30", "31", "31", "30", "31", "30", "31"];
    var res = "ok"
   

    if(((dia < 0 )||(dia > 32))||(dia == "")){
        res = "Debe introducir un día válido";
    }

    if (dia.length == 1) {
        dia = "0" + dia;
    }


    var fecha = new Date();
    var diaActual = fecha.getDate();
    var mesActual = fecha.getMonth() + 1;
    var anioActualb = fecha.getFullYear();

     var anioActual = fecha.getFullYear();

    if ((dia != "") && (mes > 0) && (anio != "")){
       anioActualb = anioActualb - 18;

        var fech1 = new Date(anio, mes - 1, dia);
        var fech2 = new Date(anioActualb, mesActual - 1, diaActual);
        fech1 = Date.parse(fech1);
        fech2 = Date.parse(fech2);
        if (fech1 <= fech2) {
           //mayor de edad
        }
        else {
            res = "Debe ser mayor de edad";
        }
      
    }

    


 
    if (anio > anioActual){
        res = "Debe introducir una fecha válida";
    }
    else if (anio < 1901){
        res = "Debe introducir una fecha válida";
    }



    if (mes <= 0) {
        res = "Debe introducir una fecha válida";
    }






    if ((dia != "") && (mes > 0) && (anio != "") && (res == "ok")) {
        var Cero = false;
        if (mes < 10) {
            mes = mes.substring(1);
            Cero = true;
        }
       var controlDia = diasMes[mes];
       if (Cero) {
          
           mes = 0 + mes; 
       }
       if (dia <= controlDia) {
           var FechaNa = dia + "/" + mes + "/" + anio;
           res = validaFecha(FechaNa);
           

       }
       else {
           res = "Debe introducir un día válido";
       }

        
    }




    if(res =="ok"){
        document.getElementById('txtDiaNa').style.borderColor = "";
        document.getElementById('txtDiaNa').style.border = "";
         document.getElementById('txtAnNa').style.borderColor = "";
        document.getElementById('txtAnNa').style.border = "";
        document.getElementById('ddlMesFnac').style.borderColor = "";
        document.getElementById('ddlMesFnac').style.border = "";


        document.getElementById('txtDiaNa').style.backgroundColor = "";
        document.getElementById('txtAnNa').style.backgroundColor = "";
        document.getElementById('ddlMesFnac').style.backgroundColor = "";

        document.getElementById('lblErrorFechaNa').innerHTML = "";
        document.getElementById('lblErrorFechaNa').style.visibility = "Hidden";

        strerror[3] = "0";
    }
    else{

        document.getElementById('txtDiaNa').style.borderColor = "#C8175E";
        document.getElementById('txtAnNa').style.borderColor = "#C8175E";
        document.getElementById('ddlMesFnac').style.borderColor = "#C8175E";

        document.getElementById('txtDiaNa').style.backgroundColor = "#E8ACBE";
        document.getElementById('txtAnNa').style.backgroundColor = "#E8ACBE";
        document.getElementById('ddlMesFnac').style.backgroundColor = "#E8ACBE";

        document.getElementById('lblErrorFechaNa').innerHTML = res;
        document.getElementById('lblErrorFechaNa').style.visibility = "visible";

        strerror[3] = "1";

    }

}

function validarEquipo() {


    if (document.getElementById('ddlEquipoFutfol').value == "-1" || (document.getElementById('ddlEquipoFutfol').value == "")) {
        document.getElementById('ddlEquipoFutfol').style.borderColor = "#C8175E";
        document.getElementById('ddlEquipoFutfol').style.backgroundColor = "#E8ACBE";

        document.getElementById('lblErrorEquipo').innerHTML = "Debe seleccionar su equipo de fútbol";
        document.getElementById('lblErrorEquipo').style.visibility = "visible";

        strerror[11] = "1";

    }
    else {
            
        

        document.getElementById('ddlEquipoFutfol').style.borderColor = "";
        document.getElementById('ddlEquipoFutfol').style.border = "";
        document.getElementById('lblErrorEquipo').innerHTML = "";
        document.getElementById('ddlEquipoFutfol').style.backgroundColor = "";

        strerror[11] = "0";
    }


}
