<a href="https://vaguinhas.audibert.dev"><img src="assets/banner.png" alt="Vaguinhas" height=100% width=auto></a>

[![Add Bot](https://img.shields.io/badge/Add_Bot-Discord-ffd801?style=for-the-badge&logo=discord&logoColor=ffd801)](https://discord.com/oauth2/authorize?client_id=1532881297809342494)
[![Website](https://img.shields.io/badge/Check-Website-ffd801?style=for-the-badge&logo=vercel&logoColor=ffd801)](https://vaguinhas.audibert.dev)
[![API](https://img.shields.io/badge/Check-API-ffd801?style=for-the-badge&logo=vercel&logoColor=ffd801)](https://github.com/matheusaudibert/api-vagas)

# Vaguinhas

O **vaguinhas** é um bot de Discord que distribui vagas de tecnologia direto nos canais do seu servidor. Ele consome a [api-vagas](https://github.com/matheusaudibert/api-vagas), que agrega vagas de **estágio**, **júnior**, **pleno** e **sênior**, e posta cada vaga nova como uma mensagem formatada, com nível, tecnologias, requisitos, salário, modelo de trabalho, local e botões para a vaga e para a empresa.

A ideia é simples: você escolhe qual canal recebe cada nível e o bot cuida do resto. Nada de precisar ficar atualizando o LinkedIn ou entrar em grupo de vagas, a vaga chega no seu servidor poucos minutos depois de ser publicada.

Cada nível é independente. Você pode mandar as vagas de estágio para `#estagio`, as de sênior para `#vagas-senior`, ou configurar só um nível e ignorar os outros.

## A mensagem da vaga

Cada vaga é enviada como um embed **Components V2**, com o máximo de informação que a API tiver sobre ela:

| Campo | De onde vem |
| --- | --- |
| **Título da vaga** | Cabeçalho da mensagem |
| **Sobre a vaga** | Descrição logo abaixo do título |
| **Nível** | Estágio, júnior, pleno ou sênior |
| **Tecnologias** | Requisitos técnicos, normalizados em uma frase |
| **Requisitos desejáveis** | O que é diferencial, mas não obrigatório |
| **Modelo** | Presencial, híbrido ou remoto |
| **Salário** | Faixa ou valor divulgado |
| **Local** | Cidade/estado da vaga |
| **Link da vaga** | Botão que leva direto para a candidatura |
| **Link da empresa** | Botão com o nome da empresa, apontando para o site dela (ou para o LinkedIn, se não houver site) |

**Sempre que possível** é a regra aqui: nem toda vaga vem completa da API. Campos vazios simplesmente não aparecem, em vez de virar uma linha com "Não informado", se a vaga não divulga salário, a linha de salário some. O mesmo vale para os botões: sem link da empresa, só o botão da vaga é exibido.

Textos longos são truncados por campo, para que nenhuma vaga estoure o limite de 4000 caracteres de uma mensagem Components V2 do Discord.

## Comandos

Os quatro comandos de nível exigem a permissão **Gerenciar Servidor** e todas as respostas são efêmeras (só quem executou vê).

| Comando | Descrição | Permissão |
| --- | --- | --- |
| `/estagio <canal>` | Define o canal que recebe as vagas de estágio | Gerenciar Servidor |
| `/junior <canal>` | Define o canal que recebe as vagas de júnior | Gerenciar Servidor |
| `/pleno <canal>` | Define o canal que recebe as vagas de pleno | Gerenciar Servidor |
| `/senior <canal>` | Define o canal que recebe as vagas de sênior | Gerenciar Servidor |
| `/menu` | Mostra quais canais estão configurados no servidor | Nenhuma |

### Como funcionam os comandos de nível

Os comandos `/estagio`, `/junior`, `/pleno` e `/senior` são idênticos, a única diferença é qual nível eles configuram. Cada um recebe um canal de texto ou de anúncios e funciona como um **toggle**:

- **Canal diferente do atual** → configura (ou troca) o canal daquele nível.
- **Mesmo canal já configurado** → remove a configuração, e aquele canal para de receber vagas.

Antes de salvar, o bot verifica se realmente consegue postar no canal escolhido (`Ver canal` + `Enviar mensagens`). Se não conseguir, a configuração é recusada.

Na **primeira vez** que um nível é configurado, o bot já envia a vaga mais recente daquele nível para o canal, para você ver o resultado imediatamente em vez de esperar o próximo ciclo.

### `/menu`

Lista os quatro níveis e o canal configurado em cada um (ou "Não configurado"). Serve para conferir rapidamente o estado do bot no servidor sem precisar procurar nos logs ou nas permissões.

## Licença

[MIT](LICENSE)