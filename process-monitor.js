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
