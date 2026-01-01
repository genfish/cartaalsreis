This folder should contain Twemoji SVG files named by codepoint(s), for example:

- 1f384.svg (Christmas tree 🎄)
- 2b50.svg (star ⭐)
- 1f381.svg (gift 🎁)
- 2744.svg (snowflake ❄️)

You can download these SVGs from the Twemoji repository or CDN and place them into this folder.

Example curl commands:

curl -o 1f384.svg https://twemoji.maxcdn.com/v/latest/svg/1f384.svg
curl -o 2b50.svg https://twemoji.maxcdn.com/v/latest/svg/2b50.svg
curl -o 1f381.svg https://twemoji.maxcdn.com/v/latest/svg/1f381.svg
curl -o 2744.svg https://twemoji.maxcdn.com/v/latest/svg/2744.svg

After placing the SVG files, reload the page. The script expects files like `twemoji/svg/1f384.svg` etc.