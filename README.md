# USGClient
USGClient is written and compiled using Svelte alone.  

For localhost development: create for import into vite.config.js

api-proxy-config.js
---
const proxy = {

    '/api': 'http(s)://your.location.api',
    '/dist': 'http(s)://your.location.dist',

}

export { proxy };
---
<code>