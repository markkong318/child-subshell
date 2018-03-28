const subshell = require('../src/wrapper');

const shell = subshell.shell();
const run = subshell.command(shell);
const run_interactive = subshell.command_interactive(shell);

shell.setLogger((line) => console.log(line));

let python_commands = ['1+1', 'print "hello"', 'exit()'];

(async () => {
  await run('ls -al');
  await run_interactive('python', (line, input) => {
    if(line === '>>> ') {
      input(python_commands.shift());
    }
  });

  await run('ls -al');
  await process.exit(0);
})();