import type { Post } from "./types";
import { withReadingTime } from "./reading-time";

const posts: Post[] = [
  withReadingTime({
    slug: "que-es-un-radicado-rama-judicial",
    title: "Qué es un radicado y por qué es clave en la justicia colombiana",
    date: "2026-08-10",
    updatedAt: "2026-08-12",
    tags: [{ slug: "rama-judicial", name: "Rama Judicial" }, { slug: "guias", name: "Guías" }],
    excerpt:
      "El número de radicado es la identidad de tu proceso judicial. Te explicamos qué es, cómo leerlo y por qué es la puerta de entrada a la vigilancia procesal automatizada.",
    coverImage: "/covers/radicado.svg",
    author: "Equipo Wabog",
    blocks: [
      {
        type: "tldr",
        text: "El radicado es el número único de 23 dígitos que identifica un proceso judicial en Colombia. Sin él no puedes consultar ni vigilar tu caso ante la Rama Judicial.",
      },
      {
        type: "paragraph",
        text: "Si alguna vez has tenido un proceso en Colombia, seguramente escuchaste la pregunta: «¿cuál es tu número de radicado?». Esa cifra, que parece un simple dato administrativo, es en realidad la identidad de tu proceso: sin ella no existe una manera oficial de localizarlo, seguirlo ni consultarlo.",
      },
      {
        type: "heading",
        level: 2,
        text: "¿Qué es exactamente un radicado?",
      },
      {
        type: "paragraph",
        text: "Un radicado es el código numérico único que la Rama Judicial asigna a cada proceso cuando es admitido. Funciona como la cédula del proceso: lo identifica de manera inequívoca frente a juzgados, tribunales y despachos de todo el país.",
      },
      {
        type: "quote",
        text: "El radicado es la llave que conecta tu caso con el expediente digital de la justicia colombiana.",
        cite: "Guía Wabog de vigilancia procesal",
      },
      {
        type: "heading",
        level: 3,
        text: "¿Cómo se compone un número de 23 dígitos?",
      },
      {
        type: "paragraph",
        text: "El formato estándar del Consejo Superior de la Judicatura es de 23 dígitos, y cada grupo tiene un significado:",
      },
      {
        type: "table",
        headers: ["Grupo", "Dígitos", "Qué significa"],
        rows: [
          ["1", "1–5", "Despacho judicial (código del juzgado o tribunal)"],
          ["2", "6–7", "Tipo de proceso (ejecutivo, ordinario, penal…)"],
          ["3", "8–9", "Año de radicación"],
          ["4", "10–23", "Número consecutivo del proceso"],
        ],
      },
      {
        type: "callout",
        tone: "info",
        title: "Dato clave",
        text: "Un radicado bien digitado es la diferencia entre encontrar tu proceso en segundos o perder horas buscando entre consultas incorrectas.",
      },
      {
        type: "heading",
        level: 2,
        text: "¿Qué tipos de radicado existen?",
      },
      {
        type: "list",
        ordered: false,
        items: [
          "Radicado de primera instancia: el número inicial con el que nace el proceso.",
          "Radicado de segunda instancia: se genera al apelar o interponer recursos ante el tribunal.",
          "Radicado de tutela: para acciones de tutela, con reglas y plazos propios.",
        ],
      },
      {
        type: "paragraph",
        text: "Aunque cambien las instancias, el vínculo entre números permite reconstruir la historia completa del proceso.",
      },
      {
        type: "cta_pill",
        label: "Vigila tu radicado gratis por 15 días",
        href: "https://wabog.com",
      },
      {
        type: "faq",
        items: [
          {
            question: "¿Dónde encuentro el radicado de mi proceso?",
            answer:
              "En la notificación inicial de tu proceso, en el certificado de existencia, en las consultas de la Rama Judicial o preguntándole a tu apoderado.",
          },
          {
            question: "¿El radicado cambia cuando el proceso sube a segunda instancia?",
            answer:
              "Sí: la segunda instancia recibe un nuevo número, pero siempre queda vinculado al radicado original a través del sistema.",
          },
          {
            question: "¿Puedo vigilar varios radicados a la vez?",
            answer:
              "Sí. Con Wabog puedes registrar todos tus radicados y recibir una alerta en WhatsApp cada vez que el juzgado registre una actuación nueva.",
          },
        ],
      },
    ],
  }),
  withReadingTime({
    slug: "consultar-procesos-judiciales-en-linea",
    title: "Cómo consultar procesos judiciales en línea: guía paso a paso",
    date: "2026-08-05",
    tags: [{ slug: "rama-judicial", name: "Rama Judicial" }, { slug: "tutoriales", name: "Tutoriales" }],
    excerpt:
      "Aprende a consultar cualquier proceso de la Rama Judicial de Colombia desde tu computador o celular, gratis y en pocos minutos, con el número de radicado correcto.",
    coverImage: "/covers/consultar.svg",
    author: "Equipo Wabog",
    blocks: [
      {
        type: "paragraph",
        text: "Consultar el estado de un proceso judicial en Colombia ya no requiere ir al juzgado ni esperar a que te notifiquen por correo físico. La Rama Judicial publica la información de los expedientes en línea y, con la guía correcta, puedes verificarla tú mismo en minutos.",
      },
      {
        type: "heading",
        level: 2,
        text: "Requisitos antes de empezar",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "Ten a la mano el número de radicado (23 dígitos).",
          "Asegúrate de que el proceso sea de consulta pública.",
          "Conectate desde un navegador actualizado (Chrome, Safari o Edge).",
        ],
      },
      {
        type: "callout",
        tone: "warning",
        title: "Ojo con los errores de digitación",
        text: "Un solo dígito mal escrito devuelve «proceso no encontrado». Copia y pega el radicado si es posible.",
      },
      {
        type: "heading",
        level: 3,
        text: "Formato del radicado",
      },
      {
        type: "code",
        lang: "text",
        code: "05001-31-03-003-2020-00123-00",
      },
      {
        type: "paragraph",
        text: "Es común escribirlo con guiones para agrupar los dígitos, pero los buscadores de la Rama Judicial aceptan el número continuo de 23 dígitos.",
      },
      {
        type: "heading",
        level: 2,
        text: "Paso a paso",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "Entra al portal de consulta de procesos de la Rama Judicial.",
          "Selecciona la especialidad correcta (civil, penal, laboral, etc.).",
          "Elige la opción de búsqueda «por número de radicación».",
          "Ingresa el radicado y pulsa consultar.",
          "Revisa el último movimiento y las actuaciones registradas.",
        ],
      },
      {
        type: "youtube",
        videoId: "dQw4w9WgXcQ",
      },
      {
        type: "divider",
      },
      {
        type: "callout",
        tone: "success",
        title: "El paso siguiente: vigilancia automatizada",
        text: "Consultar manualmente funciona, pero revisar a mano cada día es insostenible. Wabog vigila tus radicados en tiempo real y te avisa por WhatsApp en el instante en que aparece una actuación nueva.",
      },
      {
        type: "table",
        headers: ["Método", "Frecuencia", "Esfuerzo"],
        rows: [
          ["Consulta manual", "Cuando te acuerdes", "Alto"],
          ["Recordatorios de calendario", "Periódica", "Medio"],
          ["Wabog (alertas por WhatsApp)", "Tiempo real", "Cero"],
        ],
      },
      {
        type: "faq",
        items: [
          {
            question: "¿La consulta en línea es gratuita?",
            answer:
              "Sí. La Rama Judicial ofrece consulta pública gratuita de los procesos en la mayoría de las especialidades.",
          },
          {
            question: "¿Qué pasa si no aparece mi proceso?",
            answer:
              "Verifica la especialidad y el radicado. Si sigue sin aparecer, el proceso puede ser de acceso restringido o el juzgado aún no lo ha indexado.",
          },
        ],
      },
      {
        type: "cta_pill",
        label: "Prueba Wabog gratis",
        href: "https://wabog.com",
      },
    ],
  }),
];

export function getAllPosts(): Post[] {
  return posts;
}

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getPostsByTag(tag: string): Post[] {
  return posts.filter((p) => p.tags.some((t) => t.slug === tag));
}

export function getAllTags(): { slug: string; name: string; count: number }[] {
  const map = new Map<string, { slug: string; name: string; count: number }>();
  for (const post of posts) {
    for (const tag of post.tags) {
      const current = map.get(tag.slug);
      if (current) {
        current.count += 1;
      } else {
        map.set(tag.slug, { slug: tag.slug, name: tag.name, count: 1 });
      }
    }
  }
  return [...map.values()].sort((a, b) => b.count - a.count);
}

export function getLatestPost(): Post | undefined {
  return [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
}