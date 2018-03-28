module.exports = class Command {
  constructor({shell, cmd, interactive}) {
    this.shell = shell;
    this.cmd = cmd;
    this.interactive = interactive;

    this.exec = `${this.cmd}`;
    this.exec += ';echo __END_OF_COMMAND_[$?]__\n';

    this.handleStdoutDataBind = this.handleStdoutData.bind(this);
    this.shell.getStdout().on('data', this.handleStdoutDataBind);

    this.handleStderrDataBind = this.handleStderrData.bind(this);
    this.shell.getStderr().on("data", this.handleStderrDataBind);

    this.runningState = this.RUNNING_STATE_INIT;

    this.RUNNING_STATE_INIT = 0;
    this.RUNNING_STATE_START = 1;
    this.RUNNING_STATE_END = 2;

    this.logger = shell.getLogger();

    return this;
  }

  handleStdoutData(data) {
    const lines = data.split(/\r?\n/);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const match = line.match(/__END_OF_COMMAND_\[(\d+)\]__/);

      if (match) {
        this.retCode = parseInt(match[1]);

        this.finish();
        return;
      } else {
        this.logger(line);
      }

      if (this.interactive) {
        this.interactive(line, this.handleStdinData.bind(this));
      }
    }
  }

  handleStderrData(data) {
    this.logger(data);
  }

  handleStdinData(data) {
    this.shell.getStdin().write(`${data}\n`);
  }

  run() {
    let promiseResolve, promiseReject;

    const promise = new Promise((resolve, reject) => {
      promiseResolve = resolve;
      promiseReject = reject;
    });

    this.promiseResolve = promiseResolve;
    this.promiseReject = promiseReject;
    this.promise = promise;

    this.runningState = this.RUNNING_STATE_START;

    this.shell.getStdin().write(this.exec);

    this.timer = setTimeout(() => {
      if (!this.runningState !== this.RUNNING_STATE_END) {
        const obj = {
          retCode: -1,
          cmd: this.cmd,
        };

        this.promiseReject(obj);
      }
    }, 86400000);

    return promise;
  }

  finish() {
    this.runningState = this.RUNNING_STATE_END;

    clearTimeout(this.timer);

    this.shell.getStdout().removeListener('data', this.handleStdoutDataBind);
    this.shell.getStderr().removeListener('data', this.handleStderrDataBind);

    const obj = {
      retCode: this.retCode,
      cmd: this.cmd,
    };

    if (this.retCode) {
      return this.promiseReject(obj);
    }

    return this.promiseResolve(obj);
  }
};
