import { MessageFlags } from 'discord.js';
import { CHAVES_NIVEIS, INTERVALO_MS } from './config.js';
import { fetchVaga } from './api.js';
import { montarMensagemVaga } from './messages/vaga.js';
import { guildsComNivel, limparCanal } from './db/guilds.js';
import { getUltimoLink, setUltimoLink } from './db/estado.js';

const LOTE = 5;

// Erros que significam "esse canal não serve mais": foi apagado ou o bot
// perdeu acesso. Insistir a cada 5 minutos é desperdício, então limpamos.
const ERROS_DE_CANAL = new Set([
  10003, // Unknown Channel
  50001, // Missing Access
  50013, // Missing Permissions
]);

async function enviarParaGuild(client, guildId, canalId, nivel, components) {
  try {
    const canal = await client.channels.fetch(canalId);
    await canal.send({ components, flags: MessageFlags.IsComponentsV2 });
    return true;
  } catch (erro) {
    if (ERROS_DE_CANAL.has(erro.code)) {
      console.warn(
        `[${nivel.toUpperCase()}] Canal ${canalId} inacessível (${erro.code}) em ${guildId}. Limpando config.`
      );
      await limparCanal(guildId, nivel).catch((falha) =>
        console.error('[MONGO] Erro ao limpar canal:', falha.message)
      );
    } else {
      console.error(
        `[${nivel.toUpperCase()}] Erro ao enviar para ${canalId} (${guildId}):`,
        erro.message
      );
    }
    return false;
  }
}

async function processarNivel(client, nivel) {
  const vaga = await fetchVaga(nivel);
  if (!vaga) return;

  const ultimoLink = await getUltimoLink(nivel);

  if (vaga.link_vaga === ultimoLink) {
    console.log(`[${nivel.toUpperCase()}] Nenhuma vaga nova.`);
    return;
  }

  const components = montarMensagemVaga(vaga);
  if (!components) return;

  const alvos = await guildsComNivel(nivel);
  console.log(
    `[${nivel.toUpperCase()}] Nova vaga: ${vaga.titulo_vaga} — ${alvos.length} servidor(es).`
  );

  let enviados = 0;

  for (let i = 0; i < alvos.length; i += LOTE) {
    const resultados = await Promise.all(
      alvos.slice(i, i + LOTE).map((doc) =>
        enviarParaGuild(client, doc._id, doc.canais[nivel], nivel, components)
      )
    );
    enviados += resultados.filter(Boolean).length;
  }

  // Grava o link independente de falhas individuais: um servidor com problema
  // não pode travar o nível inteiro no próximo ciclo.
  await setUltimoLink(nivel, vaga.link_vaga);

  if (alvos.length > 0) {
    console.log(
      `[${nivel.toUpperCase()}] Enviada para ${enviados}/${alvos.length} servidor(es).`
    );
  }
}

async function ciclo(client) {
  console.log('[POLLER] Iniciando ciclo de verificação de vagas...');

  for (const nivel of CHAVES_NIVEIS) {
    try {
      await processarNivel(client, nivel);
    } catch (erro) {
      console.error(`[${nivel.toUpperCase()}] Erro no ciclo:`, erro);
    }
  }
}

export function iniciarPoller(client) {
  ciclo(client);
  setInterval(() => ciclo(client), INTERVALO_MS);

  const minutos = INTERVALO_MS / 60_000;
  console.log(`[POLLER] Ativo. Checando a API a cada ${minutos} minuto(s).`);
}
