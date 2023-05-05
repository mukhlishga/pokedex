import React, { createContext, useContext, useEffect, useReducer, useState } from "react";
import { debounce } from "lodash";

const GlobalContext = createContext();

const LOADING = "LOADING";
const GET_POKEMON = "GET_POKEMON";
const GET_ALL_POKEMON = "GET_ALL_POKEMON";
const GET_ALL_POKEMON_DATA = "GET_ALL_POKEMON_DATA";
const GET_SEARCH = "GET_SEARCH";
const GET_POKEMON_DATABASE = "GET_POKEMON_DATABASE";
const NEXT = "NEXT";

const reducer = (state, action) => {
  switch (action.type) {
    case LOADING:
      return { ...state, loading: true};
    case GET_ALL_POKEMON:
      return { 
        ...state, 
        allPokemon: action.payload.results, 
        next: action.payload.next, 
        loading: false
      };
    case GET_POKEMON:
      return { ...state, pokemon: action.payload, loading: false};
    case GET_POKEMON_DATABASE:
      return { ...state, pokemonDataBase: action.payload, loading: false};
    case GET_SEARCH:
      return { ...state, searchResult: action.payload, loading: false};
    case NEXT:
      return { 
        ...state, 
        allPokemon: [...state.allPokemon, ...action.payload.results], 
        next: action.payload.next,
        loading: false
      };
  }
  return state;
}

export const GlobalProvider = ({ children }) => {

  const initialState = {
    allPokemon: [],
    pokemon: [],
    pokemonDataBase: [],
    searchResult: [],
    next: "",
    loading: false,
  }

  const [state, dispatch] = useReducer(reducer, initialState);
  const [allPokemonData, setAllPokemonData] = useState([])
  const baseUrl = "https://pokeapi.co/api/v2/";

  const allPokemon = async () => {
    dispatch({ type: "LOADING" });
    const res = await fetch(`${baseUrl}pokemon?limit=20`);
    const data = await res.json();
    dispatch({ type: "GET_ALL_POKEMON", payload: data });

    const allPokemonData = [];
    for (const pokemon of data.results) {
      const pokemonRes = await fetch(pokemon.url);
      const pokemonData = await pokemonRes.json();
      allPokemonData.push(pokemonData);
    }
    setAllPokemonData(allPokemonData);
  }

  const getPokemon = async (name) => {
    dispatch({ type: "LOADING" });
    const res = await fetch(`${baseUrl}pokemon/${name}`);
    const data = await res.json();
    dispatch({ type: "GET_POKEMON", payload: data });
  }

  const getPokomenDatabase = async () => {
    dispatch({ type: "LOADING" });
    const res = await fetch(`${baseUrl}pokemon?limit=100000&offset=0`);
    const data = await res.json();
    dispatch({ type: "GET_POKEMON_DATABASE", payload: data.results });
  }

  const next = async () => {
    dispatch({ type: "LOADING" });
    const res = await fetch(state.next);
    const data = await res.json();
    dispatch({ type: "NEXT", payload: data });

    const newAllPokemonData = [];
    for (const pokemon of data.results) {
      const pokemonRes = await fetch(pokemon.url);
      const pokemonData = await pokemonRes.json();
      newAllPokemonData.push(pokemonData);
    }
    setAllPokemonData([...allPokemonData, ...newAllPokemonData]);
  }

  const realTimeSearch = debounce(async (search) => {
    dispatch({ type: "LOADING" });
    const res = state.pokemonDataBase.filter((pokemon) => {
      return pokemon.name.includes(search.toLowerCase());
    });
    dispatch({ type: "GET_SEARCH", payload: res });
  }, 300);

  useEffect(() => {
    allPokemon();
    getPokomenDatabase();
  }, [])

  // console.log(state)

  return (
    <GlobalContext.Provider 
      value={{ 
        ...state,
        allPokemonData,
        getPokemon,
        realTimeSearch,
        next
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}

export const useGlobalContext = () => {
  return useContext(GlobalContext);
}
