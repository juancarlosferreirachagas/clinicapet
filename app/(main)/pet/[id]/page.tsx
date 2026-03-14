"use client";

import { useParams } from "next/navigation";
import { PetFicha } from "@/components/PetFicha";

export default function PetPage() {
  const params = useParams();
  const id = params.id as string;
  return <PetFicha id={id} />;
}
