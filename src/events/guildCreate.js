import {
  Events,
  ChannelType,
  PermissionFlagsBits,
  MessageFlags,
} from 'discord.js';
import { boasVindas } from '../messages/boasVindas.js';

const TIPOS_DE_CANAL = [ChannelType.GuildText, ChannelType.GuildAnnouncement];

/**
 * Primeiro canal de texto, na ordem em que aparece no servidor, onde o bot
 * consegue postar. Retorna null se não houver nenhum.
 */
function primeiroCanalDisponivel(guild) {
  const eu = guild.members.me;
  if (!eu) return null;

  return (
    guild.channels.cache
      .filter((canal) => {
        if (!TIPOS_DE_CANAL.includes(canal.type)) return false;

        const permissoes = canal.permissionsFor(eu);
        return Boolean(
          permissoes?.has(PermissionFlagsBits.ViewChannel) &&
            permissoes?.has(PermissionFlagsBits.SendMessages)
        );
      })
      .sort((a, b) => a.rawPosition - b.rawPosition)
      .first() ?? null
  );
}

export const name = Events.GuildCreate;

export async function execute(guild) {
  console.log(`[BOT] Entrou em ${guild.name} (${guild.id}).`);

  const canal = primeiroCanalDisponivel(guild);

  if (!canal) {
    console.warn(
      `[BOAS-VINDAS] Nenhum canal disponível para postar em ${guild.id}.`
    );
    return;
  }

  try {
    await canal.send({
      components: boasVindas(),
      flags: MessageFlags.IsComponentsV2,
    });
    console.log(`[BOAS-VINDAS] Enviada em #${canal.name} (${guild.id}).`);
  } catch (erro) {
    console.error(
      `[BOAS-VINDAS] Erro ao enviar em ${guild.id}:`,
      erro.message
    );
  }
}
