module.exports = async callback => {

    try {
        const Asignatura = artifacts.require("./Asignatura.sol");

        // Usar las cuentas de usuario
        const accounts = await web3.eth.getAccounts();
        if (accounts.length < 8) {
            throw new Error("No hay cuentas.");
        }

        let asignatura = await Asignatura.deployed();

        // Identificar al profesor:
        let owner = await asignatura.owner();
        console.log("Cuenta del owner =", owner);

        // Crear coordinador
        await asignatura.setCoordinador(accounts[1])
        let coordinador = await asignatura.coordinador();
        console.log("Cuenta del coordinador =", coordinador);

        // Crear un profesor
        await asignatura.addProfesor(accounts[2], "Paco");
        let profesor = accounts[2];
        console.log("Cuenta de un profesor =", profesor);

        console.log("Crear dos evaluaciones:");
        await asignatura.creaEvaluacion("Examen Parcial", 12345678, 30, {from: coordinador});
        await asignatura.creaEvaluacion("Examen Final", 12349999, 70, {from: coordinador});

        console.log("Matricular a dos alumnos:");
        let evaAccount = accounts[3];
        let pepeAccount = accounts[4];
        console.log("Cuenta de Eva =", evaAccount);
        console.log("Cuenta de Pepe =", pepeAccount);
        await asignatura.automatricula("Eva Martinez", "em@dominio.es", "49223433P", {from: evaAccount});
        await asignatura.automatricula("Jose Redondo", "jr@stio.com", "34229384K", {from: pepeAccount});

        console.log("Añadir calificaciones:");
        await asignatura.califica(evaAccount, 0, 1, 65, {from: profesor});
        await asignatura.califica(evaAccount, 1, 1, 75, {from: profesor});
        await asignatura.califica(pepeAccount, 0, 0, 0, {from: profesor});
        await asignatura.califica(pepeAccount, 1, 1, 50, {from: profesor});
    } catch (err) {   // Capturar errores
        console.log(`Error: ${err}`);
    } finally {
        console.log("FIN");
    }

    callback();      // Terminar
};
