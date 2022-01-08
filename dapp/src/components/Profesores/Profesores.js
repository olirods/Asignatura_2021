import {drizzleReactHooks} from '@drizzle/react-plugin'
import {useParams, Link} from "react-router-dom";

import ProfesoresHead from "./ProfesoresHead";
import ProfesoresBody from "./ProfesoresBody";

const {useDrizzle} = drizzleReactHooks;

export const Profesores = () => {
    const {useCacheCall} = useDrizzle();

    const ml = useCacheCall("Asignatura", "profesoresLength") || 0;

    return (
        <section className="AppProfesores">
            <h2>Profesores</h2>
            <table>
                <ProfesoresHead/>
                <ProfesoresBody profesoresLength={ml || 0}/>
            </table>
        </section>
    );
};


export const Profesor = () => {
    const {useCacheCall} = useDrizzle();

    let {addr} = useParams();

    const nombre = useCacheCall("Asignatura", "datosProfesor", addr);

    return <>
        <header className="AppProfesor">
            <h2>Profesor</h2>
        </header>
        <ul>
            <li><b>Nombre:</b> {nombre ?? "Desconocido"}</li>
            <li><b>Address:</b> {addr}</li>
        </ul>
        <Link to="/profesores">Volver</Link>
    </>
};
