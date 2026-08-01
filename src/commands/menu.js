import {
  SlashCommandBuilder,
  InteractionContextType,
  MessageFlags,
} from 'discord.js';
import { getConfig } from '../db/guilds.js';
import { menu } from '../messages/feedback.js';

export const data = new SlashCommandBuilder()
  .setName('menu')
  .setDescription('Mostra as configurações atuais do vaguinhas neste servidor.')
  .setContexts(InteractionContextType.Guild);

export async function execute(interaction) {
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });

  const config = await getConfig(interaction.guildId);

  await interaction.editReply({
    components: menu(config),
    flags: MessageFlags.IsComponentsV2,
  });
}
