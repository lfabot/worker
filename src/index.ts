import { Amqp } from "@spectacles/brokers";
import { promises as fsp } from "fs";
import LFAClient from "./structures/Client";
const broker = new Amqp("gateway");
const events = ["MESSAGE_CREATE"];

async function bootstrap() { // tslint:disable-line
    await broker.connect(process.env.AMQP_URI);
    broker.subscribe(events, handleAmqp);
}

function handleAmqp(event: string, data: any) {
    switch (event) {
        case "MESSAGE_CREATE": {

        }
    }
}

async function loadCommands(client: LFAClient) {
    const folders: string[] = await fsp.readdir(`${process.cwd()}/commands`);
    for (const folder of folders) {
        const files: string[] = await fsp.readdir(`${process.cwd()}/commands/${folder}`);
        for (const file of files) {
            let command: any = await import (`${process.cwd()}/commands/${folder}/${file}`);
            command = new command.default(client);
            command.category = client.capitalize(folder);
            await client.commands.add(command);
            if (client.packages.indexOf(command.category) > -1) continue;
            client.packages.push(command.category);
        }
    }
}

bootstrap();
