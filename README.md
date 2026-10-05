# Louçadada — site institucional

Site da Louçadada Presentes & Decoração, Rua Rui Barbosa, 54, Araguari (MG).
Marca e site: Fortunato Estúdio. Identidade e estratégia aprovadas em ago/2026.

**Fase 1 (esta entrega): institucional.** Quatro páginas que contam quem é a casa,
o que ela faz e como chegar até ela. Não há carrinho, catálogo, busca, formulário
nem área de cliente. Toda conversão acontece fora do site: WhatsApp, Instagram
(@loucadada) e a porta da loja.

**Fase 2: e-commerce.** Loja on-line, Lista Louçadada e Louçadada Em Casa (o serviço
cobrado) ficam para depois. Nada disso está no ar, e o texto do site foi escrito para
não prometer nada disso. Ver a seção "Preparado para a fase 2", no fim deste arquivo.

Tecnicamente: HTML estático, CSS e JavaScript escritos à mão. Sem build, sem
dependência, sem node_modules. O que está na pasta é o que vai para o ar.

---

## Estrutura de pastas

```
/
├── index.html              Home
├── a-casa/index.html       A história: 1966 até hoje, a família, a linha do tempo
├── em-casa/index.html      O que a gente faz: o serviço passo a passo
├── visite/index.html       Endereço, contato, como chegar
├── 404.html                Página de erro (referenciada no .htaccess)
│
├── robots.txt              Libera tudo e aponta o sitemap
├── sitemap.xml             As quatro páginas, para o Google
├── .htaccess               Config de hospedagem Apache (cache, 404, barra final)
├── .gitignore
│
├── favicon.svg             Ícone vetorial (o laço)
├── favicon-32.png          Fallback 32×32 para navegador antigo
├── apple-touch-icon.png    Ícone de tela de início no iPhone
├── icone-512.png           Logo quadrado usado no JSON-LD
├── og.jpg                  Imagem de compartilhamento, 1200×630
│
└── assets/
    ├── css/site.css        TODO o visual do site. Arquivo único.
    ├── js/site.js          Menu do celular, entrada suave, ano do rodapé. Sem biblioteca.
    ├── fontes/             Webfonts .woff2 + fontes.css (os @font-face)
    ├── img/                As fotos do site, em .webp
    └── marca/              Logotipo e laço em SVG solto, para uso fora do site
```

Uma observação sobre `assets/marca/`: os SVGs ali são a fonte da marca para outras
peças. Dentro do site, o laço e o logotipo não são carregados como arquivo: eles vivem
inline, dentro de um `<svg class="so-leitor">` no topo de cada página, e são chamados
com `<use href="#laco">` e `<use href="#logotipo">`. Isso deixa a cor controlada pelo
CSS e evita requisição extra. Se precisar editar o desenho, edite nas quatro páginas
(o bloco é idêntico em todas) ou gere de novo a partir de `assets/marca/_sprite.html`.

### Links internos

Sempre absolutos e com barra no fim: `/`, `/a-casa/`, `/em-casa/`, `/visite/`.
O `.htaccess` redireciona `/a-casa` para `/a-casa/` com 301, para não duplicar
conteúdo no Google. Vercel, Netlify e GitHub Pages fazem isso sozinhos.

---

## Sistema visual

### As quatro cores e a dosagem 60-25-10-5

| Cor | HEX | Papel | Dose |
|---|---|---|---|
| Grafite Chumbo | `#24282C` | O palco. Fundo da maior parte do site. | 60% |
| Porcelana | `#F2EDE3` | O respiro. Texto sobre escuro e as seções claras. | 25% |
| Azul da Casa | `#1F66AC` | A assinatura. Laço, botão principal, chamada final. | 10% |
| Latão de Lustre | `#B8934A` | A joia. Sobrelinha, número, filete, anotação. | 5% |

A dosagem não é decorativa: é o que mantém o site com cara de vitrine acesa à noite,
e não de cartaz. Duas regras gravadas no CSS e que não devem ser quebradas:

1. **Escuro carrega claro, claro carrega escuro.** Seção grafite recebe texto
   porcelana; seção porcelana recebe texto grafite. A classe `.claro` já vira a chave
   inteira (sobrelinha, botões, legendas, citações) quando aplicada a uma `.secao`.
2. **Os dois acentos nunca se tocam.** Azul e latão não encostam um no outro. Latão só
   em título grande, filete, selo e número, nunca em texto corrido. Azul sobre grafite
   só para o laço e grafismo, nunca em letra pequena.

O CSS declara ainda três tons de apoio derivados desses quatro, para dar profundidade:
`--grafite-fundo #1C1F22` (o fundo do body, um tom abaixo), `--grafite-alto #2C3136`
(superfície elevada), `--azul-vivo #2E7FCE` e `--latao-claro #CBA95F` (estados de
foco e hover). Todos vivem em `:root`, no começo de `assets/css/site.css`.

### As três fontes

| Papel | Fonte | Token CSS |
|---|---|---|
| Títulos | Bookmania (oficial) → Fraunces (provisória) | `--serifa` |
| Texto corrido | Figtree | `--sans` |
| Anotação da casa | Caveat | `--caneta` |

**Sobre a serifa.** A fonte oficial da marca é a **Bookmania**. Ela é licenciada via
Adobe e ainda não está hospedada aqui. Enquanto isso, o **Fraunces** segura o lugar:
é uma serifa de corpo generoso e presença de letreiro, com o mesmo comportamento nos
títulos. Os dois arquivos estão em `/assets/fontes/`, declarados em
`/assets/fontes/fontes.css`.

A troca é de uma linha. O token está escrito assim:

```css
--serifa:"Bookmania","Fraunces",Georgia,"Times New Roman",serif;
```

Quando a licença de webfont da Bookmania for contratada, basta colocar os `.woff2`
em `/assets/fontes/` e declarar um `@font-face` com `font-family: 'Bookmania'`.
O site passa a usar a Bookmania sozinho, sem tocar em mais nada. O logotipo não
depende de fonte nenhuma: é vetor.

A **Caveat** é a caneta da casa. Regra: **no máximo uma anotação (`.nota`) por
página**, sempre grande e torta. E nunca por cima das imagens `olhar-*.webp`, que já
trazem a anotação manuscrita dentro da própria foto.

---

## Como publicar

Site estático. Não tem build, não tem servidor de aplicação, não tem banco. Publicar
é subir a pasta inteira.

**Vercel / Netlify** — arraste a pasta na interface, ou conecte o repositório do Git.
Não configure comando de build nem diretório de saída: a raiz do projeto já é o site.

**GitHub Pages** — Settings → Pages → Deploy from a branch → `main` / root.

**Hospedagem comum (cPanel, Apache)** — envie tudo por FTP para `public_html/`,
inclusive o `.htaccess`, que é arquivo oculto e alguns clientes de FTP escondem.
Ele cuida do 404, do cache, da compressão e da barra no fim da URL.

**Nginx** — o `.htaccess` é ignorado. Replique o equivalente na configuração do server:
`error_page 404 /404.html`, cache longo para `.webp`, `.woff2`, `.css` e `.js`,
`no-cache` para `.html`, e o redirecionamento que acrescenta a barra final.

Depois de subir, cheque três coisas: se `/a-casa/` abre, se um endereço inventado
qualquer cai no 404 da casa, e se `https://loucadada.com/sitemap.xml` responde.
Aí cadastre o sitemap no Google Search Console.

## Como rodar local

Não abra os arquivos com dois cliques. Os caminhos são absolutos (`/assets/...`) e o
`file://` não resolve isso. Suba um servidor na raiz do projeto:

```bash
python3 -m http.server 8000
```

E acesse `http://localhost:8000`.

Nota: o `http.server` não aplica o `.htaccess`, então o 404 aparece como a página
padrão do Python, e `/a-casa` sem barra não redireciona. Em produção os dois funcionam.

---

## Antes de publicar

Checklist de pendências. Todas elas estão no HTML com marcador visível, de propósito,
para não passarem despercebidas.

- [x] **WhatsApp** — ligado: `5534998703531`, com a mensagem pronta
      "Olá, vim pelo site e gostaria de falar com uma atendente."
      Para trocar o número ou o texto, é um find/replace do link `wa.me` inteiro.
- [x] **E-mail, razão social e CNPJ** — preenchidos: Loucadada de Araguari LTDA,
      CNPJ 23.113.863/0001-70, loucadadapresentes@yahoo.com.br.
- [x] **Domínio** — registrado: `loucadada.com` (Hostinger, 28/09/2026). O site inteiro
      já aponta para ele: canonical, og:url, JSON-LD, sitemap.xml, robots.txt e .htaccess,
      trocados de uma vez com `./trocar-dominio.sh loucadada.com`.

      Se um dia o endereço mudar, rode o script de novo **antes de pedir indexação no
      Search Console**. Depois que o Google indexa, mudar de domínio joga autoridade fora.
- [ ] **Fotos novas** — as imagens atuais são o acervo existente. Quando sair o ensaio
      profissional, substituir (ver abaixo) e conferir os `alt`, que descrevem cenas
      específicas das fotos atuais.
- [ ] **og.jpg** — trocar pela arte final de compartilhamento, 1200×630, e testar o
      link colando no WhatsApp e no Instagram antes de divulgar.
- [ ] **HTTPS** — com o certificado ativo, descomentar o bloco de redirecionamento
      no topo do `.htaccess`.
- [ ] **Search Console** — cadastrar a propriedade e enviar o sitemap.

---

## Como trocar uma foto

1. Exporte em **`.webp`**, qualidade 80 a 85, largura máxima de 1600px. Peso ideal
   abaixo de 250 KB. Nada de `.jpg` ou `.png` no conteúdo.
2. Salve em **`/assets/img/`**. Nome em minúsculas, sem acento, separado por hífen,
   descrevendo a cena (`fachada-rui-barbosa.webp`, e não `IMG_4471.webp`).
3. No HTML, atualize as quatro coisas da tag:

```html
<img src="/assets/img/nome-do-arquivo.webp"
     alt="Descrição real da cena, para quem não vê a imagem"
     width="1080" height="1406" loading="lazy" decoding="async" />
```

- **`src`** com caminho absoluto, começando em `/assets/img/`.
- **`width` e `height`** com o tamanho **real em pixels** do arquivo novo. Eles não
  esticam nada (o CSS controla a exibição), servem para reservar o espaço e evitar
  que a página pule enquanto carrega. Número errado aqui é bug de layout.
- **`alt`** reescrito para a foto nova: descreva a cena, não repita o título que está
  ao lado. Para quem usa leitor de tela, o `alt` é a foto.
- **`loading="lazy"` e `decoding="async"`** ficam em todas as imagens, **menos na
  primeira imagem da página**, que leva `fetchpriority="high"` e não leva `lazy`.

Se a foto estiver dentro de uma `<figure class="figura">`, revise também o
`<figcaption>`. As quatro `olhar-*.webp` têm texto manuscrito dentro da imagem: não
escreva `.nota` em Caveat por cima delas. As imagens de sacola, caixa e cartão são
mockups de aplicação da marca, servem para ilustrar embalagem e embrulho, e não devem
ser legendadas como foto da loja.

---

## Preparado para a fase 2

O que já está pronto para quando a loja on-line entrar, e o que ainda precisa existir.

**Já está pronto:**

- **O sistema visual inteiro.** `site.css` é um sistema, não um tema de página.
  Os componentes `.cartao`, `.grade--2/3/4`, `.botao`, `.figura`, `.trilho`, `.ficha`
  e `.chamada` montam vitrine de produto, listagem e ficha sem CSS novo.
- **A estrutura de URL.** Cada página é uma pasta com `index.html`, e o `.htaccess`
  garante a barra final. `/loja/`, `/lista/` e similares entram sem quebrar nada.
- **O SEO de base.** JSON-LD `HomeGoodsStore` com endereço, área atendida e fundação
  já na home. Produto vira `Product` + `Offer` pendurado nessa mesma entidade.
- **O sitemap e o robots** abertos, prontos para receber as novas rotas.
- **O cache** do `.htaccess`: HTML sempre fresco, imagem e fonte com validade de um ano.
- **Os mockups de embalagem** (`sacola-*.webp`, `caixa-presente.webp`,
  `cartao-verso.webp`), que já existem para ilustrar embrulho e entrega.
- **A regra de preço da marca:** preço só aparece como "a partir de", nunca como
  tabela fechada. Vale para a fase 2 também.

**Ainda vai precisar:** plataforma de loja (o site atual não tem carrinho nem
pagamento), fotografia de produto em padrão consistente, um cadastro com estoque real,
e a definição comercial de Lista Louçadada e Louçadada Em Casa. Enquanto essa definição
não sair, o serviço continua sendo apresentado como o que a casa já faz, sem pacote,
sem preço e sem botão de contratação.

---

Dúvida sobre a marca, a paleta ou a voz do texto: Fortunato Estúdio.
Dúvida sobre um arquivo específico: os comentários dentro de `site.css`, `site.js`,
`fontes.css` e `.htaccess` explicam cada decisão no lugar onde ela foi tomada.
