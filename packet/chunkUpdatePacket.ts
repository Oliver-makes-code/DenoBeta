import { InputBuffer, OutputBuffer }from "../buffer.ts"
import Packet from "./packet.ts"

export default class ChunkUpdatePacket extends Packet {
    x?: number
    y?: number
    loaded?: boolean

    constructor(x?: number, y?: number, loaded?: boolean) {
        super()
        if (x)
            this.x = x
        if (y)
            this.y = y
        if (loaded)
            this.loaded = loaded
    }

    async read(buf: InputBuffer) {
        this.x = await buf.readInt()
        this.y = await buf.readInt()
        this.loaded = await buf.readBool()
    }
    write(buf: OutputBuffer) {
        buf.writeInt(this.x ?? 0)
        buf.writeInt(this.y ?? 0)
        buf.writeBool(!!this.loaded)
    }

    getId(): number {
        return 50
    }

    static create(): Packet {
        return new ChunkUpdatePacket()
    }
}