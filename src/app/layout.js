// Moldura de TODAS as telas: menu no topo, a tela no meio, rodapé embaixo.
import "@fontsource-variable/inter";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Diário de Estudos",
  description:
    "Crie uma pasta para cada matéria, guarde o que você aprende e estude por um resumo pronto.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
