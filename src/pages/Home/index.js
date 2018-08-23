import React, { Component, Fragment } from 'react';
import Cabecalho from '../../components/Cabecalho'
import NavMenu from '../../components/NavMenu'
import Dashboard from '../../components/Dashboard'
import Widget from '../../components/Widget'
import TrendsArea from './../../components/TrendsArea'
import Tweet from '../../containers/TweetContainer'
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
        window.store = this.context.store //teste pelo console window.store.dispatch({type: 'ADD_NOTIFICACAO', action.msg})
        console.log(this.context.store.getState())        
        this.context.store.subscribe( () => {            
            this.setState({
                //aplica o state vindo da store
                tweetAtivo: this.context.store.getState().tweets.tweetAtivo,
                tweets: this.context.store.getState().tweets.tweets,
            })
        })
        this.context.store.dispatch(TweetActions.carregaTweets())        
        console.log(this.context.store.dispatch(TweetActions.carregaTweets()))
    }

    adicionaTweet = (event) => {
        event.preventDefault()
        if(this.state.novoTweet) {
            this.context.store.dispatch(TweetActions.adicionaTweet(this.state.novoTweet))
            this.setState({
                novoTweet: ''
            })
        }
    }

    removeOTweet = (idDoTweet) => {
        
        this.context.store.dispatch(TweetActions.removeTweet(idDoTweet))

        console.log(this.context.store.dispatch({type: 'REMOVE_TWEET', idDoTweetQueVaiSumir: idDoTweet}))
    }

    abreModal = (idDoTweetQueVaiNoModal) => {
        console.log('abre');        
        this.context.store.dispatch({type: 'ABRE_MODAL', idDoTweetQueVaiNoModal})
        
    }
    
    fechaModal = (evento) => {
        const elementoAlvo = evento.target
        const isModal = elementoAlvo.classList.contains('modal')
        console.log('fecha')
        if(isModal){
            this.context.store.dispatch({type: 'FECHA_MODAL'})
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
                    removivel={this.state.tweetAtivo.removivel}
                    >                
                    </Tweet>
                }
            </Widget>
        </Modal>
        {
            this.context.store.getState().noticacao && 
            <div className='noticacaoMsg' onAnimationEnd={() => {
                this.context.store.dispatch({type: 'REMOVE_NOTICICACAO'})
            }}>
                { this.context.store.getState().noticacao }
            </div>
        }
                
      </Fragment>
    );
  }
}