import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  InteractionContextType,
  ChannelType,
  MessageFlags,
} from 'discord.js';
import { NIVEIS, CHAVES_NIVEIS } from '../config.js';
import { getConfig, setCanal, limparCanal } from '../db/guilds.js';
import { fetchVaga } from '../api.js';
import { montarMensagemVaga } from '../messages/vaga.js';
import { sucesso, erro, removido, erroRemocao } from '../messages/feedback.js';

const TIPOS_DE_CANAL = [ChannelType.GuildText, ChannelType.GuildAnnouncement];

/** Os quatro comandos de nível são idênticos, só muda o nível que configuram. */
function criarComando(nivel) {
  const { label } = NIVEIS[nivel];

  const data = new SlashCommandBuilder()
    .setName(nivel)
    .setDescription(
      `Define o canal das vagas de ${label}. Selecione o mesmo canal para remover.`
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setContexts(InteractionContextType.Guild)
    .addChannelOption((opcao) =>
      opcao
        .setName('canal')
        .setDescription(
          `Canal que vai receber as vagas de ${label} (o já configurado remove)`
        )
        .addChannelTypes(...TIPOS_DE_CANAL)
        .setRequired(true)
    );

  async function execute(interaction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const canal = interaction.options.getChannel('canal');

    let configAtual;

    try {
      configAtual = await getConfig(interaction.guildId);
    } catch (falha) {
      console.error(`[${nivel.toUpperCase()}] Erro ao ler config:`, falha);
      return responder(interaction, erro(nivel));
    }

    // Selecionar o canal que já está configurado funciona como toggle: remove.
    if (configAtual[nivel] === canal.id) {
      try {
        await limparCanal(interaction.guildId, nivel);
      } catch (falha) {
        console.error(`[${nivel.toUpperCase()}] Erro ao remover canal:`, falha);
        return responder(interaction, erroRemocao(nivel));
      }

      return responder(interaction, removido(nivel, canal.id));
    }

    // O bot precisa conseguir postar no canal antes de gravarmos a config
    const permissoes = canal.permissionsFor(interaction.guild.members.me);
    const podePostar =
      permissoes?.has(PermissionFlagsBits.ViewChannel) &&
      permissoes?.has(PermissionFlagsBits.SendMessages);

    if (!podePostar) {
      console.warn(
        `[${nivel.toUpperCase()}] Sem permissão para postar em #${canal.name} (${interaction.guildId}).`
      );
      return responder(interaction, erro(nivel));
    }

    const primeiraVez = !configAtual[nivel];

    try {
      await setCanal(interaction.guildId, nivel, canal.id);
    } catch (falha) {
      console.error(`[${nivel.toUpperCase()}] Erro ao salvar config:`, falha);
      return responder(interaction, erro(nivel));
    }

    await responder(interaction, sucesso(nivel, canal.id));

    // Na primeira configuração, manda a vaga atual para o canal já mostrar
    // conteúdo. Falhar aqui não muda a resposta ao usuário.
    if (primeiraVez) {
      try {
        const vaga = await fetchVaga(nivel);
        const components = montarMensagemVaga(vaga);

        if (components) {
          await canal.send({
            components,
            flags: MessageFlags.IsComponentsV2,
          });
        }
      } catch (falha) {
        console.error(
          `[${nivel.toUpperCase()}] Erro ao enviar a vaga inicial:`,
          falha.message
        );
      }
    }
  }

  return { data, execute };
}

function responder(interaction, components) {
  return interaction.editReply({
    components,
    flags: MessageFlags.IsComponentsV2,
  });
}

export const comandosDeNivel = CHAVES_NIVEIS.map(criarComando);
