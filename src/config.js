import 'dotenv/config';

// Variáveis de ambiente obrigatórias
export const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
export const CLIENT_ID = process.env.CLIENT_ID;
export const MONGODB_URI = process.env.MONGODB_URI;

export function validarAmbiente() {
  const faltando = ['DISCORD_TOKEN', 'CLIENT_ID', 'MONGODB_URI'].filter(
    (nome) => !process.env[nome]
  );

  if (faltando.length > 0) {
    throw new Error(
      `Variáveis de ambiente ausentes no .env: ${faltando.join(', ')}`
    );
  }
}

// API de vagas
export const API_BASE_URL =
  process.env.API_BASE_URL || 'https://api-vagas.vercel.app';

// Intervalo entre as checagens da API (5 minutos)
export const INTERVALO_MS = 5 * 60 * 1000;

// Banco
export const DB_NOME = 'vaguinhas';

// Status exibido no perfil do bot: "Assistindo 💼 Últimas vagas"
export const PRESENCA = '💼 Últimas vagas';

// Identidade visual
export const COR = 16766977;
export const LOGO = 'https://i.postimg.cc/SxGG03nM/logo-vaguinhas.jpg';
export const BANNER = 'https://i.postimg.cc/7Yj6NnwT/banner-vaguinhas.png';
export const SITE = 'https://vaguinhas.audibert.dev/';

// Emojis da aplicação (aba Emojis do Developer Portal, para renderizarem
// em qualquer servidor onde o bot estiver)
export const EMOJIS = {
  sucesso: '<:sucesso:1532981823393763338>',
  erro: '<:erro:1532981824849186816>',
  configuracao: '<:configuracao:1532981826417725470>',
  nivel: '<:nivel:1532981833988308992>',
  tecnologias: '<:tecnologias:1532981831991824495>',
  requisitos: '<:requisitos:1532981830003855460>',
  salario: '<:salario:1532981838488932552>',
  modelo: '<:modelo:1532981828057563239>',
  local: '<:local:1532981837016862720>',
  bemvindo: '<:bemvindo:1533002771719262268>',
};

// Níveis suportados. A chave é o nome do comando, o campo no Mongo e a rota.
export const NIVEIS = {
  estagio: { rota: '/estagio', label: 'estágio' },
  junior: { rota: '/junior', label: 'júnior' },
  pleno: { rota: '/pleno', label: 'pleno' },
  senior: { rota: '/senior', label: 'sênior' },
};

export const CHAVES_NIVEIS = Object.keys(NIVEIS);
