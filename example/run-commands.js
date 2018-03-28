const subshell = require('../src/wrapper');

const shell = subshell.shell();
const run = subshell.command(shell);

shell.setLogger((line) => console.log(line))

(async () => {
  await run('ls');

  await run('cd ..');

  await run('ls -al');

  await process.exit(0);
})();