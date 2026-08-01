import {
  TextDisplayBuilder,
  ThumbnailBuilder,
  SectionBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  ContainerBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} from 'discord.js';
import { COR, LOGO, SITE, EMOJIS } from '../config.js';

// O total de texto de uma mensagem Components V2 é limitado a 4000 caracteres,
// então cada campo tem seu próprio teto para nenhuma vaga estourar o limite.
const LIMITE_DESCRICAO = 1200;
const LIMITE_LISTA = 700;
const LIMITE_CURTO = 200;
const LIMITE_LABEL_BOTAO = 80;

function truncar(texto, limite) {
  if (!texto) return null;
  const limpo = String(texto).trim();
  if (!limpo) return null;
  return limpo.length > limite ? `${limpo.slice(0, limite - 1)}…` : limpo;
}

/** "presencial" -> "Presencial". A API não padroniza a caixa dos valores. */
function capitalizar(valor) {
  if (!valor) return null;
  return valor.charAt(0).toUpperCase() + valor.slice(1);
}

/**
 * Normaliza uma lista separada por ";" numa frase.
 * "conhecimento em TI; Office 365; ITIL" -> "Conhecimento em TI, Office 365, ITIL."
 */
function frase(valor) {
  if (!valor) return null;

  const itens = String(valor)
    .split(';')
    .map((item) => item.trim())
    .filter(Boolean);

  if (itens.length === 0) return null;

  return capitalizar(itens.join(', ')) + '.';
}

function ehUrlValida(valor) {
  if (!valor) return false;
  try {
    const url = new URL(String(valor).trim());
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Monta os components da mensagem de uma vaga.
 * Campos vazios ("", null, undefined) são omitidos — a linha não aparece.
 */
export function montarMensagemVaga(vaga) {
  if (!vaga) return null;

  const titulo = truncar(vaga.titulo_vaga, LIMITE_CURTO) ?? 'Nova vaga';
  const descricao = truncar(vaga.descricao_vaga, LIMITE_DESCRICAO);

  const secao = new SectionBuilder()
    .setThumbnailAccessory(new ThumbnailBuilder().setURL(LOGO))
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(`# ${titulo}`)
    );

  if (descricao) {
    secao.addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `${descricao}`
      )
    );
  }

  const container = new ContainerBuilder()
    .setAccentColor(COR)
    .addSectionComponents(secao)
    .addSeparatorComponents(
      new SeparatorBuilder()
        .setSpacing(SeparatorSpacingSize.Small)
        .setDivider(true)
    );

  const linhas = [
    [EMOJIS.nivel, '**Nível**', truncar(vaga.nivel_vaga, LIMITE_CURTO)],
    [
      EMOJIS.tecnologias,
      '**Tecnologias**',
      truncar(frase(vaga.requisitos_tecnicos), LIMITE_LISTA),
    ],
    [
      EMOJIS.requisitos,
      '**Requisitos desejáveis:**',
      truncar(frase(vaga.requisitos_desejaveis), LIMITE_LISTA),
      true, // o rótulo já traz os dois-pontos
    ],
    [EMOJIS.salario, '**Salário**', truncar(vaga.salario, LIMITE_CURTO)],
    [
      EMOJIS.modelo,
      '**Modelo**',
      capitalizar(truncar(vaga.forma_trabalho, LIMITE_CURTO)),
    ],
    [EMOJIS.local, '**Local**', truncar(vaga.local, LIMITE_CURTO)],
  ];

  for (const [emoji, rotulo, valor, semDoisPontos] of linhas) {
    if (!valor) continue;

    container.addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `${emoji} ${rotulo}${semDoisPontos ? '' : ':'} ${valor}`
      )
    );
  }

  container.addTextDisplayComponents(
    new TextDisplayBuilder().setContent(
      `-# Saiba mais sobre o **vaguinhas** [aqui](${SITE})!`
    )
  );

  const components = [container];
  const botoes = [];

  if (ehUrlValida(vaga.link_vaga)) {
    botoes.push(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel('Link da vaga')
        .setURL(vaga.link_vaga.trim())
    );
  }

  const linkEmpresa = ehUrlValida(vaga.link_empresa)
    ? vaga.link_empresa
    : ehUrlValida(vaga.link_pagina_linkedin)
      ? vaga.link_pagina_linkedin
      : null;

  if (linkEmpresa) {
    const nome = truncar(vaga.nome_empresa, LIMITE_CURTO);
    const label = nome ? `Empresa ${nome}` : 'Empresa';

    botoes.push(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel(truncar(label, LIMITE_LABEL_BOTAO))
        .setURL(linkEmpresa.trim())
    );
  }

  if (botoes.length > 0) {
    components.push(new ActionRowBuilder().addComponents(...botoes));
  }

  return components;
}
