const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, makeInMemoryStore } = require('@whiskeysockets/baileys');
const P = require('pino');
const comandos = require('./comandos');

async function iniciarBot() {
  const { state, saveCreds } = await useMultiFileAuthState('auth');
  const sock = makeWASocket({
    printQRInTerminal: true,
    auth: state,
    logger: P({ level: 'silent' })
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const from = msg.key.remoteJid;
    const body = msg.message.conversation || msg.message.extendedTextMessage?.text || "";

    const isGroup = from.endsWith("@g.us");
    const sender = msg.key.participant || msg.key.remoteJid;
    const groupMetadata = isGroup ? await sock.groupMetadata(from) : {};
    const isAdmin = isGroup ? groupMetadata.participants.find(p => p.id === sender)?.admin : false;

    const comando = body.split(" ")[0].toLowerCase();
    if (global.soloGrupo && !isGroup) return;

    if (global.modoAdmin && !isAdmin && !require('./config').adminBypass.includes(comando)) return;

    if (comando in comandos) {
      await comandos[comando.replace(".", "")](sock, msg, isAdmin, from, sender, isGroup, body);
    }

    if (global.antilink && body.includes("chat.whatsapp.com") && !isAdmin) {
      await sock.sendMessage(from, { text: "Detectado link de grupo. Eliminando usuario..." });
      await sock.groupParticipantsUpdate(from, [sender], "remove");
      await sock.sendMessage(from, { text: "Wow, eras admin, fuiste perdonado ❌🧢" });
    }
  });

  sock.ev.on('call', async (call) => {
    if (global.antillamadas) {
      await sock.updateBlockStatus(call[0].from, "block");
      console.log("Llamada detectada. Usuario bloqueado.");
    }
  });
}


  sock.ev.on('group-participants.update', async (update) => {
    const { id, participants, action } = update;
    const nombreGrupo = (await sock.groupMetadata(id)).subject;

    for (let user of participants) {
      if (action === 'add') {
        await sock.sendMessage(id, {
          image: { url: './bienvenida.png' },
          caption: `👋 *BIENVENIDO A LOS + Buscados*`
        });
      } else if (action === 'remove') {
        await sock.sendMessage(id, {
          image: { url: './bienvenida.png' },
          caption: `🚨 *SE DIO A LA FUGA ❌🧢*`
        });
      }
    }
  });


iniciarBot();