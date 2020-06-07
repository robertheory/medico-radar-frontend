import React from 'react';
import axios from 'axios';
import { FiMenu, FiX, FiMapPin } from 'react-icons/fi'
import ReactMapGL, { Marker } from 'react-map-gl'
import mapConfig from './config/map.json'

import SearchForm from './components/SearchForm'

import './global.css'

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

    registroANS: '',
    convenio: [],
    plano: [],
    estabelecimento: [],
    viewport: {
      latitude: 45.4211,
      longitude: -75.6903,
      width: "100%",
      height: "100%",
      zoom: 15,
      mapboxApiAccessToken: mapConfig.mapToken

    },
    mapStyleMode: lightStyle,
    pointers: [],
    results: ''

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
      atendimento: [],
      registroANS: ''

    })

  }

  setPlano = async (id) => {

    const planos = await axios.get(`https://medicoradas-api.herokuapp.com/convenio/${id}/planos`, (response) => {

      return response

    })

    this.setState({
      plano: planos.data
        // .filter(item => item.nomePlano === 'Bradesco Saúde Hospitalar Nacional  2 E CE B')
        .map(item => {

          return {
            id: item.cdPlano,
            value: item.nomePlano
          }

        }),
      registroANS: id

    })

  }

  setEstabelecimento = async (id) => {

    const estabelecimentos = await axios.get(`https://medicoradas-api.herokuapp.com/estabelecimento/${this.state.registroANS}/${id}`, (response) => {

      return response

    })

    const filteredEstabelecimentos = estabelecimentos.data.filter(item => item.latitude !== null && item.longitude !== null)

    this.setState({
      estabelecimento: filteredEstabelecimentos.map(item => {
        return {
          id: item.cnpj,
          value: item.nome,
        }
      }),
      pointers: filteredEstabelecimentos.map(item => {

        return {
          id: item.cnpj,
          latitude: item.latitude === null ? 0 : Number(item.latitude),
          longitude: item.longitude === null ? 0 : Number(item.longitude)
        }

      })

    })

    const validLatitude = filteredEstabelecimentos[0] !== undefined ? filteredEstabelecimentos[0].latitude : this.state.viewport.latitude
    const validLongitude = filteredEstabelecimentos[0] !== undefined ? filteredEstabelecimentos[0].longitude : this.state.viewport.longitude

    this.setCoordinates(Number(validLatitude), Number(validLongitude), 5)

  }

  setCoordinates = async (lat, long, zoom = 15) => {

    let newViewport = this.state.viewport

    newViewport.latitude = lat
    newViewport.longitude = long
    newViewport.zoom = zoom

    this.setState({

      viewport: newViewport

    })

  }

  setCoordinateById = (id) => {

    const { latitude, longitude } = this.state.pointers.filter(item => item.id === id)[0]

    this.setCoordinates(latitude, longitude)

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

    navigator.geolocation.getCurrentPosition(position => {

      const { latitude, longitude } = position.coords

      this.setCoordinates(latitude, longitude)

    })

  }

  render() {

    return (

      this.state.convenio === '' ? '' :

        <div className="App">

          <FiMenu className="menu-icon hidden" onClick={() => menuToggle()}></FiMenu>

          <div className="search-area" id="search-area">

            <FiX className="menu-icon" onClick={() => menuToggle()}></FiX>

            <h1>Busca</h1>
            
            <div className="accordion" id="accordionExample">
              <div className="card">
                <div className="card-header" id="headingOne">
                  <h2 className="mb-0">
                    <button className="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                      Convenios
                    </button>
                  </h2>
                </div>

                <div id="collapseOne" className="collapse show" aria-labelledby="headingOne" data-parent="#accordionExample">
                  <div className="card-body">
                  <SearchForm id="convenioList" data={this.state.convenio} handleSearch={this.setPlano}></SearchForm>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-header" id="headingTwo">
                  <h2 className="mb-0">
                    <button className="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                      Planos
                    </button>
                  </h2>
                </div>
                <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordionExample">
                  <div className="card-body">
                  <SearchForm id="planoList" data={this.state.plano} handleSearch={this.setEstabelecimento}></SearchForm>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-header" id="headingThree">
                  <h2 className="mb-0">
                    <button className="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                      Estabelecimentos
                    </button>
                  </h2>
                </div>
                <div id="collapseThree" className="collapse" aria-labelledby="headingThree" data-parent="#accordionExample">
                  <div className="card-body">
                    <SearchForm id="estabelecimentoList" data={this.state.estabelecimento} handleSearch={this.setCoordinateById}></SearchForm>
                  </div>
                </div>
              </div>
            </div>

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

                  <button className='marker-button' onClick={() => this.setCoordinates(item.latitude, item.longitude)}>

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
