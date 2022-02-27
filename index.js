const processWindows = require("node-process-windows");
const RPC = require("discord-rpc");

const clientId = '947582103095234562';
const scopes = ['rpc', 'rpc.api', 'messages.read'];

const client = new RPC.Client({ transport: 'ipc' });
let notionActivePage;


setInterval(() => {
    processWindows.getProcesses((err, processes) => {
        processes.forEach(function (p) {
            if(p.processName === "Notion" && p.mainWindowTitle !== undefined && p.mainWindowTitle !== ""){
                notionActivePage = p.mainWindowTitle;
            }
        });
    });
}, 1e4);

let timestamp = new Date();

client.on("ready", () =>{

    client.setActivity({
        details: "Editing:",
        state: `${notionActivePage ? notionActivePage : "No file open"}`,
        startTimestamp: timestamp,
        largeImageKey: "notion",
        largeImageText: "notion"
    });
    
    setInterval(() => {
        client.setActivity({
            details: "Editing:",
            state: `${notionActivePage ? notionActivePage : "No file open"}`,
            startTimestamp: timestamp,
            largeImageKey: "notion",
            largeImageText: "notion"
        });
        console.debug("Notion updating presence is running");
    }, 15e3);

    console.log("Notion rich presence is running");
});

client.login({
    clientId: clientId
});