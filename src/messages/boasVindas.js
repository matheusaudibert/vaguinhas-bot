import {
  TextDisplayBuilder,
  MediaGalleryBuilder,
  MediaGalleryItemBuilder,
  ContainerBuilder,
} from 'discord.js';
import { COR, BANNER, SITE, EMOJIS } from '../config.js';

/** Apresentação enviada quando o bot entra num servidor novo. */
export function boasVindas() {
  return [
    new ContainerBuilder()
      .setAccentColor(COR)
      .addMediaGalleryComponents(
        new MediaGalleryBuilder().addItems(
          new MediaGalleryItemBuilder().setURL(BANNER)
        )
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(`# ${EMOJIS.bemvindo} Vaguinhas`)
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          'O bot **Vaguinhas** é responsável por enviar vagas de TI no seu servidor do Discord.'
        )
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          'Para configurar o bot basta usar os comandos **/estagio**, **/junior**, **/pleno**, **/senior** e selecionar os canais que receberão as vagas.'
        )
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          'Use o comando **/menu** para ter uma visão completa de como cada canal está configurado.'
        )
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `-# Saiba mais sobre o **vaguinhas** [aqui](${SITE})!`
        )
      ),
  ];
}
