const config = require('./config');

const comandos = {
  async link(sock, msg, isGroup, groupMetadata) {
    if (isGroup) {
      const code = await sock.groupInviteCode(msg.key.remoteJid);
      await sock.sendMessage(msg.key.remoteJid, { text: `Link del grupo: https://chat.whatsapp.com/${code}` });
    } else {
      await sock.sendMessage(msg.key.remoteJid, { text: "Este comando solo se puede usar en grupo." });
    }
  },

  async antilink(sock, msg, isAdmin, from, sender, isGroup) {
    global.antilink = !global.antilink;
    const estado = global.antilink ? "activado" : "desactivado";
    await sock.sendMessage(from, { text: `Antilink ${estado}` });
  },

  async modoadmin(sock, msg, isAdmin, from) {
    global.modoAdmin = !global.modoAdmin;
    const estado = global.modoAdmin ? "activado" : "desactivado";
    await sock.sendMessage(from, { text: `Modo admin ${estado}` });
  },

  async LosmasBuscados(sock, msg, from) {
    const info = `🧢 *LOS MÁS BUSCADOS* 🧢
🔗 Grupo oficial: ${config.losMasBuscados.grupo}
📸 Instagram: ${config.losMasBuscados.instagram}
🎵 TikTok: ${config.losMasBuscados.tiktok}`;
    await sock.sendMessage(from, { text: info });
  },

  async antillamadas(sock, msg) {
    global.antillamadas = !global.antillamadas;
    const estado = global.antillamadas ? "activado" : "desactivado";
    await sock.sendMessage(msg.key.remoteJid, { text: `Antillamadas ${estado}` });
  },

  async sologrupo(sock, msg) {
    global.soloGrupo = !global.soloGrupo;
    const estado = global.soloGrupo ? "activado" : "desactivado";
    await sock.sendMessage(msg.key.remoteJid, { text: `Modo solo grupo ${estado}` });
  },

  async creador(sock, msg, from) {
    const texto = `👑 *CREADOR DEL BOT*
Ezequiel Muñoz
📞 ${config.creador.whatsapp}
📸 ${config.creador.instagram}
🎵 ${config.creador.tiktok}

👑 *CREADOR DE LOS MÁS BUSCADOS*
Maisi
📞 WhatsApp
📸 Instagram
🎵 TikTok`;
    await sock.sendMessage(from, { text: texto });
  },

  async bot(sock, msg, body, from) {
    const prompt = body.replace(".bot", "").trim();
    if (!prompt) {
      await sock.sendMessage(from, { text: "Escribí algo después de .bot para responder con IA." });
    } else {
      const respuesta = `🤖 ChatGPT dice:
${prompt}`;
      await sock.sendMessage(from, { text: respuesta });
    }
  }
};

module.exports = comandos;