import { InputBuffer, OutputBuffer } from "../../buffer.ts"
import Packet from "../packet.ts"

export default class StringPacket extends Packet {
    string?: string

    constructor(string?: string) {
        super()
        if (string)
            this.string = string
    }

    async read(buf: InputBuffer) {
        this.string = await buf.readString()
    }
    write(buf: OutputBuffer) {
        buf.writeString(this.string!)
    }

    static create(): Packet {
        return new StringPacket()
    }
}