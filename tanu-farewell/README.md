# For Tanu — A Little Book of Memories

A responsive, interactive farewell website with 11 personal notes gathered from the team's Microsoft Forms responses.

## Interactions

- Select any note to read the complete message.
- Use Previous / Next to move between letters.
- Search by contributor name.
- Choose “Surprise me” to open a random note.
- Trigger the final send-off animation at the bottom of the page.

## Local preview

Run `python -m http.server 8000` from this folder and visit `http://localhost:8000`.

## Deployment

The site is deployed as a subpath of the existing `Vineetdasari14/Vineet` GitHub Pages site:

`https://vineetdasari14.github.io/Vineet/tanu-farewell/`

The repository's Pages workflow copies the existing `good-morning-aishu` website to the Pages root and this folder to `/tanu-farewell/`, preserving the other site.

## Privacy

This repository is public. Contributor names and messages in `data/messages.json` are publicly accessible. This static site is not password protected.