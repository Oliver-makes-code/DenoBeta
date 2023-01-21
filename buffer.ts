import Packet from "./packet/packet.ts"

const decoder = new TextDecoder()
const encoder = new TextEncoder()

export class InputBuffer {
    connection: Deno.Reader

    constructor(connection: Deno.Reader) {
        this.connection = connection
    }

    private async readN(number: number): Promise<DataView> {
        const out = new Uint8Array(number)
        await this.connection.read(out)
        const buffer = new ArrayBuffer(number)
        const view = new DataView(buffer)
        out.forEach((elem, idx) => view.setUint8(idx, elem))
        return view
    }

    async readUByte(): Promise<number> {
        return (await this.readN(1)).getUint8(0)
    }

    async readByte(): Promise<number> {
        return (await this.readN(1)).getInt8(0)
    }

    async readBool(): Promise<boolean> {
        return await this.readUByte() != 0
    }

    async readShort(): Promise<number> {
        return (await this.readN(2)).getInt16(0)
    }

    async readInt(): Promise<number> {
        return (await this.readN(4)).getInt32(0)
    }

    async readLong(): Promise<bigint> {
        return (await this.readN(8)).getBigInt64(0)
    }

    async readFloat(): Promise<number> {
        return (await this.readN(4)).getFloat32(0)
    }

    async readDouble(): Promise<number> {
        return (await this.readN(8)).getFloat64(0)
    }

    async readChar(): Promise<string> {
        return decoder.decode(new Uint8Array((await this.readN(2)).buffer))
    }

    async readString(): Promise<string> {
        const len = await this.readShort()
        return decoder.decode(new Uint8Array((await this.readN(len)).buffer))
    }
}

export class OutputBuffer {
    buf: ArrayBuffer
    view: DataView
    index = 0

    constructor() {
        this.buf = new ArrayBuffer(0)
        this.view = new DataView(this.buf)
        this.index = 0
    }

    private clear() {
        this.buf = new ArrayBuffer(0)
        this.view = new DataView(this.buf)
        this.index = 0
    }

    private tryExpand(bytes: number) {
        if (this.index + bytes > this.view.byteLength) {
            const old = new Uint8Array(this.buf)
            this.buf = new ArrayBuffer(this.index+bytes)
            this.view = new DataView(this.buf)
            old.forEach((elem, idx)=> this.view.setUint8(idx, elem))
        }
    }

    writeUByte(byte: number): OutputBuffer {
        this.tryExpand(1)
        this.view.setUint8(this.index++, byte)
        return this
    }

    writeByte(byte: number): OutputBuffer {
        this.tryExpand(1)
        this.view.setInt8(this.index++, byte)
        return this
    }

    writeBool(bool: boolean): OutputBuffer {
        this.tryExpand(1)
        this.writeUByte(bool ? 1 : 0)
        return this
    }

    writeShort(int: number): OutputBuffer {
        this.tryExpand(2)
        this.view.setUint16(this.index, int)
        this.index += 2
        return this
    }

    writeInt(int: number): OutputBuffer {
        this.tryExpand(4)
        this.view.setUint32(this.index, int)
        this.index += 4
        return this
    }

    writeLong(int: bigint): OutputBuffer {
        this.tryExpand(8)
        this.view.setBigInt64(this.index, int)
        this.index += 8
        return this
    }

    writeFloat(float: number): OutputBuffer {
        this.tryExpand(4)
        this.view.setFloat32(this.index, float)
        this.index += 4
        return this
    }

    writeDouble(float: number): OutputBuffer {
        this.tryExpand(8)
        this.view.setFloat64(this.index, float)
        this.index += 8
        return this
    }

    writeChar(char: string): OutputBuffer {
        let encode = encoder.encode(char)
        if (encode.length == 0) throw "empty char"
        if (encode.length > 2) throw "char size > 2 bytes"
        if (encode.length == 1) encode = new Uint8Array([encode[0], 0])
        return this.writeByte(encode[0]).writeByte(encode[1])
    }

    writeString(char: string): OutputBuffer {
        const encode = encoder.encode(char)
        this.writeShort(encode.length)
        encode.forEach(byte => this.writeByte(byte))
        return this
    }

    toString(): string {
        return new Uint8Array(this.buf).toString()
    }

    async send(conn: Deno.Writer, packet: Packet) {
        this.writeUByte(packet.getId())
        packet.write(this)
        await conn.write(new Uint8Array(this.buf))
        this.clear()
    }
}