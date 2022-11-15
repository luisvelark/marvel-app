// PROYECTO FINAL
//         Desarrollar una SPA con un formulario de login, colocar validaciones
//         solo acceder con los datos correctos, al ingresar al sistema
//         mostrar en una tabla o la estructura que quieras el contenido de un servicio web externo (construir una API REST)

// ******************ELEMENTOS***************

const $formulario = document.getElementById("formulario");
console.log($formulario);

const $inputs = document.querySelectorAll("#formulario input");
console.log($inputs);

const $avisoEmail = document.getElementById("avisoEmail");
const $avisoPass = document.getElementById("avisoPass");
console.log($avisoEmail, $avisoPass);

const $msjEnvio = document.getElementById("msj-envio");

// ******************VALIDACIONES***************
const sesion = {
  user: "luisvelark@gmail.com",
  pass: "123educacioIT",
};

const expresiones = {
  email: /^([a-zA-Z0-9_\.-]+)@([\da-zA-Z\.-]+)\.([a-zA-Z\.]{2,6})$/, //correo valido
  pass: /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, //minusculas,mayusculas,numero y opcional caracteres especiales pero minimo 8 caracteres
};

const campos = {
  email: false,
  pass: false,
};

// ******************MAIN***************
$inputs.forEach((input) => {
  input.addEventListener("keyup", validarFormulario);
  input.addEventListener("blur", validarFormulario);
});
// ******************FUNCIONES***************

function validarFormulario(e) {
  console.log("validando....");
  switch (e.target.name) {
    case "email":
      validarEmail(expresiones.email, e.target, $avisoEmail);
      // console.log(e.target.name);
      break;
    case "pass":
      validarPass(expresiones.pass, e.target, $avisoPass);
      // console.log(e.target.name);
      break;
  }
}
//- - - - - - - - - - - - - - - - - - - - - - -
function validarEmail(expresion, input, avisoCorreo) {
  const correo = input.value.trim();
  if (correo === "") {
    showError(
      input,
      avisoCorreo,
      "*Este campo esta vacio completelo, por favor!."
    );
    campos.email = false;
    // console.log(correo + "esta vacio");
  } else {
    if (expresion.test(correo)) {
      // console.log("valido " + correo);
      cleanErrors(input, avisoCorreo, "correo válido!");
      campos.email = true;
    } else {
      showError(input, avisoCorreo, "*Ingrese un correo valido, por favor!.");
      campos.email = false;
      // console.log("invalido " + correo);
    }
  }
}
//- - - - - - - - - - - - - - - - - - - - - - -
function validarPass(expresion, input, avisoPass) {
  const pass = input.value.trim();
  if (pass === "") {
    showError(
      input,
      avisoPass,
      "*Este campo esta vacio completelo, por favor!."
    );
    campos.pass = false;
  } else {
    if (expresion.test(pass)) {
      cleanErrors(input, avisoPass, "contraseña válida!");
      campos.pass = true;
    } else {
      showError(
        input,
        avisoPass,
        `<p class="mt-1 mb-0">*Debe contener mayúsculas.</p>
        <p class="mt-0 mb-0">*Debe contener minúsculas.</p>
        <p class="mt-0 mb-0">*Debe contener numeros.</p>
        <p class="mt-0 mb-0">*mínimo 8 caracteres.</p>`
      );
      campos.pass = false;
    }
  }
}
//- - - - - - - - - - - - - - - - - - - - - - -
function showError(element, aviso, message) {
  aviso.innerHTML = `${message}`;
  element.classList.add("is-invalid");
  aviso.classList.add("invalid-feedback");
  element.classList.remove("is-valid");
  aviso.classList.remove("valid-feedback");
}

function cleanErrors(element, aviso, message) {
  aviso.innerHTML = `${message}`;
  element.classList.remove("is-invalid");
  aviso.classList.remove("invalid-feedback");
  aviso.classList.add("valid-feedback");
  element.classList.add("is-valid");
}
//- - - - - - - - - - - - - - - - - - - - - - -
// consulta a API en caso de que el formulario esté correcto
$formulario.addEventListener("submit", (e) => {
  e.preventDefault();
  const $main = document.getElementById("main");

  if (campos.email && campos.pass) {
    console.log("enviando...");
    Consulta();
    $main.style.display = "none";
    $msjEnvio.innerHTML = `<div class="alert alert-success" role="alert">
    Accediendo...
  </div>`;
    setTimeout(() => {
      $msjEnvio.innerHTML = "";
    }, 5000);
    e.target.reset();
    console.log("se envio exitosamente");
  } else {
    $msjEnvio.innerHTML = `<div class="alert alert-danger" role="alert">
    Algo salio mal!
  </div>`;
    setTimeout(() => {
      $msjEnvio.innerHTML = "";
    }, 5000);
    console.log("algo salio mal");
  }
});
//- - - - - - - - - - - - - - - - - - - - - - -
//la consulta a la API
async function Consulta() {
  try {
    const $marvelContainer = document.getElementById("marvel-container");
    const $evento = document.getElementById("evento");
    let content = "";
    const url =
      "https://gateway.marvel.com:443/v1/public/events?ts=1&apikey=46c274f04d1126f530e6799dde13d838&hash=e47cc4b46b8c303b931ab3602b751e55";

    const res = await fetch(url);

    const datos = await res.json();
    console.log(datos);

    for (const hero of datos.data.results) {
      content += `
      <div class="col-md-6 col-sm-12 col-lg-4">
        <div class="card" style="width: 18rem;margin: auto;">
          <img src="${hero.thumbnail.path}.${hero.thumbnail.extension}" class="card-img-top hero" alt="${hero.title}">
          <div class="card-body">
            <h5 class="card-title">${hero.title}</h5>
            <p class="card-text">${hero.description}</p>
          </div>
        </div>
      </div>`;
    }
    $marvelContainer.innerHTML = content;
    $evento.classList.remove("sin-eventos");
    $evento.classList.add("eventos");
  } catch (error) {
    console.log(error);
  }
}
