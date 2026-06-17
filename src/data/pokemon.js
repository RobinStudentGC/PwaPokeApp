export async function fetchPokemon(limit) {
    const result = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`)
    .then(ressponse => ressponse.json())
    .then(data => data.results)
    .catch(error => {
        console.error('Error fetching Pokémon:', error)
        return []
    });

    return result;
}

export async function fetchPokemonDetails(id) {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}/`
    const result = await fetch(url)
    .then(ressponse => ressponse.json())
    .catch(error => {
        console.error('Error fetching Pokémon details:', error)
        return {}
    });

    return result;
}

export default {
    fetchPokemon,
    fetchPokemonDetails
}