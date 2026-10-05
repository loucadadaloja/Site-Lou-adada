/* Louçadada — o mínimo de JS pra casa funcionar bem.
   Sem biblioteca: menu do celular, entrada suave e o ano do rodapé. */
(function () {
  'use strict';

  /* --- menu do celular --------------------------------------------------- */
  var menu = document.getElementById('menu');
  var abrir = document.querySelector('.abrir-menu');
  var fechar = document.querySelector('.fechar-menu');

  /* o que fica atrás do painel, quando ele está aberto */
  var fundo = [document.querySelector('main'), document.querySelector('.rodape'), abrir]
    .filter(Boolean);

  function estado(aberto) {
    if (!menu || !abrir) return;
    menu.setAttribute('data-aberto', aberto ? 'true' : 'false');
    abrir.setAttribute('aria-expanded', aberto ? 'true' : 'false');
    document.body.style.overflow = aberto ? 'hidden' : '';

    /* com o painel aberto, o resto da página sai do tab e do leitor de tela.
       Sem isso, tabular continua andando pelo conteúdo escondido atrás. */
    fundo.forEach(function (el) {
      if (aberto) { el.setAttribute('inert', ''); el.setAttribute('aria-hidden', 'true'); }
      else { el.removeAttribute('inert'); el.removeAttribute('aria-hidden'); }
    });

    if (aberto) {
      var primeiro = menu.querySelector('a');
      if (primeiro) primeiro.focus();
    } else {
      abrir.focus();
    }
  }

  /* Tab circula dentro do painel enquanto ele está aberto */
  if (menu) menu.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab' || menu.getAttribute('data-aberto') !== 'true') return;
    var focaveis = menu.querySelectorAll('a[href], button:not([disabled])');
    if (!focaveis.length) return;
    var primeiro = focaveis[0], ultimo = focaveis[focaveis.length - 1];
    if (e.shiftKey && document.activeElement === primeiro) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primeiro.focus(); }
  });

  if (abrir) abrir.addEventListener('click', function () {
    estado(menu.getAttribute('data-aberto') !== 'true');
  });
  if (fechar) fechar.addEventListener('click', function () { estado(false); });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu && menu.getAttribute('data-aberto') === 'true') estado(false);
  });

  if (menu) {
    menu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A' && window.matchMedia('(max-width:860px)').matches) estado(false);
    });
  }

  /* fecha sozinho quando a tela cresce, pra não travar o scroll no desktop */
  var largo = window.matchMedia('(min-width:861px)');
  var aoMudar = function (m) { if (m.matches) estado(false); };
  if (largo.addEventListener) largo.addEventListener('change', aoMudar);
  else if (largo.addListener) largo.addListener(aoMudar);

  /* --- entrada suave ----------------------------------------------------- */
  var quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var alvos = document.querySelectorAll('.surge');

  if (quieto || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(alvos, function (el) { el.classList.add('visivel'); });
  } else {
    var olho = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.add('visivel');
        olho.unobserve(entrada.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    Array.prototype.forEach.call(alvos, function (el, i) {
      el.style.transitionDelay = (Math.min(i % 4, 3) * 70) + 'ms';
      olho.observe(el);
    });
  }

  /* --- o álbum da casa ---------------------------------------------------- */
  /* As fotos se revezam sozinhas. Quem não quiser movimento não recebe nenhum,
     e quem quiser parar tem um botão, que é o que a norma de acessibilidade
     pede pra qualquer coisa que se mexe sozinha por mais de cinco segundos. */
  Array.prototype.forEach.call(document.querySelectorAll('.album'), function (album) {
    var itens = album.querySelectorAll('.album__item');
    if (itens.length < 2) return;

    var pausa = album.querySelector('.album__pausa');
    var caixaPontos = album.querySelector('.album__pontos');
    var rotulo = album.querySelector('.album__rotulo');
    var atual = 0;
    var relogio = null;
    var parado = quieto;              // com movimento reduzido, já começa parado
    var INTERVALO = 5200;

    var pontos = [];
    Array.prototype.forEach.call(itens, function (item, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'album__ponto';
      var legenda = item.querySelector('figcaption');
      b.setAttribute('aria-label', 'Foto ' + (i + 1) + ' de ' + itens.length +
        (legenda ? ': ' + legenda.textContent.trim().slice(0, 60) : ''));
      b.addEventListener('click', function () { mostra(i); reinicia(); });
      caixaPontos.appendChild(b);
      pontos.push(b);
    });

    function mostra(i) {
      atual = (i + itens.length) % itens.length;
      Array.prototype.forEach.call(itens, function (item, j) {
        if (j === atual) item.setAttribute('data-ativa', '');
        else item.removeAttribute('data-ativa');
        item.setAttribute('aria-hidden', j === atual ? 'false' : 'true');
      });
      pontos.forEach(function (p, j) { p.setAttribute('aria-current', j === atual ? 'true' : 'false'); });
    }

    function reinicia() {
      clearInterval(relogio);
      if (parado) return;
      relogio = setInterval(function () { mostra(atual + 1); }, INTERVALO);
    }

    function alterna(novoEstado) {
      parado = novoEstado;
      pausa.setAttribute('aria-pressed', parado ? 'true' : 'false');
      if (rotulo) rotulo.textContent = parado ? 'Continuar' : 'Pausar';
      reinicia();
    }

    pausa.addEventListener('click', function () { alterna(!parado); });

    /* fora da tela ou aba em segundo plano, não faz sentido girar */
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) clearInterval(relogio); else reinicia();
    });

    album.setAttribute('data-ligado', '');
    mostra(0);
    alterna(parado);
  });

  /* --- carrossel da reinauguração ----------------------------------------- */
  /* Mesma regra do álbum: anda sozinho, mas tem botão de parar. A diferença é
     que aqui as vizinhas continuam à vista, desfocadas, e a posição de cada
     foto é dita por data-pos, que o CSS traduz em tamanho, desfoque e lugar. */
  Array.prototype.forEach.call(document.querySelectorAll('.giro'), function (giro) {
    var itens = giro.querySelectorAll('.giro__item');
    if (itens.length < 2) return;

    var palco = giro.querySelector('.giro__palco');
    var pausa = giro.querySelector('.giro__pausa');
    var rotulo = giro.querySelector('.album__rotulo');
    var atual = 0;
    var relogio = null;
    var parado = quieto;
    var INTERVALO = 4600;
    var total = itens.length;

    function mostra(i) {
      atual = (i % total + total) % total;
      Array.prototype.forEach.call(itens, function (item, j) {
        /* distância da foto até o meio, pelo caminho mais curto do círculo */
        var d = j - atual;
        if (d > total / 2) d -= total;
        if (d < -total / 2) d += total;
        if (d < -2) d = -2;
        if (d > 2) d = 2;
        item.setAttribute('data-pos', d);
        item.setAttribute('aria-hidden', d === 0 ? 'false' : 'true');
      });
    }

    function reinicia() {
      clearInterval(relogio);
      if (parado) return;
      relogio = setInterval(function () { mostra(atual + 1); }, INTERVALO);
    }

    function alterna(novoEstado) {
      parado = novoEstado;
      pausa.setAttribute('aria-pressed', parado ? 'true' : 'false');
      if (rotulo) rotulo.textContent = parado ? 'Continuar' : 'Pausar';
      reinicia();
    }

    Array.prototype.forEach.call(giro.querySelectorAll('[data-giro]'), function (b) {
      b.addEventListener('click', function () {
        mostra(atual + (b.getAttribute('data-giro') === 'anterior' ? -1 : 1));
        reinicia();
      });
    });
    pausa.addEventListener('click', function () { alterna(!parado); });

    /* clicar na foto de fora traz ela pro meio: é o que a pessoa espera */
    Array.prototype.forEach.call(itens, function (item, j) {
      item.addEventListener('click', function () {
        if (item.getAttribute('data-pos') !== '0') { mostra(j); reinicia(); }
      });
    });

    /* arrastar com o dedo, que no celular é como se passa foto */
    var x0 = null;
    palco.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    palco.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) { mostra(atual + (dx < 0 ? 1 : -1)); reinicia(); }
      x0 = null;
    }, { passive: true });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) clearInterval(relogio); else reinicia();
    });

    mostra(0);
    alterna(parado);
  });

  /* --- ano do rodapé ----------------------------------------------------- */
  var anos = document.querySelectorAll('[data-ano]');
  Array.prototype.forEach.call(anos, function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
