import Packet from "../packet.ts";
import StringPacket from "./stringPacket.ts"

export default class DisconnectPacket extends StringPacket {
    getId(): number {
        return 255
    }

    static create(): Packet {
        return new DisconnectPacket()
    }
}