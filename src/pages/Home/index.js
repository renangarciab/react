import React, { Component, Fragment } from 'react';
import Cabecalho from '../../components/Cabecalho'
import NavMenu from '../../components/NavMenu'
import Dashboard from '../../components/Dashboard'
import Widget from '../../components/Widget'
import TrendsArea from './../../components/TrendsArea'
import Tweet from '../../components/Tweet'
import TweetLoading from '../../components/TweetLoading'
import Modal from '../../components/Modal'
import ProtoType from 'prop-types'
import * as TweetActions from '../../actions/TweetsActions'

export default class Home extends Component {
    constructor() {
        super()

        this.state = {
            novoTweet: '',
            tweets: [],
            tweetAtivo: {}
        }        
    }

    static contextTypes = {
        store: ProtoType.object
    }

    componentDidMount() {
        console.log(this.context.store.getState())
        this.context.store.subscribe( () => {            
            this.setState({
                tweets: this.context.store.getState()
            })
        })
        this.context.store.dispatch(TweetActions.carregaTweets())
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

    removeOTweet = (idDoTweet) => {
        const listaAtualizada = this.state.tweets.filter((tweetAtual) => {
            return tweetAtual._id !== idDoTweet
        })

        fetch(`http://twitelum-api.herokuapp.com/tweets/${idDoTweet}?X-AUTH-TOKEN=${localStorage.getItem('TOKEN')}`, {
            method: 'DELETE'
        })
        .then((resposta) => resposta.json() )
        .then((respostaConvertidaEmObjeto) => {
            this.setState({
                tweets: listaAtualizada
            })
        })

        this.setState({
            tweets: listaAtualizada
        })
    }

    abreModal = (idDoTweetQueVaiNoModal) => {
        console.log('abre');
        const tweetQueVaiFicarAtivo = this.state.tweets.find((tweetAtual) => {
            return tweetAtual._id === idDoTweetQueVaiNoModal
        })
        this.setState({
            tweetAtivo: tweetQueVaiFicarAtivo
        })
        
    }
    
    fechaModal = (evento) => {
        const elementoAlvo = evento.target
        const isModal = elementoAlvo.classList.contains('modal')
        console.log('fecha')
        if(isModal){
            this.setState({
                tweetAtivo: {}
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
                                this.state.tweets.map((tweetAtual, indice) => {
                                    return <Tweet 
                                    key={tweetAtual._id}
                                    id={tweetAtual._id}
                                    texto={tweetAtual.conteudo}
                                    usuario={tweetAtual.usuario}
                                    removivel={tweetAtual.removivel}
                                    likeado={tweetAtual.likeado}
                                    totalLikes={tweetAtual.totalLikes}
                                    removeHandler={() => {this.removeOTweet(tweetAtual._id)}}
                                    abreModalHandler={() => {this.abreModal(tweetAtual._id)}}/>
                                })
                            : <TweetLoading status='loading'/>                         
                            
                        }
                    </div>
                </Widget>
            </Dashboard>
        </div>
        <Modal 
         isAberto={Boolean(this.state.tweetAtivo._id)}
         fechaModal={this.fechaModal}>
            <Widget>
                {
                    Boolean(this.state.tweetAtivo._id) &&
                    <Tweet
                    id={this.state.tweetAtivo._id}
                    texto={this.state.tweetAtivo.conteudo}
                    usuario={this.state.tweetAtivo.usuario}
                    likeado={this.state.tweetAtivo.likeado}
                    totalLikes={this.state.tweetAtivo.totalLikes}
                    >                
                    </Tweet>
                }
            </Widget>
        </Modal>
      </Fragment>
    );
  }
}