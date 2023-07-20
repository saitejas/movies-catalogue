import React from  'react'
import {movies} from '../assets/data/movies';
import { useState } from 'react';
import { Search } from '../components/search';
export default function Home () {

    const [movieData, setMovieData] = useState({
        origMovies: movies,
        filteredMovies: movies
      });
    
      const applyFilters = (filter, query) => {
        if (query === '') {
          setMovieData({ ...movieData, origMovies: movies, filteredMovies: movies });
        } else {
          if (filter === 'get') {
            applyGetFilter(query);
          } else if (filter === 'rank') {
            applyRankFilter(query);
          }
        }
      }
    
      function parseQueryString (queryString) {
        const keyValuePairs = queryString.split(",");
        const queryObject = {};
      
        keyValuePairs.forEach(pair => {
          const [key, value] = pair.split("=");
          queryObject[key.trim()] = value.trim();
        });
      
        return queryObject;
      }
      
      function filterData(data, queryObject) {
        return data.filter(item => {
          return Object.keys(item).some(dataKey => {
            const lowerDataKey = dataKey.toLowerCase();
            const lowerQueryKey = Object.keys(queryObject).find(queryKey =>
              lowerDataKey.includes(queryKey.toLowerCase())
            );
      
            if (lowerQueryKey) {
              const itemValue = String(item[dataKey]).toLowerCase();
              const queryValue = queryObject[lowerQueryKey].toLowerCase();
              return itemValue.includes(queryValue);
            }
      
            return false;
          });
        });
      }
    
      const applyGetFilter = (queryString) => {
        const queryObject = parseQueryString(queryString);
        const filteredData = filterData(movies, queryObject);
        setMovieData({ ...movieData, filteredMovies: filteredData });
      }
    
      function constructQueryArrayFromString(queryString) {
        const queryArray = [];
        const queryPairs = queryString.split(',');
      
        for (const queryPair of queryPairs) {
          const [titlePart, rankStr] = queryPair.split('&rank=');
          const [, title] = titlePart.toLowerCase().split('title=');
          const rank = parseInt(rankStr);
      
          // If the rank is not a valid number, skip this entry.
          if (isNaN(rank)) {
            console.warn(`Invalid rank for title: ${title}. Skipping this entry.`);
            continue;
          }
      
          queryArray.push({ title, rank });
        }
      
        return queryArray;
      }
      
      function sortMoviesByRanks(movieArray, query) {
        const sortedMovies = [...movieArray];
      
        for (const { title, rank } of query) {
          const matchingMovies = sortedMovies.filter(
            movie => movie.Title.toLowerCase().includes(title)
          );
      
          if (matchingMovies.length === 0) {
            // Movie with the given title not found, skip to the next query entry.
            continue;
          }
      
          const matchedMovie = matchingMovies[0];
          const matchedMovieIndex = sortedMovies.indexOf(matchedMovie);
    
          // Calculate the final rank (index) for the matched movie
          let finalRank = Math.min(rank - 1, sortedMovies.length);
      
          // Remove the matched movie from the list
          sortedMovies.splice(matchedMovieIndex, 1);
      
          // Insert the matched movie at the calculated rank
          sortedMovies.splice(finalRank, 0, matchedMovie);
          
        }
      
        return sortedMovies;
      }
    
      const applyRankFilter = (queryString) => {
        const queryArray = constructQueryArrayFromString(queryString);
        const sortedMovies = sortMoviesByRanks(movies, queryArray);
        setMovieData({ ...movieData, filteredMovies: sortedMovies });
      }
    
      const MovieTile = ({movie}) => {
        const {Title, Poster, Year, Genre, imdbRating, Runtime} = movie;
        return(
          <div className="bg-white rounded-lg overflow-hidden shadow-lg transform transition-transform hover:scale-105 m-2 p-4">
              <img
            className="w-full h-48 object-stretch sm:h-64"
            src={Poster}
            alt={Title}
          />
          <div className='mt-5'>
            <h3 className="text-xl text-left font-semibold mb-2">{Title}</h3>
            <div className='text-left'>
              <div className='flex flex-row gap-4 items-center'>
                <p className="text-gray-600">{Year}</p>
                <p className="text-gray-600">{Runtime}</p>
                <div className="inline-flex items-center px-3 py-0.5 bg-yellow-500 rounded-[10px] text-white shadow-md">
                  Imdb {imdbRating}
                </div>
              </div>
              <p className="text-gray-600 mt-3">{Genre}</p>
            </div>
          </div>
          </div>
        )
      }


      return(
        <div className="p-20 px-32">
            <Search onComplete={applyFilters} />
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5'>
                {movieData.filteredMovies.map((movie, index) => (
                    <MovieTile movie={movie} key={index}/>
                ))}
            </div>
        </div>
      )
    
}