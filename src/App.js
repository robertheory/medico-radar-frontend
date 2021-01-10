import React from 'react';
import axios from 'axios';
import { FiMenu, FiX, FiRefreshCcw, FiAlertTriangle } from 'react-icons/fi'
import { FaMapPin } from 'react-icons/fa'
import ReactMapGL, { Marker } from 'react-map-gl'
import mapConfig from './config/map.json'

import SearchForm from './components/SearchForm'

import './css/global.css'

const sateliteStyle = "mapbox://styles/doravantebeto/ckan9j9bz0omy1ipdb6b1oizn"
const darkStyle = "mapbox://styles/doravantebeto/ckan9ggs7124u1iqlreo3hoe5"
const lightStyle = "mapbox://styles/doravantebeto/ckan9i4oj2i4l1ipg0y55068l"

function menuToggle() {

  [...document.getElementsByClassName('menu-icon')].map(item => item.classList.toggle('hidden'))

  document.getElementById('search-area').classList.toggle('hidden')

}

class App extends React.Component {

  state = {

    registroANS: '',
    convenio: [],
    plano: [],
    estabelecimento: [],
    viewport: {
      latitude: -23.6319245,
      longitude: -46.7541027,
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

    console.log(filteredEstabelecimentos)

    this.setState({
      estabelecimento: filteredEstabelecimentos.map(item => {
        return {
          id: item.cnpj,
          value: item.nome,
          bairro: item.bairro,
          logradouro: item.logradouro,
          municipio: item.municipio,
          telefone: item.telefone
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

    menuToggle()

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

    this.setState({

      mapStyleMode: e.target.innerHTML === 'Satelite'
        ? sateliteStyle
        : e.target.innerHTML === 'Dark'
          ? darkStyle
          : lightStyle

    })

  }

  handleCleanSearch() {

    this.setState({

      plano: [],
      estabelecimento: [],
      pointers: []

    })

    navigator.geolocation.getCurrentPosition(position => {

      const { latitude, longitude } = position.coords

      this.setCoordinates(latitude, longitude)

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

            <button className="refresh" onClick={() => this.handleCleanSearch()}>

              <FiRefreshCcw></FiRefreshCcw>

              Limpar

            </button>

            {this.state.plano[0] === undefined && this.state.estabelecimento[0] === undefined
              ? <SearchForm name="Convenios" id="convenioList" data={this.state.convenio} handleSearch={this.setPlano} />
              : ''
            }


            {this.state.plano[0] !== undefined && this.state.estabelecimento[0] === undefined
              ? <SearchForm name="Planos" id="planoList" data={this.state.plano} handleSearch={this.setEstabelecimento} />
              : ''
            }

            {this.state.estabelecimento[0] !== undefined &&
              <SearchForm name="Estabelecimentos" id="estabelecimentoList" data={this.state.estabelecimento} handleSearch={this.setCoordinateById}></SearchForm>
            }

            <div className="map-view-button" id="map-view-button">

              <button className="btn-left" onClick={e => this.mapToggle(e)}>Satelite</button>
              <button className="btn-center active" onClick={e => this.mapToggle(e)}>Light</button>
              <button className="btn-right" onClick={e => this.mapToggle(e)}>Dark</button>

            </div>

            <a href="https://github.com/doravantebeto/medico-radar-frontend/issues">

              <FiAlertTriangle></FiAlertTriangle>

              <p>
                Encontrou algum Bug? Ajude entrando em contato!
              </p>
            </a>

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

                <Marker
                  className="marker"
                  latitude={item.latitude}
                  longitude={item.longitude}
                  key={item.id}
                >

                  {this.state.estabelecimento.filter(estab => estab.id === item.id).map(info => (
                    <ul>
                      <li>{info.value}</li>
                      {this.state.viewport.zoom > 6 && <li> <hr /> {info.municipio}</li>}
                      {this.state.viewport.zoom > 6 && <li> <hr /> {info.logradouro}</li>}
                      {this.state.viewport.zoom > 8 && <li> <hr /> {info.bairro}</li>}
                      {this.state.viewport.zoom > 8 && <li> <hr /> {info.telefone}</li>}
                    </ul>
                  ))}

                  <FaMapPin className="mapPin" onClick={() => this.setCoordinates(item.latitude, item.longitude)} />

                </Marker>

              ))}

            </ReactMapGL>

          </div>

        </div >

    )

  }

}

export default App;
