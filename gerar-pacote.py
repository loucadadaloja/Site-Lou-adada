#!/usr/bin/env python3
"""Gera o pacote do site para subir na hospedagem.

O que entra: tudo que o navegador pede, inclusive o .htaccess, que é
arquivo oculto e some fácil quando se arrasta pasta na mão.

O que fica de fora: a pasta .git, a pasta docs (modelo da arte do link e
playbook), o README e os próprios scripts. Nada disso é página do site, e
publicar é dar endereço para quem não precisa ter.

    python3 gerar-pacote.py

Sai um loucadada-site.zip pronto para o public_html da hospedagem.
"""
import os, sys, zipfile

RAIZ = os.path.dirname(os.path.abspath(__file__))
SAIDA = os.path.join(RAIZ, 'loucadada-site.zip')

FORA = {'.git', 'docs', '.github', 'node_modules'}
ARQ_FORA = {'README.md', '.gitignore', 'loucadada-site.zip'}

def main():
    if os.path.exists(SAIDA):
        os.remove(SAIDA)
    n, peso = 0, 0
    htaccess = False
    with zipfile.ZipFile(SAIDA, 'w', zipfile.ZIP_DEFLATED) as z:
        for raiz, dirs, arqs in os.walk(RAIZ):
            dirs[:] = [d for d in dirs if d not in FORA]
            for a in sorted(arqs):
                if a in ARQ_FORA or a.endswith(('.py', '.sh', '.bak')):
                    continue
                caminho = os.path.join(raiz, a)
                rel = os.path.relpath(caminho, RAIZ)
                z.write(caminho, rel)
                n += 1
                peso += os.path.getsize(caminho)
                if rel == '.htaccess':
                    htaccess = True

    print('%d arquivos · %.1f MB soltos · %.1f MB zipado'
          % (n, peso/1e6, os.path.getsize(SAIDA)/1e6))
    print('.htaccess dentro do pacote: %s' % ('sim' if htaccess else 'NÃO — confira'))
    print('\nPronto: %s' % SAIDA)
    print('Sobe o conteúdo dele na pasta public_html da hospedagem.')
    return 0 if htaccess else 1

sys.exit(main())
