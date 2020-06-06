import React from 'react';
import axios from 'axios';
import { FiMenu, FiX, FiMapPin } from 'react-icons/fi'
import ReactMapGL, { Marker } from 'react-map-gl'

import Dropdown from './components/Dropdown'

import './global.css'

// const conveniosJSON = require('./assets/convenio.json')
const planosJSON = require('./assets/planos.json')
const atendimentoJSON = require('./assets/atendimento.json')
const mapEntriesJSON = require('./assets/map_entries.json')

const sateliteStyle = "mapbox://styles/doravantebeto/ckan9j9bz0omy1ipdb6b1oizn"
const darkStyle = "mapbox://styles/doravantebeto/ckan9ggs7124u1iqlreo3hoe5"
const lightStyle = "mapbox://styles/doravantebeto/ckan9i4oj2i4l1ipg0y55068l"

function menuToggle() {

  [...document.getElementsByClassName('menu-icon')].map(item => item.classList.toggle('hidden')

  )

  document.getElementById('search-area').classList.toggle('hidden')

}

class App extends React.Component {

  state = {

    convenio: [],
    plano: [],
    atendimento: [],
    estabelecimento: null,
    viewport: {
      latitude: 45.4211,
      longitude: -75.6903,
      width: "100%",
      height: "100%",
      zoom: 10,
      mapboxApiAccessToken: "pk.eyJ1IjoiZG9yYXZhbnRlYmV0byIsImEiOiJja2FuOHhwbGMwMXc0MnhvNmY2ZHg4eWhmIn0.892Y-QNZxyxAM90blvN5kw"

    },
    mapStyleMode: lightStyle,
    pointers: [],
    results: ''

  }

  test = async () => {

    const settings = {
      "async": true,
      "crossDomain": true,
      "headers": {
        "authorization": "Token token=20a2e2b8372e5a688f7610c5f4c3e355"
      }
    }
    
    await axios.get("https://www.cepaberto.com/api/v3/cep?cep=01001000", settings).then(response => {
    
      console.log(response)
    
    })

  }

  setConvenios = async () => {

    const convenios = await axios.get('https://medicoradas-api.herokuapp.com/convenio', (response) => {

      return response

    })

    // console.log(convenios)

    this.setState({

      convenio: convenios.data.map(item => {

        return {
          id: item.registroAns,
          value: item.nomeFantasia
        }

      }),
      plano: [],
      atendimento: []

    })

  }

  setPlano = async (id) => {

    // const convenios = await axios.get('https://api-portoseg.sensedia.com/quotation/v1/itens', (response) => {

    //   return response

    // })

    this.setState({
      plano: planosJSON.filter(plano => plano.registro_ans === id).map(item => {

        return {
          id: item.id_plano,
          value: item.nome_plano
        }

      })

    })

  }

  setAtendimento = async (id) => {

    // const convenios = await axios.get('https://api-portoseg.sensedia.com/quotation/v1/itens', (response) => {

    //   return response

    // })

    this.setState({
      atendimento: atendimentoJSON.filter(item => item.cd_plano === id).map(item => {

        return {

          id: item.cd_cnpj_estb_saude,
          value: item.nm_estabelecimento_saude,

        }

      })

    })

  }

  setEstabelecimento = async (id) => {

    const cd_plano = atendimentoJSON.filter(item => item.cd_cnpj_estb_saude === id)[0].cd_plano

    const map_entries = mapEntriesJSON.filter(item => item.cd_plano === cd_plano)

    let newViewport = this.state.viewport

    newViewport.latitude = map_entries[0].latitude
    newViewport.longitude = map_entries[0].longitude
    newViewport.zoom = 10

    this.setState({
      pointers: map_entries,
      viewport: newViewport,
      results: map_entries.map(item => ({

        id: item.latitude + ' - ' + item.longitude,
        value: item.latitude + ' - ' + item.longitude

      }))
     })

  }

  setCoordinates = async (id) => {

    const coordinates = id.split(' - ')

    console.log(coordinates)

    this.setState({

      pointers: [
        {
          id: 1,
          latitude: coordinates[0],
          longitude: coordinates[1],
        }
      ]

    })

  }

  setViewport = async (viewport) => {

    this.setState({

      viewport: viewport

    })

  }

  mapToggle(e) {

    const [...buttons] = document.getElementById('map-view-button').children

    buttons.map(item => item.classList.remove('active'))

    e.target.classList.add('active')

    console.log(e.target.innerHTML.toLowerCase() + 'Style')

    this.setState({

      mapStyleMode: e.target.innerHTML === 'Satelite'
        ? sateliteStyle
        : e.target.innerHTML === 'Dark'
          ? darkStyle
          : lightStyle

    })

  }

  componentDidMount() {

    this.setConvenios()

  }

  render() {

    return (

      this.state.convenio === '' ? '' :

        <div className="App">

          <FiMenu className="menu-icon hidden" onClick={() => menuToggle()}></FiMenu>

          <div className="search-area" id="search-area">

            <FiX className="menu-icon" onClick={() => menuToggle()}></FiX>

            <h1>Busca</h1>

            <Dropdown
              default="Convenio"
              id="convenioList"
              data={this.state.convenio}
              handleSearch={this.setPlano}>
            </Dropdown>

            <Dropdown
              default="Plano"
              id="planoList"
              data={this.state.plano}
              handleSearch={this.setAtendimento}>
            </Dropdown>

            <Dropdown
              default="Atendimento"
              id="atendimentoList"
              data={this.state.atendimento}
              handleSearch={this.setEstabelecimento}>
            </Dropdown>

            {/* {!this.state.pointers[0] ? <h4>Finish the search to see the results</h4> :
            
              <Dropdown
                default="Todos os resultados"
                id="resultList"
                data={this.state.results}
                handleSearch={this.setCoordinates}>
              </Dropdown>
            
            } */}

            <button className="btn-sub" onClick={() => this.test()}>Enviar</button>

            <div className="map-view-button" id="map-view-button">

              <button className="btn-left" onClick={e => this.mapToggle(e)}>Satelite</button>
              <button className="btn-center active" onClick={e => this.mapToggle(e)}>Light</button>
              <button className="btn-right" onClick={e => this.mapToggle(e)}>Dark</button>

            </div>

            <p>{this.state.viewport.latitude}</p>
            <p>{this.state.viewport.longitude}</p>

          </div>

          <div className="map">

            <ReactMapGL
              {...this.state.viewport}
              mapStyle={this.state.mapStyleMode}
              onViewportChange={viewport => {
                this.setViewport(viewport)
              }}
            >

              {this.state.pointers.map(item => (

                <Marker latitude={item.latitude} longitude={item.longitude} key={item.id}>

                  <button className='marker-button'>

                    <FiMapPin className="mapPin"></FiMapPin>

                  </button>

                </Marker>

              ))}

            </ReactMapGL>
            
          </div>

        </div>

    )

  }

}

export default App;
