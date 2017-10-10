import logger from "winston";
import server from "./lib/server";
import sensors from "./lib/sensors";
import storage from "./lib/storage";
import config from "./config";

async function startup()
{
    printStarLine();
    console.log('* Hello from RunYangBridge *');
    printStarLine();
    console.log(' RunYangBridge server is now starting... ');

    await perpare();

    printStarLine();
    logger.info('Congratulations! RunYangBridge server is now running.');
}

async function perpare()
{
    await setup();
    await loadSensor();
}

async function setup()
{
    setupLogger();
    setupServer();
    await setupStorage();
}

function setupLogger()
{
    logger.remove(logger.transports.Console);        //删除已建立的传输
    logger.add(logger.transports.Console, {          //新建log
        timestamp: () => new Date().toString().substr(0, 24),
        colorize: true
    });
}

function setupServer()
{
    server.setup();
}

async function setupStorage()
{
    let storage = null;
    try
    {
        storage = require("./lib/storage");
        if (storage.default)
        {
            // In ES6, use storage.default
            storage = storage.default;
        }
        logger.info("Connecting to the default database...");
        await storage.connection.connect();
        logger.info("Database connected.");
    }
    catch (err)
    {
        logger.error(err);
        logger.error("Fail to connect to the default database.");
        logger.info("Server is going to stop.");
        process.exit();
    }
}

async function loadSensor()
{
    await sensors.load();
}

function printStarLine()
{
    //console.log('*'.repeat(80));
}

startup();
