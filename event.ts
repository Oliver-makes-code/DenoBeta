export const Event = {
    login: "login",
    packet: "packet",
    disconnect: "disconnect"
} as const

export type Event = keyof typeof Event
