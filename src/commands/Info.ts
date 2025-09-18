import { Message, EmbedBuilder } from 'discord.js';
import { Prefix } from '../Config';
import { getDiscordInstance } from '../DiscordClient';
import { getGameboyInstance } from '../GameboyClient';
import { Command } from '../types/Command';

const command: Command = {
  names: ['info', 'i'],
  description: 'Show info about the player and the pokemon in the party.',
  execute,
  adminOnly: false,
};

function execute(_msg: Message, args: string[]): void {
  const client = getDiscordInstance();
  if (!client) {
    throw new Error('Discord did not initialize');
  }
  const stats = getGameboyInstance().getStats();

  if (args.length === 0) {
    const shortEmbed = new EmbedBuilder();
    shortEmbed.setAuthor({ name: stats.playerName });
    shortEmbed.addFields(
      { name: 'Money', value: '§' + stats.money, inline: true },
      { name: 'Rival', value: stats.rivalName, inline: true },
      { name: 'Time', value: stats.time, inline: true },
      {
        name: 'Location',
        value: `${stats.location.name}\nRun \`${Prefix}map\` for full map`,
        inline: true,
      }
    );

    stats.pokemon.forEach(({ nickname, name, level, hp, maxHP }, i) => {
      shortEmbed.addFields({
        name: `${i + 1} ${nickname}`,
        value: `${name} lvl ${level}\n${hp}/${maxHP} HP`,
        inline: true,
      });
    });
    shortEmbed.addFields({
      name: 'Detailed info',
      value: `Run \`${Prefix}info 1\` to view info about the first pokémon, \`${Prefix}info 2\` for the second and so on.`,
    });
    const badges = stats.gyms
      .map(({ name, done }) => `${name}: ${done ? 'Done' : 'Not done'}`)
      .join(', ');
    shortEmbed.addFields({ name: 'Badges', value: badges });

    client.sendMessage(shortEmbed);
  } else {
    try {
      const pokemonIndex = parseInt(args[0]) - 1;
      if (pokemonIndex > stats.pokemon.length) {
        throw new Error('Invalid pokemon index');
      }

      const pokemon = stats.pokemon[pokemonIndex];
      const pokemonEmbed = new EmbedBuilder();
      let status = Object.keys(pokemon.status)
        .filter((status) => pokemon.status[status])
        .join(', ');
      if (status === '') {
        status = 'No status';
      }
      pokemonEmbed.setAuthor({ name: pokemon.nickname });
      pokemonEmbed.setTitle(`${pokemon.name} lvl ${pokemon.level}`);
      pokemonEmbed.setURL(pokemon.url);
      pokemonEmbed.setThumbnail(pokemon.image);
      pokemonEmbed.addFields(
        { name: 'HP', value: `${pokemon.hp}/${pokemon.maxHP}`, inline: true },
        { name: 'Type', value: pokemon.types.join(', '), inline: true },
        { name: 'Status', value: status, inline: true },
        {
          name: 'Moves',
          value: pokemon.moves
            .map(({ name, pp, maxPp }) => `${name} ${pp}/${maxPp} PP`)
            .join(', '),
        },
        { name: 'Attack', value: pokemon.attack.toString(), inline: true },
        { name: 'Defense', value: pokemon.defense.toString(), inline: true },
        { name: 'Speed', value: pokemon.speed.toString(), inline: true },
        { name: 'Special', value: pokemon.special.toString(), inline: true }
      );

      client.sendMessage(pokemonEmbed);
    } catch (error) {
      client.sendMessage(
        `Invalid pokémon index given. Run \`${Prefix}info 1\` to view info about the first pokémon, \`${Prefix}info 2\` for the second and so on.`
      );
    }
  }
}
export = command;
