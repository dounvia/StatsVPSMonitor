const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const os = require('os');
const { exec } = require('child_process');
const util = require('util');

const execPromise = util.promisify(exec);

const TOKEN = 'TON_TOKEN';
const CHANNEL_ID = 'ID_DU_CHANNEL';
const REFRESH_RATE = 6000;
const COLOR = 0x0099ff;

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

async function getCpuInfo() {
    try {
        const { stdout: load } = await execPromise("top -bn1 | grep 'Cpu(s)' | awk '{print $2 + $4}'");
        return `${parseFloat(load).toFixed(1)}%`;
    } catch {
        return 'Indisponible';
    }
}

function getMemoryUsage() {
    const total = os.totalmem() / (1024 * 1024);
    const free = os.freemem() / (1024 * 1024);
    const used = total - free;
    return `${Math.round(used)}MB / ${Math.round(total)}MB (${Math.round((used / total) * 100)}%)`;
}

async function getDiskUsage() {
    try {
        const { stdout } = await execPromise("df -h / | awk 'NR==2 {print $3 \" / \" $2 \" (\" $5 \")\"}'");
        return stdout.trim();
    } catch {
        return 'Indisponible';
    }
}

function getUptime() {
    const uptime = os.uptime();
    const jours = Math.floor(uptime / 86400);
    const heures = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    return `${jours}j ${heures}h ${minutes}m`;
}

async function getTemperature() {
    try {
        const { stdout } = await execPromise("cat /sys/class/thermal/thermal_zone0/temp");
        return `${(parseInt(stdout) / 1000).toFixed(1)}°C`;
    } catch {
        return 'Non supporté';
    }
}

async function getNetworkUsage() {
    try {
        const { stdout } = await execPromise("cat /proc/net/dev | awk '/eth0|wlan0/ {print $1, $2, $10}'");
        const parts = stdout.trim().split(/\s+/);
        if (parts.length < 3) return 'Non disponible';

        const rx = (parseInt(parts[1]) / (1024 * 1024)).toFixed(2);
        const tx = (parseInt(parts[2]) / (1024 * 1024)).toFixed(2);
        return `⬇ ${rx}MB | ⬆ ${tx}MB`;
    } catch {
        return 'Non disponible';
    }
}

async function createEmbed() {
    const [cpu, mem, disk, uptime, temp, net] = await Promise.all([
        getCpuInfo(), getMemoryUsage(), getDiskUsage(), getUptime(), getTemperature(), getNetworkUsage()
    ]);

    return new EmbedBuilder()
        .setTitle('📊 Surveillance VPS Debian')
        .setColor(COLOR)
        .addFields(
            { name: '🔄 CPU', value: cpu, inline: true },
            { name: '🧠 RAM', value: mem, inline: true },
            { name: '💾 Disque', value: disk, inline: true },
            { name: '⏳ Uptime', value: uptime, inline: false },
            { name: '🌡 Température', value: temp, inline: true },
            { name: '🌐 Réseau', value: net, inline: true }
        )
        .setFooter({ text: 'Développé par Dounia Kassou • Debian VPS Monitor' })
        .setTimestamp();
}

async function updateEmbed() {
    try {
        const channel = await client.channels.fetch(CHANNEL_ID);
        if (!channel) return console.error('Canal introuvable');

        const messages = await channel.messages.fetch({ limit: 5 });
        const lastBotMessage = messages.find(msg => msg.author.id === client.user.id);

        const embed = await createEmbed();

        if (lastBotMessage) {
            await lastBotMessage.edit({ embeds: [embed] });
        } else {
            await channel.send({ embeds: [embed] });
        }
    } catch (error) {
        console.error('Erreur lors de la mise à jour:', error);
    }
}

client.on('messageCreate', async (message) => {
    if (message.content === '!status') {
        try {
            const embed = await createEmbed();
            await message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Erreur lors de l\'envoi du statut:', error);
            await message.reply('Erreur lors de la récupération des statistiques');
        }
    }
});

client.once('ready', () => {
    console.log(`Bot connecté en tant que ${client.user.tag}!`);
    updateEmbed();
    setInterval(updateEmbed, REFRESH_RATE);
});

client.login(TOKEN);
