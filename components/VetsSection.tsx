"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, getErrorMessage } from "@/lib/api";
import { API_BASE, CN } from "@/lib/constants";
import type { Veterinario } from "@/lib/types";
import { useToast } from "./Toast";
import { useConfirm } from "./ConfirmModal";
import { SectionHeader } from "./ui/SectionHeader";
import { Card, CardHeader } from "./ui/Card";
import { FormField } from "./ui/FormField";
import { Modal } from "./ui/Modal";

const EMPTY_FORM = { nome: "", crmv: "", especialidade: "", email: "" };

export function VetsSection() {
  const [vets, setVets] = useState<Veterinario[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<number | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const { toast } = useToast();
  const { confirm } = useConfirm();

  const load = () => {
    api<Veterinario[]>(`${API_BASE}/veterinarios`).then((r) => {
      if (r.ok && Array.isArray(r.dados)) setVets(r.dados);
      else toast(getErrorMessage(r, "Erro ao carregar."), "error");
      setLoading(false);
    });
  };

  useEffect(() => load(), []);

  const resetForm = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
  };

  const handleEdit = (v: Veterinario) => {
    setEditId(v.id);
    setForm({ nome: v.nome, crmv: v.crmv, especialidade: v.especialidade || "", email: v.email || "" });
    setFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!(await confirm({ titulo: "Excluir veterinário", mensagem: "O veterinário será removido permanentemente. Deseja continuar?", confirmarTexto: "Excluir" }))) return;
    const r = await api<{ mensagem?: string }>(`${API_BASE}/veterinarios/${id}`, { method: "DELETE" });
    if (r.ok) {
      toast("Veterinário excluído com sucesso.", "success");
      resetForm();
      load();
    } else toast(getErrorMessage(r, "Erro ao excluir."), "error");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = { ...form, especialidade: form.especialidade || null, email: form.email || null };
    const url = editId ? `${API_BASE}/veterinarios/${editId}` : `${API_BASE}/veterinarios`;
    const r = await api<Veterinario>(url, {
      method: editId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (r.ok) {
      toast(editId ? "Veterinário atualizado com sucesso." : "Veterinário cadastrado com sucesso.", "success");
      resetForm();
      setFormOpen(false);
      load();
    } else toast(getErrorMessage(r, "Erro ao salvar."), "error");
  };

  const novoBtn = (
    <button type="button" onClick={() => { resetForm(); setFormOpen(true); }} className={CN.btnNovo}>
      <span className="material-icons-round text-base">add</span> Novo
    </button>
  );

  return (
    <section>
      <SectionHeader
        title="Cadastro de Veterinários"
        subtitle="Gerencie a equipe de veterinários"
        quickLinks={[{ href: "/?s=consultas", label: "Ver agenda" }, { href: "/?s=pets", label: "Pets" }]}
      />
      <Modal open={formOpen} onClose={() => { resetForm(); setFormOpen(false); }} title={editId ? "Editar veterinário" : "Cadastrar veterinário"}>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <datalist id="especialidades">
                <option value="Clínica geral" /><option value="Cirurgia" /><option value="Dermatologia" /><option value="Cardiologia" /><option value="Oftalmologia" />
              </datalist>
              <div className="grid grid-cols-2 gap-4 gap-x-5">
                <FormField label="Nome completo" hint="Nome do profissional">
                  <input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} className={CN.input} placeholder="Dr(a) Nome Completo" required />
                </FormField>
                <FormField label="CRMV" hint="Registro profissional (UF + número)">
                  <input value={form.crmv} onChange={(e) => setForm({ ...form, crmv: e.target.value })} className={CN.input} placeholder="Ex: SP-12345 ou MG 6789" required />
                </FormField>
                <FormField label="Especialidade">
                  <input value={form.especialidade} onChange={(e) => setForm({ ...form, especialidade: e.target.value })} className={CN.input} placeholder="Clínica geral, Cirurgia, Dermatologia" list="especialidades" />
                </FormField>
                <FormField label="E-mail">
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={CN.input} placeholder="email@clinica.com" />
                </FormField>
              </div>
              <div className="flex gap-3 pt-2 border-t border-slate-100">
                <button type="submit" className={CN.btnPrimary}>{editId ? "Salvar alterações" : "Cadastrar veterinário"}</button>
                <button type="button" onClick={() => { resetForm(); setFormOpen(false); }} className={CN.btnSecondary}>Cancelar</button>
              </div>
            </form>
      </Modal>
      <Card>
          <CardHeader title="Veterinários cadastrados" action={novoBtn} />
          <div className="space-y-2.5">
            {loading && <p className={CN.listEmpty}>Carregando...</p>}
            {!loading && !vets.length && <p className={CN.listEmpty}>Nenhum veterinário.</p>}
            {vets.map((v) => (
              <div key={v.id} className={CN.listItem}>
                <Link href={`/vet/${v.id}`} className="flex-1 min-w-0 block">
                  <span className={CN.link}>{v.nome}</span> – CRMV {v.crmv}
                  <p className="mt-0.5 text-[0.75rem] text-[var(--text-muted)]">{v.especialidade || "-"}{v.email ? ` • ${v.email}` : ""}</p>
                </Link>
                <div className="flex gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <button type="button" onClick={() => handleEdit(v)} className={CN.btnEditar}><span className="material-icons-round text-sm mr-0.5">edit</span> Editar</button>
                  <button type="button" onClick={() => handleDelete(v.id)} className={CN.btnExcluir}><span className="material-icons-round text-sm mr-0.5">delete_outline</span> Excluir</button>
                </div>
              </div>
            ))}
          </div>
        </Card>
    </section>
  );
}
