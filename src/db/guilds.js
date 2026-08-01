import { guildsCol } from './mongo.js';
import { CHAVES_NIVEIS } from '../config.js';

const CANAIS_VAZIOS = Object.fromEntries(CHAVES_NIVEIS.map((n) => [n, null]));

/**
 * Configuração de um servidor. Nunca retorna null: servidor sem doc no banco
 * devolve todos os canais como null.
 */
export async function getConfig(guildId) {
  const doc = await guildsCol().findOne({ _id: guildId });
  return { ...CANAIS_VAZIOS, ...(doc?.canais ?? {}) };
}

export async function setCanal(guildId, nivel, canalId) {
  const agora = new Date();

  await guildsCol().updateOne(
    { _id: guildId },
    {
      $set: { [`canais.${nivel}`]: canalId, atualizadoEm: agora },
      $setOnInsert: { criadoEm: agora },
    },
    { upsert: true }
  );
}

export async function limparCanal(guildId, nivel) {
  await guildsCol().updateOne(
    { _id: guildId },
    { $set: { [`canais.${nivel}`]: null, atualizadoEm: new Date() } }
  );
}

/** Remove a config de um servidor. Usado quando o bot é expulso. */
export async function removerGuild(guildId) {
  await guildsCol().deleteOne({ _id: guildId });
}

/** Todos os servidores com um canal configurado para o nível informado. */
export async function guildsComNivel(nivel) {
  return guildsCol()
    .find(
      { [`canais.${nivel}`]: { $ne: null } },
      { projection: { [`canais.${nivel}`]: 1 } }
    )
    .toArray();
}
