# :bar_chart: Discord VPS Stats Monitor

Un bot Discord simple et efficace pour surveiller les statistiques système d'un VPS Debian en temps réel.

![Discord VPS Monitor Preview](https://i.imgur.com/i5vfoW0.png)

## :sparkles: Fonctionnalités

- **Surveillance en temps réel** des ressources système
- **Mise à jour automatique** des statistiques toutes les 6 secondes
- **Affichage détaillé** des informations suivantes:
  - Utilisation CPU
  - Utilisation RAM
  - Espace disque
  - Uptime du système
  - Température CPU (si disponible)
  - Statistiques réseau

## :clipboard: Prérequis

- Node.js v16.9.0 ou supérieur
- Un VPS sous Debian (ou autre distribution Linux)
- Un bot Discord avec les permissions appropriées

## :rocket: Installation

1. Clonez ce dépôt:
   ```bash
   git clone https://github.com/dounvia/StatsVPSMonitor.git
   cd StatsVPSMonitor
   ```

2. Installez les dépendances:
   ```bash
   npm install discord.js
   ```

3. Configurez le bot:
   - Ouvrez `index.js`
   - Remplacez `TON_TOKEN` par le token de votre bot Discord
   - Remplacez `ID_DU_CHANNEL` par l'ID du canal où vous souhaitez afficher les statistiques

4. Lancez le bot:
   ```bash
   node index.js
   ```

## :computer: Utilisation

Une fois le bot en ligne, il affichera automatiquement les statistiques dans le canal configuré et les mettra à jour régulièrement.

### Commandes

- `!status` - Affiche manuellement les statistiques actuelles du VPS

## :gear: Configuration

Vous pouvez modifier les paramètres suivants dans le fichier `index.js`:

- `REFRESH_RATE` - Intervalle de mise à jour en millisecondes (par défaut: 6000ms)
- `COLOR` - Couleur de l'embed Discord (par défaut: bleu)

## :pencil: Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## :bust_in_silhouette: Auteur

**Dounia Kassou**

- GitHub: [@dounvia](https://github.com/dounvia)

## :handshake: Contribution

Les contributions, problèmes et demandes de fonctionnalités sont les bienvenus!
