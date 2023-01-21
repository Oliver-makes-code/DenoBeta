import { InputBuffer, OutputBuffer } from "../../buffer.ts"
import Packet from "../packet.ts"
import Vector3iPacket from "./v3iPacket.ts";

export default class PositionPacket extends Vector3iPacket {
    constructor(x?: number, y?: number, z?:number) {
        super(x,y,z)
    }

    async read(buf: InputBuffer) {
        await super.read(buf)
        this.x /= 32
        this.y /= 32
        this.z /= 32
    }
    write(buf: OutputBuffer) {
        const tempx = this.x
        const tempy = this.y
        const tempz = this.z
        this.x = Math.ceil(this.x * 32)
        this.y = Math.ceil(this.y * 32)
        this.z = Math.ceil(this.z * 32)
        super.write(buf)
        this.x = tempx
        this.y = tempy
        this.z = tempz
    }

    static create(): Packet {
        return new PositionPacket()
    }
}