import { useState } from "react";
import "./App.css";

export default function App() {
  const [search, setSearch] = useState("");

  function handleSearch() {
    const firmsSection = document.getElementById("firms");
    if (firmsSection) {
      firmsSection.scrollIntoView({ behavior: "smooth" });
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  }

  return (
    <main style={{ padding: "40px" }}>
      <h1>El Paso's Best Lawyers</h1>

      <div style={{ marginBottom: "30px" }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search lawyers..."
          style={{ padding: "10px", width: "300px" }}
        />

        <button
          onClick={handleSearch}
          style={{ marginLeft: "10px", padding: "10px 20px" }}
        >
          Search
        </button>
      </div>

      <section id="firms">
        <h2>Featured Firms</h2>

        <p>Cesar Ornelas Injury Law</p>
        <p>Setra Law Firm</p>
        <p>Villar & Garcia Immigration Attorneys</p>
      </section>
    </main>
  );
}