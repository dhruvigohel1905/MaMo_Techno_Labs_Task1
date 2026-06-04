const fs = require('fs');
const files = [
  'src/modules/attendance/attendance.controller.ts',
  'src/modules/certificate/certificate.controller.ts',
  'src/modules/event/event.controller.ts',
  'src/modules/organization/org.controller.ts',
  'src/modules/registration/registration.controller.ts',
  'src/modules/user/user.controller.ts'
];
files.forEach(f => {
  if (fs.existsSync(f)) {
    let c = fs.readFileSync(f, 'utf8');
    c = c.replace(/req\.params\.([a-zA-Z]+)/g, '(req.params.$1 as string)');
    fs.writeFileSync(f, c);
  }
});
