import { BrowserRouter, Routes, Route } from "react-router-dom";

import '../css/App.css';
import Loading from './Loading';
import Layout from './Layout';
import Home from './Home';
import Evaluaciones from "./Evaluaciones/Evaluaciones";
import {Alumnos, Alumno} from "./Alumnos/Alumnos";
import {Profesores, Profesor} from "./Profesores/Profesores";
import Calificaciones from "./Calificaciones/Calificaciones";
import MisCosas from "./MisCosas/MisCosas";
import NoMatch from './NoMatch';

function App() {
    return (
        <div className="App">
            <Loading>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Layout/>}>
                            <Route index element={<Home/>}/>
                            <Route path="evaluaciones" element={<Evaluaciones/>}/>
                            <Route path="alumnos" element={<Alumnos/>}/>
                            <Route path="alumnos/:addr" element={<Alumno/>}/>
                            <Route path="profesores" element={<Profesores/>}/>
                            <Route path="profesores/:addr" element={<Profesor/>}/>
                            <Route path="calificaciones" element={<Calificaciones/>}/>
                            <Route path="miscosas" element={<MisCosas/>}/>
                            <Route path="*" element={<NoMatch/>}/>
                        </Route>
                    </Routes>
                </BrowserRouter>
            </Loading>
        </div>
    );
}

export default App;
