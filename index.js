const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys")
const P = require("pino")

async function startBot() {

    const { state, saveCreds } = await useMultiFileAuthState("auth")

    const sock = makeWASocket({
        auth: state,
        logger: P({ level: "info" })
    })

    sock.ev.on("creds.update", saveCreds)

    sock.ev.on("connection.update", (update) => {
        if (update.qr) {
            console.log("QR RECEIVED - check Railway logs")
        }
        if (update.connection === "open") {
            console.log("WhatsApp connected")
        }
    })

    sock.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0]
        if (!msg.message) return

        const sender = msg.key.remoteJid
        const text = msg.message.conversation || ""

        console.log("Message:", text)

        await sock.sendMessage(sender, {
            text: "OpenClaw cloud bot is active."
        })
    })
}

startBot()
