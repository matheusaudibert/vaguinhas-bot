import { TextDisplayBuilder, ContainerBuilder } from 'discord.js';
import { COR, SITE, EMOJIS, NIVEIS, CHAVES_NIVEIS } from '../config.js';

export function sucesso(nivel, canalId) {
  const { label } = NIVEIS[nivel];

  return [
    new ContainerBuilder()
      .setAccentColor(COR)
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `${EMOJIS.sucesso} Canal de ${label} configurado com sucesso: <#${canalId}>.`
        )
      ),
  ];
}

export function removido(nivel, canalId) {
  const { label } = NIVEIS[nivel];

  return [
    new ContainerBuilder()
      .setAccentColor(COR)
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `${EMOJIS.sucesso} Canal de ${label} removido com sucesso: <#${canalId}> não vai mais receber vagas.`
        )
      ),
  ];
}

export function erro(nivel) {
  const { label } = NIVEIS[nivel];

  return [
    new ContainerBuilder()
      .setAccentColor(COR)
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `${EMOJIS.erro} Erro ao configurar canal de ${label}.`
        )
      ),
  ];
}

export function erroRemocao(nivel) {
  const { label } = NIVEIS[nivel];

  return [
    new ContainerBuilder()
      .setAccentColor(COR)
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `${EMOJIS.erro} Erro ao remover canal de ${label}.`
        )
      ),
  ];
}

export function menu(config) {
  const container = new ContainerBuilder()
    .setAccentColor(COR)
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent('## Configurações do Vaguinhas')
    )
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `${EMOJIS.configuracao} Estas são as configurações atuais do bot neste servidor.`
      )
    );

  for (const nivel of CHAVES_NIVEIS) {
    const canalId = config[nivel];
    const valor = canalId ? `<#${canalId}>` : 'Não configurado';

    container.addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `**Canal de ${NIVEIS[nivel].label}**: ${valor}`
      )
    );
  }

  container.addTextDisplayComponents(
    new TextDisplayBuilder().setContent(
      `-# Saiba mais sobre o **vaguinhas** [aqui](${SITE})!`
    )
  );

  return [container];
}
