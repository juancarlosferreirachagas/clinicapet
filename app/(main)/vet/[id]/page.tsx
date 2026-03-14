"use client";

import { useParams } from "next/navigation";
import { VetFicha } from "@/components/VetFicha";

export default function VetPage() {
  const params = useParams();
  const id = params.id as string;
  return <VetFicha id={id} />;
}
