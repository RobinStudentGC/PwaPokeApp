const POKEAPI_BASE = "https://pokeapi.co/api/v2";

// Haalt de volledige lijst met Pokémon op (alleen naam en url).
// Dit is de enige lijst-call van de hele app.
export async function fetchPokemon(limit) {
  try {
    const response = await fetch(`${POKEAPI_BASE}/pokemon?limit=${limit}`);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Ophalen van de Pokémon-lijst mislukt:", error);
    return [];
  }
}

// Haalt de details van 1 Pokémon op. Wordt pas aangeroepen bij een klik.
export async function fetchPokemonDetails(id) {
  try {
    const response = await fetch(`${POKEAPI_BASE}/pokemon/${id}/`);
    return await response.json();
  } catch (error) {
    console.error("Ophalen van de Pokémon-details mislukt:", error);
    return {};
  }
}
