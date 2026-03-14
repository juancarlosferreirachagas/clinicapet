export function getEspecieIcon(especie: string): string {
  const e = (especie || "").toLowerCase();
  if (e.includes("cachorro") || e.includes("dog")) return "pets";
  if (e.includes("gato") || e.includes("cat")) return "support";
  if (e.includes("passar") || e.includes("ave") || e.includes("bird")) return "cruelty_free";
  if (e.includes("coelho") || e.includes("rabbit")) return "egg";
  return "pets";
}

export function calcularIdade(dataNascimento: string | null | undefined): string | null {
  if (!dataNascimento) return null;
  const nasc = new Date(dataNascimento + "T12:00:00");
  const hoje = new Date();
  const anos = Math.floor((hoje.getTime() - nasc.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  const meses = Math.floor(((hoje.getTime() - nasc.getTime()) % (365.25 * 24 * 60 * 60 * 1000)) / (30.44 * 24 * 60 * 60 * 1000));
  if (anos < 0) return null;
  if (anos === 0) return meses <= 1 ? `${meses} mês` : `${meses} meses`;
  if (anos === 1 && meses === 0) return "1 ano";
  if (anos === 1) return `1 ano e ${meses} ${meses === 1 ? "mês" : "meses"}`;
  return meses === 0 ? `${anos} anos` : `${anos} anos e ${meses} ${meses === 1 ? "mês" : "meses"}`;
}

export function formatarData(s: string): string {
  const d = new Date(s + "T12:00:00");
  const hoje = new Date();
  if (d.toDateString() === hoje.toDateString()) return "Hoje";
  const DIAS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  return `${DIAS[d.getDay()]}, ${d.getDate()} ${MESES[d.getMonth()]}`;
}
