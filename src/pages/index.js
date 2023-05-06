import { useState } from 'react';
import { useGlobalContext } from '../context/global';
import Router from "next/router";

export default function Home() {
  const { allPokemonData, searchResult, getPokemon, loading, realTimeSearch, next } = useGlobalContext();
  const [search, setSearch] = useState("");

  const handleChange = (e) => {
    setSearch(e.target.value);
    realTimeSearch(search);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    realTimeSearch(search);
  };

  const displaySearchResults = () => {
    return searchResult.map((pokemon) => {
      return (
        <div 
          className='search-result-names'
          key={pokemon.id}
          onClick={() => {
            Router.push(`/pokemon/${pokemon.name}`);
          }}
        >
          {pokemon.name}
        </div>
      )
    })
  };

  return (
    <main>

      <form action='' className='search-form' onSubmit={handleSearch}>
        <div className='input-control'>
          <input 
            type='text'
            value={search}
            onChange={handleChange}
            placeholder='Type the pokemon name here...'
          >
          </input>
          <button className='submit-btn' type='submit'>
            Search
          </button>
        </div>
      </form>

      {search && searchResult.length > 0 && <div className='search-results'>
        {displaySearchResults()}
      </div>}

      <div className='all-pokemon'>
        {allPokemonData.map((pokemon) => {
          return (
            <div key={pokemon?.id} className='card' onClick={() => {
              Router.push(`/pokemon/${pokemon.name}`)
            }}>
              <div className='card-image'>
                <img 
                  src={pokemon.sprites.front_default} 
                  alt={pokemon.name} 
                />
              </div>
              <div className='card-body'>
                <span>{`#${('000' + pokemon.id).slice(-3)}`}</span>
                <h3>{pokemon.name}</h3>
              </div>
            </div>
          )
        })}
      </div>

      <div className='load-more'>
        {allPokemonData.length > 0 &&
          <button className='load-mode-btn' onClick={next}>
            {!loading ? "Load more" : "Loading . . ."}
          </button>
        }
      </div>

    </main>
  )
}
