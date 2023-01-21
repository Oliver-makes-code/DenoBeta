import { InputBuffer, OutputBuffer } from "../../buffer.ts"
import Packet from "../packet.ts"

export default class Vector3iPacket extends Packet {
    x = 0
    y = 0
    z = 0

    constructor(x?: number, y?: number, z?:number) {
        super()
        if (x)
            this.x = x
        if (y)
            this.y = y
        if (z)
            this.z = z
    }

    async read(buf: InputBuffer) {
        this.x = await buf.readInt()
        this.y = await buf.readInt()
        this.z = await buf.readInt()
    }
    write(buf: OutputBuffer) {
        buf.writeInt(this.x)
        buf.writeInt(this.y)
        buf.writeInt(this.z)
    }

    static create(): Packet {
        return new Vector3iPacket()
    }
}
