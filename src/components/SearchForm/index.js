import React, { useState, useEffect } from 'react';

export default function SearchForm(props) {

    const [data, setData] = useState([])

    useEffect(() => {

        setData(props.data)

    }, [props.data])

    function searchItems(e){

        const searchText = e.target.value

        setData(props.data.filter(item => item.value.includes(searchText)))

    }

    return (

        <div className="search-form">

        <input id={props.id} type="text" name="search" id="search" className="search-bar" placeholder="Buscar..." onChange={e => searchItems(e)}/>

        {data.map(item => (

            <button className="search-item" key={item.id} onClick={() => props.handleSearch(item.id)}>
                <p>
                    {item.value}
                </p>
            </button>

        ))}

      </div>

    );
};