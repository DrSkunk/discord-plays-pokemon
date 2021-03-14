const fs = require('fs');
const input = fs.readFileSync('./src/mapping/input.txt').toString().split('|-');

input.shift();
input.pop();

const output = input.map((line) => {
  const cleanLine = line.slice(2); //'\n|1\n|{{m|', '');
  const idSplit = cleanLine.split('\n|{{m|');
  const id = parseInt(idSplit[0]);

  const nameSplit = idSplit[1].split('}}\n{{typetable|');
  const name = nameSplit[0];
  const typeSplit = nameSplit[1].split('}}\n{{statustable|');
  const type = typeSplit[0];
  const categorySplit = typeSplit[1].split('}}\n{{contesttable|');
  const category = categorySplit[0];
  const contestSplit = categorySplit[1].split('\n|');

  const url = `https://bulbapedia.bulbagarden.net/wiki/${name}_(move)`;

  return {
    id,
    name,
    type,
    category,
    pp: parseInt(contestSplit[1]),
    power: parseInt(contestSplit[2]),
    accuracy: parseInt(contestSplit[3].slice(0, -1)),
    url,
  };
});

console.log('output');
('Physical}}\n{{contesttable|Tough}}\n|35\n|40\n|100%\n|I\n"');
