// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

/**
* El contrato Asignatura que representa una asignatura de la carrera. *
* Version 2021 - Clase de Teoria
*
* Autores: Antonio Fernandez Alvarez
*          Ignacio Gomez Gomez
*          Sergio Olivares Rodriguez
*/
contract Asignatura {
    /// Version 2021 - Teoria
    uint public version = 2021;
    
    /** 
     * address del owner que ha desplegado el contrato.
     */
    address public owner;
    
    /** 
     * address del coordinador de la asignatura
     */
    address public coordinador;
    
    /// Nombre de la asignatura
    string public nombre;
    
    /// Curso academico
    string public curso;
    
    // Indica si la asignatura ya ha sido cerrada o no
    bool public cerrada;
    
    /// Error personalizado
	error DniAlreadyExists(string dniNuevo, string Mensaje);
    
    /**
     * Datos de una evaluación.
     */
    struct Evaluacion {
        string nombre;
        uint fecha;
        uint puntos;
    }
    
    
    /// Evaluaciones de la asignatura.
    Evaluacion[] public evaluaciones;
    
    
    /**
     * Datos de un alumno.
     */
    struct DatosAlumno {
        string nombre;
        string email;
        string dni;
    }
    
    
    /// Acceder a los datos de un alumno dada su direccion.
    mapping (address => DatosAlumno) public datosAlumno;
    
    /// Acceder a los datos (nombre) de un profesor dada su direccion.
    mapping (address => string) public datosProfesor;
    
    /// Profesores existentes.
    address[] public profesores;
    
    
    /// Array con las direcciones de los alumnos matriculados
    address[] public matriculas;
    
    
    /// Tipos de notas: no presentado, nota entre 0 y 10, y matricula de honor
    enum TipoNota { NP, Normal, MH }
    
    /**
     * Datos de una nota.
     * La calificacion esta multiplicada por 100 porque no hay decimales
     */
    struct Nota {
        TipoNota tipo;
        uint calificacion;
    }
    
    
    // Dada la direccion de un alumno, y el indice de la evaluacion, devuelve
    // la nota del alumno.
    mapping (address => mapping (uint => Nota)) public calificaciones;
    
    
    /**
     * Constructor.
     * 
     * @param _nombre Nombre de la asignatura.
     * @param _curso Curso academico.
     */
    constructor(string memory _nombre, string memory _curso) {
        
        bytes memory bn = bytes(_nombre);
        require(bn.length != 0, "El nombre de la asignatura no puede ser vacio");
        
        bytes memory bc = bytes(_curso);
        require(bc.length != 0, "El curso academico de la asignatura no puede ser vacio");
        
        owner = msg.sender;
        nombre = _nombre;
        curso = _curso;
        cerrada = false;
    }
    
    
    function setCoordinador(address nuevoCoordinador) soloOwner soloAbierta public {
        coordinador = nuevoCoordinador;
    }
    
    /**
     * El numero de evaluaciones creadas.
     * 
     * @return El numero de evaluaciones creadas.
     */
    function evaluacionesLength() public view returns(uint){
        return evaluaciones.length;
    }
    
    /**
     * El numero de profesores existentes.
     * 
     * @return El numero de profesores existentes.
     */
    function profesoresLength() public view returns(uint){
        return profesores.length;
    }
    
    /**
     * Crear una prueba de evaluacion de la asignatura. Por ejemplo, practica 3.
     * 
     * Las evaluaciones se meteran en el array evaluaciones, y nos referiremos a ellas
     * por su posicion en el array.
     * 
     * @param _nombre El nombre de la evaluacion.
     * @param _fecha La fecha de evaluacion (segundos desde el 1/1/1970).
     * @param _puntos Los puntos que proporciona a la nota final.
     * 
     * @return La posicion en el array evaluaciones,
     */
     function creaEvaluacion(string memory _nombre, uint _fecha, uint _puntos) soloCoordinador soloAbierta public
     returns (uint) {
         
         bytes memory bn = bytes(_nombre);
         require(bn.length != 0, "El nombre de la evaluacion no puede ser vacio");
         
         evaluaciones.push(Evaluacion(_nombre, _fecha, _puntos));
         return evaluaciones.length - 1;
    } 
    
    /**
     * El numero de alumnos matriculados.
     * 
     * @return El numero de alumnos matriculados.
     */
    function matriculasLength() public view returns(uint) {
        return matriculas.length;
    }
    
    function addProfesor(address profesor, string memory _nombre) soloOwner soloAbierta public {
        require(!esProfesor(profesor), "El profesor debe ser unico");
        
        bytes memory bn = bytes(_nombre);
        require(bn.length != 0, "El nombre del profesor no puede ser vacio");
        
        datosProfesor[profesor] = _nombre;
        
        profesores.push(profesor);
    }
    
    /**
     * Los alumnos pueden automatricularse con el metodo automatricula.
     * 
     * Impedir que se pueda meter un nombre vacio.
     * 
     * @param _nombre El nombre del alumno.
     * @param _email El email del alumno.
     * @param _dni El DNI del alumno
     */
    function automatricula(string memory _nombre, string memory _email, string memory _dni) noMatriculados soloAbierta public {
        
        bytes memory bn = bytes(_nombre);
        require(bn.length != 0, "El nombre no puede ser vacio");
    
        bytes memory bd = bytes(_dni);
        require(bd.length != 0, "El DNI no puede ser vacio");
        
        ///require(!existeDni(_dni), "El DNI ya esta asociado a otro alumno");
        
        if(existeDni(_dni)){
			revert DniAlreadyExists({dniNuevo: _dni,Mensaje: "El DNI introducido ya esta asociado a otro alumno"});
		}
        
        DatosAlumno memory datos = DatosAlumno(_nombre, _email, _dni);
        
        datosAlumno[msg.sender] = datos;
        
        matriculas.push(msg.sender);
    }
    
    /**
     * Permite a un alumno obtener sus propios datos.
     * 
     * @return _nombre El nombre del alumno que invoca el metodo.
     * @return _email El email del alumno que invoca el metodo.
     * @return _dni El DNI del alumno que invoca el metodo.
     */
    function quienSoy() soloMatriculados public view returns (string memory _nombre, string memory _email, string memory _dni) {
        DatosAlumno memory datos = datosAlumno[msg.sender];
        _nombre = datos.nombre;
        _email = datos.email;
        _dni = datos.dni;
    }
    
    /**
     * Poner la nota de un alumno en una evaluacion.
     * 
     * @param alumno        La direccion del alumno.
     * @param evaluacion    El indice de una evaluacion en el array evaluaciones.
     * @param tipo          Tipo de nota.
     * @param calificacion  La calificacion, multiplicada por 100 porque no hay decimales.
     */
    function califica(address alumno, uint evaluacion, TipoNota tipo, uint calificacion) soloProfesor soloAbierta public {
        
        require(estaMatriculado(alumno), "Solo se pueden calificar a un alumno matriculado.");
        require(evaluacion < evaluaciones.length, "No se puede calificar una evaluacion que no existe.");
        require(calificacion <= 100, "No se puede calificar con una nota superior a la maxima permitida.");
        
        Nota memory nota = Nota(tipo, calificacion);
        
        calificaciones[alumno][evaluacion] = nota;
    }
    
    function Compara(string memory a,string memory b) public pure returns(bool) {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }
    
    /**
     * Consulta si una direccion pertenece a un alumno matriculado.
     * 
     * @param alumno La direccion de un alumno.
     * 
     * @return true si es un alumno matriculado.
     */
    function estaMatriculado(address alumno) private view returns (bool) {
        
        string memory _nombre = datosAlumno[alumno].nombre;
        
        bytes memory b = bytes(_nombre);
        
        return b.length != 0;
    }
    
    /**
     * Consulta si existe un dni para un alumno
     * 
     * @param _dni Posible dni
     * 
     * @return true si es un dni ya existente
     */
    function existeDni(string memory _dni) private view returns (bool) {
        bool existe = false;
        
        for (uint i=0; i < matriculasLength(); i++) {
            
            if (Compara((datosAlumno[matriculas[i]].dni), _dni)) {
                existe = true;
                break;
            }
        }
        
        return existe;
    }
    
    /**
     * Consulta si una direccion pertenece a un profesor.
     * 
     * @param profesor La direccion del posible profesor.
     * 
     * @return true si es un profesor
     */
    function esProfesor(address profesor) public view returns (bool) {
        
        string memory _nombre = datosProfesor[profesor];
        
        bytes memory b = bytes(_nombre);
        
        return b.length != 0;
    }
    

    /**
     * Devuelve el tipo de nota y la calificacion que ha sacado el alumno que invoca el metodo en
     * la evaluacion pasada como parametro.
     * 
     * @param evaluacion Indice de una evaluacion en el array de evaluaciones.
     * 
     * @return tipo             El tipo de nota que ha sacado el alumno.
     * @return calificacion     La calificacion que ha sacado el alumno.
     */
    function miNota(uint evaluacion) soloMatriculados public view returns (TipoNota tipo, uint calificacion) {
        
        require(evaluacion < evaluaciones.length, "El indice de la evaluacion no existe.");
        
        Nota memory nota = calificaciones[msg.sender][evaluacion];
        
        tipo = nota.tipo;
        calificacion = nota.calificacion;
    }
    
    function cerrar() soloCoordinador public {
        cerrada = true;
    }
    
    
    /**
     * Modificador para que una funcion solo la pueda ejecutar un profesor.
     * 
     * Se usa en creaEvaluacion y en califica.
     */
    modifier soloProfesor() {
        
        require(esProfesor(msg.sender), "Solo permitido al profesor");
        _;
    }
    
    /**
     * Modificador para que una funcion solo la pueda ejecutar un alumno matriculado.
     */
    modifier soloMatriculados() {
        
        require(estaMatriculado(msg.sender), "Solo permitido a alumnos matriculados");
        _;
    }
    
    /**
     * Modificador para que una funcion solo la pueda ejecutar un alumno no matriculado.
     * 
     * Se usa en creaEvaluacion y en califica.
     */
    modifier noMatriculados() {
        
        require(!estaMatriculado(msg.sender), "Solo permitido a alumnos no matriculados");
        _;
    }
    
    modifier soloAbierta() {
        
        require(cerrada == false, "Solo permitido en asignaturas abiertas");
        _;
    }
    
     /**
     * Modificador para que una funcion solo la pueda ejecutar el owner.
     */
    modifier soloOwner() {
        
        require(msg.sender == owner, "Solo permitido al owner");
        _;
    }
    
    /**
     * Modificador para que una funcion solo la pueda ejecutar el coordinador de la asignatura.
     */
    modifier soloCoordinador() {
        
        require(msg.sender == coordinador, "Solo permitido al coordinador de la asignatura");
        _;
    }
    
    /**
     * No se permite la recepcion de dinero.
     */
    receive() external payable {
        revert("No se permite la recepcion de dinero.");
    }
    
}