export default function LeadCaptureForm() {
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
        style={{
          display: "grid",
          gap: "20px",
        }}
      >
        <input
          placeholder="Full Name"
          style={inputStyle}
        />

        <input
          placeholder="Email Address"
          style={inputStyle}
        />

        <input
          placeholder="Phone Number"
          style={inputStyle}
        />

        <textarea
          placeholder="Describe your legal issue"
          rows={5}
          style={{
            ...inputStyle,
            resize: "vertical",
          }}
        />

        <button
          type="submit"
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
          Request Free Consultation
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