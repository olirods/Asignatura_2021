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

const CerrarAsignatura = () => {
    const {drizzle} = useDrizzle();

    // Obtener el status de la ultima transaccion enviada:
    const { transactionStack, transactions } = useDrizzleState(drizzleState => ({
        transactionStack: drizzleState.transactionStack,
        transactions: drizzleState.transactions
    }));
    const [lastStackID, setLastStackID] = useState(undefined)
    const txObject = transactions[transactionStack[lastStackID] || 'undefined'];
    const status = txObject?.status;

    return (<article className="AppCerrarAsignatura">
        <h4>Cambiar Coordinador</h4>
        <SoloCoordinador>
            <form>
                <button key="submit" className="pure-button" type="button"
                        onClick={ev => {
                            ev.preventDefault();
                             const stackId = drizzle.contracts.Asignatura.methods.cerrar.cacheSend();
                            setLastStackID(stackId);
                        }}>
                    Cerrar asignatura
                </button>

                <p> {status != 'success' ? '' : 'Operación realizada con éxito'} </p>
            </form>
        </SoloCoordinador>
    </article>);
};

export default CerrarAsignatura;
