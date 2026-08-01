import { Collection } from 'discord.js';
import { comandosDeNivel } from './nivel.js';
import * as menu from './menu.js';

export const comandos = [...comandosDeNivel, menu];

/** Mapa nome -> comando, usado pelo roteador de interações. */
export const registro = new Collection(
  comandos.map((comando) => [comando.data.name, comando])
);

/** Payload JSON para registrar os comandos na API do Discord. */
export const comandosJSON = comandos.map((comando) => comando.data.toJSON());
