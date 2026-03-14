export type ApiResponse<T> = { ok: boolean; dados: T | { erro: string } };

export function getErrorMessage<T>(r: ApiResponse<T>, fallback = "Erro"): string {
  const dados = r.dados;
  return typeof dados === "object" && dados !== null && "erro" in dados ? (dados as { erro: string }).erro : fallback;
}

export async function api<T>(url: string, opts: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(url, opts);
    const dados = (await res.json()) as T | { erro: string };
    return { ok: res.ok, dados };
  } catch {
    return { ok: false, dados: { erro: "Servidor indisponível. Verifique se está rodando." } };
  }
}
