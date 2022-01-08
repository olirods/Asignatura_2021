import {useState} from "react";

import {drizzleReactHooks} from '@drizzle/react-plugin'

const {useDrizzle, useDrizzleState} = drizzleReactHooks;

const NoMatriculados = ({children}) => {
    const {useCacheCall} = useDrizzle();
    const drizzleState = useDrizzleState(state => state);

    const estaMatriculado = useCacheCall("Asignatura", "estaMatriculado", drizzleState.accounts[0]);

    if (estaMatriculado) {
        return <p>SÓLO PARA NO MATRICULADOS</p>
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

const AutoMatricular = () => {
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
    let [email, setEmail] = useState("") //string
    let [dni, setDNI] = useState("") //string

    return (<article className="AppNoMatriculados">
        <h4>Automatricularse</h4>
        <NoMatriculados>
            <form>
                <p>
                    Nombre:  &nbsp;
                    <input key="nombre" type="text" name="nombre" value={nombre} placeholder="Nombre"
                           onChange={ev => setNombre(ev.target.value)}/>
                </p>
                <p>
                    Email:  &nbsp;
                    <input key="email" type="text" name="email" value={email} placeholder="Email"
                           onChange={ev => setEmail(ev.target.value)}/>
                </p>
                <p>
                    DNI:  &nbsp;
                    <input key="dni" type="text" name="dni" value={dni} placeholder="DNI"
                           onChange={ev => setDNI(ev.target.value)}/>
                </p>
                <button key="submit" className="pure-button" type="button"
                        onClick={ev => {
                            ev.preventDefault();
                             const stackId = drizzle.contracts.Asignatura.methods.automatricula.cacheSend(nombre, email, dni);
                            setLastStackID(stackId);
                        }}>
                    Añadir
                </button>

                <p> {status != 'success' ? '' : 'Operación realizada con éxito'} </p>
            </form>
        </NoMatriculados>
    </article>);
};

export default AutoMatricular;
