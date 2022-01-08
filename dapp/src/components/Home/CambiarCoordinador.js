import {useState} from "react";

import {drizzleReactHooks} from '@drizzle/react-plugin'

const {useDrizzle, useDrizzleState} = drizzleReactHooks;

const SoloOwner = ({children}) => {
    const {useCacheCall} = useDrizzle();
    const drizzleState = useDrizzleState(state => state);

    const owner = useCacheCall("Asignatura", "owner");

    if (owner !== drizzleState.accounts[0]) {
        return <p>NO SOY EL OWNER</p>
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

const CambiarCoordinador = () => {
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
    let [newAddr, setNewAddr] = useState("")

    return (<article className="AppCambiarCoordinador">
        <h4>Cambiar Coordinador</h4>
        <SoloOwner>
            <form>
                <span>
                    Dirección del nuevo coordinador:  &nbsp;
                    <input key="addr" type="text" name="addr" value={newAddr} placeholder="Dirección del nuevo coordinador"
                           onChange={ev => setNewAddr(ev.target.value)}/>
                    &nbsp;
                </span>
                <button key="submit" className="pure-button" type="button"
                        onClick={ev => {
                            ev.preventDefault();
                             const stackId = drizzle.contracts.Asignatura.methods.setCoordinador.cacheSend(newAddr);
                            setLastStackID(stackId);
                        }}>
                    Cambiar
                </button>

                <p> {status != 'success' ? '' : 'Operación realizada con éxito'} </p>

            </form>
        </SoloOwner>
    </article>);
};

export default CambiarCoordinador;
