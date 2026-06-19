const API_URL = "https://pokeapi.co/api/v2";

export async function fetchPokemon(limit) {
  try {
    const response = await fetch(`${API_URL}/pokemon?limit=${limit}`);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Ophalen van Pokemon-lijst mislukt:", error);
    return [];
  }
}

export async function fetchPokemonDetails(id) {
  try {
    const response = await fetch(`${API_URL}/pokemon/${id}/`);
    return await response.json();
  } catch (error) {
    console.error("Ophalen van Pokemon-details mislukt:", error);
    return {};
  }
}
