import { REST, Routes } from 'discord.js';
import { DISCORD_TOKEN, CLIENT_ID, validarAmbiente } from './src/config.js';
import { comandosJSON } from './src/commands/index.js';

validarAmbiente();

// Passe um GUILD_ID para registrar só num servidor de teste: comandos de guild
// aparecem na hora, enquanto os globais levam até 1 hora para propagar.
const guildId = process.env.GUILD_ID;

const rest = new REST().setToken(DISCORD_TOKEN);

const rota = guildId
  ? Routes.applicationGuildCommands(CLIENT_ID, guildId)
  : Routes.applicationCommands(CLIENT_ID);

console.log(
  `Registrando ${comandosJSON.length} comando(s) ${guildId ? `no servidor ${guildId}` : 'globalmente'}...`
);

const registrados = await rest.put(rota, { body: comandosJSON });

for (const comando of registrados) {
  console.log(`  /${comando.name} — ${comando.description}`);
}

console.log(`\n${registrados.length} comando(s) registrado(s) com sucesso.`);

if (!guildId) {
  console.log('Comandos globais podem levar até 1 hora para aparecer.');
}
