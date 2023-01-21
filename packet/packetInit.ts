import { register } from "./packet.ts"
import LoginPacket from "./string/loginPacket.ts"
import DisconnectPacket from "./string/disconnectPacket.ts"
import HandshakePacket from "./handshakePacket.ts"
import WorldSpawnPacket from "./v3i/worldSpawnPacket.ts"
import EntitySpawnPacket from "./v3i/entitySpawnPacket.ts"
import ChunkUpdatePacket from "./chunkUpdatePacket.ts"

export default function init() {
    register(1, () => new HandshakePacket())
    register(2, () => new LoginPacket())
    register(6, () => new WorldSpawnPacket())
    register(24, () => new EntitySpawnPacket())
    register(50, () => new ChunkUpdatePacket())
    register(255, () => new DisconnectPacket())
}
