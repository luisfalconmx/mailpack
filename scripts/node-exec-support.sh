echo '#!/usr/bin/env node' | cat - dist/main.js > temp && mv temp dist/main.js
chmod 775 dist/main.js