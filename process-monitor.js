//importo i dati

const si = require("systeminformation");
const Table = require("cli-table3");
const chalk = require("chalk");

let prevData = new Map();

//avvio una funzione in cui applico il filtraggio  e ri-ordino i livelli di Cpu

async function getProcesses() {
  const processes = await si.processes();

  let topProcesses = processes.list
    .filter((p) => p.cpu > 0 || p.mem > 0.5)
    .sort((a, b) => b.cpu - a.cpu)
    .slice(0, 15);

  return topProcesses;
}

//funzione per implementare il display dei parametri della cpu e ram e la creazione di una tabella con ogni parametro deve mostrarmi

async function displayMonitor() {
  console.clear();

  const cpu = await si.currentLoad();
  const memory = await si.mem();

  console.log(chalk.blue.bold("\n🖥️  SYSTEM MONITOR\n"));

  console.log(chalk.yellow(`CPU Usage: ${cpu.currentLoad.toFixed(1)}%`));
  console.log(
    chalk.yellow(
      `RAM Usage: ${((mem.used / mem.total) * 100).toFixed(1)}% (${(mem.used / 1024 / 1024 / 1024).toFixed(1)}GB / ${(mem.total / 1024 / 1024 / 1024).toFixed(1)}GB)`,
    ),
  );

  const tabella = new Table({
    head: [
      chalk.cyan("PID"),
      chalk.cyan("Name"),
      chalk.cyan("Cpu %"),
      chalk.cyan("Ram %"),
      chalk.cyan("Ram (Mb)"),
    ],
    colWidths: [8, 30, 10, 10, 12],
  });
}
