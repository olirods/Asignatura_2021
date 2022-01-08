import {drizzleReactHooks} from '@drizzle/react-plugin'
import {newContextComponents} from "@drizzle/react-components";
import CerrarAsignatura from './CerrarAsignatura';

const {AccountData} = newContextComponents;
const {useDrizzle, useDrizzleState} = drizzleReactHooks;

const OpenClose = () => {
    const {drizzle, useCacheCall} = useDrizzle();
    const drizzleState = useDrizzleState(state => state);

    const cerrada = useCacheCall("Asignatura", "cerrada");

    return (
      <article className="AppOwnerAddr">
        <h3>Estado de la asignatura {cerrada ? '❌' : '✅'}</h3>
        <CerrarAsignatura/>
      </article>
    );

    };

  export default OpenClose;