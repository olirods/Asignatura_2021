import {drizzleReactHooks} from '@drizzle/react-plugin'
import {Link} from "react-router-dom";

const {useDrizzle} = drizzleReactHooks;

const ProfesorRow = ({profesorIndex}) => {
    const {useCacheCall} = useDrizzle();

    let {addr, nombre} = useCacheCall(['Asignatura'],
        call => {
            const addr = call("Asignatura", "profesores", profesorIndex);
            const nombre = addr && call("Asignatura", "datosProfesor", addr);
            return {addr, nombre};
        }
    );

    return <tr key={"PROF-" + profesorIndex}>
        <th>A<sub>{profesorIndex}</sub></th>
        <td>{nombre}</td>
        <td><Link to={`/profesores/${addr}`}>Info</Link></td>
    </tr>;
};

export default ProfesorRow;
