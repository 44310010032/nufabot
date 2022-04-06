const {
    default: makeWASocket,
    generateThumbnail,
    getDevice,
    DisconnectReason,
    downloadContentFromMessage,
    delay,
    fetchLatestBaileysVersion,
    useSingleFileAuthState,
    generateWAMessage,
    prepareWAMessageMedia,
    generateWAMessageFromContent,
    proto,
    generateWAMessageContent,
    WAProto,
    isJidGroup,
    jidDecode,
} = require('@adiwajshing/baileys');
const tiktok = require('tiktok-scraper-without-watermark')
const _ = require('lodash')
const angkaTerbilang = require('@develoka/angka-terbilang-js');
const translate = require('@vitalets/google-translate-api');
const fetch = require('node-fetch');
const pino = require('pino');
const CFonts = require('cfonts');
const gradient = require('gradient-string');
let package = require('./package.json');
let session = `./session.json`;
let { daftar, isilimit, minlimit, habiskan } = require('./rid_key.js');
// const { drawImage } = require("./lib/quoteGen.js");
const { state, saveState } = useSingleFileAuthState(session);
global.config = require('./src/config.json');
global.API = config.api;
global.owner = config.owner;
global.footer = config.footer;
global.quot = config.quot;
const { SID } = require('sid-api')
const sID = new SID('zrn2021.001@gmail.com', 'Inipassword@123');
let { igApi, isIgPostUrl, shortcodeFormatter, getSessionId } = require('insta-fetcher');
const { Sticker, StickerTypes, extractMetadata } = require('wa-sticker-formatter');
const yts = require('yt-search');
let ig = new igApi(config.session_id);

/** LOCAL MODULE */
const {
    color,
    bgColor,
    cut,
    isUrl,
    humanFileSize,
    shrt,
    fetchAPI,
    formatPhone,
    getBuffer,
} = require('./utils/function');
const { Serialize } = require('./lib/simple');
const { tiktokDL } = require('./lib/tiktok');
const { download, parseMention } = require('./lib/function');
const { mp3, mp4, ytIdRegex } = require('./lib/yt');
const MediafireDL = require('./lib/mediafire');
const { Gempa, Cuaca} = require("./lib/bmkg")
const { pasaran } = require("./lib/tgl.js")
const cmdMSG = require('./src/cmdMessage.json');
let mulai = fs.statSync('./src/start.txt')
/** DATABASE */
let chatsJid = JSON.parse(fs.readFileSync('./db/chatsJid.json', 'utf-8'));
let premi = JSON.parse(fs.readFileSync('./db/premium.json', 'utf-8'));
global.p = require('./db/premium.json');


const start = async () => {
    CFonts.say(`${package.name}`, {
        font: 'shade',
        align: 'center',
        gradient: ['#12c2e9', '#c471ed'],
        transitionGradient: true,
        letterSpacing: 3,
    });
    CFonts.say(`'${package.name}' Coded By ${package.author}`, {
        font: 'console',
        align: 'center',
        gradient: ['#DCE35B', '#45B649'],
        transitionGradient: true,
    });

    const { version, isLatest } = await fetchLatestBaileysVersion()
    const client = makeWASocket({
        printQRInTerminal: true,
        logger: pino({ level: 'silent' }),
        auth: state,
        version,
        browser: [package.name, 'Safari', '3.0'],
    });

    client.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection == 'connecting') {
            console.log(
                color('[SYS]', '#009FFF'),
                color(moment().format('DD/MM/YY HH:mm:ss'), '#A1FFCE'),
                color(`${package.name} is Authenticating...`, '#f64f59')
            );
        } else if (connection === 'close') {
            console.log('connection closed, try to restart');
            lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut
                ? start()
                : console.log(
                    color('[SYS]', '#009FFF'),
                    color(moment().format('DD/MM/YY HH:mm:ss'), '#A1FFCE'),
                    color(`WA Web Logged out`, '#f64f59')
                );;
        } else if (connection == 'open') {
            console.log(
                color('[SYS]', '#009FFF'),
                color(moment().format('DD/MM/YY HH:mm:ss'), '#A1FFCE'),
                color(`${package.name} is now Connected...`, '#38ef7d')
            );
        }
    });

    client.ev.on('chats.update', chats => {
        for (let i of chats) {
            if (!chatsJid.some((x => x == i.id))) {
                chatsJid.push(i.id);
                fs.writeFileSync('./db/chatsJid.json', JSON.stringify(chatsJid), 'utf-8');
            }
        }
    })

client.ev.on('group-participants.update', async (anu) => {
        console.log(anu.action, anu);
        try {
            let jid = anu.id;
            let meta = await client.groupMetadata(jid)
            let participants = anu.participants
            const buttons = [
                      {buttonId: `${prefix}owner`, buttonText: {displayText: ' Owner'}, type: 1},
                      {buttonId: `${prefix}menu`, buttonText: {displayText: ' Menu'}, type: 1}
                    ]
            for (let x of participants) {
                let dp;
                try {
                    // dp = await client.profilePictureUrl(x, 'image')
                    dp = 'https://imgdb.net/storage/uploads/68d9c88a5f40fbf7e6c0deb8c511400c90204eaaa62b7a8f4aacab4a6ea261f2.jpg'
                } catch (error) {
                    dp = 'https://imgdb.net/storage/uploads/68d9c88a5f40fbf7e6c0deb8c511400c90204eaaa62b7a8f4aacab4a6ea261f2.jpg'
                }
                //const { buffer } = await getBuffer(dp)

                if (anu.action == 'add') {
                    // client.sendMessage(jid, { image: { url: dp },mentions: [x], caption: `Selamat bergabung @${x.split('@')[0]} di group ${meta.subject}\n\nKetik *.menu* untuk menampilkan Menu Bot\n\n*Note:* Jika BOT tidak merespon dalam 10 detik, silahkan kirim ulang` })
                    client.sendMessage(jid, 
                    { 
                      location: { jpegThumbnail: (await getBuffer(dp)).buffer, name: `${package.name}` },
                      mentions: [x],
                      caption: `Selamat bergabung @${x.split('@')[0]} di group ${meta.subject}\n\n`, 
                      footer: 'NufaBOT',
                      buttons: buttons,
                      headerType: 4
                    })

                } else if (anu.action == 'remove') {
                    client.sendMessage(jid, { 
                      location: { jpegThumbnail: (await getBuffer('https://imgdb.net/storage/uploads/1c4ef351b6b387ab669400ca88fab1ead252d2019641a8f6d506d261c83e4017.png')).buffer, name: `${package.name}` },
                      mentions: [x], 
                      caption: `Selamat jalan @${x.split('@')[0]}, semoga harimu suram!`,
                      templateButtons: buttons,
                      headerType: 4 
                    })
                }
            }
        } catch (error) {
            console.log(error);
        }
    })

    client.ev.on('creds.update', () => saveState)
    client.ev.on('messages.upsert', async (msg) => {
        try {
            if (!msg.messages) return
            const m = msg.messages[0]
            if (m.key.fromMe) return
            console.log(m);
            var from = m.key.remoteJid;
            let type = client.msgType = Object.keys(m.message)[0];
            //console.log(m.message.listResponseMessage.singleSelectReply.selectedRowId);
            Serialize(client, m)
            const content = JSON.stringify(JSON.parse(JSON.stringify(msg)).messages[0].message)
            let t = m.messageTimestamp
            client.time = moment.tz('Asia/Jakarta').format('DD/MM HH:mm:ss')
            const body = (type === 'conversation') ? m.message.conversation : (type == 'imageMessage') ? m.message.imageMessage.caption : (type == 'videoMessage') ? m.message.videoMessage.caption : (type == 'extendedTextMessage') ? m.message.extendedTextMessage.text : (type == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId : (type == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId : (type == 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId : (type === 'messageContextInfo') ? (m.message.listResponseMessage.singleSelectReply.selectedRowId || m.message.buttonsResponseMessage.selectedButtonId || m.text) : ''
        
            const isGroupMsg = isJidGroup(from)
            const isMedia = (type === 'imageMessage' || type === 'videoMessage')
            const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
            const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
            const isQuotedAudio = type === 'extendedTextMessage' && content.includes('audioMessage')
            const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
            const sender = m.sender
            const isOwner = config.owner.includes(sender)
            const isPrem = p.includes(sender)
            let pushname = m.pushName
            const botNumber = client.user.id
            const groupId = isGroupMsg ? from : ''
            const groupMetadata = isGroupMsg ? await client.groupMetadata(groupId) : ''
            const groupMembers = isGroupMsg ? groupMetadata.participants : ''
            const groupAdmins = []
            for (let i of groupMembers) {
                i.isAdmin ? groupAdmins.push(i.jid) : ''
            }
            const isGroupAdmin = groupAdmins.includes(sender)
            const isBotGroupAdmin = groupAdmins.includes(botNumber)
            var from2;
            if (from.endsWith('@g.us') == true) {
              var from2 = m.key.participant;
            } else {
              var from2 = m.key.remoteJid;
            }
            
            var datkey = await daftar(from2,pushname);
            var user_key = datkey.key
            var user_limit = datkey.limit
            global.angka = angkaTerbilang(user_limit)

            const formattedTitle = isGroupMsg ? groupMetadata.subject : ''
            global.prefix = /^[./~!#%^&+=\-,;:()]/.test(body) ? body.match(/^[./~!#%^&+=\-,;:()]/gi) : '#'

            const arg = body.substring(body.indexOf(' ') + 1)
            const args = body.trim().split(/ +/).slice(1);
            let flags = [];
            const isCmd = body.startsWith(global.prefix);
            const cmd = isCmd ? body.slice(1).trim().split(/ +/).shift().toLocaleLowerCase() : null
            let url = args.length !== 0 ? args[0] : ''

            for (let i of args) {
                if (i.startsWith('--')) flags.push(i.slice(2).toLowerCase())
            }

            const typing = async (jid) => await client.sendPresenceUpdate('composing', jid)
            const recording = async (jid) => await client.sendPresenceUpdate('recording', jid)
            const waiting = async (jid, m) => await client.sendMessage(jid, { text: '🤫 _Sedang diproses..._' }, { quoted: m })
            const templateButtons = [
              {index: 1, urlButton: {displayText: `Tambah Limit`, url: `${user_key}`}},
              {index: 2, quickReplyButton: { displayText: `Tutorial`, id: `${prefix}tutorial` } }
            ]
            const templateMessage = {
            text: `⚠ Limit kamu habis, klik tombol di bawah untuk menambah limit hingga 10.`,
            footer: `Link di bawah khusus untuk ${pushname}`,
            templateButtons: templateButtons
            }
            const habis = async (jid, m) => await  client.sendMessage(jid, templateMessage, {quoted: m})
          
            global.reply = async (text) => {
                await client.sendPresenceUpdate('composing', from)
                return client.sendMessage(from, { text }, { quoted: m })
            }
            const logEvent = (text) => {
                if (!isGroupMsg) {
                    console.log(bgColor(color('[EXEC]', 'black'), '#38ef7d'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), '#A1FFCE'), gradient.summer(`[${text}]`), bgColor(color(type, 'black'), 'cyan'), '~> from', gradient.cristal(pushname))
                }
                if (isGroupMsg) {
                    console.log(bgColor(color('[EXEC]', 'black'), '#38ef7d'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), '#A1FFCE'), gradient.summer(`[${text}]`), bgColor(color(type, 'black'), 'cyan'), '~> from', gradient.cristal(pushname), 'in', gradient.fruit(formattedTitle))
                }
            }

            if (!chatsJid.some((x => x == sender))) {
                chatsJid.push(sender);
                fs.writeFileSync('./db/chatsJid.json', JSON.stringify(chatsJid), 'utf-8');
            }

            let tipe = bgColor(color(type, 'black'), '#FAFFD1')
            if (!isCmd && !isGroupMsg) {
                console.log('[MSG]', color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), '#A1FFCE'), cut(m.text), `~> ${(tipe)} from`, color(pushname, '#38ef7d'))
            }
            if (!isCmd && isGroupMsg) {
                console.log('[MSG]', color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), '#A1FFCE'), cut(m.text), `~> ${tipe} from`, color(pushname, '#38ef7d'), 'in', gradient.morning(formattedTitle))
            }
            if (isCmd && !isGroupMsg) {
                console.log(color('[CMD]'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), '#A1FFCE'), color(`${cmd} [${args.length}]`), color(`${cut(body)}`, 'cyan'), '~> from', gradient.teen(pushname, 'magenta'))
            }
            if (isCmd && isGroupMsg) {
                console.log(color('[CMD]'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), '#A1FFCE'), color(`${cmd} [${args.length}]`), color(`${cut(body)}`, 'cyan'), '~> from', gradient.teen(pushname), 'in', gradient.fruit(formattedTitle))
            }

            if (config.autoReads) await client.sendReadReceipt(from, sender, [m.key.id])

            if (isOwner) {
                if (body.startsWith("> ")) {
                    await typing(from)
                    let syntaxerror = require('syntax-error');
                    let _return;
                    let _syntax = '';
                    let _text = body.slice(2);
                    try {
                        let i = 15
                        let exec = new (async () => { }).constructor('print', 'msg', 'require', 'client', 'm', 'axios', 'fs', 'exec', _text);
                        _return = await exec.call(client, (...args) => {
                            if (--i < 1) return
                            console.log(...args)
                            return reply(from, util.format(...args))
                        }, msg, require, client, m, axios, fs, exec);
                    } catch (e) {
                        let err = await syntaxerror(_text, 'Execution Function', {
                            allowReturnOutsideFunction: true,
                            allowAwaitOutsideFunction: true
                        })
                        if (err) _syntax = '```' + err + '```\n\n'
                        _return = e
                    } finally {
                        reply(_syntax + util.format(_return))
                    }
                } else if (body.startsWith("$ ")) {
                    await typing(from)
                    exec(body.slice(2), (err, stdout) => {
                        if (err) return reply(`${err}`)
                        if (stdout) reply(`${stdout}`)
                    })
                }
            }
            if(/tutorial/.test (cmd)) {
              await reply('Check this video for tutorial add limit\nhttps://vt.tiktok.com/ZSdLQfGFx/')
            }

            if (/donasi/.test(cmd)) {
               await typing(from)
               const buttonsDefault = [
                    { quickReplyButton: { displayText: `QRIS`, id: `${prefix}qris` } },
               ]
               let text = `*Payment:*\nDANA, OVO, GOPAY, SHOPEE PAY, LINK AJA\n\`\`\`085255646434\`\`\`\na.n *M ASRAN*`
               client.sendMessage(from, { text, footer:'Semua donasi yang masuk akan digunakan untuk pengembangan BOT ini', templateButtons: buttonsDefault, headerType: 3 }, { quoted: m })
            }

                       if (/readmore/.test(cmd)){
                if (args.length === 0) return reply('Kirim perintah !readmore text1 | text2')
                    let _text = arg.split('|')[0];
                    let more2 = arg.split('|')[1];

                const more = String.fromCharCode(8206)
                const readMore = more.repeat(4001)
                await reply(_text + readMore + more2, m)
            }   

if(/surah/.test(cmd)) {
        try {
            let example = `*Cara penggunaan :*\n\n` +
                `_menampilkan ayat secara spesifik :_\n${prefix + cmd} al-mulk 1\n\n` +
                `_menampilkan beberapa jumlah ayat :_\n${prefix + cmd} al-mulk 1-20\n(dengan artinya) : ${prefix + cmd} al-mulk 1-20 --arti\n`
            if (args.length < 1) return await reply(example)
            if (args[1].includes('-')) {
                const find = await list().then(res => {
                    return res.find(val => val.name.transliteration.id.toLowerCase() == args[0].toLowerCase())//res.findIndex(val => val.name.transliteration.id.toLowerCase().match(toRegExp(cari)))
                })
                const res = await getSurah(find.number)
                const ayat = res.data.verses
                const detil = res.data
                const range = args[1]
                const idxNUM = range.split('-')
                const dari = idxNUM[0]
                const ke = idxNUM[1]
                const max = (ke - dari);
                if (max > 30) return await reply('maksimal jumlah ayat yang dapat ditampilkan adalah 30')
                const selectedRange = ayat.slice(dari - 1, ke)

                var tex = `✅ *Detail Informasi Surah*
◈ ${'Nama Surah :'} *${detil.name.transliteration.id}*
◈ ${'No Surah :'} *${res.data.number}*
◈ ${'Jumlah Ayat :'} *${res.data.numberOfVerses}*
◈ ${'Arti Surah :'} *${detil.name.translation.id}*
◈ ${'Tergolong surah ' + detil.revelation.id}\n`

                const withTranslation = flags.includes('arti')

                for (let i = 0; i < selectedRange.length; i++) {
                    tex += `\n*{ ${selectedRange[i].number.inSurah} }* - ${selectedRange[i].text.arab} ◈${withTranslation ? '\n' + selectedRange[i].translation.id + '\n\n' : '\n'}`
                }
                await reply(tex)
            } else if (!isNaN(args[1])) {
                const find = await list().then(res => {
                    return res.find(val => val.name.transliteration.id.toLowerCase() == args[0].toLowerCase())//res.findIndex(val => val.name.transliteration.id.toLowerCase().match(toRegExp(cari)))
                })
                const res = await getSurah(find.number, args[1])
                const detil = res.data.surah

                var tex = `✅ *Detail Informasi Surah*
◈ ${'Nama Surah :'} *${detil.name.transliteration.id}*
◈ ${'No Surah :'} *${res.data.surah.number}*
◈ ${'Jumlah Ayat :'} *${res.data.surah.numberOfVerses}*
◈ ${'Arti Surah :'} *${detil.name.translation.id}*
◈ ${'Tergolong surah ' + detil.revelation.id}

*{ ${res.data.number.inSurah} }* - ${res.data.text.arab} ◈\n\n${res.data.translation.id}

◈ Tafsir Ayat: ${res.data.tafsir.id.short}`

                let idMp3 = shrt(res.data.audio.primary, { title: `${detil.name.transliteration.id} - ${res.data.number.inSurah}`, tiktokAudio: true })
                const btnCover = [
                    { quickReplyButton: { displayText: `Audio`, id: `${prefix}sendthis ${idMp3.id}` } },
                ]
                let buttonMessage = {
                    text: tex,
                    footer,
                    templateButtons: btnCover,
                }
                await client.sendMessage(m.chat, buttonMessage, { quoted: m })
            } else {
                const find = await list().then(res => {
                    return res.find(val => val.name.transliteration.id.toLowerCase() == args[0].toLowerCase())//res.findIndex(val => val.name.transliteration.id.toLowerCase().match(toRegExp(cari)))
                })
                const res = await getSurah(find.number, args[1])
                const detil = res.data.surah

                var tex = `✅ *Detail Informasi Surah*
◈ ${'Nama Surah :'} *${detil.name.transliteration.id}*
◈ ${'No Surah :'} *${res.data.number}*
◈ ${'Jumlah Ayat :'} *${res.data.numberOfVerses}*
◈ ${'Arti Surah :'} *${detil.name.translation.id}*
◈ ${'Tergolong surah ' + detil.revelation.id}

◈ Tafsir : ${res.data.tafsir.id}`

            }
        } catch (error) {
            console.log(error);
            await reply(util.format(error))
        }
    }


async function list() {
    const { data } = await axios.get('https://api.quran.sutanlab.id/surah')
    return data.data
}

async function getSurah(number, ayat = '') {
    const { data } = await axios.get(`https://api.quran.sutanlab.id/surah/${number}/${ayat}`)
    return data
}    

          if(cmd=='listsurah'){
             try {
            let example = `*Cara penggunaan :*\n\n` +
                `_menampilkan ayat secara spesifik :_\n${prefix}surah al-mulk 1\n\n` +
                `_menampilkan beberapa jumlah ayat :_\n${prefix}surah al-mulk 1-20\n(dengan artinya) : ${prefix}surah al-mulk 1-20 --arti\n`
            const find = await list()
            let tex = `${example}\n\nlist surah :`
            for (let x of find) {
                tex += `\n◈ *_${x.number}._* ${x.name.transliteration.id}`
            }

            await reply(tex)
        } catch (error) {
            console.log(error);
            await reply('error, tidak ditemukan')
        }
  

async function list() {
    const { data } = await axios.get('https://api.quran.sutanlab.id/surah')
    return data.data
}
          }

          if ( cmd == 'prem'){
            if(!isPrem) return reply ('Bukan owner')
            await reply ('ok')
          }


            if (cmd == 'autoread' && isOwner) {
            try {
            await client.presenceSubscribe(m.chat)
            await client.sendPresenceUpdate('composing', m.chat)
            if (args[0] === 'on') {
                if (config.autoReads) return await reply('✅ *Auto Read* sudah Aktif sebelumnya!')
                config.autoReads = true
                fs.writeFileSync('./src/config.json', JSON.stringify(config, null, 2))
                await reply('✅ *Auto Read* Aktif!')
            } else if (args[0] == 'off') {
                if (!config.autoReads) return reply('❌ *Auto Read* sudah Nonaktif sebelumnya!')
                config.autoReads = false
                fs.writeFileSync('./src/config.json', JSON.stringify(config, null, 2))
                await reply('❌ *Auto Read* Nonaktif!')
            } else {
                await reply('silahkan pilih on / off')
            }
        } catch (error) {
            await reply(util.format(error))
            console.log(error);
        }
    }
          if (/mix/.test(cmd)){
             try {
            const kitchen = require('./lib/emojikitchen')
            if (flags.find(v => v.match(/shuffle|random/))) {
                const emoji = kitchen.shuffle()
                const res = await kitchen.mix(emoji[0], emoji[1])
                const data = new Sticker(_.sample(res.results).url, { packname: package.name, author: '@theazran_' })
                await client.sendMessage(from, await data.toMessage(), { quoted: m })
              
            } else {
                const parsed = kitchen.parseEmoji(body)
                if (parsed.length < 1) return reply('emoji not supported, try another one.\n\nDo Note! that not all emojis are supported yet')
                const res = await kitchen.mix(parsed.length == 1 ? parsed[0] : parsed[0], parsed[1])
                const img = _.sample(res.results).url
                if (flags.find(v => v.match(/image|img|i/))) {
                    await client.sendFileFromUrl(from, img, `success ${shortenerAuth ? `https://s.id/${(await sID.short(img)).link.short}` : ''}`)
                } else {
                    const data = new Sticker(img, { packname: `NufaBOT`, author: 'by @theazran_' })
                    await client.sendMessage(m.chat, await data.toMessage(), { quoted: m })
                }
            }
        } catch (error) {
            await reply('emoji not supported, try another one.\n\nDo Note! that not all emojis are supported')
            console.log(error);
        }
    }
          
            if (cmd == 'bilang'){
              await reply(angkaTerbilang(args))
            }
    

          if (body == 'tebakgambar') {
                var apiKey = 'ridah2-Tuf7l41' // change with your key self.
                var urlApi = 'https://www.api.ridped.com/api'
        client.gtp = client.gtp ? client.gtp : {}
        if (from in client.gtp) {
            return await client.sendMessage(from, { text: `Masih ada tebakgambar yang belum anda jawab disini` }, { quoted: m })
        }
        await client.sendMessage(from, { text: 'Tunggu sebentar...' }, { quoted: m })
        var gtp = await fetch(urlApi + '?feature=tebakgambar&apikey=' + apiKey)
        var datjson = await gtp.json()
        var caption = `Silahkan jawab tebakgambar ini. Waktu untuk menjawab 25 detik!.
Bantuan : *${datjson.jawaban.replace(/[bcdfghjklmnpqrstvwxyz]/g, '_')}*`
        if (datjson.status == false) {
            return await client.sendMessage(from, { text: datjson.msg })
        }
        return client.gtp[from] = [
            await client.sendMessage(from, { image: { url: datjson.img }, caption: caption, mimetype: 'image/jpeg' }),
            datjson,
            setTimeout(() => {
                if (client.gtp[from]) client.sendMessage(from, { text: `Waktu telah habis, jawabanya adalah : *${datjson.jawaban}*`})
                return delete client.gtp[from]
            }, 25000)
        ]
    }
    
    try {
        if (from in client.gtp) {
            var j_user = m.message.conversation
            var jawaban = client.gtp[from][1].jawaban
            if (j_user.toLowerCase() == jawaban.toLowerCase()) {
                await client.sendMessage(from, { text: `Benar`}, { quoted: m})
                clearTimeout(client.gtp[from][2])
                return delete client.gtp[from]
            } else {
                return await client.sendMessage(from, { text: 'Salah' }, { quoted: m })
            }
        }
    } catch (e) {}

           if (cmd == 'tr' || cmd == 'translate'){
              try {
            let lang = args[0]
            if (!lang) return await reply(`code bahasa tujuan diperlukan, contoh ${prefix + cmd} id i love you, not only at this time`)
            if (m.quoted) {
                _text = m.quoted.text
                const tr = (await translate(_text, { to: lang })).text
                await reply(tr)
            } else if (args.length >= 2) {
                _text = args.slice(1).join(' ')
                const tr = (await translate(_text, { to: lang })).text
                await reply(tr)
            } else {
                await reply(`reply pesan atau masukkan text, contoh ${prefix + cmd} id i love you, not only at this time`)
            }
        } catch (error) {
            console.log(error);
            await reply('error, sepertinya code bahasa tidak support')
        }
    }

          // if(/ridtest/.test(cmd)) {
          //   return reply('mynumb ' + from2);
          // }
          if (/quotemaker/.test(cmd)) {
            if (args.length === 0) return reply('Cara penggunaan : \n quotemaker INI QUOTE | INI WATERMARK | url gambar\n\n NOTE: \n - QUOTE harus di isi\n- WATERMARK JIKA TIDAK DI ISI MAKA YG DI DISPLAY NAMA ANDA\n- Url gambar jika tidak di isi maka default https://ridped.com/way/mypp2.png');
            await typing(from);
            let _text = arg.split('| ')[0];
            let wm = arg.split('| ')[1] ? arg.split('| ')[1] : pushname;
            let bg = arg.split('| ')[2] ? arg.split('| ')[2] : 'https://ridped.com/way/mypp2.png';
            return await client.sendMessage(from, { image: { url: `https://www.api.ridped.com/api?feature=quotemaker&apikey=R!dp3d&text=${_text}&wm=${wm}&bg=${bg}`}, caption: `https://www.api.ridped.com/api?feature=quotemaker&apikey=KEPO&text=${_text}&wm=${wm}&bg=${bg}`, mimetype: `image/jpeg`}, { quoted: m});
          }
             if(/ig/.test(cmd)){
               if (args.length === 0) return reply('*Ex.* !ig theazran_')
              let ige = await ig.fetchUser(args)
               return await client.sendMessage(from, { image: { url: ige.hd_profile_pic_url_info.url}, caption:`
*Full Name:* ${ige.fullname}
*Username:* ${ige.username}
*Followers:* ${ige.followers}
*Following:* ${ige.following}
*Total Post:* ${ige.post_count}
*Bio:* ${ige.biography}
instagram.com/${ige.username}`, mimetype: `image/jpeg`}, { quoted: m});
          }
           if(/gg/.test(cmd)){
             ig.fetchUser('mg.creativestudio').then((res) => {
    console.log(res);
});
           }
          


            if (/ping/.test(cmd)){
              await typing(from)
              mtime = new Date(mulai.mtime)
        now = new Date()
              const buttonsDefault = [
                {index: 2, urlButton: {displayText: 'Instagram', phoneNumber: 'https://instagram.com/theazran_'}},
                    {index: 2, callButton: {displayText: 'Call me!', phoneNumber: '+6285255646434'}},
                 { quickReplyButton: { displayText: `OWNER`, id: `${prefix}owner` } },
                 { quickReplyButton: { displayText: `MENU`, id: `${prefix}menu` } },
                ]
              client.sendMessage(from, { caption: `💬 Bot online
Bot Run Time : ${moment.duration((now - mtime) / 1000, 'seconds').humanize()}
Total user: ${chatsJid.length}`, footer, templateButtons: buttonsDefault, location: { jpegThumbnail: (await getBuffer('https://imgdb.net/storage/uploads/68d9c88a5f40fbf7e6c0deb8c511400c90204eaaa62b7a8f4aacab4a6ea261f2.jpg')).buffer, name: `${package.name}` }, headerType: 4 }, { quoted: m })
            }
       
            if (/qris/.test(cmd)) {
              await typing(from)
              client.sendMessage(from, { caption: 'COMING SOON', footer, location: { jpegThumbnail: (await getBuffer('https://1.bp.blogspot.com/-_aXTEL0Y66A/YI5zRDoUvnI/AAAAAAAAE4U/X9Z0En02MtQbVkYEiTPIDjOF9aSalKtagCLcBGAsYHQ/s1600/Logo%2BQRIS.png')).buffer, name: `${package.name}` }, headerType: 4 }, { quoted: m })
            }

            if (/https:\/\/.+\.whatsapp.+/g.test(body) && !m.isBot && isGroupMsg) {
              return reply ('⚠ Link group whatsapp terdeksi'), {quoted: m}
            }

            if (cmd == 'removebg' || cmd == 'nobg' || cmd == 'rmbg') {
                try {
                    if (isMedia || isQuotedImage || m.quoted.mtype == 'documentMessage') {
                        //const mediaData = await downloadMediaMessage(m.quoted ? m.quoted : m)
                        const removed = await Sticker.removeBG(m.quoted ? await m.quoted.download() : await m.download());
                        if (flags.find(v => v.match(/((doc)|ument)|file/))) {
                            await client.sendMessage(from, { document: removed, fileName: sender.split('@')[0] + 'removed.png', mimetype: 'image/png', jpegThumbnail: removed }, { quoted: m })
                        } else {
                            await client.sendMessage(from, { image: removed, mimetype: 'image/png', caption: 'removed' }, { quoted: m })
                        }
                    } else if (isQuotedSticker) {
                        const removed = await Sticker.removeBG(await m.quoted.download())
                        const data = new Sticker(removed, { packname: package.name, author: package.author })
                        await client.sendMessage(from, await data.toMessage(), { quoted: m })
                    } else {
                        reply(`send/reply image. example :\n${prefix + cmd}\n\ndocument result use --doc`)
                    }
                } catch (error) {
                    console.log(error);
                    reply('aww snap. error occurred')
                }
            }
        

            if (cmd == 'help' || cmd == 'menu') {
                await typing(from)
                const buttonsDefault = [
                    { urlButton: { displayText: `Rest API`, url: `https://azran.my.id` } },
                    { urlButton: { displayText: `Instagram`, url: `https://instagram.com/theazran_` } },
                    { quickReplyButton: { displayText: `🔗 Link Group`, id: `${prefix}lg` } },
                    { quickReplyButton: { displayText: `💰 Donasi`, id: `${prefix}donasi` } },
                    { quickReplyButton: { displayText: `☎ Owner`, id: `${prefix}owner` } },
                ]
      
                let text = `Hi *${pushname}* 👋\n*Key* : ${user_key}\n*Limit Anda sat ini* : ${user_limit}\n\n` +
                    `${fs.readFileSync('./src/menu.txt', 'utf-8').replace(/prefix /gim, prefix)}`

                     client.sendMessage(from, { caption: text, footer, templateButtons: buttonsDefault, location: { jpegThumbnail: (await getBuffer('https://imgdb.net/storage/uploads/68d9c88a5f40fbf7e6c0deb8c511400c90204eaaa62b7a8f4aacab4a6ea261f2.jpg')).buffer, name: `${package.name}` }, headerType: 4 }, { quoted: m })
                // client.sendMessage(from,
                // {
                //   caption: text,
                //   footer,
                //   templateButtons: buttonsDefault, 
                //   headerType: 4
                //   }, 
                //   { quoted: m })
            }
          if (/owner/.test(cmd)) {
                await typing(from)
                owner.map(async (v) => await sendContact(m.chat, v.split('@s.whatsapp.net')[0], package.author, m))
                await delay(2000)
                const buttonsDefault = [
                    { urlButton: { displayText: `🌐 Web`, url: `https://azran.my.id` } },
                    { urlButton: { displayText: `📸 Instagram`, url: `https://www.instagram.com/theazran_` } },
                    { urlButton: { displayText: `🐈 Facebook`, url: `https://fb.com/azran123` } },
                ]
                client.sendMessage(from, { text: `Social Media`, footer:'azran.my.id', templateButtons: buttonsDefault }, { quoted: m })
            }
if (cmd == 'isilimit' || cmd == 'isiulang') {
                if (user_limit == '0') {
                    if (args.length < 1) return await reply('Key nya?')
                    let isiulang = await isilimit(from2, args)
                    await reply(`${isiulang.msg}`)
                } else {
                    await reply(`Limit kamu masih ada *${angka}*, Habiskan terlebih dahulu!`)
                }
            }
            if (cmd == 'limit' || cmd == 'ceklimit') {
            if(isPrem && isOwner) return reply('Limit anda tidak terbatas!')
            if (user_limit == "0") {
                        await typing(from)
                        return await habis(from, m)
                     }
            await reply(`Limit kamu masih ada *${angka}*`)
            }
               
            if (/lg/i.test(cmd)) {
              await typing(from)
              await reply(`*Group NufaBOT\n*https://chat.whatsapp.com/IQuBTCget6oLpFeI0WrrjE`)
            }
          if(/tagall/i.test(cmd)) {
              try {
            const groupMembers = (await client.groupMetadata(m.chat)).participants
            let type = m.quoted ? m.quoted.mtype : m.mtype
            if (cmd == 'hidetag') {
                let text = args.join(' ')
                if (/image|video|audio|sticker/i.test(type)) {
                    let ms = m.quoted ? m.getQuotedObj() : m
                    await client.copyNForward(m.chat, client.cMod(m.chat, ms, text, client.user.id), true, { mentions: groupMembers.map(x => x.id) })
                } else {
                    client.sendMessage(m.chat, { text, mentions: groupMembers.map(x => x.id) })
                }
            } else {
                text = args.length >= 1 ? `@${jidDecode(m.sender).user} : ${args.join(' ')}\n` : '*Tag All Members*\n'
                n = 1
                for (let i of groupMembers) {
                    text += `\n*_${n}_.* @${jidDecode(i.id).user}`
                    n++
                }

                if (/image|video/i.test(type)) {
                    let ms = m.quoted ? m.getQuotedObj() : m
                    await client.copyNForward(m.chat, client.cMod(m.chat, ms, text, client.user.id, { mentions: groupMembers.map(x => x.id) }), true, { mentions: groupMembers.map(x => x.id) })
                } else {
                    client.sendMessage(m.chat, { text, mentions: groupMembers.map(x => x.id) })
                }

            }
        } catch (error) {
            console.log(error);
        }
    }
          

           if (/https:\/\/.+\.tiktok.+/g.test(body) && !m.isBot) {
                try {
                    // example check limit
                    if (user_limit == "0" && !isPrem) {
                        await typing(from)
                        return await habis(from, m)
                     }
                    url = body.match(/https:\/\/.+\.tiktok.+/g)[0]
                    logEvent(url)
                    await waiting(from, m)
                    await typing(from)
                    const data = await tiktokDL(url)
                    let author = `${data.authorMeta.username}` || ''

                  // \n*Author:* ${author}\n*Desc:* ${data.desc}]
                    let sisa = user_limit - 1
                    let caption = `*Success...*\n*[1 Limit terpakai]*\nlimit tersisa ${sisa} (${angkaTerbilang(sisa)})`
                    
                    await sendFileFromUrl(from, data.videoUrlNoWatermark.url_list[1], caption, m, '', 'mp4', { height: data.videoUrlNoWatermark.height, width: data.videoUrlNoWatermark.width })
                    // example kurangi limit ketika semua di atas sukses 
                    await minlimit(from2 && !isPrem)
                } catch (error) {                    console.log(error)
                    //await reply('an error occurred
                }
            }
          
          // if (/https:\/\/.+\.tiktok.+/g.test(body) && !m.isBot){
          //   try {
          //           // example check limit
          //           if (user_limit == "0" && !isOwner) {
          //               await typing(from)
          //               return await habis(from, m)
          //            }
          //   await waiting(from, m)
          //   await typing(from)
          //   const url = body.match(/https:\/\/.+\.tiktok.+/g)[0]
          //   const data = await tiktok.tiktokdownload(url)
          //   let capt = '✅ Success..\n*1 limit terpakai*'
          //   await sendFileFromUrl(from, data.nowm, capt, m, '', 'mp4')
          //   await minlimit(from2)
          //       } catch (error) {                    
          //         console.log(error)
          //           // await reply('an error occurred
          //       }
          //   }
      
          
            if(/habiskan/.test(cmd)){
            await habiskan(from2)
            await reply('✅ Berhasil, Limit dihabiskan.\nSilahkan ketik *.ceklimit* untuk melihat link tambah limit')
          }

            if (/pp|gantipp/.test(cmd)) {
              if (!isOwner) return reply('⚠ Hanya owner!')
              let media = await m.quoted.download()
              return await client.updateProfilePicture(client.user.id, media)
            }
    
            if (/del|delete/.test(cmd)){
              if (m.quoted && !m.quoted.isBot) return reply('⚠ Reply pesan dari Bot!')
              client.sendMessage(from,{delete: {remoteJid: from, fromMe: true, id: m.quoted.id, participant: m.quoted.sender}})
            }


if (/https?:\/\/sfile.mobi\/[0-9-a-zA-Z_]{1,20}/g.test(body) && !m.isBot) {
  try {
    url = body.match(/https?:\/\/sfile.mobi\/[0-9-a-zA-Z_]{1,20}/g)[0]
    logEvent(url);
    await typing(from)
    let fetchs = await fetch(`https://www.api.ridped.com/api?feature=sfile&apikey=R!dp3d&url=${url}`);
    let jeeson = await fetchs.json();
    await client.sendMessage(from, { document: { url: jeeson.link}, fileName: `NufaBOT - ${jeeson.uploaded}.npv4`, mimetype: 'application/npv4'})
    await reply (`User: ${jeeson.user}\nUpload pada: ${jeeson.uploaded}\nTotal Download:${jeeson.total_download}\nDesc: ${jeeson.desc}`)
  } catch (error) {
    console.log(error);
          await reply('an error occurred')
  }
}

            if (/https?:\/\/twitter.com\/[0-9-a-zA-Z_]{1,20}\/status\/[0-9]*/g.test(body) && !m.isBot) {
                try {
                    url = body.match(/https?:\/\/twitter.com\/[0-9-a-zA-Z_]{1,20}\/status\/[0-9]*/g)[0]
                    logEvent(url);
                    await typing(from)
                    let { result: data } = await fetchAPI('masgi', '/twitter/download.php?url=' + url)
                    await waiting(from, m)
                    await reply(`Media from *${data.name} [@${data.username}]* ${quot}${data.full_text}${quot}\n\nTotal ${data.media.mediaUrl.length} ${data.media.mediaType}` || '')
                    for (i of data.media.mediaUrl) {
                        await sendFileFromUrl(from, i, '', m)
                    }
                } catch (error) {
                    console.log(error);
                    await reply('an error occurred')
                }
            }
          if(/ccc/.test(cmd)){
            await client.sendMessage('6285255646434@s.whatsapp.net', { forward: msg }) 
          }

            
            if (/https?:\/\/(web\.|www\.|m\.)?(facebook|fb)\.(com|watch)\S+/g.test(m.text) && !m.isBot) {
                try {
                  if (user_limit == "0") {
                        await typing(from)
                        return await habis(from, m)
                     }
                    url = body.match(/https?:\/\/(web\.|www\.|m\.)?(facebook|fb)\.(com|watch)\S+/g)[0]
                    logEvent(url);
                    await typing(from)
                    let data = await fetchAPI('masgi', '/facebook/?url=' + url)
                    await waiting(from, m)
                    await sendFileFromUrl(from, data.videoUrl, `*Success* - ${data.title}`, m, '', 'mp4')
                    await minlimit(from2)
                } catch (error) {
                    console.log(error);
                    await reply('an error occurred')
                }
            }

            if (/https?:\/\/?(www|pin|id)?\.(it|pinterest\.co(m|\.[a-z]{1,2}))\S+\//g.test(body) && !m.isBot) {
                try {
                    await typing(from)
                    url = /https?:\/\/?(www|pin|id)?\.(it|pinterest\.co(m|\.[a-z]{1,2}))\S+\//g.exec(body)[0]
                    logEvent(url);
                    await waiting(from, m)
                    let data = await fetchAPI('masgi', '/pinterest/download.php?url=' + url)
                    let media = data.is_video ? data.videos.video_list[Object.getOwnPropertyNames(data.videos.video_list)[0]] : data.images.orig
                    await sendFileFromUrl(from, media.url, `*${data.title || data.closeup_unified_title}* - Posted at ${moment(data.created_at).format('DD/MM/YY HH:mm:ss')}`, m)
                } catch (error) {
                    console.log(error);
                    await reply('an error occurred')
                }
            }

            // if (/(?:https?:\/\/)?(?:www\.)?(?:instagram\.com(?:\/\.+?)?\/(p|reel|tv)\/)([\w-]+)(?:\/)?(\?.*)?$/gim.test(body) && !m.isBot) {
            if(isIgPostUrl(body) && !m.isBot){

            // if (/(?:https?:\/\/)?(?:www\.)?(?:instagram\.com(?:\/\w+)?\/(p|reel|tv)\/)([\w-]+)(?:\/)?(\?.*)?$/gim.test(body) && !m.isBot) {
                try {
                  if (user_limit == "0") {
await typing(from)
return await habis(from, m)}
                    let { type, shortcode } = shortcodeFormatter(body)
                    url = `https://www.instagram.com/${type}/${shortcode}`;
                    logEvent(url);
                    await waiting(from, m)
                    let result = await ig.fetchPost(url);
                    let arr = result.links;
                    let capt = '✅ *Sukses Download Post Instagram*\n';
                    capt += '• Nama : ' + result.name + '\n';
                    capt += '• Username : ' + result.username + '\n';
                    capt += '• Likes : ' + result.likes + '\n';
                    capt += '• Media Count : ' + result.media_count; + '\n';
                    // reply(capt)
                    for (let i = 0; i < arr.length; i++) {
                        if (arr[i].type == "image") {
                            await sendFileFromUrl(from, arr[i].url, `${capt}`, m, '', 'jpeg',
                                { height: arr[i].dimensions.height, width: arr[i].dimensions.width }
                            )
                            await minlimit(from2)
                        } else {
                            await sendFileFromUrl(from, arr[i].url, `${capt}`, m, '', 'mp4',
                                { height: arr[i].dimensions.height, width: arr[i].dimensions.width }
                            )
                            await minlimit(from2)
                        }
                    }
                } catch (error) {
                    console.log(error);
                    reply('an error occurred')
                }
            }

            if (/https:\/\/(www\.)?instagram\.com\/stories\/.+/g.test(body) && !m.isBot) {
                try {
                    await typing(from)
                    await waiting(from, m)
                    if (user_limit == "0") {
                        await typing(from)
                        return await habis(from, m)
                     }
                    let regex = new RegExp(/https:\/\/(www\.)?instagram\.com\/stories\/.+/g)
                    let u = body.match(regex)[0]
                    logEvent(u);
                    let s = u.indexOf('?') >= 0 ? u.split('?')[0] : (u.split('').pop() == '/' != true ? `${u}` : u);
                    let [username, storyId] = s.split('/stories/')[1].split('/')
                    const data = await ig.fetchStories(username);
                    let media = data.stories.filter(x => x.id.match(storyId))
                    if (media[0].type == "image") {
                        await sendFileFromUrl(
                            from, media[0].url, `_Stories from @${username}_\nTaken at : ${moment(media[0].taken_at * 1000).format('DD/MM/YY HH:mm:ss')}`, m, '', 'jpeg',
                            { height: media[0].original_height, width: media[0].original_width }
                        )
                        await minlimit(from2)
                    } else {
                        await sendFileFromUrl(
                            from, media[0].url, `_Stories from @${username}_\nTaken at : ${moment(media[0].taken_at * 1000).format('DD/MM/YY HH:mm:ss')}`, m, '', 'mp4',
                            { height: media[0].original_height, width: media[0].original_width }
                        )
                        await minlimit(from2)
                    }
                } catch (error) {
                    reply('an error occurred')
                    console.log(error);
                }
            }
          
          

            if (/https:\/\/www\.instagram\.com\/s\/.+story_media_id=([\w-]+)/g.test(body) && !m.isBot) {
                const link_highlight = /https:\/\/www\.instagram\.com\/s\/(.*?)\?story_media_id=([\w-]+)/g.exec(body)[0]
                try {
                    await typing(from)
                    if (user_limit == "0") {
                    await typing(from)
                    return await habis(from, m)}
                    logEvent(link_highlight);
                    const username = await axios.get(link_highlight).then(async res => {
                        const { data } = await axios.get(res.request.res.responseUrl + '?__a=1', { headers: { cookie: 'sessionid='+config.session_id}})
                        return data.user.username;
                    })
                    let [, highlightId, mediaId] = /https:\/\/www\.instagram\.com\/s\/(.*?)\?story_media_id=([\w-]+)/g.exec(link_highlight)
                    highlightId = Buffer.from(highlightId, 'base64').toString('binary').match(/\d+/g)[0]
                    let { data } = await ig.fetchHighlights(username)
                    const filterHighlight = data.filter(x => highlightId.match(x.highlights_id))[0]
                    const filterReels = filterHighlight.highlights.filter(x => mediaId.match(x.media_id.match(/(\d+)/)[0]))[0]
                    let id = shrt(filterHighlight.cover, { title: filterHighlight.title })
                    const btnCover = [
                        { quickReplyButton: { displayText: `Highlight Cover`, id: `${prefix}sendmedia ${id.id}` } },
                    ]
                    let buttonMessage = {
                        caption: `*${filterHighlight.title}* - _Highlights from https://www.instagram.com/${username}_\nTaken at : ${moment(filterReels.taken_at * 1000).format('DD/MM/YY HH:mm:ss')}`,
                        footer,
                        templateButtons: btnCover,
                        height: filterReels.dimensions.height,
                        width: filterReels.dimensions.width
                    }
                    filterReels.type == 'image'
                        ? buttonMessage['image'] = { url: filterReels.url }
                        : buttonMessage['video'] = { url: filterReels.url }
                    await client.sendMessage(from, buttonMessage, { quoted: m })
                    //await sendFileFromUrl(from, filterReels.url, `*${filterHighlight.title}* - _Highlights from https://www.instagram.com/${username}_\nTaken at : ${moment(filterReels.taken_at * 1000).format('DD/MM/YY HH:mm:ss')}`, m, '', '', { templateButtons: btnCover, footer })
                    await minlimit(from2)
                } catch (error) {
                    console.log(error);
                    reply('an error occurred')
                }
            }

            if (/sendmedia/i.test(cmd)) {
                try {
                    let id = db.filter(x => x.id == args[0])[0]
                    await sendFileFromUrl(from, id.url, `Highlight Cover [${id.title}]`, m)
                    await minlimit(from2)
                } catch (error) {
                    console.log(error);
                }
            }

            if (/mediafire/i.test(cmd)) {
                if (!isUrl(url)) return await reply('bukan link mediafire banh')
                if (!/mediafire/.test(url)) return await reply('bukan link mediafire banh')
                try {
                    const { title, filesize, filename, upload_date, download_url } = await MediafireDL(url);
                    let ext = filename.split('.').pop();
                    let caption = `🔥 *Mediafire Downloader* 🔗\n\n` +
                        `📄 : *${filename}*\n` +
                        `ℹ : *${Number(filesize.split(/MB|GB/)[0]) > 350 ? 'Ukuran File Terlalu besar untuk dikirim via WhatsApp' : filesize}*\n` +
                        `📅 : *${upload_date}*${Number(filesize.split(/MB|GB/)[0]) <= 350 ? '\n\nsedang mengirim file, lama atau tidaknya tergantung ukuran file' : ''}`
                    if (Number(filesize.split(/MB|GB/)[0]) > 350) {
                        const buttonsDefault = [
                            { urlButton: { displayText: `${filename}`, url: `${download_url}` } }
                        ]
                        await client.sendMessage(from, { caption: caption, footer, templateButtons: buttonsDefault, image: { url: 'https://masgimenz.my.id/upload/files/jambr.jpg' }, headerType: 4 }, { quoted: m })
                    } else {
                        await reply(caption);
                        await sendFileFromUrl(from, download_url, '', m, '', ext, { fileName: `${filename}.${ext}` })
                    }
                } catch (error) {
                    await reply(error.message)
                }
            }
          
if (/8d/.test(cmd)){
  try {
            let mediaType = m.quoted ? m.quoted.mtype : m.mtype
            let msg = m.quoted ? m.quoted : m
            if (/audio|video|document/i.test(mediaType)) {
                const buffer = await client.downloadMediaMessage(msg)
                const res = await EightD(buffer)
                await client.sendFile(m.chat, res, m, { audio: true })
            } else {
                await reply(`reply a video with caption ${prefix}${cmd}`)
            }
        } catch (error) {
            console.log(error);
            await reply('error')
        }
}


            if (cmd == 'yts' || cmd == 'ytsearch') {
                if (args.length < 1) return await reply('mau cari apa?')
                try {
                    if (user_limit == "0") {
                    await typing(from)
                    return await habis(from, m)}
                    let arr = (await yts({ query: arg, hl: 'id' })).videos;
                    let list = new Array();
                    let desc = '*YouTube Search*\n'
                    for (let i = 0; i < 10; i++) {
                        desc += `\n*${i + 1}. ${arr[i].title}*\n🐓 *Channel :* ${arr[i].author.name}\n⌛ *Duration :* ${arr[i].timestamp}\n👀 *Views :* ${arr[i].views}\n📅 *Uploaded :* ${arr[i].ago}\n🔗 *Url :* ${arr[i].url}\n`
                        list.push({
                            title: `${i + 1}. ${arr[i].title}`,
                            description: `Channel : ${arr[i].author.name}\nDuration : ${arr[i].timestamp}\nViews : ${arr[i].views}\nUploaded : ${arr[i].ago}`,
                            rowId: `${prefix}yt ${arr[i].url}`
                        });
                    }
                    await sendListM(
                        from,
                        { buttonText: 'YouTube Search', description: desc, title: 'Pilih untuk mendownload' },
                        list, m
                    );
                } catch (error) {
                    console.log(error);
                }
            }

            if (cmd == 'play' || cmd == 'lagu' || cmd == 'ytmp3') {
                if (cmd == 'play' && args.length < 1) return await reply('mau cari lagu apa?')
                if (cmd == 'ytmp3' && !isUrl(url) && !ytIdRegex.test(url)) return await reply('link nya mana?')
                 await typing(from)
                try {
                    let durasi = '';
                    if (!isUrl(url)) {
                        let arr = await yts({ query: arg, hl: 'id' });
                        let { videoId, duration } = arr.videos[0];
                        durasi += duration
                        url = `https://www.youtube.com/watch?v=${videoId}`
                    }
                    const { meta, path, size} = await mp3(url);
                    let capt = `✅ *Musik ditemukan!*\n`;
                    capt += meta.videoDetails.title;
                    capt += `\nDurasi : ${moment.utc(meta.videoDetails.lengthSeconds * 1000).format('mm:ss')}`
                    capt += '\nSize : ' + humanFileSize(size, true);
                    await reply(capt);
                    await sendFile(from, path, `${meta.videoDetails.title}.mp3`, 'audio/mp3', m, { jpegThumbnail: (await getBuffer(meta.videoDetails.thumbnails.slice(-1)[0].url)).buffer })
                    await minlimit(from2)
                } catch (error) {
                    reply('_Wahh! Nampaknya ada yang error!_')
                    console.log(error);
                }
            }

            if (cmd == 'yt' || cmd == 'ytmp4'){
                try {
                    if (user_limit == "0") {
                    await typing(from)
                    return await habis(from, m)}
                    if (args.length < 1 || !isUrl(url)) return await reply('link nya mana?')
                    if (cmd == 'yt' && !m.isBot) {
                        await waiting(from, m)
                        const data = await mp4(url)
                        let caption = `ℹ Judul : ${data.title}\n` +
                            `⌛ Durasi : ${moment.utc(data.duration * 1000).format('HH:mm:ss')}\n` +
                            `📅 Uploaded at : ${data.date}\n` +
                            `🐓 Channel : ${data.channel}`
                        const templateButtons = [
                            { quickReplyButton: { displayText: `360p [${humanFileSize(Number(data.dl_link['360p'].contentLength), true, 1)}]`, id: `${prefix}ytmp4 ${url} | 360p` } },
                            { quickReplyButton: { displayText: `mp3`, id: `${prefix}ytmp3 ${url}` } },
                        ]
                        let img = await getBuffer(data.thumb)
                        let op = {
                          location: { jpegThumbnail:(img).buffer, 
                          name: `${package.name}`},
                          caption: caption,
                          footer: 'Silahkan pilih format di bawah ini',
                          templateButtons,
                          headerType: 4
                          //   image: { url: data.thumb },
                          //   caption: caption,
                          //   footer: 'Silahkan pilih format di bawah ini',
                          //   templateButtons,
                          //   jpegThumbnail: img.buffer
                        }
                        await client.sendMessage(from, op, { quoted: m })
                        // await minlimit(from2)
                    } else {
                        await waiting(from, m)
                        let quality = '360p'
                        const data = await mp4(url)
                        let caption = `ℹ Judul : ${data.title}\n` +
                            `⌛ Durasi : ${moment.utc(data.duration * 1000).format('HH:mm:ss')}\n` +
                            `📅 Uploaded at : ${data.date}\n` +
                            `🐓 Channel : ${data.channel}\n` +
                            `🕶 Quality : ${data.dl_link[quality].qualityLabel}`
                        // await reply(caption)
                        await sendFileFromUrl(from, data.dl_link[quality].url, caption, m, '', 'mp4', { height: data.dl_link[quality].height, width: data.dl_link[quality].width })
                        await minlimit(from2)
                    }
                } catch (error) {
                    reply('an error occurred')
                    console.log(error);
                }
            }

          if(/gempa/.test(cmd)){
            Gempa().then( v => 
client.sendMessage(m.chat, { image: { url: v.map }, caption: `*Info Gempa*\n• Waktu: *${v.waktu}*\n• Lintang: *${v.lintang}*\n• Bujur: *${v.bujur}*\n• Magnitudo: *${v.magnitudo}*\n• Kedalaman: *${v.kedalaman}*\n• Wilayah: *${v.wilayah}*\n` }, { quoted: m})
)
          }

          if(/cekall/.test(cmd)){
               if (!isOwner) return 
  let getGroups = await client.groupFetchAllParticipating();
let groups = Object.entries(getGroups).slice(0).map(entry => entry[1]);
let list_group = `*LIST-GROUP*\n\nTotal: *${groups.length}*\n\n`
for (let x of groups) {
list_group += `GroupID : ${x.id}\nGroupName : ${x.subject}\n\n`
}
await reply(list_group.trim())
          }

          if(/ht/.test(cmd)){
if (args.length === 0) return reply(`Contoh:\n!ht halo semua`)
var h = (await client.groupMetadata(from)).participants.map(a => a.id)
client.sendMessage(from, { text: args, mentions: h})
          }
          
            if (/^s(|ti(c|)ker)$/i.test(cmd)) {
                let packName = args.length >= 1 ? arg.split('|')[0] : `${package.name}`
                let stickerAuthor = args.length >= 1 ? arg.split('|')[1] : `${package.author}`
                let categories = config.stickerCategories[arg.split('|')[2]] || config.stickerCategories['happy']
                try {
                  if (user_limit == "0") {
                    await typing(from)
                    return await habis(from, m)}
                   await typing(from)
                    if (isMedia && !m.message.videoMessage || isQuotedImage) {
                        const message = isQuotedImage ? m.quoted : m.message.imageMessage
                        const buff = await client.downloadMediaMessage(message)
                        const data = new Sticker(buff, { pack: packName, author: 'by @theazran_', categories, type: StickerTypes.FULL, quality: 50, id: footer })
                      
                        await client.sendMessage(from, await data.toMessage(), { quoted: m })
                      await minlimit(from2)
                    } else if (m.message.videoMessage || isQuotedVideo) {
                        if (isQuotedVideo ? m.quoted.seconds > 15 : m.message.videoMessage.seconds > 15) return reply('too long duration, max 15 seconds')
                        const message = isQuotedVideo ? m.quoted : m.message.videoMessage
                        const buff = await client.downloadMediaMessage(message)
                        const data = new Sticker(buff, { pack: packName, author: stickerAuthor, categories, type: StickerTypes.FULL, quality: 50, id: footer })
                        await client.sendMessage(from, await data.toMessage(), { quoted: m })
                      await minlimit(from2)
                    } else {
                        reply('Kirim/reply media gambar atau video')
                    }
                } catch (error) {
                    reply('an error occurred');
                    console.log(error);
                }

                if (/fl(i|o)p|rotate/.test(cmd)) {
                    try {
                        const degrees = ['90', '180', '270', 'flip', 'flop']
                        const deg = /fl(i|o)p/i.test(cmd) ? cmd : Number(args[0])
                        let crop = flags.find(v => cropStyle.map(x => x == v.toLowerCase()))
                        if (isMedia || isQuotedImage) {
                            const message = isQuotedImage ? m.quoted : m
                            const buff = await client.downloadMediaMessage(message)
                            const data = await Sticker.rotate(buff, deg);
                            await client.sendMessage(from, { image: data, caption: args[0] }, { quoted: m })
                        } else if (isQuotedSticker) {
                            const buff = await client.downloadMediaMessage(m.quoted)
                            const rotated = await Sticker.rotate(buff, deg);
                            const data = new Sticker(rotated, { packname: package.name, author: package.author, packId: deg }, crop)
                            await client.sendMessage(from, await data.toMessage(), { quoted: m })
                        } else {
                            reply(`send/reply image or sticker. example :\n${prefix + cmd} degrees\n\nlist degrees :${degrees.map(x => '- ' + x).join('\n')}`)
                        }
                    } catch (error) {
                        console.log(error);
                        reply('aww snap. error occurred')
                    }
                }    
            }

          if(/short/.test(cmd)){
            try {
            if (!isUrl(url)) return await reply('bukan url')
            const {data} = await sID.short(url);
            await reply('✅ Link berhasil dipendekkan: \ns.id/' + data.short)
        } catch (error) {
            console.log(error);
            await reply('error')
        }
    }

          if (/quote/.test(cmd)){
            try {
              if (args.length === 0) return m.reply('text quotes tidak boleh kosong')
              let _text = arg.split('|')[0]
              let wm = arg.split('|')[1]
              wm = wm ? `~ ${wm}` : ''
              if (m.mtype && m.mtype == 'imageMessage' || m.quoted && m.quoted.mtype && m.quoted.mtype == 'imageMessage'){
                const message = m.quoted ? m.quoted : m
                const bg = await client.downloadMediaMessage(message)
                const generated = await drawImage(_text, wm, bg)
                let caption = ''
                try {
                  await client.sendMessage(m.chat, { image: generated.toBuffer(), caption }, { quoted: m })
                } catch (error) {
                  
                }
              }
            } catch (error) {
              
            }
          }
               
            if (/toimg/i.test(cmd)) {
                if (isQuotedSticker) {
                    try {
                        await typing(from)
                        await client.presenceSubscribe(from)
                        await client.sendPresenceUpdate('composing', from)
                        const media = await downloadMediaMessage(m.quoted)
                        await client.sendMessage(from, { image: media, jpegThumbnail: media }, { quoted: m })
                    } catch (error) {
                        console.log(error);
                        reply('an error occurred')
                    }
                } else {
                    await reply('reply a sticker')
                }
            }

             // Groups Moderation
             if (isCmd && isGroupMsg) {
                if (isGroupAdmin) return reply('Hah?')
                if (isBotGroupAdmin) return reply(cmdMSG.botNotAdmin)
                switch (cmd) {
                    case '+':
                    case 'add':
                        if (args.length < 1) return reply(`example: ${prefix + cmd} 628xxx, +6285-2335-xxxx, 085236xxx`)
                        try {
                            let _participants = args.join(' ').split`,`.map(v => formatPhone(v.replace(/[^0-9]/g, '')))
                            let users = (await Promise.all(
                                _participants.filter(async x => {
                                    (await client.onWhatsApp(x)).map(x => x.exists)
                                }))
                            )
                            await client.groupParticipantsUpdate(groupId, users, 'add').then(res => console.log(res)).catch(e => console.log(e))
                        } catch (error) {
                            reply(util.format(error))
                            console.log(error);
                        }
                        break;
                    case '-':
                    case 'kick':
                        if (!isOwner) return await reply('Kick matamu!')
                        if (m.quoted) {
                            const _user = m.quoted.sender;
                            await client.groupParticipantsUpdate(groupId, [_user], 'remove')
                        } else if (args.length >= 1 || m.mentionedJid.length >= 1) {
                            let _participants = parseMention(args.join(' '))
                            if (_participants.length < 1) return reply(`tag user atau reply pesan nya, contoh : ${prefix + cmd} @user`)
                            reply(`Kick/Remove *${_participants.length}* group members within delay 2 seconds to prevent banned`)
                            for (let usr of _participants) {
                                await delay(2000)
                                await client.groupParticipantsUpdate(groupId, [usr], 'remove')
                            }
                        } else {
                            reply(`tag user atau reply pesan nya, contoh : ${prefix + cmd} @user`)
                        }
                        break;
                    case 'pm':
                    case 'upadmin':
                    case '^':
                    case 'promote':
                        if (m.quoted) {
                            const _user = m.quoted.sender;
                            await client.groupParticipantsUpdate(groupId, [_user], 'promote')
                        } else if (args.length >= 1 || m.mentionedJid.length >= 1) {
                            let _participants = parseMention(body)
                            if (_participants.length < 1) return reply(`tag user atau reply pesan nya, contoh : ${prefix + cmd} @user`)
                            reply(`Promoting *${_participants.length}* group members to be Group Admin within delay 3 seconds to prevent banned`)
                            for (let usr of _participants) {
                                await delay(3000)
                                await client.groupParticipantsUpdate(groupId, [usr], 'promote')
                            }
                        } else {
                            reply(`tag user atau reply pesan nya, contoh : ${prefix + cmd} @user`)
                        }
                        break;
                    case 'dm':
                    case 'unadmin':
                    case 'demote':
                        if (m.quoted) {
                            const _user = m.quoted.sender;
                            await client.groupParticipantsUpdate(groupId, [_user], 'demote')
                        } else if (args.length >= 1 || m.mentionedJid.length >= 1) {
                            let _participants = parseMention(body)
                            if (_participants.length < 1) return reply(`tag user atau reply pesan nya, contoh : ${prefix + cmd} @user`)
                            reply(`Demoting *${_participants.length}* group members to be Group Mmbers within delay 3 seconds to prevent banned`)
                            for (let usr of _participants) {
                                await delay(3000)
                                await client.groupParticipantsUpdate(groupId, [usr], 'demote')
                            }
                        } else {
                            reply(`tag user atau reply pesan nya, contoh : ${prefix + cmd} @user`)
                        }
                        break;
                    case 'inv':
                    case 'rekrut':
                        if (m.quoted) {
                            const _user = m.quoted.sender;
                            try {
                                await client.groupParticipantsUpdate(groupId, [_user], 'add')
                            } catch (error) {
                                const inviteCode = await client.groupInviteCode(groupId)
                                let thumb;
                                try { thumb = await client.profilePictureUrl(from, 'image') } catch (e) { thumb = './src/logo.jpg' }
                                await sendGroupV4Invite(groupId, _user, inviteCode, moment().add('3', 'days').unix(), false, thumb)
                                reply('inviting...')
                            }
                        } else {
                            reply(`reply pesan user yg mau di invite`)
                        }
                        break;
                    case 'setdesc':
                    case 'deskripsi':
                    case 'desc':
                    case 'updesc':
                        if (args.length < 1) return reply(`Mengubah deskripsi group, example: ${prefix + cmd} ssstt... dilarang mengontol wkwkwk!`)
                        const _desc = args.join(' ')
                        await client.groupUpdateDescription(groupId, _desc)
                        break;
                    case 'uptitle':
                    case 'settitle':
                    case 'gname':
                    case 'upgname':
                    case 'cgname':
                        if (args.length < 1) return reply(`Mengubah deskripsi group, example: ${prefix + cmd} ${package.name}`)
                        const _title = args.join(' ')
                        const _before = (await client.groupMetadata(groupId)).subject
                        await client.groupUpdateSubject(groupId, _title)
                        reply(`Berhasil mengubah nama group.\n\nBefore : ${_before}\nAfter : ${args.join(' ')}`)
                        break;
                    case 'lock':
                    case 'tutup':
                    case 'close':
                        await client.groupSettingUpdate(groupId, 'announcement')
                        reply('success')
                        break;
                    case 'unlock':
                    case 'buka':
                    case 'open':
                        await client.groupSettingUpdate(groupId, 'not_announcement')
                        reply('success')
                        break;
                    case 'setpicture':
                    case 'setimage':
                        if (isMedia || isQuotedImage) {
                            const message = isQuotedImage ? m.quoted : m
                            const buffer = await downloadMediaMessage(message)
                            await client.updateProfilePicture(groupId, buffer)
                        } else if (isUrl(url)) {
                            await client.updateProfilePicture(groupId, { url })
                        } else {
                            reply(`send/reply image, or you can use url that containing image`)
                        }
                        break;
                }
            }

        } catch (error) {
            console.log(color('[ERROR]', 'red'), color(moment().format('DD/MM/YY HH:mm:ss'), '#A1FFCE'), error);
        }
    })


    

    /**
     * Send files from url with automatic file type specifier 
     * @param {string} jid this message sent to? 
     * @param {string} url url which contains media
     * @param {string} caption media message with caption, default is blank
     * @param {string} quoted the message you want to quote
     * @param {string} mentionedJid mentionedJid
     * @param {string} extension custom file extensions
     * @param {boolean} asDocument if set to true, it will send media (audio) as document
     * @param  {...any} options 
     */
    async function sendFileFromUrl(jid, url, caption = '', quoted = '', mentionedJid, extension, options = {}, axiosOptions = {}) {
        try {
            const { filepath, mimetype } = await download(url, extension, axiosOptions);
            mentionedJid = mentionedJid ? parseMention(mentionedJid) : []
            let mime = mimetype.split('/')[0]
            let thumb = await generateThumbnail(filepath, mime)
            if (mimetype == 'image/gif' || options.gif) {
                await client.sendPresenceUpdate('composing', jid)
                const message = await prepareWAMessageMedia({ video: { url: filepath }, caption, gifPlayback: true, gifAttribution: 1, mentions: mentionedJid, jpegThumbnail: thumb, ...options }, { upload: client.waUploadToServer })
                let media = generateWAMessageFromContent(jid, { videoMessage: message.videoMessage }, { quoted, mediaUploadTimeoutMs: 600000 })
                await client.relayMessage(jid, media.message, { messageId: media.key.id })
                //await client.sendMessage(jid, { video: buffer, caption, gifPlayback: true, mentions: mentionedJid, jpegThumbnail: thumb, ...options }, { quoted })
            } else if (mime == 'video') {
                await client.sendPresenceUpdate('composing', jid)
                client.refreshMediaConn(false)
                const message = await prepareWAMessageMedia({ video: { url: filepath }, caption, mentions: mentionedJid, jpegThumbnail: thumb, ...options }, { upload: client.waUploadToServer })
                let media = generateWAMessageFromContent(jid, { videoMessage: message.videoMessage }, { quoted, mediaUploadTimeoutMs: 600000 })
                await client.relayMessage(jid, media.message, { messageId: media.key.id })
            } else if (mime == 'image') {
                await client.sendPresenceUpdate('composing', jid)
                const message = await prepareWAMessageMedia({ image: { url: filepath }, caption, mentions: mentionedJid, jpegThumbnail: thumb, ...options }, { upload: client.waUploadToServer })
                let media = generateWAMessageFromContent(jid, { imageMessage: message.imageMessage }, { quoted, mediaUploadTimeoutMs: 600000 })
                await client.relayMessage(jid, media.message, { messageId: media.key.id })
            } else if (mime == 'audio') {
                await client.sendPresenceUpdate('recording', jid)
                const message = await prepareWAMessageMedia({ document: { url: filepath }, mimetype: mimetype, fileName: options.fileName }, { upload: client.waUploadToServer })
                let media = generateWAMessageFromContent(jid, { documentMessage: message.documentMessage }, { quoted, mediaUploadTimeoutMs: 600000 })
                await client.relayMessage(jid, media.message, { messageId: media.key.id })
            } else {
                await client.sendPresenceUpdate('composing', jid)
                client.refreshMediaConn(false)
                const message = await prepareWAMessageMedia({ document: { url: filepath }, mimetype: mimetype, fileName: options.fileName }, { upload: client.waUploadToServer, })
                let media = generateWAMessageFromContent(jid, { documentMessage: message.documentMessage }, { quoted, mediaUploadTimeoutMs: 600000 })
                await client.relayMessage(jid, media.message, { messageId: media.key.id })
            }
            fs.unlinkSync(filepath)
        } catch (error) {
            client.sendMessage(jid, { text: `error => ${util.format(error)} ` }, { quoted })
        }
    }
    global.sendFileFromUrl;

    /**
     * 
     * @param {String} jid 
     * @param {Object} button 
     * @param {Array|Object} rows 
     * @param {Object} quoted 
     * @param {Object} options 
     * @returns 
     */
    async function sendListM(jid, button, rows, quoted, options) {
        await client.sendPresenceUpdate('composing', jid)
        let messageList = WAProto.Message.fromObject({
            listMessage: WAProto.ListMessage.fromObject({
                buttonText: button.buttonText,
                description: button.description,
                listType: 1,
                sections: [
                    {
                        title: button.title,
                        rows: [...rows]
                    }
                ]
            })
        })
        let waMessageList = generateWAMessageFromContent(jid, messageList, { quoted, userJid: jid, contextInfo: { ...options } })
        return await client.relayMessage(jid, waMessageList.message, { messageId: waMessageList.key.id })
    }

        /**
     * send file as document, from path
     * @param {string} jid 
     * @param {string} path 
     * @param {string} fileName 
     * @param {string} mimetype 
     * @param {any} quoted
     * @returns
     */

        
         async function sendFile(jid, path, fileName, mimetype = '', quoted = '', options = {}) {
            return await client.sendMessage(jid, { document: { url: path }, mimetype, fileName, ...options }, { quoted })
                .then(() => {
                    try {
                        fs.unlinkSync(path)
                    } catch (error) {
                        console.log(error);
                    }
                })
        }


    async function sendContact(jid, numbers, name, quoted, men) {
        let number = numbers.replace(/[^0-9]/g, '')
        const vcard = 'BEGIN:VCARD\n'
            + 'VERSION:3.0\n'
            + 'FN:' + name + '\n'
            + 'ORG:;\n'
            + 'TEL;type=CELL;type=VOICE;waid=' + number + ':+' + number + '\n'
            + 'END:VCARD'
        return client.sendMessage(jid, { contacts: { displayName: name, contacts: [{ vcard }] }, mentions: men ? men : [] }, { quoted: quoted })
    }
    client.downloadMediaMessage = downloadMediaMessage
    async function downloadMediaMessage(message) {
        let mimes = (message.msg || message).mimetype || ''
        let messageType = mimes.split('/')[0].replace('application', 'document') ? mimes.split('/')[0].replace('application', 'document') : mimes.split('/')[0]
        let extension = mimes.split('/')[1]
        const stream = await downloadContentFromMessage(message, messageType)
        let buffer = Buffer.from([])
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }
        return buffer
    }
};

// mtype

async function sendAudio(jid, path, quoted, options = {}) {
    let mimetype = getDevice(quoted.id) == 'ios' ? 'audio/mpeg' : 'audio/mp4'
    await client.sendMessage(jid, { audio: { url: path }, mimetype, mp3: true, ...options }, { quoted })
        .then(() => {
            try {
                fs.unlinkSync(path)
            } catch (error) {
                console.log(error);
            }
        })
}
/**
 * 
 * @param {string} jid 
 * @param {proto.WebMessageInfo} message 
 * @param {boolean} forceForward 
 * @param {any} options 
 * @returns 
 */
async function copyNForward(jid, message, forceForward = false, options = {}) {
    let vtype
    if (options.readViewOnce) {
        message.message = message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message ? message.message.ephemeralMessage.message : (message.message || undefined)
        vtype = Object.keys(message.message.viewOnceMessage.message)[0]
        delete (message.message && message.message.ignore ? message.message.ignore : (message.message || undefined))
        delete message.message.viewOnceMessage.message[vtype].viewOnce
        message.message = {
            ...message.message.viewOnceMessage.message
        }
    }

    let mtype = Object.keys(message.message)[0]
    let content = generateForwardMessageContent(message, forceForward)
    let ctype = Object.keys(content)[0]
    let context = {}
    if (mtype != "conversation") context = message.message[mtype].contextInfo
    content[ctype].contextInfo = {
        ...context,
        ...content[ctype].contextInfo
    }
    const waMessage = generateWAMessageFromContent(jid, content, options ? {
        ...content[ctype],
        ...options,
        ...(options.contextInfo ? {
            contextInfo: {
                ...content[ctype].contextInfo,
                ...options.contextInfo
            }
        } : {})
    } : {})
    await client.relayMessage(jid, waMessage.message, { messageId: waMessage.key.id })
    return waMessage
}

/**
 * 
 * @param {string} jid 
 * @param {proto.WebMessageInfo} copy 
 * @param {string} text 
 * @param {string} sender 
 * @param {*} options 
 * @returns 
 */
function cMod(jid, copy, text = '', sender = client.user.id, options = {}) {
    //let copy = message.toJSON()
    let mtype = Object.keys(copy.message)[0]
    let isEphemeral = mtype === 'ephemeralMessage'
    if (isEphemeral) {
        mtype = Object.keys(copy.message.ephemeralMessage.message)[0]
    }
    let msg = isEphemeral ? copy.message.ephemeralMessage.message : copy.message
    let content = msg[mtype]
    if (typeof content === 'string') msg[mtype] = text || content
    else if (text || content.caption) content.caption = text || content.caption
    else if (content.text) content.text = text || content.text
    if (typeof content !== 'string') msg[mtype] = {
        ...content,
        ...options
    }
    if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
    else if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
    if (copy.key.remoteJid.includes('@s.whatsapp.net')) sender = sender || copy.key.remoteJid
    else if (copy.key.remoteJid.includes('@broadcast')) sender = sender || copy.key.remoteJid
    copy.key.remoteJid = jid
    copy.key.fromMe = sender === client.user.id

    return proto.WebMessageInfo.fromObject(copy)
}

// mtype




try {
    start().catch(e => console.log(e));
} catch (error) {
    console.log(error);
}

