import React, { useEffect } from "react";
import { useGlobalContext } from "../../context/global";
import { useRouter } from "next/router";
import styles from "../../styles/Pokemon.module.css";
import Router from "next/router";

const colors = {
	bug: '#A6B91A',
  dark: '#705746',
	dragon: '#6F35FC',
	electric: '#F7D02C',
	fairy: '#D685AD',
	fighting: '#C22E28',
	fire: '#EE8130',
	flying: '#A98FF3',
  ghost: '#735797',
	grass: '#7AC74C',
	ground: '#E2BF65',
  ice: '#96D9D6',
	normal: '#A8A77A',
	poison: '#A33EA1',
	psychic: '#F95587',
	rock: '#B6A136',
  steel: '#B7B7CE',
	water: '#6390F0',
};

function Pokemon() {
  const router = useRouter();
  const { pokemon } = router.query;
  const { getPokemon, loading, pokemon: pokemonItem } = useGlobalContext();

  useEffect(() => {
    if (pokemon) {
      getPokemon(pokemon);
    }
  }, [])

  const renderTypes = () =>
    pokemonItem?.types?.map((type) => (
      <li key={type.slot} class={styles.PokemonType} style={{ "background-color": colors[type.type.name] }}>
        {type.type.name}
      </li>
    ));
  
  const renderStats = () =>
    pokemonItem?.stats?.map((stat, index) => (
      <div key={index} class={styles.PokemonStats}>
        <div
          class={styles.PokemonStat}
          style={{ width: `${(stat.base_stat * 100) / 160}%` }}
        >
          {stat.stat.name}: {stat.base_stat}
        </div>
      </div>
    ));

  return (
    <>
      { loading 
      ? (
        <div className="loader">
          {}
        </div>
        ) 
      : (
        pokemonItem && <div className={styles.PokemonCard}>
  
          <h2 class={styles.PokemonName}>{`#${('000' + pokemonItem?.id).slice(-3)} ${pokemonItem?.name}`}</h2>

          <div className={styles.PokemonImage}>
            <img class={styles.PokemonImageFront}
              src={
                pokemonItem?.sprites?.front_default
                ? pokemonItem?.sprites?.front_default
                : pokemonItem?.sprites?.other?.home.front_default
              }
              alt={pokemonItem?.name}
            />
            <img class={styles.PokemonImageBack}
              src={
                pokemonItem?.sprites?.back_default
                ? pokemonItem?.sprites?.back_default
                : pokemonItem?.sprites?.other?.home.back_default
              } 
              alt={pokemonItem?.name}
            />
          </div>
  
          <div className={styles.PokemonBody}>
            <ul class={styles.PokemonTypes}>{renderTypes()}</ul>
            <div>{renderStats()}</div>
          </div>

          <div className="back-btn">
            <button
              onClick={() => {
                Router.push(`/`);
              }}
            >
              Back
            </button>
          </div>
  
        </div>)
      
      }
    </>
  )
}

export default Pokemon;
