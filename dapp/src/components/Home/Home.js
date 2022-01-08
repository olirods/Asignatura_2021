import OwnerAddr from "./OwnerAddr";
import CoordinadorAddr from "./CoordinadorAddr";
import OpenClose from "./OpenClose";

function Home() {
    return (
      <section className="AppHome">
        <OwnerAddr />
        <CoordinadorAddr />
        <OpenClose />
      </section>
    );
}

export default Home;