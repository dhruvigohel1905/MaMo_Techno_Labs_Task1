const fs = require('fs');
const files = [
  'src/modules/community/community.controller.ts',
  'src/modules/notification/notification.controller.ts'
];
files.forEach(f => {
  if (fs.existsSync(f)) {
    let c = fs.readFileSync(f, 'utf8');
    c = c.replace(/req\.params\.([a-zA-Z]+)/g, '(req.params.$1 as string)');
    fs.writeFileSync(f, c);
  }
});
