import React from 'react';

const AcordionCard = (props) => {
    return (

        <div className="card">
            <div className="card-header" id="headingOne">
                <h2 className="mb-0">
                    <button id="btn-convenios" className="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                        {props.title}
                    </button>
                </h2>
            </div>

            <div id="collapseOne" className={`collapse ${props.className}`} aria-labelledby="headingOne" data-parent="#accordionExample">
                <div className="card-body">

                    {props.content}

                    {/* <SearchForm open="btn-planos" id="convenioList" data={this.state.convenio} handleSearch={this.setPlano}></SearchForm> */}
                </div>
            </div>
        </div>
    );
};

export default AcordionCard;