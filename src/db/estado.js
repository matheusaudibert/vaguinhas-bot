import { estadoCol } from './mongo.js';

/**
 * Dedup do poller. Guarda o link da última vaga enviada por nível, para que um
 * restart do processo não repita as vagas que já foram para os canais.
 */
export async function getUltimoLink(nivel) {
  const doc = await estadoCol().findOne({ _id: nivel });
  return doc?.ultimoLink ?? null;
}

export async function setUltimoLink(nivel, link) {
  await estadoCol().updateOne(
    { _id: nivel },
    { $set: { ultimoLink: link, ultimoEnvioEm: new Date() } },
    { upsert: true }
  );
}
