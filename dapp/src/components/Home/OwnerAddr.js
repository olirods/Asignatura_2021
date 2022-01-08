import {drizzleReactHooks} from '@drizzle/react-plugin'
import {newContextComponents} from "@drizzle/react-components";

const {AccountData} = newContextComponents;
const {useDrizzle, useDrizzleState} = drizzleReactHooks;

const OwnerAddr = () => {
    const {drizzle, useCacheCall} = useDrizzle();
    const drizzleState = useDrizzleState(state => state);

    const owner = useCacheCall("Asignatura", "owner");

    return (
      <article className="AppOwnerAddr">
        <h3>Owner</h3>
        <ul>
          <li>Dirección: <span style={{color: "blue"}}>{owner || "Desconocida"}</span></li>
        </ul>
      </article>
    );

    };

  export default OwnerAddr;