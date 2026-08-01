import { MongoClient } from 'mongodb';
import { MONGODB_URI, DB_NOME, CHAVES_NIVEIS } from '../config.js';

let client = null;
let db = null;

export async function conectar() {
  if (db) return db;

  client = new MongoClient(MONGODB_URI);
  await client.connect();
  db = client.db(DB_NOME);

  // Um índice por nível: o fan-out consulta { "canais.<nivel>": { $ne: null } }
  await Promise.all(
    CHAVES_NIVEIS.map((nivel) =>
      db.collection('guilds').createIndex({ [`canais.${nivel}`]: 1 })
    )
  );

  console.log(`[MONGO] Conectado ao banco "${DB_NOME}".`);
  return db;
}

function getDb() {
  if (!db) throw new Error('MongoDB não conectado. Chame conectar() antes.');
  return db;
}

export const guildsCol = () => getDb().collection('guilds');
export const estadoCol = () => getDb().collection('estado');

export async function desconectar() {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}
