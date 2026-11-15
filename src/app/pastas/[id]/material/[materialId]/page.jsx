"use client";
// Tela 7 (editar): /pastas/[id]/material/[materialId]
import { useParams } from "next/navigation";
import FormularioMaterial from "@/components/FormularioMaterial";

export default function EditarMaterial() {
  const { id, materialId } = useParams();
  return <FormularioMaterial pastaId={id} materialId={materialId} />;
}
