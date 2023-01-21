import { InputBuffer, OutputBuffer } from "../buffer.ts"

export default class Packet {
    async read(_buf: InputBuffer) {}
    write(_buf: OutputBuffer) {}
    getId(): number {
        return -1
    }
    
    static create(): Packet {
        return new Packet()
    }
}

const packetRegistry: (() => Packet)[] = []

export function register(id: number, packet: () => Packet) {
    packetRegistry[id] = packet
}

export function getPacket(id: number): (() => Packet)|undefined {
    return packetRegistry[id]
}
