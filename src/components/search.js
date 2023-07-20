import React from "react";
import { useState } from 'react';

export function Search ({ onComplete }) {

    const [filter, setFilter] = useState('get');
    const [query, setQuery] = useState('');

    const onKeyUp = (event) => {
        if (event.key === 'Enter') {
            onComplete(filter, query);
        }
      }

    return (
        <div>
            <div className="flex flex-row flex-wrap items-center m-4">
                <select
                className="bg-gray-100 rounded-md py-2 px-4 mr-2 mb-2 sm:mb-0"
                value={filter}
                onChange={(val)=> {setFilter(val.target.value)}}
                >
                <option value="get">GET</option>
                <option value="rank">RANK</option>
                </select>
                <input
                type="text"
                className="bg-gray-100 flex-1 rounded-md py-2 px-4"
                placeholder="Enter your query here"
                value={query}
                onChange={(event)=> {setQuery(event.target.value)}}
                onKeyDown={onKeyUp}
                />
            </div>
        </div>
    )
}