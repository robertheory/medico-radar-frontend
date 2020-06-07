# Medicoradar

Projeto para facilitar a localização de medicos levando em consideração o convênio e o plano do paciente, evitando com que o mesmo tenha que baixar aplicativos para isso.


### Responsavel pela API consumida pela aplicação
[Luan Féo](https://github.com/luanvsfeo)

### Endpoints

|HTTP| Url                            | Descricao                             |
|----|-----------------------------------------------| --------------------------------------|
|GET | https://medicoradas-api.herokuapp.com/convenio| Retorna os convênios presentes na base|
|GET | https://medicoradas-api.herokuapp.com/convenio/{registroAns}/planos| Retorna os planos do convênio|
|GET |https://medicoradas-api.herokuapp.com/estabelecimento/{registroAns}/{cdPlano} |  Retorna os estabelecimentos levando em consideração o plano e o convenio|


### Tecnologias utilizadas
- Spring boot
- JPA/Hibernate
- Postgresql




