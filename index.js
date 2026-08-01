import { Client, GatewayIntentBits, Events, ActivityType } from 'discord.js';
import { DISCORD_TOKEN, PRESENCA, validarAmbiente } from './src/config.js';
import { conectar, desconectar } from './src/db/mongo.js';
import { removerGuild } from './src/db/guilds.js';
import * as interactionCreate from './src/events/interactionCreate.js';
import { iniciarPoller } from './src/poller.js';

validarAmbiente();

// Guilds é a única intent necessária: o bot só recebe slash commands e envia
// mensagens. Nenhuma intent privilegiada é usada.
const client = new Client({
  intents: [GatewayIntentBits.Guilds],
  presence: {
    status: 'online',
    activities: [{ name: PRESENCA, type: ActivityType.Watching }],
  },
});

client.on(interactionCreate.name, interactionCreate.execute);

client.once(Events.ClientReady, (pronto) => {
  const atividade = pronto.user.presence.activities[0];

  console.log(
    `[BOT] Conectado como ${pronto.user.tag} em ${pronto.guilds.cache.size} servidor(es).`
  );
  console.log(
    `[BOT] Status: ${ActivityType[atividade.type]} "${atividade.name}".`
  );
  iniciarPoller(pronto);
});

client.on(Events.Error, (erro) => console.error('[BOT] Erro no client:', erro));

// Bot expulso ou servidor deletado: a config não serve mais para nada.
client.on(Events.GuildDelete, async (guild) => {
  try {
    await removerGuild(guild.id);
    console.log(`[BOT] Saiu de ${guild.id}. Config removida.`);
  } catch (erro) {
    console.error(`[BOT] Erro ao remover config de ${guild.id}:`, erro.message);
  }
});

// O bot atende vários servidores: uma promise rejeitada num deles não pode
// derrubar o processo inteiro (no Node 20 isso encerra por padrão).
process.on('unhandledRejection', (motivo) =>
  console.error('[BOT] Promise rejeitada sem tratamento:', motivo)
);
process.on('uncaughtException', (erro) =>
  console.error('[BOT] Exceção não capturada:', erro)
);

await conectar();
await client.login(DISCORD_TOKEN);

async function encerrar(sinal) {
  console.log(`\n[BOT] ${sinal} recebido, encerrando...`);
  await client.destroy();
  await desconectar();
  process.exit(0);
}

process.on('SIGINT', () => encerrar('SIGINT'));
process.on('SIGTERM', () => encerrar('SIGTERM'));
