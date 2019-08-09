import { Amqp } from "@spectacles/brokers";
import { Client as Cache } from "@spectacles/cache";
import Rest from "@spectacles/rest";
import { Message } from "@spectacles/types";
import { promises as fsp } from "fs";
import Redis from "ioredis";
import { Pool } from "pg";
import LFAClient from "./structures/Client";
const broker = new Amqp("gateway");
const events = ["MESSAGE_CREATE"];

async function bootstrap() { // tslint:disable-line
    await broker.connect(process.env.AMQP_URI);
    const client = new LFAClient(
        broker,
        new Cache(new Redis(process.env.CACHE_URI)),
        new Pool({ connectionString: process.env.POSTGRES_URI }),
        Rest(process.env.DISCORD_TOKEN)
    );
    await loadCommands(client);
    await broker.subscribe(events, (event, data) => {
        switch (event) {
            case "MESSAGE_CREATE": MessageEvent(data, client);
            default: console.log(`Other event received: ${event}`);
        }
    });
    console.log("LFABot Worker successfully connected.");
}

async function loadCommands(client: LFAClient) {
    const folders: string[] = await fsp.readdir(`${process.cwd()}/commands`);
    for (const folder of folders) {
        const files: string[] = await fsp.readdir(`${process.cwd()}/commands/${folder}`);
        for (const file of files) {
            if (!file.endsWith(".js")) continue;
            let command: any = await import (`${process.cwd()}/commands/${folder}/${file}`);
            command = new command.default(client);
            command.category = client.capitalize(folder);
            await client.commands.add(command);
            if (client.packages.indexOf(command.category) > -1) continue;
            client.packages.push(command.category);
        }
    }
}

async function MessageEvent(msg: Message, client: LFAClient) {
    if (!msg.content.startsWith(client.prefix)) return;
    const prefix = new RegExp(
    `^<@!?${this.client.user.id}> |^${regExpEsc(commandPrefix || "lfa, "
    )}`).exec(msg.content); // tslint:disable-line
    if (!prefix) return;
    const args: string[] = msg.content.slice(prefix[0].length)
        .trim()
        .split(/ +/g);
    const command = client.commands.get(args.shift().toLowerCase());

    try {
        await command.execute(msg);
    } catch (error) {
        // TODO: Error handling.
    }
}

function regExpEsc(str) {
    return str.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
}

bootstrap();
