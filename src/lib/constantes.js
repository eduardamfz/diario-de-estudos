// Valores fixos usados em várias telas.
export const TIPOS = [
  { valor: "texto", rotulo: "Texto" },
  { valor: "video", rotulo: "Vídeo" },
  { valor: "slide", rotulo: "Slide" },
  { valor: "link", rotulo: "Link" },
];
export const rotuloDoTipo = (t) => TIPOS.find((x) => x.valor === t)?.rotulo ?? t;

// Cores que a pessoa pode escolher para a pasta
export const CORES = ["#6D28D9", "#A78BFA", "#7C3AED", "#DB2777", "#0EA5E9", "#16A34A", "#F59E0B"];
