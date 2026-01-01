# Carta als Reis d'Orient

Aplicació web per escriure i compartir la carta als Reis d'Orient. Perfecte per a nens i adults que volen fer arribar els seus desitjos de manera especial.

## Característiques

- Escriure la carta amb una tipografia elegant (Pacifico)
- Decoracions festives amb emojis nadalencs al voltant de la carta
- Espai per signar o dibuixar amb dit/ratolí
- Impressió en format A4 (amb o sense decoracions)
- Compartir a xarxes socials (WhatsApp, Twitter, Facebook, Instagram, Bluesky, Threads, Mastodon)
- Disseny responsiu per escriptori i mòbil
- Web Share API nativa en dispositius mòbils

## Demo

Obre `index.html` directament al navegador o desplega-ho en qualsevol servidor web estàtic.

## Ús

1. **Escriure**: Fes clic a l'àrea de text i comença a escriure la teva carta
2. **Signar**: Dibuixa la teva signatura o nom a l'espai de signatura (a l'esquerra de "Gràcies")
3. **Imprimir**: Clica "Imprimir" i tria si vols incloure les decoracions o no
4. **Compartir**: Clica "Compartir" per generar una imatge i enviar-la a les xarxes socials

## Estructura del projecte

```
CartaAlsReis/
├── index.html          # Pàgina principal
├── styles.css          # Estils CSS
├── script.js           # Lògica JavaScript
├── favicon.ico         # Icona del lloc
├── twemoji/            # Emojis vectorials (SVG)
│   └── svg/            # Fitxers SVG dels emojis
└── README.md           # Aquest fitxer
```

## Dependències externes (CDN)

- [html2canvas](https://html2canvas.hertzen.com/) - Generació d'imatges
- [signature_pad](https://github.com/szimek/signature_pad) - Canvas de signatura
- [Google Fonts (Pacifico)](https://fonts.google.com/specimen/Pacifico) - Tipografia
- [Twemoji](https://github.com/twitter/twemoji) - Emojis vectorials (inclosos localment)

## Funcionalitats tècniques

### Signatura digital
- Dibuix amb ratolí o pantalla tàctil
- Corbes Bézier suaus
- Botó per esborrar
- Compatible amb impressió i captura d'imatge

### Compartició a xarxes socials
- **Mòbil**: Utilitza Web Share API nativa per compartir directament
- **Escriptori**: Modal amb opcions per copiar/descarregar la imatge i enllaços a les xarxes

### Impressió
- Format A4 optimitzat
- Opció d'imprimir amb o sense decoracions festives
- Compatible amb impressores domèstiques

## Navegadors compatibles

- Chrome/Edge (recomanat)
- Firefox
- Safari

## Llicència

MIT License - Lliure per utilitzar, modificar i distribuir.

## Autor

DevId - Genfish Informàtica SL

---

Bones festes i que els Reis us portin molts regals!
