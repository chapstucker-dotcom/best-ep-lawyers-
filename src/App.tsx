import "./App.css";
import AttorneyProfile from "./pages/AttorneyProfile";
import CarAccidentLawyers from "./pages/CarAccidentLawyers";

export default function App() {
  const path = window.location.pathname;

  if (path === "/el-paso-car-accident-lawyers") {
    return <CarAccidentLawyers />;
  }

  if (path === "/attorneys/johnson-injury-lawyers") {
    return (
      <AttorneyProfile
        firm="Johnson Injury Lawyers"
        title="El Paso Personal Injury Attorneys"
        phone="9155551000"
        website="https://example.com"
        rating="5.0"
        reviews="214 Reviews"
        description="Johnson Injury Lawyers helps clients throughout El Paso with car accidents, truck accidents, catastrophic injury claims, wrongful death litigation, and insurance disputes."
        services={[
          "Car accident claims",
          "Truck accident litigation",
          "Wrongful death",
          "Insurance disputes",
          "Catastrophic injuries",
        ]}
      />
    );
  }

  if (path === "/attorneys/el-paso-family-law-group") {
    return (
      <AttorneyProfile
        firm="El Paso Family Law Group"
        title="El Paso Divorce & Family Law Attorneys"
        phone="9155552000"
        website="https://example.com"
        rating="4.9"
        reviews="132 Reviews"
        description="El Paso Family Law Group assists clients with divorce, child custody, child support, adoption, mediation, and complex family disputes throughout El Paso County."
        services={[
          "Divorce representation",
          "Child custody",
          "Child support",
          "Adoption",
          "Family mediation",
        ]}
      />
    );
  }

  if (path === "/attorneys/border-defense-criminal-lawyers") {
    return (
      <AttorneyProfile
        firm="Border Defense Criminal Lawyers"
        title="El Paso Criminal Defense Attorneys"
        phone="9155553000"
        website="https://example.com"
        rating="4.8"
        reviews="189 Reviews"
        description="Border Defense Criminal Lawyers represents clients facing DWI charges, drug offenses, felony accusations, and federal criminal matters in El Paso, Texas."
        services={[
          "DWI defense",
          "Drug offenses",
          "Felony defense",
          "Federal criminal defense",
          "Bond hearings",
        ]}
      />
    );
  }

  if (path === "/attorneys/el-paso-immigration-legal-center") {
    return (
      <AttorneyProfile
        firm="El Paso Immigration Legal Center"
        title="El Paso Immigration Attorneys"
        phone="9155554000"
        website="https://example.com"
        rating="4.9"
        reviews="164 Reviews"
        description="El Paso Immigration Legal Center helps individuals and families with visas, green cards, citizenship, deportation defense, and immigration court proceedings."
        services={[
          "Green cards",
          "Citizenship",
          "Deportation defense",
          "Immigration court",
          "Family immigration",
        ]}
      />
    );
  }

  return <CarAccidentLawyers />;
}