"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, getErrorMessage } from "@/lib/api";
import { API_BASE, CN } from "@/lib/constants";
import type { Pet } from "@/lib/types";
import { useToast } from "./Toast";
import { useConfirm } from "./ConfirmModal";
import { SectionHeader } from "./ui/SectionHeader";
import { Card, CardHeader } from "./ui/Card";
import { FormField } from "./ui/FormField";
import { Modal } from "./ui/Modal";
import { PetAvatar } from "./PetAvatar";
import { PetInfoBadges } from "./PetInfoBadges";

const EMPTY_FORM = { nome: "", especie: "", raca: "", nome_tutor: "", telefone: "", foto_url: "", data_nascimento: "", sexo: "" };

export function PetsSection() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<number | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { confirm } = useConfirm();

  const load = () => {
    api<Pet[]>(`${API_BASE}/pets`).then((r) => {
      if (r.ok && Array.isArray(r.dados)) setPets(r.dados);
      else toast(getErrorMessage(r, "Erro ao carregar."), "error");
      setLoading(false);
    });
  };

  useEffect(() => load(), []);

  const resetForm = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
  };

  const handleEdit = (p: Pet) => {
    setEditId(p.id);
    setForm({
      nome: p.nome,
      especie: p.especie,
      raca: p.raca || "",
      nome_tutor: p.nome_tutor,
      telefone: p.telefone || "",
      foto_url: p.foto_url || "",
      data_nascimento: p.data_nascimento || "",
      sexo: p.sexo || "",
    });
    setFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!(await confirm({ titulo: "Excluir pet", mensagem: "Esta ação remove o pet permanentemente. Deseja continuar?", confirmarTexto: "Excluir" }))) return;
    const r = await api<{ mensagem?: string }>(`${API_BASE}/pets/${id}`, { method: "DELETE" });
    if (r.ok) {
      toast("Pet excluído com sucesso.", "success");
      resetForm();
      load();
    } else toast(getErrorMessage(r, "Erro ao excluir."), "error");
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const r = await fetch("/api/upload", { method: "POST", body: fd });
    const json = await r.json();
    setUploading(false);
    e.target.value = "";
    if (r.ok && json.url) {
      setForm((f) => ({ ...f, foto_url: json.url }));
      toast("Foto anexada.", "success");
    } else toast(json.erro || "Erro ao enviar foto.", "error");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = { ...form, raca: form.raca || null, telefone: form.telefone || null, foto_url: form.foto_url || null, data_nascimento: form.data_nascimento || null, sexo: form.sexo || null };
    const url = editId ? `${API_BASE}/pets/${editId}` : `${API_BASE}/pets`;
    const r = await api<Pet>(url, {
      method: editId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (r.ok) {
      toast(editId ? "Pet atualizado com sucesso." : "Pet cadastrado com sucesso.", "success");
      resetForm();
      setFormOpen(false);
      load();
    } else toast(getErrorMessage(r, "Erro ao salvar."), "error");
  };

  const novoBtn = (
    <button type="button" onClick={() => { resetForm(); setFormOpen(true); }} className={CN.btnNovo}>
      <span className="material-icons-round text-base">add</span> Novo pet
    </button>
  );

  return (
    <section>
      <SectionHeader
        title="Cadastro de Pets"
        subtitle="Cadastre os pets e seus tutores"
        quickLinks={[{ href: "/?s=consultas", label: "Ver agenda" }, { href: "/?s=vets", label: "Veterinários" }]}
      />
      <Modal open={formOpen} onClose={() => { resetForm(); setFormOpen(false); }} title={editId ? "Editar pet" : "Cadastrar pet"}>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <datalist id="especies">
                <option value="Cachorro" /><option value="Gato" /><option value="Ave" /><option value="Coelho" /><option value="Hamster" />
              </datalist>
              <datalist id="racas">
                <option value="SRD" /><option value="Labrador" /><option value="Golden Retriever" /><option value="Persa" /><option value="Siamês" />
              </datalist>
              <div>
                <h4 className="text-[0.75rem] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <span className="material-icons-round text-sm">pets</span> Dados do animal
                </h4>
                <div className="grid grid-cols-2 gap-4 gap-x-5">
                  <FormField label="Nome" hint="Nome pelo qual o animal é chamado">
                    <input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} className={CN.input} placeholder="Ex: Rex, Mia, Thor" required />
                  </FormField>
                  <FormField label="Espécie">
                    <input value={form.especie} onChange={(e) => setForm({ ...form, especie: e.target.value })} className={CN.input} placeholder="Cachorro, Gato, Ave, Coelho" required list="especies" />
                  </FormField>
                  <FormField label="Raça" hint="Use SRD se sem raça definida" className="col-span-2 sm:col-span-1">
                    <input value={form.raca} onChange={(e) => setForm({ ...form, raca: e.target.value })} className={CN.input} placeholder="Ex: Labrador, Persa, SRD" list="racas" />
                  </FormField>
                  <FormField label="Data de nascimento" hint="Para calcular a idade">
                    <input type="date" value={form.data_nascimento} onChange={(e) => setForm({ ...form, data_nascimento: e.target.value })} className={CN.input} />
                  </FormField>
                  <FormField label="Sexo">
                    <select value={form.sexo} onChange={(e) => setForm({ ...form, sexo: e.target.value })} className={CN.input}>
                      <option value="">Selecione</option>
                      <option value="macho">Macho</option>
                      <option value="femea">Fêmea</option>
                    </select>
                  </FormField>
                  <FormField label="Foto" className="col-span-2 sm:col-span-1">
                    <div className="flex gap-2 items-center flex-wrap">
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 text-[0.8125rem] font-medium rounded-lg bg-[var(--primary-muted)] text-[var(--primary)] hover:bg-[var(--primary-light)] transition-colors">
                        <span className="material-icons-round text-lg">add_photo_alternate</span>
                        {uploading ? "Enviando..." : "Anexar foto"}
                        <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" onChange={handleFileChange} disabled={uploading} />
                      </label>
                      {form.foto_url && <span className="text-[0.75rem] text-emerald-600 font-medium">✓ Foto anexada</span>}
                    </div>
                  </FormField>
                </div>
              </div>
              <div>
                <h4 className="text-[0.75rem] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <span className="material-icons-round text-sm">person</span> Dados do tutor
                </h4>
                <div className="grid grid-cols-2 gap-4 gap-x-5">
                  <FormField label="Nome do responsável" hint="Nome completo do tutor" className="col-span-2">
                    <input value={form.nome_tutor} onChange={(e) => setForm({ ...form, nome_tutor: e.target.value })} className={CN.input} placeholder="Nome completo do tutor" required />
                  </FormField>
                  <FormField label="Telefone / WhatsApp" hint="Para contato e lembretes">
                    <input value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} className={CN.input} placeholder="(00) 00000-0000" />
                  </FormField>
                </div>
              </div>
              <div className="flex gap-3 pt-2 border-t border-slate-100">
                <button type="submit" className={CN.btnPrimary}>{editId ? "Salvar alterações" : "Cadastrar pet"}</button>
                <button type="button" onClick={() => { resetForm(); setFormOpen(false); }} className={CN.btnSecondary}>Cancelar</button>
              </div>
            </form>
      </Modal>
      <Card>
        <CardHeader title="Pets cadastrados" action={novoBtn} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading && <p className={`${CN.listEmpty} col-span-full`}>Carregando...</p>}
            {!loading && !pets.length && <p className={`${CN.listEmpty} col-span-full`}>Nenhum pet. Clique em Novo pet para cadastrar.</p>}
            {pets.map((p) => (
              <div key={p.id} className="flex flex-col rounded-[var(--radius)] border-l-[3px] border-l-[var(--primary)] bg-slate-50/80 hover:bg-[var(--primary-subtle)] p-4 transition-colors">
                <div className="flex items-start gap-3">
                  <PetAvatar fotoUrl={p.foto_url} especie={p.especie} nome={p.nome} size="sm" className="shrink-0" />
                  <Link href={`/pet/${p.id}`} className="flex-1 min-w-0">
                    <span className={CN.link}>{p.nome}</span>
                    <p className="text-[0.8125rem] text-[var(--text-muted)]">{p.especie}{p.raca ? ` • ${p.raca}` : ""}</p>
                    <PetInfoBadges data_nascimento={p.data_nascimento} sexo={p.sexo} className="mt-1" />
                    <p className="text-[0.75rem] text-[var(--text-muted)] mt-0.5">
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push(`/tutor?nome=${encodeURIComponent(p.nome_tutor)}${p.telefone ? `&telefone=${encodeURIComponent(p.telefone)}` : ""}`); }}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); router.push(`/tutor?nome=${encodeURIComponent(p.nome_tutor)}${p.telefone ? `&telefone=${encodeURIComponent(p.telefone)}` : ""}`); } }}
                        className={`${CN.link} cursor-pointer`}
                      >
                        {p.nome_tutor}
                      </span>
                      {p.telefone ? ` • ${p.telefone}` : ""}
                    </p>
                  </Link>
                </div>
                <div className="flex gap-2 mt-3 pt-3 border-t border-slate-200/60" onClick={(e) => e.stopPropagation()}>
                  <button type="button" onClick={() => handleEdit(p)} className={CN.btnEditar}><span className="material-icons-round text-sm align-[-2px] mr-0.5">edit</span> Editar</button>
                  <button type="button" onClick={() => handleDelete(p.id)} className={CN.btnExcluir}><span className="material-icons-round text-sm align-[-2px] mr-0.5">delete_outline</span> Excluir</button>
                </div>
              </div>
            ))}
          </div>
        </Card>
    </section>
  );
}
