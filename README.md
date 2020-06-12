# Medicoradar

Projeto para facilitar a localização de médicos levando em consideração o convênio e o plano do paciente, evitando com que o mesmo tenha que baixar aplicativos para isso.

#### Preview:

- http://medico-radar.surge.sh/

![enter image description here](https://github.com/doravantebeto/medico-radar-frontend/blob/master/src/assets/Medico%20Radar.gif?raw=true)

### Descrição:

- Para encontrar estabelecimentos que aceitam o seu plano de saúde, o usuário vai utilizar o menu de buscas à esquerda, que atualmente, os filtra por convênio e plano, respectivamente. Escolhendo seu convênio, é apresentada uma lista de planos de saúde do convênio em questão, e após selecionar seu plano, já será possível observar no mapa as localidades associadas e no menu, uma lista das mesmas. Cada etapa da da busca conta com uma caixa de pesquisa por texto case sensitive.

### Tecnologias utilizadas:

- ReactJS
- CSS3
- [React-Map-GL](https://github.com/visgl/react-map-gl#readme)

### Requisitos:

- Node v12.16.1
- NPM 6.13.4
- React 16.13.1

### Uso:

- Antes de tudo instale as dependências: - `npm install` ou `yarn install`
- Scripts: - `npm start` - Inicia a preview local - `npm build` - Gera a pasta /build - `npm deploy` - Gera a pasta build e publica a página na plataforma [Surge](https://surge.sh/). - Requisitos: - Instalar o Surge: - `npm install -g surge` ou `yarn install -g surge`; - Iniciar/configurar sua conta Surge; - Modificar o package.json para atender ao domínio desejado;
<hr>

### Responsavel pela API consumida pela aplicação:

[Luan Féo](https://github.com/luanvsfeo)

### Endpoints:

| HTTP | Url                                                                           | Descricao                                                                |
| ---- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| GET  | https://medicoradas-api.herokuapp.com/convenio                                | Retorna os convênios presentes na base                                   |
| GET  | https://medicoradas-api.herokuapp.com/convenio/{registroAns}/planos           | Retorna os planos do convênio                                            |
| GET  | https://medicoradas-api.herokuapp.com/estabelecimento/{registroAns}/{cdPlano} | Retorna os estabelecimentos levando em consideração o plano e o convenio |

### Tecnologias utilizadas:

- Spring boot
- JPA/Hibernate
- Postgresql

#### Atenção: nossa base de dados conta com registros que se limitam ao território brasileiro e que estão disponíveis de forma pública no [Portal Brasileiro de Dados Abertos](http://www.dados.gov.br/)

##### Em conjunto com o Portal Brasileiro de Dados Abertos, foram utilizadas as seguintes APIs:

- [CEP Aberto](https://cepaberto.com/)
- [ReceitaWS](https://receitaws.com.br/api)
