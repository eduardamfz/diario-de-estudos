"use client";
// Tela 7 (criar): /pastas/[id]/material/novo
import { useParams } from "next/navigation";
import FormularioMaterial from "@/components/FormularioMaterial";

export default function NovoMaterial() {
  const { id } = useParams();
  return <FormularioMaterial pastaId={id} />;
}
