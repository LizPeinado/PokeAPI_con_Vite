import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [pokemonName, setPokemonName] = useState('pikachu'); // Pokémon inicial
  const [search, setSearch] = useState('');
  const [pokemonData, setPokemonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para obtener los datos de la PokéAPI
  const fetchPokemon = async (nameOrId) => {
    if (!nameOrId) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nameOrId.toLowerCase().trim()}`);

      if (!response.ok) {
        throw new Error('¡Pokémon no encontrado!');
      }
      const data = await response.json();
      setPokemonData(data);
    } catch (err) {
      setError(err.message);
      setPokemonData(null);
    } finally {
      setLoading(false);
    }
  };

  // Se ejecuta una vez al cargar la app con el Pokémon inicial
  useEffect(() => {
    fetchPokemon(pokemonName);
  }, [pokemonName]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim() !== '') {
      setPokemonName(search);
    }
  };

  return (
    <div className="app-container">
      <h1>Poké-Buscador</h1>
      
      {/* Formulario de Búsqueda */}
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Nombre o ID del Pokémon..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">Buscar</button>
      </form>

      {/* Estado de carga */}
      {loading && <p className="message">Buscando en la Pokédex...</p>}

      {/* Mensaje de error */}
      {error && <p className="message error-message">{error}</p>}

      {/* Tarjeta de Información del Pokémon */}
      {pokemonData && !loading && (
        <div className="pokemon-card">
          <span className="pokemon-id">#{pokemonData.id}</span>
          
          {/* Imagen */}
          <img 
            src={pokemonData.sprites.other['official-artwork'].front_default || pokemonData.sprites.front_default} 
            alt={pokemonData.name} 
            className="pokemon-image"
          />
          
          <h2 className="pokemon-title">{pokemonData.name}</h2>
          
          {/* Tipos del Pokémon */}
          <div className="types-container">
            {pokemonData.types.map((t) => (
              <span key={t.type.name} className={`type-badge ${t.type.name}`}>
                {t.type.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

