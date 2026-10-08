const { execSync } = require('child_process');

const git = '"C:\\Users\\Admin\\MinGit\\cmd\\git.exe"';

function run(cmd) {
  console.log(`> ${cmd}`);
  try {
    const out = execSync(cmd, { cwd: 'd:\\Antigravity', encoding: 'utf8' });
    if (out.trim()) console.log(out.trim());
  } catch (err) {
    console.error(`Error: ${err.message}`);
    if (err.stdout) console.log(err.stdout);
    if (err.stderr) console.error(err.stderr);
  }
}

run(`${git} init`);
run(`${git} config user.name "Le Huy Toan"`);
run(`${git} config user.email "lehuytoan@example.com"`);
run(`${git} add .`);
run(`${git} status`);
run(`${git} commit -m "Initial commit: Website sự kiện Business Meeting 2026 - ASTRONIXA & Ohana"`);
