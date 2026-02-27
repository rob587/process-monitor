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

  const processes = await getProcesses();

  processes.forEach((proc) => {
    const ramMB = ((proc.mem * memInfo.total) / 100 / 1024 / 1024).toFixed(0);

    // Colora in base al consumo
    let cpuColor =
      proc.cpu > 50 ? chalk.red : proc.cpu > 20 ? chalk.yellow : chalk.white;
    let memColor =
      proc.mem > 10 ? chalk.red : proc.mem > 5 ? chalk.yellow : chalk.white;

    tabella.push([
      proc.pid,
      proc.name.substring(0, 28),
      cpuColor(proc.cpu.toFixed(1)),
      memColor(proc.mem.toFixed(1)),
      ramMB,
    ]);
  });

  console.log(tabella.toString());
  console.log(
    chalk.gray("\nAggiornamento ogni 3 secondi... Premi CTRL+C per uscire"),
  );
}

console.log(chalk.green("🚀 Avvio Process Monitor...\n"));

displayMonitor();
setInterval(displayMonitor, 3000);
