// Source https://bulbapedia.bulbagarden.net/wiki/List_of_locations_by_index_number_(Generation_I)

import { MapLocations } from './MapLocation';

export const Locations: {
  [key: number]: {
    name: string;
    location: { name: string; x: number; y: number };
  };
} = {
  0x00: {
    name: 'Pallet Town',
    location: MapLocations.PalletTown,
  },
  0x01: {
    name: 'Viridian City',
    location: MapLocations.ViridianCity,
  },
  0x02: {
    name: 'Pewter City',
    location: MapLocations.PewterCity,
  },
  0x03: {
    name: 'Cerulean City',
    location: MapLocations.CeruleanCity,
  },
  0x04: {
    name: 'Lavender Town',
    location: MapLocations.LavenderTown,
  },
  0x05: {
    name: 'Vermilion City',
    location: MapLocations.VermilionCity,
  },
  0x06: {
    name: 'Celadon City',
    location: MapLocations.CeladonCity,
  },
  0x07: {
    name: 'Fuchsia City',
    location: MapLocations.FuchsiaCity,
  },
  0x08: {
    name: 'Cinnabar Island',
    location: MapLocations.CinnabarIsland,
  },
  0x09: {
    name: 'Pokémon League',
    location: MapLocations.IndigoPlateau,
  },
  0x0a: {
    name: 'Saffron City',
    location: MapLocations.SaffronCity,
  },
  0x0c: {
    name: 'Route 1',
    location: MapLocations.Route1,
  },
  0x0d: {
    name: 'Route 2',
    location: MapLocations.Route2,
  },
  0x0e: {
    name: 'Route 3',
    location: MapLocations.Route3,
  },
  0x0f: {
    name: 'Route 4',
    location: MapLocations.Route4,
  },
  0x10: {
    name: 'Route 5',
    location: MapLocations.Route5,
  },
  0x11: {
    name: 'Route 6',
    location: MapLocations.Route6,
  },
  0x12: {
    name: 'Route 7',
    location: MapLocations.Route7,
  },
  0x13: {
    name: 'Route 8',
    location: MapLocations.Route8,
  },
  0x14: {
    name: 'Route 9',
    location: MapLocations.Route9,
  },
  0x15: {
    name: 'Route 10',
    location: MapLocations.Route10,
  },
  0x16: {
    name: 'Route 11',
    location: MapLocations.Route11,
  },
  0x17: {
    name: 'Route 12',
    location: MapLocations.Route12,
  },
  0x18: {
    name: 'Route 13',
    location: MapLocations.Route13,
  },
  0x19: {
    name: 'Route 14',
    location: MapLocations.Route14,
  },
  0x1a: {
    name: 'Route 15',
    location: MapLocations.Route15,
  },
  0x1b: {
    name: 'Route 16',
    location: MapLocations.Route16,
  },
  0x1c: {
    name: 'Route 17',
    location: MapLocations.Route17,
  },
  0x1d: {
    name: 'Route 18',
    location: MapLocations.Route18,
  },
  0x1e: {
    name: 'Sea Route 19',
    location: MapLocations.SeaRoute19,
  },
  0x1f: {
    name: 'Sea Route 20',
    location: MapLocations.SeaRoute20,
  },
  0x20: {
    name: 'Sea Route 21',
    location: MapLocations.SeaRoute21,
  },
  0x21: {
    name: 'Route 22',
    location: MapLocations.Route22,
  },
  0x22: {
    name: 'Route 23',
    location: MapLocations.Route23,
  },
  0x23: {
    name: 'Route 24',
    location: MapLocations.Route24,
  },
  0x24: {
    name: 'Route 25',
    location: MapLocations.Route25,
  },
  0x25: {
    name: "Red's house (first floor)",
    location: MapLocations.PalletTown,
  },
  0x26: {
    name: "Red's house (second floor)",
    location: MapLocations.PalletTown,
  },
  0x27: {
    name: "Blue's house",
    location: MapLocations.PalletTown,
  },
  0x28: {
    name: "Professor Oak's Lab",
    location: MapLocations.PalletTown,
  },
  0x29: {
    name: 'Pokémon Center (Viridian City)',
    location: MapLocations.ViridianCity,
  },
  0x2a: {
    name: 'Poké Mart (Viridian City)',
    location: MapLocations.ViridianCity,
  },
  0x2b: {
    name: 'School (Viridian City)',
    location: MapLocations.ViridianCity,
  },
  0x2c: {
    name: 'House 1 (Viridian City)',
    location: MapLocations.ViridianCity,
  },
  0x2d: {
    name: 'Pokémon Gym (Viridian City)',
    location: MapLocations.ViridianCity,
  },
  0x2e: {
    name: "Diglett's Cave (Route 2 entrance)",
    location: MapLocations.Route2,
  },
  0x2f: {
    name: 'Gate (Viridian City/Pewter City) (Route 2)',
    location: MapLocations.Route2,
  },
  0x30: {
    name: "Oak's Aide House 1 (Route 2)",
    location: MapLocations.Route2,
  },
  0x31: {
    name: 'Gate (Route 2)',
    location: MapLocations.Route2,
  },
  0x32: {
    name: 'Gate (Route 2/Viridian Forest) (Route 2)',
    location: MapLocations.Route2,
  },
  0x33: {
    name: 'Viridian Forest',
    location: MapLocations.ViridianForest,
  },
  0x34: {
    name: 'Pewter Museum (floor 1)',
    location: MapLocations.PewterCity,
  },
  0x35: {
    name: 'Pewter Museum (floor 2)',
    location: MapLocations.PewterCity,
  },
  0x36: {
    name: 'Pokémon Gym (Pewter City)',
    location: MapLocations.PewterCity,
  },
  0x37: {
    name: 'House with disobedient Nidoran♂ (Pewter City)',
    location: MapLocations.PewterCity,
  },
  0x38: {
    name: 'Poké Mart (Pewter City)',
    location: MapLocations.PewterCity,
  },
  0x39: {
    name: 'House with two Trainers (Pewter City)',
    location: MapLocations.PewterCity,
  },
  0x3a: {
    name: 'Pokémon Center (Pewter City)',
    location: MapLocations.PewterCity,
  },
  0x3b: {
    name: 'Mt. Moon (Route 3 entrance)',
    location: MapLocations.Route3,
  },
  0x3c: {
    name: 'Mt. Moon',
    location: MapLocations.MtMoon,
  },
  0x3d: {
    name: 'Mt. Moon',
    location: MapLocations.MtMoon,
  },
  0x3e: {
    name: 'Invaded house (Cerulean City)',
    location: MapLocations.CeruleanCity,
  },
  0x3f: {
    name:
      'Poliwhirl for Jynx trade house (Red/Blue)\nBulbasaur adoption house (Pokémon Yellow)',
    location: MapLocations.CeruleanCity,
  },
  0x40: {
    name: 'Pokémon Center (Cerulean City)',
    location: MapLocations.CeruleanCity,
  },
  0x41: {
    name: 'Pokémon Gym (Cerulean City)',
    location: MapLocations.CeruleanCity,
  },
  0x42: {
    name: 'Bike Shop (Cerulean City)',
    location: MapLocations.CeruleanCity,
  },
  0x43: {
    name: 'Poké Mart (Cerulean City)',
    location: MapLocations.CeruleanCity,
  },
  0x44: {
    name: 'Pokémon Center (Route 4)',
    location: MapLocations.Route4,
  },
  0x45: {
    name: 'Invaded house - alternative music (Cerulean City)',
    location: MapLocations.CeruleanCity,
  },
  0x46: {
    name: 'Saffron City Gate (Route 5)',
    location: MapLocations.Route5,
  },
  0x47: {
    name: 'Entrance to Underground Path (Kanto Routes 5-6) (Route 5)',
    location: MapLocations.Route5,
  },
  0x48: {
    name: 'Daycare Center (Route 5)',
    location: MapLocations.Route5,
  },
  0x49: {
    name: 'Saffron City Gate (Route 6)',
    location: MapLocations.Route6,
  },
  0x4a: {
    name: 'Entrance to Underground Path (Route 6)',
    location: MapLocations.Route6,
  },
  0x4b: {
    name: 'Entrance to Underground Path 2 (Route 6)',
    location: MapLocations.Route6,
  },
  0x4c: {
    name: 'Saffron City Gate (Route 7)',
    location: MapLocations.Route7,
  },
  0x4d: {
    name: 'Entrance to Underground Path (Route 7)',
    location: MapLocations.Route7,
  },
  0x4e: {
    name: 'Entrance to Underground Path 2 (Route 7)',
    location: MapLocations.Route7,
  },
  0x4f: {
    name: 'Saffron City Gate (Route 8)',
    location: MapLocations.Route8,
  },
  0x50: {
    name: 'Entrance to Underground Path (Route 8)',
    location: MapLocations.Route8,
  },
  0x51: {
    name: 'Pokémon Center (Rock Tunnel)',
    location: MapLocations.RockTunnel,
  },
  0x52: {
    name: 'Rock Tunnel',
    location: MapLocations.RockTunnel,
  },
  0x53: {
    name: 'Power Plant',
    location: MapLocations.PowerPlant,
  },
  0x54: {
    name: 'Gate 1F (Route 11-Route 12)',
    location: MapLocations.Route11,
  },
  0x55: {
    name: "Diglett's Cave (Vermilion City entrance)",
    location: MapLocations.VermilionCity,
  },
  0x56: {
    name: 'Gate 2F (Route 11-Route 12)',
    location: MapLocations.Route11,
  },
  0x57: {
    name: 'Gate (Route 12-Route 13)',
    location: MapLocations.Route12,
  },
  0x58: {
    name: 'Sea Cottage',
    location: MapLocations.SeaCottage,
  },
  0x59: {
    name: 'Pokémon Center (Vermilion City)',
    location: MapLocations.VermilionCity,
  },
  0x5a: {
    name: 'Pokémon Fan Club (Vermilion City)',
    location: MapLocations.VermilionCity,
  },
  0x5b: {
    name: 'Poké Mart (Vermilion City)',
    location: MapLocations.VermilionCity,
  },
  0x5c: {
    name: 'Pokémon Gym (Vermilion City)',
    location: MapLocations.VermilionCity,
  },
  0x5d: {
    name: 'House with Pidgey (Vermilion City)',
    location: MapLocations.VermilionCity,
  },
  0x5e: {
    name: 'Vermilion Harbor (Vermilion City)',
    location: MapLocations.VermilionCity,
  },
  0x5f: {
    name: 'S.S. Anne 1F',
    location: MapLocations.SSAnne,
  },
  0x60: {
    name: 'S.S. Anne 2F',
    location: MapLocations.SSAnne,
  },
  0x61: {
    name: 'S.S. Anne 3F',
    location: MapLocations.SSAnne,
  },
  0x62: {
    name: 'S.S. Anne B1F',
    location: MapLocations.SSAnne,
  },
  0x63: {
    name: 'S.S. Anne (Deck)',
    location: MapLocations.SSAnne,
  },
  0x64: {
    name: 'S.S. Anne (Kitchen)',
    location: MapLocations.SSAnne,
  },
  0x65: {
    name: "S.S. Anne (Captain's room)",
    location: MapLocations.SSAnne,
  },
  0x66: {
    name: "S.S. Anne 1F (Gentleman's room)",
    location: MapLocations.SSAnne,
  },
  0x67: {
    name: "S.S. Anne 2F (Gentleman's room)",
    location: MapLocations.SSAnne,
  },
  0x68: {
    name: "S.S. Anne B1F (Sailor/Fisherman's room)",
    location: MapLocations.SSAnne,
  },
  0x6c: {
    name: 'Victory Road (Route 23 entrance)',
    location: MapLocations.VictoryRoad,
  },
  0x71: {
    name: "Lance's Elite Four room",
    location: MapLocations.IndigoPlateau,
  },
  0x76: {
    name: 'Hall of Fame',
    location: MapLocations.IndigoPlateau,
  },
  0x77: {
    name: 'Underground Path (Route 5-Route 6)',
    location: MapLocations.Route5,
  },
  0x78: {
    name: "Blue's room",
    location: MapLocations.PalletTown,
  },
  0x79: {
    name: 'Underground Path (Route 7-Route 8)',
    location: MapLocations.Route7,
  },
  0x7a: {
    name: 'Celadon Department Store 1F',
    location: MapLocations.CeladonCity,
  },
  0x7b: {
    name: 'Celadon Department Store 2F',
    location: MapLocations.CeladonCity,
  },
  0x7c: {
    name: 'Celadon Department Store 3F',
    location: MapLocations.CeladonCity,
  },
  0x7d: {
    name: 'Celadon Department Store 4F',
    location: MapLocations.CeladonCity,
  },
  0x7e: {
    name: 'Celadon Department Store Rooftop Square',
    location: MapLocations.CeladonCity,
  },
  0x7f: {
    name: 'Celadon Department Store Lift',
    location: MapLocations.CeladonCity,
  },
  0x80: {
    name: 'Celadon Mansion 1F',
    location: MapLocations.CeladonCity,
  },
  0x81: {
    name: 'Celadon Mansion 2F',
    location: MapLocations.CeladonCity,
  },
  0x82: {
    name: 'Celadon Mansion 3F',
    location: MapLocations.CeladonCity,
  },
  0x83: {
    name: 'Celadon Mansion 4F',
    location: MapLocations.CeladonCity,
  },
  0x84: {
    name: 'Celadon Mansion 4F (Eevee building)',
    location: MapLocations.CeladonCity,
  },
  0x85: {
    name: 'Pokémon Center (Celadon City)',
    location: MapLocations.CeladonCity,
  },
  0x86: {
    name: 'Pokémon Gym (Celadon City)',
    location: MapLocations.CeladonCity,
  },
  0x87: {
    name: 'Rocket Game Corner (Celadon City)',
    location: MapLocations.CeladonCity,
  },
  0x88: {
    name: 'Celadon Department Store 5F',
    location: MapLocations.CeladonCity,
  },
  0x89: {
    name: 'Prize corner (Celadon City)',
    location: MapLocations.CeladonCity,
  },
  0x8a: {
    name: 'Restaurant (Celadon City)',
    location: MapLocations.CeladonCity,
  },
  0x8b: {
    name: 'House with Team Rocket members (Celadon City)',
    location: MapLocations.CeladonCity,
  },
  0x8c: {
    name: 'Hotel (Celadon City)',
    location: MapLocations.CeladonCity,
  },
  0x8d: {
    name: 'Pokémon Center (Lavender Town)',
    location: MapLocations.LavenderTown,
  },
  0x8e: {
    name: 'Pokémon Tower F1',
    location: MapLocations.PokemonTower,
  },
  0x8f: {
    name: 'Pokémon Tower F2',
    location: MapLocations.PokemonTower,
  },
  0x90: {
    name: 'Pokémon Tower F3',
    location: MapLocations.PokemonTower,
  },
  0x91: {
    name: 'Pokémon Tower F4',
    location: MapLocations.PokemonTower,
  },
  0x92: {
    name: 'Pokémon Tower F5',
    location: MapLocations.PokemonTower,
  },
  0x93: {
    name: 'Pokémon Tower F6',
    location: MapLocations.PokemonTower,
  },
  0x94: {
    name: 'Pokémon Tower F7',
    location: MapLocations.PokemonTower,
  },
  0x95: {
    name: "Mr. Fuji's house (Lavender Town)",
    location: MapLocations.LavenderTown,
  },
  0x96: {
    name: 'Poké Mart (Lavender Town)',
    location: MapLocations.LavenderTown,
  },
  0x97: {
    name: "House with NPC discussing Cubone's mother",
    location: MapLocations.LavenderTown,
  },
  0x98: {
    name: 'Poké Mart (Fuchsia City)',
    location: MapLocations.FuchsiaCity,
  },
  0x99: {
    name: 'House with NPCs discussing Bill (Fuchsia City)',
    location: MapLocations.FuchsiaCity,
  },
  0x9a: {
    name: 'Pokémon Center (Fuchsia City)',
    location: MapLocations.FuchsiaCity,
  },
  0x9b: {
    name: "Warden's house (Fuchsia City)",
    location: MapLocations.FuchsiaCity,
  },
  0x9c: {
    name: 'Safari Zone gate (Fuchsia City)',
    location: MapLocations.FuchsiaCity,
  },
  0x9d: {
    name: 'Pokémon Gym (Fuchsia City)',
    location: MapLocations.FuchsiaCity,
  },
  0x9e: {
    name: 'House with NPCs discussing Baoba (Fuchsia City)',
    location: MapLocations.FuchsiaCity,
  },
  0x9f: {
    name: 'Seafoam Islands',
    location: MapLocations.SeafoamIslands,
  },
  0xa0: {
    name: 'Seafoam Islands',
    location: MapLocations.SeafoamIslands,
  },
  0xa1: {
    name: 'Seafoam Islands',
    location: MapLocations.SeafoamIslands,
  },
  0xa2: {
    name: 'Seafoam Islands',
    location: MapLocations.SeafoamIslands,
  },
  0xa3: {
    name: 'Vermilion City Fishing Brother',
    location: MapLocations.VermilionCity,
  },
  0xa4: {
    name: 'Fuchsia City Fishing Brother',
    location: MapLocations.FuchsiaCity,
  },
  0xa5: {
    name: 'Pokémon Mansion (1F)',
    location: MapLocations.CinnabarIsland,
  },
  0xa6: {
    name: 'Pokémon Gym (Cinnabar Island)',
    location: MapLocations.CinnabarIsland,
  },
  0xa7: {
    name: 'Pokémon Lab (Cinnabar Island)',
    location: MapLocations.CinnabarIsland,
  },
  0xa8: {
    name: 'Pokémon Lab - Trade room (Cinnabar Island)',
    location: MapLocations.CinnabarIsland,
  },
  0xa9: {
    name: 'Pokémon Lab - Room with scientists (Cinnabar Island)',
    location: MapLocations.CinnabarIsland,
  },
  0xaa: {
    name: 'Pokémon Lab - Fossil resurrection room (Cinnabar Island)',
    location: MapLocations.CinnabarIsland,
  },
  0xab: {
    name: 'Pokémon Center (Cinnabar Island)',
    location: MapLocations.CinnabarIsland,
  },
  0xac: {
    name: 'Poké Mart (Cinnabar Island)',
    location: MapLocations.CinnabarIsland,
  },
  0xad: {
    name: 'Poké Mart - alternative music (Cinnabar Island)',
    location: MapLocations.CinnabarIsland,
  },
  0xae: {
    name: 'Pokémon Center (Indigo Plateau)',
    location: MapLocations.IndigoPlateau,
  },
  0xaf: {
    name: "Copycat's house 1F (Saffron City)",
    location: MapLocations.SaffronCity,
  },
  0xb0: {
    name: "Copycat's house 2F (Saffron City)",
    location: MapLocations.SaffronCity,
  },
  0xb1: {
    name: 'Fighting Dojo (Saffron City)',
    location: MapLocations.SaffronCity,
  },
  0xb2: {
    name: 'Pokémon Gym (Saffron City)',
    location: MapLocations.SaffronCity,
  },
  0xb3: {
    name: 'House with Pidgey (Saffron City)',
    location: MapLocations.SaffronCity,
  },
  0xb4: {
    name: 'Poké Mart (Saffron City)',
    location: MapLocations.SaffronCity,
  },
  0xb5: {
    name: 'Silph Co. 1F',
    location: MapLocations.SaffronCity,
  },
  0xb6: {
    name: 'Pokémon Center (Saffron City)',
    location: MapLocations.SaffronCity,
  },
  0xb7: {
    name: "Mr. Psychic's house (Saffron City)",
    location: MapLocations.SaffronCity,
  },
  0xb8: {
    name: 'Gate 1F (Route 15)',
    location: MapLocations.Route15,
  },
  0xb9: {
    name: 'Gate 2F (Route 15)',
    location: MapLocations.Route15,
  },
  0xba: {
    name: 'Gate 1F (Cycling Road (Route 16)',
    location: MapLocations.Route16,
  },
  0xbb: {
    name: 'Gate 2F (Cycling Road (Route 16)',
    location: MapLocations.Route16,
  },
  0xbc: {
    name: 'Secret house (Cycling Road) (Route 16)',
    location: MapLocations.Route16,
  },
  0xbd: {
    name: 'Route 12 Fishing Brother',
    location: MapLocations.Route12,
  },
  0xbe: {
    name: 'Gate 1F (Route 18)',
    location: MapLocations.Route18,
  },
  0xbf: {
    name: 'Gate 2F (Route 18)',
    location: MapLocations.Route18,
  },
  0xc0: {
    name: 'Seafoam Islands',
    location: MapLocations.SeafoamIslands,
  },
  0xc1: {
    name: 'Badges check gate (Route 22)',
    location: MapLocations.Route22,
  },
  0xc2: {
    name: 'Victory Road',
    location: MapLocations.VictoryRoad,
  },
  0xc3: {
    name: 'Gate 2F (Route 12)',
    location: MapLocations.Route12,
  },
  0xc4: {
    name: 'House with NPC and HM moves advice Vermilion City',
    location: MapLocations.VermilionCity,
  },
  0xc5: {
    name: "Diglett's Cave",
    location: MapLocations.DiglettsCave,
  },
  0xc6: {
    name: 'Victory Road',
    location: MapLocations.VictoryRoad,
  },
  0xc7: {
    name: 'Team Rocket Hideout (B1F)',
    location: MapLocations.CeladonCity,
  },
  0xc8: {
    name: 'Team Rocket Hideout (B2F)',
    location: MapLocations.CeladonCity,
  },
  0xc9: {
    name: 'Team Rocket Hideout (B3F)',
    location: MapLocations.CeladonCity,
  },
  0xca: {
    name: 'Team Rocket Hideout (B4F)',
    location: MapLocations.CeladonCity,
  },
  0xcb: {
    name: 'Team Rocket Hideout (Lift)',
    location: MapLocations.CeladonCity,
  },
  0xcf: {
    name: 'Silph Co. (2F)',
    location: MapLocations.SaffronCity,
  },
  0xd0: {
    name: 'Silph Co. (3F)',
    location: MapLocations.SaffronCity,
  },
  0xd1: {
    name: 'Silph Co. (4F)',
    location: MapLocations.SaffronCity,
  },
  0xd2: {
    name: 'Silph Co. (5F)',
    location: MapLocations.SaffronCity,
  },
  0xd3: {
    name: 'Silph Co. (6F)',
    location: MapLocations.SaffronCity,
  },
  0xd4: {
    name: 'Silph Co. (7F)',
    location: MapLocations.SaffronCity,
  },
  0xd5: {
    name: 'Silph Co. (8F)',
    location: MapLocations.SaffronCity,
  },
  0xd6: {
    name: 'Pokémon Mansion (2F)',
    location: MapLocations.CinnabarIsland,
  },
  0xd7: {
    name: 'Pokémon Mansion (3F)',
    location: MapLocations.CinnabarIsland,
  },
  0xd8: {
    name: 'Pokémon Mansion (B1F)',
    location: MapLocations.CinnabarIsland,
  },
  0xd9: {
    name: 'Safari Zone (Area 1)',
    location: MapLocations.SafariZone,
  },
  0xda: {
    name: 'Safari Zone (Area 2)',
    location: MapLocations.SafariZone,
  },
  0xdb: {
    name: 'Safari Zone (Area 3)',
    location: MapLocations.SafariZone,
  },
  0xdc: {
    name: 'Safari Zone (Entrance)',
    location: MapLocations.SafariZone,
  },
  0xdd: {
    name: 'Safari Zone (Rest house 1)',
    location: MapLocations.SafariZone,
  },
  0xde: {
    name: 'Safari Zone (Prize house)',
    location: MapLocations.SafariZone,
  },
  0xdf: {
    name: 'Safari Zone (Rest house 2)',
    location: MapLocations.SafariZone,
  },
  0xe0: {
    name: 'Safari Zone (Rest house 3)',
    location: MapLocations.SafariZone,
  },
  0xe1: {
    name: 'Safari Zone (Rest house 4)',
    location: MapLocations.SafariZone,
  },
  0xe2: {
    name: 'Cerulean Cave',
    location: MapLocations.CeruleanCity,
  },
  0xe3: {
    name: 'Cerulean Cave 1F',
    location: MapLocations.CeruleanCity,
  },
  0xe4: {
    name: 'Cerulean Cave B1F',
    location: MapLocations.CeruleanCity,
  },
  0xe5: {
    name: "Name Rater's house (Lavender Town)",
    location: MapLocations.LavenderTown,
  },
  0xe6: {
    name: 'Cerulean City (Gym Badge man)',
    location: MapLocations.CeruleanCity,
  },
  0xe8: {
    name: 'Rock Tunnel',
    location: MapLocations.RockTunnel,
  },
  0xe9: {
    name: 'Silph Co. 9F',
    location: MapLocations.SaffronCity,
  },
  0xea: {
    name: 'Silph Co. 10F',
    location: MapLocations.SaffronCity,
  },
  0xeb: {
    name: 'Silph Co. 11F',
    location: MapLocations.SaffronCity,
  },
  0xec: {
    name: 'Silph Co. Lift',
    location: MapLocations.SaffronCity,
  },
  // 0xef: {
  //   name: 'Cable Club Trade Center',
  //   location: 'LOCATIONID',
  // },
  // 0xf0: {
  //   name: 'Cable Club Colosseum',
  //   location: 'LOCATIONID',
  // },
  0xf5: {
    name: "Lorelei's room",
    location: MapLocations.IndigoPlateau,
  },
  0xf6: {
    name: "Bruno's room",
    location: MapLocations.IndigoPlateau,
  },
  0xf7: {
    name: "Agatha's room",
    location: MapLocations.IndigoPlateau,
  },
  // 0xf8: {
  //   name: 'Summer Beach House (Pokémon Yellow)',
  //   location: 'LOCATIONID',
  // },
};
