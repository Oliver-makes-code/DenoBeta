import Packet from "./packet/packet.ts"
import Client from "./client.ts"
import { Event } from "./event.ts"

const client = await Client.connect({
    username: "ProtFox"
})

client.on(Event.packet, (packet: Packet) => {
    console.log("Recieved packet!", packet)
})

client.on(Event.disconnect, (reason: string) => {
    console.log("Disconnected:", reason)
})

await client.login()