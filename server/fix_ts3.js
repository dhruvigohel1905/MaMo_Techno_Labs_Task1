const fs = require('fs');
const glob = require('glob');
glob.sync('src/modules/**/*.controller.ts').forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  // Match req.params.SOMETHING followed by non-word chars to avoid matching 'req.params' alone
  c = c.replace(/req\.params\.([a-zA-Z0-9_]+)/g, '(req.params.$1 as string)');
  fs.writeFileSync(f, c);
});
