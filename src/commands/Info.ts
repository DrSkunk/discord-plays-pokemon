import { MessageEmbed } from 'discord.js';
import {
  CurrentGamemode,
  DemocracyTimeout,
  Prefix,
  Romfile,
  SaveStateInterval,
  Scale,
} from '../Config';
import { getDiscordInstance } from '../DiscordClient';
import { getGameboyInstance } from '../GameboyClient';
import { Command } from '../types/Command';

const command: Command = {
  names: ['info', 'i'],
  description: 'Show the current loaded settings.',
  execute,
  adminOnly: false,
};

function execute(): void {
  const client = getDiscordInstance();
  if (!client) {
    throw new Error('Discord did not initialize');
  }
  const emulatorEmbed = new MessageEmbed();

  emulatorEmbed.addField('Prefix', '`' + Prefix + '`');
  emulatorEmbed.addField(
    'Current mode',
    CurrentGamemode.charAt(0) + CurrentGamemode.slice(1).toLowerCase()
  );
  emulatorEmbed.addField(
    'Time to choose',
    DemocracyTimeout / 1000 + ' seconds'
  );
  emulatorEmbed.addField('Romfile', '`' + Romfile + '`');
  emulatorEmbed.addField('Image scale', 'x' + Scale);
  emulatorEmbed.addField(
    'Autosave interval',
    `Every ${SaveStateInterval} minute(s)`
  );
  emulatorEmbed.setFooter(
    'Made with ❤️ by Sebastiaan Jansen / DrSkunk',
    'https://i.imgur.com/RPKkHMf.png'
  );

  client.sendMessage(emulatorEmbed);

  const stats = getGameboyInstance().getStats();

  const playerEmbed = new MessageEmbed();
  playerEmbed.setAuthor(stats.playerName);
  playerEmbed.addField('Money', '§' + stats.money);
  playerEmbed.addField('Rival', stats.rivalName);
  client.sendMessage(playerEmbed);

  stats.pokemon.forEach((pokemon) => {
    const pokemonEmbed = new MessageEmbed();
    let status = Object.keys(pokemon.status)
      .filter((status) => pokemon.status[status])
      .join(', ');
    if (status === '') {
      status = 'No status';
    }
    pokemonEmbed.setAuthor(pokemon.nickname);
    pokemonEmbed.setTitle(pokemon.name);
    pokemonEmbed.setURL(pokemon.url);
    pokemonEmbed.setThumbnail(pokemon.image);
    pokemonEmbed.setDescription(pokemon.nickname);
    pokemonEmbed.addField('HP', `${pokemon.hp}/${pokemon.maxHP}`, true);

    pokemonEmbed.addField('Type', pokemon.types.join(', '), true);
    pokemonEmbed.addField('Status', status, true);
    pokemonEmbed.addField('Moves', pokemon.moves.join(', '));
    pokemonEmbed.addField('Attack', pokemon.attack, true);
    pokemonEmbed.addField('Defense', pokemon.defense, true);
    pokemonEmbed.addField('Speed', pokemon.speed, true);
    pokemonEmbed.addField('Special', pokemon.special, true);

    client.sendMessage(pokemonEmbed);
  });
}
export = command;
