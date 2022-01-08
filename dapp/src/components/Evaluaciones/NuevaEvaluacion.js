import {useState} from "react";

import {drizzleReactHooks} from '@drizzle/react-plugin'

const {useDrizzle, useDrizzleState} = drizzleReactHooks;

const SoloCoordinador = ({children}) => {
    const {useCacheCall} = useDrizzle();
    const drizzleState = useDrizzleState(state => state);

    const coordinador = useCacheCall("Asignatura", "coordinador");

    if (coordinador !== drizzleState.accounts[0]) {
        return <p>NO SOY EL COORDINADOR</p>
    }
    return <>
        {children}
    </>

};


/*
PENDIENTE DE INVESTIGAR:
Si se usa useCacheSend, se envian varias transacciones cada vez que se hace un submit del formulario.
El problema esta relacionado con actualizar el estado del stackIds dentro de la implementacion de ese hook.
 */

const NuevaEvaluacion = () => {
    const {drizzle} = useDrizzle();

    // Obtener el status de la ultima transaccion enviada:
    const { transactionStack, transactions } = useDrizzleState(drizzleState => ({
        transactionStack: drizzleState.transactionStack,
        transactions: drizzleState.transactions
    }));
    const [lastStackID, setLastStackID] = useState(undefined)
    const txObject = transactions[transactionStack[lastStackID] || 'undefined'];
    const status = txObject?.status;

    // Conservar los valores metidos en el formulario
    let [nombre, setNombre] = useState("") //string
    let [fecha, setFecha] = useState("") //uint
    let [puntos, setPuntos] = useState("") //uint

    return (<article className="AppNuevaEvaluacion">
        <h4>Añadir nueva evaluación</h4>
        <SoloCoordinador>
            <form>
                <p>
                    Nombre de la Evaluación:  &nbsp;
                    <input key="nombre" type="text" name="nombre" value={nombre} placeholder="Nombre de la Evaluación"
                           onChange={ev => setNombre(ev.target.value)}/>
                </p>
                <p>
                    Fecha (segundos desde 1970):  &nbsp;
                    <input key="fecha" type="number" name="fecha" value={fecha}
                           placeholder="Fecha (segundos desde 1970)"
                           onChange={ev => setFecha(ev.target.value)}/>
                </p>
                <p>
                    Puntos (1 a 10):  &nbsp;
                    <input key="puntos" type="number" name="puntos" value={puntos}
                           placeholder="Puntos"
                           onChange={ev => setPuntos(ev.target.value)}/>
                </p>
                <button key="submit" className="pure-button" type="button"
                        onClick={ev => {
                            ev.preventDefault();
                             const stackId = drizzle.contracts.Asignatura.methods.creaEvaluacion.cacheSend(nombre, fecha, puntos);
                            setLastStackID(stackId);
                        }}>
                    Añadir
                </button>

                <p> {status != 'success' ? '' : 'Operación realizada con éxito'} </p>
            </form>
        </SoloCoordinador>
    </article>);
};

export default NuevaEvaluacion;
