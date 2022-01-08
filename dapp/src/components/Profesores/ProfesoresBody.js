import ProfesorRow from "./ProfesorRow";

const ProfesoresBody = ({profesoresLength}) => {

    let rows = [];
    for (let i = 0; i < profesoresLength; i++) {
        rows.push(<ProfesorRow key={"ab-"+i} profesorIndex={i}/>);
    }

    return <tbody>{rows}</tbody>;
};

export default ProfesoresBody;
