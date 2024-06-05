import Vue from "vue";
import store from "../store";

Vue.prototype.showLoader = async () => {
    await store.commit("utils/setLoader", true);
};

Vue.prototype.temporalAlert = async (alert) => {
    await store.commit("utils/setAlert", alert);
};

Vue.prototype.isDui = (dui) => {
    if (dui === null) return false;
    let valido = false;

    // Validando la longitud del numero de DUI
    if (dui.length === 10) {
        // Validando que no sea ceros todos los dígitos
        if (dui !== "00000000-0") {
            // Obteniendo los dígitos y el verificador
            let [digitos, validador] = dui.split("-");

            // Verficiando que la cadena
            if (typeof digitos !== "undefined" && typeof validador !== "undefined") {
                // Verificando que el validador sea de un solo caracter
                if (validador.length === 1) {
                    // Convirtiendo los digitos a array
                    digitos = digitos.split("");

                    // Convirtiendo los datos a tipo integer
                    validador = parseInt(validador, 10);
                    digitos = digitos.map((digito) => parseInt(digito, 10));

                    // Obteniendo la suma corresponiente
                    let suma = digitos.reduce(
                        (total, digito, index) => (total += digito * (9 - index)),
                        0
                    );

                    // Obteniendo el Modulo base 10
                    let mod = suma % 10;
                    mod = validador === 0 && mod === 0 ? 10 : mod;

                    let resta = 10 - mod;

                    if (resta === validador) {
                        valido = true;
                    }
                }
            }
        }
    }
    return valido;
};

Vue.prototype.isNit = (nit) => {
    if (nit === null) return false;

    let valido = false;

    // Validando la longitud del numero de DUI
    if (nit.length === 17) {
        // Validando que no sea ceros todos los dígitos
        if (
            nit !== "0000-000000-000-0" &&
            nit.match(/^[0-9]{4}-[0-9]{6}-[0-9]{3}-[0-9]$/)
        ) {
            // Obteniendo los dígitos y el verificador por separado
            let [ubicacion, fecha, correlativo, validador] = nit.split("-");
            let digitos = (ubicacion + fecha + correlativo).split("");

            // Convirtiendo los datos a tipo integer
            validador = parseInt(validador, 10);
            correlativo = parseInt(correlativo, 10);
            let suma = 0;
            let mod = 0;
            if (correlativo <= 100) {
                // Obteniendo la suma corresponiente
                suma = digitos.reduce(
                    (total, digito, index) =>
                        (total += parseInt(digito, 10) * (14 - index)),
                    0
                );
                // Obteniendo el Modulo base 11
                mod = suma % 11;
                mod = mod === 10 ? 0 : mod;
            } else {
                // Obteniendo la suma corresponiente
                suma = digitos.reduce(
                    (total, digito, index) =>
                        (total +=
                            parseInt(digito, 10) *
                            parseInt(3 + 6 * Math.floor((index + 5) / 6) - (index + 1), 10)),
                    0
                );
                // Obteniendo el Modulo base 11
                mod = suma % 11;
                mod = mod > 1 ? 11 - mod : 0;
            }
            if (mod === validador) {
                valido = true;
            }
        }
    }
    return valido;
};

Vue.prototype.getPaginationProperties = (response) => {
    return {
        page: Number(response.headers.page),
        per_page: Number(response.headers.per_page),
        total_rows: Number(response.headers.total_rows)
    }
}
//Funcion auxiliar para verificar paths accesibles
const buscarRuta = (rutas, ruta) => {
    return rutas.some((item) => {
        if (item?.childrens?.length > 0)
            if (buscarRuta(item?.childrens, ruta)) return true

        return item.nombre_uri.toLowerCase() === ruta.name.toLowerCase();
    });
};
//Funcion para verificar las paths accesibles
Vue.prototype.canNext = async (ruta) => {
    //Rutas a las que el usuario siempre va a poder acceder
    const permit = [
        "Forbidden",
        "security",
        "login",
        "forgot-password",
        "reset-password",
        "2fa",
        "verifyMail",
    ];
    if (!ruta.name) return false;
    //Si la ruta a ingresar esta definida en el arreglo local, permite ingreso
    if (permit.some((row) => row.toLowerCase() === ruta.name.toLowerCase()))
        return true;
    /*Se verifica si la ruta proporcionada se encuentra en las paths
    almacenadas, si no hay entonces se hace la petición para almacenarlas*/
    let {utils} = store.state;
    if (utils.rutas && utils.rutas.length === 0) {
        await store.dispatch("utils/getMenu");
    }
    //Busca ruta en el arreglo de paths
    return buscarRuta(utils.rutas, ruta);
};
