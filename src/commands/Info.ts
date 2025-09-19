import {
  EmbedBuilder,
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} from 'discord.js';
import { getDiscordInstance } from '../DiscordClient';
import { getGameboyInstance } from '../GameboyClient';
import { Command } from '../types/Command';

const command: Command = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Show info about the player and the pokemon in the party')
    .addIntegerOption((option) =>
      option
        .setName('pokemon')
        .setDescription('Pokemon number (1-6) for detailed info')
        .setRequired(false)
        .setMinValue(1)
        .setMaxValue(6)
    ),
  execute,
};

async function execute(
  interaction: ChatInputCommandInteraction
): Promise<void> {
  const client = getDiscordInstance();
  if (!client) {
    throw new Error('Discord did not initialize');
  }
  const stats = getGameboyInstance().getStats();
  const pokemonNumber = interaction.options.getInteger('pokemon');

  if (pokemonNumber === null) {
    const shortEmbed = new EmbedBuilder();
    shortEmbed.setAuthor({ name: stats.playerName });
    shortEmbed.addFields(
      { name: 'Money', value: '§' + stats.money, inline: true },
      { name: 'Rival', value: stats.rivalName, inline: true },
      { name: 'Time', value: stats.time, inline: true },
      {
        name: 'Location',
        value: `${stats.location.name}\nRun \`/map\` for full map`,
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
      value: `Run \`/info pokemon:1\` to view info about the first pokémon, \`/info pokemon:2\` for the second and so on.`,
    });
    const badges = stats.gyms
      .map(({ name, done }) => `${name}: ${done ? 'Done' : 'Not done'}`)
      .join(', ');
    shortEmbed.addFields({ name: 'Badges', value: badges });

    await interaction.reply({ embeds: [shortEmbed] });
  } else {
    try {
      const pokemonIndex = pokemonNumber - 1;
      if (pokemonIndex >= stats.pokemon.length) {
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

      await interaction.reply({ embeds: [pokemonEmbed] });
    } catch (error) {
      await interaction.reply({
        content: `Invalid pokémon index given. Run \`/info pokemon:1\` to view info about the first pokémon, \`/info pokemon:2\` for the second and so on.`,
        ephemeral: true,
      });
    }
  }
}
export = command;
