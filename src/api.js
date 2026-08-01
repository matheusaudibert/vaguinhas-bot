import { API_BASE_URL, NIVEIS } from './config.js';

const TIMEOUT_MS = 10_000;

/**
 * Busca a vaga mais recente de um nível. Cada rota devolve um único objeto de
 * vaga (não um array). Retorna null em qualquer falha — o poller apenas pula
 * o ciclo desse nível.
 */
export async function fetchVaga(nivel) {
  const rota = NIVEIS[nivel]?.rota;
  if (!rota) throw new Error(`Nível desconhecido: ${nivel}`);

  try {
    const resposta = await fetch(`${API_BASE_URL}${rota}`, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { Accept: 'application/json' },
    });

    if (!resposta.ok) {
      console.error(`[API] ${rota} respondeu ${resposta.status}.`);
      return null;
    }

    const vaga = await resposta.json();

    // A API sinaliza ausência de vaga com { error: ... }
    if (!vaga || vaga.error || !vaga.link_vaga) {
      console.error(`[API] ${rota} sem vaga válida.`);
      return null;
    }

    return vaga;
  } catch (erro) {
    console.error(`[API] Erro ao buscar ${rota}:`, erro.message);
    return null;
  }
}
