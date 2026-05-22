import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://yvcuhnnhspqjfnrbkhok.supabase.co",
  "YOUR_SUPABASE_ANON_KEY"
);

export default function LeadCaptureForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [legalIssue, setLegalIssue] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: any) {
    e.preventDefault();

    setLoading(true);

    // SAVE TO SUPABASE
    const { error } = await supabase
      .from("leads")
      .insert([
        {
          full_name: fullName,
          email,
          phone,
          legal_issue: legalIssue,
        },
      ]);

    if (error) {
      console.log(error);
      alert(JSON.stringify(error));
      setLoading(false);
      return;
    }

    // SEND EMAIL VIA API
    await fetch("/api/send-lead", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName,
        email,
        phone,
        legalIssue,
      }),
    });

    setLoading(false);

    alert("Consultation request submitted!");

    setFullName("");
    setEmail("");
    setPhone("");
    setLegalIssue("");
  }

  return (
    <section
      style={{
        background: "#111827",
        border: "1px solid #1e293b",
        borderRadius: "20px",
        padding: "40px",
        marginTop: "60px",
      }}
    >
      <h2
        style={{
          color: "#fbbf24",
          fontSize: "42px",
          marginBottom: "20px",
        }}
      >
        Speak With an El Paso Attorney
      </h2>

      <p
        style={{
          color: "#cbd5e1",
          marginBottom: "30px",
          lineHeight: 1.8,
        }}
      >
        Submit your information below to request a consultation.
      </p>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gap: "20px",
        }}
      >
        <input
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={inputStyle}
        />

        <textarea
          placeholder="Describe your legal issue"
          rows={5}
          value={legalIssue}
          onChange={(e) => setLegalIssue(e.target.value)}
          style={{
            ...inputStyle,
            resize: "vertical",
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            background: "#fbbf24",
            color: "#0f172a",
            padding: "18px",
            borderRadius: "12px",
            border: "none",
            fontWeight: "bold",
            fontSize: "18px",
            cursor: "pointer",
          }}
        >
          {loading
            ? "Submitting..."
            : "Request Free Consultation"}
        </button>
      </form>
    </section>
  );
}

const inputStyle = {
  padding: "18px",
  borderRadius: "12px",
  border: "1px solid #334155",
  background: "#0f172a",
  color: "white",
  fontSize: "16px",
};