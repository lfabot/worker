import { Amqp } from "@spectacles/brokers";
const broker = new Amqp("gateway");
const events = ["MESSAGE_CREATE"];

async function bootstrap() { // tslint:disable-line
    await broker.connect(process.env.AMQP_URI);
    broker.subscribe(events, (event, data) => {
        switch (event) {
            case "MESSAGE_CREATE": {
                
            }
        }

    });

}

bootstrap();
