const axios = require ("axios");
const { Pokemon } = require('../db.js');



const getAllPokemons = async () => {
    
      const databasePokemons = await Pokemon.findAll();
      const apiPokemonsRaw = (await axios.get(`https://pokeapi.co/api/v2/pokemon/`)).data.results
      const urlPorPoke = apiPokemonsRaw.map(poke => poke.url.split("/"))

      const apiPokemons = []
  
      for (let i = 0; i < urlPorPoke.length; i++) {
          apiPokemons.push(await getPokemonById(urlPorPoke[i][6],"api"))
      }
      return [...databasePokemons, ...apiPokemons];
    
  }


const getPokemonById = async (id, source) => {
    const pokemon = source === "api" 
    ? (await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`)).data 
    : await Pokemon.findByPk(id);

    return [
        {
            id: pokemon.id,
            name: pokemon.name,
            img: pokemon.sprites.other.dream_world.front_default,
            hp: pokemon.stats[0].base_stat,
            atack: pokemon.stats[1].base_stat,
            defending: pokemon.stats[2].base_stat,
            type: pokemon.types.map((type) => type.type.name)
            
        }
    ];
};


const searchPokemonByName = async (name) => {
    const databasePokemons = await Pokemon.findAll({ where: { name:name } });
    const apiPokemonsRaw = ( await axios.get (`https://pokeapi.co/api/v2/pokemon/{name}`)) .data
    const apiPokemons = cleanArray (apiPokemonsRaw);
    const filterApi = apiPokemons.filter( (pokemon) => pokemon.name = name );
    return [...filterApi, ...databasePokemons];
}

module.exports = { getPokemonById, getAllPokemons, searchPokemonByName};