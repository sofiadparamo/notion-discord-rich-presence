const processWindows = require("node-process-windows");
const RPC = require("discord-rpc");
const os = require('os');

if(os.platform() !== 'win32'){
    console.log('Only Windows is supported');
    process.exit(0);
}

const clientId = '947582103095234562';

const client = new RPC.Client({ transport: 'ipc' });
let notionActivePage;

const util = require('util');
const exec = util.promisify(require('child_process').exec);


async function enableUTF8Commands() {
    const { stdout, stderr } = await exec('@chcp 65001 >nul', {'encoding': 'UTF-8'});
}

enableUTF8Commands();

function fetchNotionProcess(){
    processWindows.getProcesses((err, processes) => {
        processes.forEach(function (p) {
            if(p.processName === "Notion" && p.mainWindowTitle !== undefined && p.mainWindowTitle !== ""){
                notionActivePage = p.mainWindowTitle;
            }
        });
    });
}

fetchNotionProcess();

setInterval(() => {
    fetchNotionProcess();
}, 1e3);


client.on("ready", () =>{
    let timestamp = new Date();
    let lastUpdate = 0;
    let lastNotionUpdate = notionActivePage;

    client.setActivity({
        details: "Editing:",
        state: `${notionActivePage ? notionActivePage : "No file open"}`,
        startTimestamp: timestamp,
        largeImageKey: "notion",
        largeImageText: "notion"
    });
    
    setInterval(() => {
        if(notionActivePage !== lastNotionUpdate){
            if(lastUpdate + 15e3 < new Date().getTime()){
                lastNotionUpdate = notionActivePage;
                console.log(`Notion updating presence to ${notionActivePage}`);
                client.setActivity({
                    details: "Editing:",
                    state: `${notionActivePage ? notionActivePage : "No file open"}`,
                    startTimestamp: timestamp,
                    largeImageKey: "notion",
                    largeImageText: "notion"
                });
                lastUpdate = new Date().getTime();
            }
        }
    }, 1e3);

    console.log("Notion rich presence is running");
});

client.login({
    clientId: clientId
});