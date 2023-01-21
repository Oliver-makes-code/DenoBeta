import { InputBuffer, OutputBuffer } from "../../buffer.ts";
import Packet from "../packet.ts";
import PositionPacket from "./positionPacket.ts";

export default class EntitySpawnPacket extends PositionPacket {
    uid = 0
    id = 0
    yaw = 0
    pitch = 0

    constructor(uid?: number, id?: number, x?: number, y?: number, z?:number, yaw?: number, pitch?: number) {
        super(x,y,z)
        if (uid)
            this.uid = uid
        if (id)
            this.id = id
        if (yaw)
            this.yaw = yaw
        if (pitch)
            this.pitch = pitch
    }

    async read(buf: InputBuffer) {
        this.uid = await buf.readInt()
        this.id = await buf.readByte()
        await super.read(buf)
        this.yaw = await buf.readByte()
        this.pitch = await buf.readByte()
    }
    write(buf: OutputBuffer) {
        buf.writeInt(this.uid)
        buf.writeByte(this.id)
        super.write(buf)
        buf.writeByte(this.yaw)
        buf.writeByte(this.pitch)
    }

    getId(): number {
        return 24
    }

    static create(): Packet {
        return new EntitySpawnPacket()
    }
}