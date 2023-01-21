import Packet from "../packet.ts";
import Vector3iPacket from "./v3iPacket.ts"

export default class WorldSpawnPacket extends Vector3iPacket {
    getId(): number {
        return 6
    }

    static create(): Packet {
        return new WorldSpawnPacket()
    }
}