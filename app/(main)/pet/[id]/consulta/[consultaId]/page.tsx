"use client";

import { useParams } from "next/navigation";
import { ConsultaDetalhe } from "@/components/ConsultaDetalhe";

export default function ConsultaNoPetPage() {
  const params = useParams();
  const consultaId = params.consultaId as string;
  return <ConsultaDetalhe id={consultaId} petId={params.id as string} />;
}
