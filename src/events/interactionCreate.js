import { Events, MessageFlags, ContainerBuilder, TextDisplayBuilder } from 'discord.js';
import { registro } from '../commands/index.js';
import { COR, EMOJIS } from '../config.js';

const FALHA_GENERICA = [
  new ContainerBuilder()
    .setAccentColor(COR)
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `${EMOJIS.erro} Ocorreu um erro ao executar este comando.`
      )
    ),
];

export const name = Events.InteractionCreate;

export async function execute(interaction) {
  if (!interaction.isChatInputCommand()) return;

  const comando = registro.get(interaction.commandName);

  if (!comando) {
    console.warn(`[INTERACAO] Comando desconhecido: ${interaction.commandName}`);
    return;
  }

  try {
    await comando.execute(interaction);
  } catch (erro) {
    console.error(`[INTERACAO] Falha em /${interaction.commandName}:`, erro);

    const payload = {
      components: FALHA_GENERICA,
      flags: MessageFlags.IsComponentsV2,
    };

    try {
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply(payload);
      } else {
        await interaction.reply({
          ...payload,
          flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
        });
      }
    } catch (falhaAoResponder) {
      console.error('[INTERACAO] Não foi possível responder:', falhaAoResponder.message);
    }
  }
}
