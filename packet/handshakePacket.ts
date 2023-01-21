import { InputBuffer, OutputBuffer }from "../buffer.ts"
import Packet from "./packet.ts"

export default class HandshakePacket extends Packet {
    username = "Player"
    key = ""
    protocolVersion = 7
    seed = BigInt(0)
    dim = 0

    constructor(username?: string) {
        super()
        if (username)
            this.username = username
    }

    async read(buf: InputBuffer) {
        this.protocolVersion = await buf.readInt()
        this.username = await buf.readString()
        this.key = await buf.readString()
        this.seed = await buf.readLong()
        this.dim = await buf.readByte()
    }

    write(buf: OutputBuffer) {
        buf
            .writeInt(this.protocolVersion)
            .writeString(this.username)
            .writeString(this.key)
            .writeLong(this.seed)
            .writeByte(this.dim)
    }


    getId(): number {
        return 1
    }
    
    static create(): Packet {
        return new HandshakePacket()
    }
}