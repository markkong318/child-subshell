const Command = require('./command');
const Shell = require('./shell');

const shell = () => (new Shell());
const command = (shell) => (cmd) => (new Command({shell, cmd}).run());
const command_interactive = (shell) => (cmd, interactive) => (new Command({shell, cmd, interactive}).run());

module.exports = {
  shell,
  command,
  command_interactive,
};
