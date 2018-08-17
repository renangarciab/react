import React, { Component, Fragment } from 'react';
import Cabecalho from './../../components/Cabecalho'
import NavMenu from './../../components/NavMenu'
import Dashboard from './../../components/Dashboard'
import Widget from './../../components/Widget'
import TrendsArea from './../../components/TrendsArea'
import Tweet from './../../components/Tweet'

export default class Home extends Component {
    constructor() {
        super()

        this.state = {
            novoTweet: '',
            tweets: []
        }        
    }

    componentDidMount() {
        fetch(`http://twitelum-api.herokuapp.com/tweets?X-AUTH-TOKEN=${localStorage.getItem('TOKEN')}`)
        .then((respostaDoServidor) => respostaDoServidor.json())
        .then((tweetsVindosDoServidor) => {
            this.setState({
                tweets: tweetsVindosDoServidor
            })
        })
    }

    adicionaTweet = (event) => {
        event.preventDefault()
        if(this.state.novoTweet) {
            fetch(`http://twitelum-api.herokuapp.com/tweets?X-AUTH-TOKEN=${localStorage.getItem('TOKEN')}`, {
                method: 'POST',
                body: JSON.stringify({conteudo: this.state.novoTweet})
            })
            .then((respostaDoServidor) => {
                return respostaDoServidor.json()
            })
            .then ((respostaConvertidaEmObjeto) => {
                this.setState({
                    tweets: [respostaConvertidaEmObjeto, ...this.state.tweets],
                    novoTweet: ''
                })
            })
        }
    }
  render() {
    return (
      <Fragment>
        <Cabecalho>
            <NavMenu usuario="@omariosouto" />
        </Cabecalho>
        <div className="container">
            <Dashboard>
                <Widget>
                    <form className="novoTweet" onSubmit={this.adicionaTweet}>
                        <div className="novoTweet__editorArea">
                            <span 
                            className={`novoTweet__status ${ this.state.novoTweet.length > 140
                            ? 'novoTweet__status--invalido'
                            : '' }`}>{this.state.novoTweet.length}/140</span>
                            <textarea
                            onChange={ (event) => { this.setState({ novoTweet: event.target.value }) } }
                            value={this.state.novoTweet}
                            className="novoTweet__editor"
                            placeholder="O que está acontecendo?"></textarea>
                        </div>
                        <button type="submit"
                        disabled = {this.state.novoTweet.length > 140}
                        className="novoTweet__envia">Tweetar</button>
                    </form>
                </Widget>
                <Widget>
                    <TrendsArea />
                </Widget>
            </Dashboard>
            <Dashboard posicao="centro">
                <Widget>
                    <div className="tweetsArea">
                        {   
                            this.state.tweets.length > 0 ?
                                this.state.tweets.map(function(tweetAtual, indice){
                                    return <Tweet key={tweetAtual._id}
                                    texto={tweetAtual.conteudo}
                                    usuario={tweetAtual.usuario}
                                    likeado={tweetAtual.likeado}
                                    totalLikes={tweetAtual.totalLikes}/>
                                })
                            : <p>calma ai</p>                           
                            
                        }
                    </div>
                </Widget>
            </Dashboard>
        </div>
      </Fragment>
    );
  }
}