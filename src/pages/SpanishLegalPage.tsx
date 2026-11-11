import PracticeAreaFirmDirectory from "../components/PracticeAreaFirmDirectory";
import LeadCaptureForm from "../components/LeadCaptureForm";
import type { PracticeAreaPageData } from "../data/practiceAreaPages";

type Topic = "immigration" | "car";
const config = {
  immigration: {
    path: "/el-paso-immigration-lawyers", shortTitle: "Immigration", practiceArea: "Immigration",
    english: "/el-paso-immigration-lawyers/", heading: "Abogados de inmigración en El Paso, Texas",
    intro: "Compare abogados y despachos que atienden asuntos de inmigración. Explore sus perfiles, experiencia y opciones de contacto antes de solicitar una consulta.",
    context: "En una comunidad fronteriza como El Paso, las familias y empresas pueden enfrentar trámites ante USCIS, consulados y tribunales de inmigración. Cada caso requiere una evaluación individual de elegibilidad, plazos y documentación.",
    services: ["Peticiones familiares y residencia permanente", "Ciudadanía y naturalización", "Visas y procesamiento consular", "Defensa en procedimientos de deportación", "Perdones migratorios y ajuste de estatus"],
    questions: [
      ["¿Cómo elegir un abogado de inmigración?", "Compare experiencia con el trámite específico, comunicación, honorarios y disponibilidad de atención en español. Pregunte quién llevará su caso y qué servicios incluye la consulta."],
      ["¿Puede un abogado ayudar con una residencia permanente?", "Un abogado puede revisar las vías de elegibilidad, preparar solicitudes y explicar posibles obstáculos. La aprobación depende de las circunstancias y de las autoridades correspondientes."],
      ["¿Qué hago si recibí una notificación de audiencia?", "Revise la fecha y el lugar de la audiencia y busque orientación legal cuanto antes. Los plazos y las consecuencias dependen del documento y de su situación."],
    ],
  },
  car: {
    path: "/el-paso-car-accident-lawyers", shortTitle: "Car Accident", practiceArea: "car-accidents",
    english: "/el-paso-car-accident-lawyers/", heading: "Abogados de accidentes de auto en El Paso, Texas",
    intro: "Compare abogados que atienden reclamaciones por choques de automóviles, lesiones y disputas con aseguradoras en El Paso. Revise los perfiles de los despachos participantes y sus opciones de contacto.",
    context: "Después de un choque, la atención médica, la documentación y la conservación de pruebas pueden ser importantes. La responsabilidad y las opciones de indemnización dependen de los hechos, las pólizas y las leyes aplicables.",
    services: ["Choques con lesiones y gastos médicos", "Reclamaciones y disputas con aseguradoras", "Accidentes con conductores sin seguro", "Choques por alcance e intersecciones", "Accidentes con responsabilidad disputada"],
    questions: [
      ["¿Qué debo hacer después de un accidente?", "Busque atención médica cuando sea necesaria, reporte el choque cuando corresponda y conserve fotos, información de testigos, informes y documentos del seguro."],
      ["¿Qué pasa si el otro conductor no tiene seguro?", "Las opciones dependen de la cobertura disponible y de las circunstancias. Un abogado puede revisar pólizas y posibles fuentes de recuperación."],
      ["¿Cuándo conviene consultar a un abogado?", "Considere una consulta cuando hay lesiones importantes, desacuerdo sobre la culpa, problemas con el seguro o pruebas que podrían perderse."],
    ],
  },
} as const;

export default function SpanishLegalPage({ topic }: { topic: Topic }) {
  const data = config[topic];
  const directoryPage: PracticeAreaPageData = {
    path: data.path, shortTitle: data.shortTitle, title: data.heading,
    description: data.intro, metaDescription: data.intro, heroText: data.intro,
    topics: [data.practiceArea], faqs: [], relatedPages: [],
  };
  return (
    <main lang="es" style={{ minHeight: "100vh", background: "#0f172a", color: "#f8fafc", padding: "32px 20px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <nav aria-label="Idioma" style={{ textAlign: "right", marginBottom: 32 }}>
          <a href={data.english} style={{ color: "#fbbf24", fontWeight: 700 }}>English</a>
          <span aria-hidden="true" style={{ margin: "0 12px" }}>|</span>
          <span aria-current="page">Español</span>
        </nav>
        <p style={{ color: "#fbbf24", fontWeight: 700 }}>El Paso's Best Lawyers · Directorio legal</p>
        <h1 style={{ color: "#fbbf24", fontSize: "clamp(2rem, 5vw, 3.4rem)", lineHeight: 1.15 }}>{data.heading}</h1>
        <p style={{ fontSize: 20, lineHeight: 1.7 }}>{data.intro}</p>
        <p style={{ lineHeight: 1.7, color: "#cbd5e1" }}>{data.context}</p>
        <section style={{ margin: "44px 0" }}>
          <h2 style={{ fontSize: 29 }}>Asuntos legales frecuentes</h2>
          <ul style={{ lineHeight: 2, paddingLeft: 25 }}>{data.services.map(item => <li key={item}>{item}</li>)}</ul>
        </section>
        <section style={{ margin: "44px 0" }}>
          <h2 style={{ fontSize: 29 }}>Compare despachos de abogados en El Paso</h2>
          <p style={{ color: "#cbd5e1" }}>Los perfiles y las categorías de los despachos pueden contener información en inglés. Confirme directamente si ofrecen atención en español.</p>
          <PracticeAreaFirmDirectory page={directoryPage} />
        </section>
        <section style={{ margin: "44px 0" }}>
          <h2 style={{ fontSize: 29 }}>Preguntas frecuentes</h2>
          {data.questions.map(([question, answer]) => <div key={question} style={{ marginBottom: 24 }}><h3 style={{ fontSize: 21 }}>{question}</h3><p style={{ lineHeight: 1.7 }}>{answer}</p></div>)}
        </section>
        <section style={{ margin: "44px 0" }}>
          <h2 style={{ fontSize: 29 }}>Solicite información sobre una consulta</h2>
          <p style={{ lineHeight: 1.7 }}>Describa su situación sin incluir información confidencial. Enviar el formulario no crea una relación abogado-cliente ni garantiza representación.</p>
          <LeadCaptureForm practiceArea={data.practiceArea} title="Solicitar una consulta" description="Comparta información básica sobre su asunto legal. El formulario está disponible en español." phoneOptional locale="es" />
        </section>
        <p style={{ fontSize: 14, color: "#cbd5e1" }}>La información de esta página es general y no constituye asesoría legal. No se garantizan resultados.</p>
        <a href="/" style={{ color: "#fbbf24" }}>Volver al inicio</a>
      </div>
    </main>
  );
}
