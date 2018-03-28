# Subshell
subshell is a library to create a new shell and run sequence of commands inside the shell. You also could run interactive command and send proper input text by monitoring the output from command.

# Install
It uses unbuffer for flushing the console message. You should install it first with `brew install unbuffer`. To install the package, run `npm i subshell`

# Usage
Here is a simple example for running commands. You could see the running result by setting `setLogger` on shell
```
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
```

The next example is an interactive commad demo. It calls the python and sending some formula

```
const subshell = require('../src/wrapper');

const shell = subshell.shell();
const run = subshell.command(shell);
const run_interactive = subshell.command_interactive(shell);

shell.setLogger((line) => console.log(line))

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
```


