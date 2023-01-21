// deno-lint-ignore-file
import { InputBuffer, OutputBuffer } from "./buffer.ts";
import HandshakePacket from "./packet/handshakePacket.ts";
import Packet, { getPacket } from "./packet/packet.ts";
import LoginPacket from "./packet/string/loginPacket.ts";
import { Event } from "./event.ts"
import packetInit from "./packet/packetInit.ts";
import DisconnectPacket from "./packet/string/disconnectPacket.ts";
packetInit()

interface ClientOptions {
    port?: number
    username?: string
}

export default class Client {
    conn: Deno.TcpConn
    inputBuffer: InputBuffer
    outputBuffer = new OutputBuffer()
    username: string
    active: boolean = true
    //@ts-ignore
    events: Map<Event, ((...params: any) => void|Promise<void>)|undefined> = new Map()

    private constructor(conn: Deno.TcpConn, options: ClientOptions) {
        this.conn = conn
        this.inputBuffer = new InputBuffer(conn)
        this.username = options.username ?? "Player_"+Math.floor(Math.random()*100)
    }

    async recievePacket() {
        const id = await this.inputBuffer.readUByte()
        const init = getPacket(id)
        if (!init) {
            throw "Unknown packet ID! Recieved: " + id
        }
        const packet = init()
        await packet.read(this.inputBuffer)
        return packet
    }

    async * packets() {
        while (this.active) {
            yield await this.recievePacket()
        }
    }

    close() {
        this.conn.close()
    }

    async sendPacket(packet: Packet) {
        this.outputBuffer.send(this.conn, packet)
    }

    async login() {
        await this.sendLoginPackets()
        await this.startEventLoop()
    }
    
    private async sendLoginPackets() {
        await this.sendPacket(new LoginPacket(this.username))
        // Wait for acknowledgement
        let recieve = await this.recievePacket()
        if (recieve.getId() != 2)
            throw "Serer sent invalid packet at login! Recieved: "+recieve.getId()
        await this.sendPacket(new HandshakePacket(this.username))
        // Wait for acknowledgement
        recieve = await this.recievePacket()
        if (recieve.getId() != 1)
            throw "Serer sent invalid packet at handshake! Recieved: "+recieve.getId()
    }

    private async startEventLoop() {
        this.emitEvent(Event.login, this)
        for await (const packet of this.packets()) {
            if (packet instanceof DisconnectPacket) {
                this.emitEvent(Event.disconnect, (packet as DisconnectPacket).string, this)
                this.close()
                return
            }
            this.emitEvent(Event.packet, packet, this)
        }
    }

    on(event: Event, action: ((...params: any) => void|Promise<void>)) {
        this.events.set(event, action)
    }

    static async connect(options?: ClientOptions) {
        if (!options)
            options = {}
        return new Client(await Deno.connect({ port: options.port ?? 25565 }), options)
    }

    private emitEvent(type: Event, ...params: any) {
        const runner = this.events.get(type)
        if (!runner) return
        runner(...params)
    }
}