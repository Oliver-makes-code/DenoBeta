import Packet from "../packet.ts";
import StringPacket from "./stringPacket.ts"

export default class LoginPacket extends StringPacket {
    getId(): number {
        return 2
    }

    static create(): Packet {
        return new LoginPacket()
    }
}
