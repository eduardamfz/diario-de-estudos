// TELA 1: Início ( / )
// Apresenta o site e leva a pessoa para Criar conta ou Entrar.
import Link from "next/link";

// Ícones simples (desenhados em SVG) usados nos três cartões
const Icone = ({ children }) => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const IconePasta = () => (
  <Icone>
    <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  </Icone>
);

const recursos = [
  {
    titulo: "Uma pasta para cada matéria",
    texto: "Crie pastas como História, Biologia ou Matemática e deixe tudo no lugar certo.",
    icone: (
      <Icone>
        <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      </Icone>
    ),
  },
  {
    titulo: "Guarde tudo da aula",
    texto: "Salve textos, frases, links de vídeos e de slides, como em um caderno que não se perde.",
    icone: (
      <Icone>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M8 9h8M8 13h5" />
      </Icone>
    ),
  },
  {
    titulo: "Estude com um resumo pronto",
    texto: "Na hora de revisar, o site junta o que você guardou em uma folha de estudo.",
    icone: (
      <Icone>
        <path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z" />
        <path d="M19 15l.7 1.8L21.5 17.5l-1.8.7L19 20l-.7-1.8-1.8-.7 1.8-.7z" />
      </Icone>
    ),
  },
];

const pastasExemplo = [
  { nome: "História", info: "8 materiais", etiqueta: "Prova sexta" },
  { nome: "Biologia", info: "5 materiais", etiqueta: "Resumo pronto" },
  { nome: "Matemática", info: "11 materiais", etiqueta: "Revisando" },
];

export default function Inicio() {
  return (
    <>
      {/* Destaque principal */}
      <section className="hero">
        <div className="hero-conteudo">
          <div>
            <span className="selo">Para estudantes de qualquer área</span>
            <h1>
              Guarde o que você aprende. <span>Estude sem pressa.</span>
            </h1>
            <p className="hero-texto">
              Crie uma pasta para cada matéria, jogue nela textos, vídeos e slides das aulas, e
              estude depois com um resumo pronto.
            </p>
            <div className="hero-botoes">
              <Link href="/cadastro" className="btn btn-branco btn-grande">
                Começar agora
              </Link>
              <Link href="/entrar" className="btn btn-contorno-claro btn-grande">
                Já tenho conta
              </Link>
            </div>
          </div>

          {/* Pastas de exemplo, só para enfeitar */}
          <div className="hero-visual" aria-hidden="true">
            {pastasExemplo.map((pasta) => (
              <div className="pasta-exemplo" key={pasta.nome}>
                <div className="pasta-topo">
                  <span className="pasta-icone">
                    <IconePasta />
                  </span>
                  <div>
                    <div className="pasta-nome">{pasta.nome}</div>
                    <div className="pasta-meta">{pasta.info}</div>
                  </div>
                </div>
                <span className="etiqueta">{pasta.etiqueta}</span>
                <div className="pasta-linha" style={{ width: "92%" }} />
                <div className="pasta-linha" style={{ width: "64%" }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Como o site ajuda */}
      <section className="secao">
        <div className="secao-titulo">
          <h2>Tudo o que você precisa para estudar</h2>
          <p>Simples de usar, do primeiro dia de aula até a véspera da prova.</p>
        </div>
        <div className="grade-3">
          {recursos.map((recurso) => (
            <article className="cartao" key={recurso.titulo}>
              <div className="cartao-icone">{recurso.icone}</div>
              <h3>{recurso.titulo}</h3>
              <p>{recurso.texto}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Chamada final */}
      <section className="chamada">
        <div className="chamada-caixa">
          <h2>Comece o seu diário hoje</h2>
          <p>É grátis e leva menos de um minuto para criar a conta.</p>
          <Link href="/cadastro" className="btn btn-branco btn-grande">
            Criar minha conta
          </Link>
        </div>
      </section>
    </>
  );
}
