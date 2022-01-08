import {drizzleReactHooks} from '@drizzle/react-plugin'
import {newContextComponents} from "@drizzle/react-components";

import CambiarCoordinador from "./CambiarCoordinador"

const {AccountData} = newContextComponents;
const {useDrizzle, useDrizzleState} = drizzleReactHooks;

const CoordinadorAddr = () => {
    const {drizzle, useCacheCall} = useDrizzle();
    const drizzleState = useDrizzleState(state => state);

    const owner = useCacheCall("Asignatura", "coordinador");

    return (
      <article className="AppCoordinadorAddr">
        <h3>Coordinador</h3>
        <ul>
          <li>Dirección: <span style={{color: "blue"}}>{owner || "Desconocida"}</span></li>
        </ul>

        <CambiarCoordinador/>
      </article>
    );

    };

  export default CoordinadorAddr;