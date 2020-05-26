import React from 'react'

export default function Dropdown(props) {

    return (

        <select name={props.id} id={props.id} onChange={() => props.handleSearch(document.getElementById(`${props.id}`).value)}>

            <option hidden>{props.default}</option>

            {props.data.map(item => (

                <option key={item.id} value={item.id}>{item.value}</option>

            ))}

        </select>

    )

}