//reducer
import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'

const stateInicial = {tweets: [], tweetAtivo: {}}

function tweetsReducer(stateDentroDaStore = stateInicial, acaoDisparadaPeloDev) {
    if(acaoDisparadaPeloDev.type === 'CARREGA_TWEETS'){
        console.log('stateDentroDaStore', stateDentroDaStore)
        return {
            ...stateDentroDaStore,
            tweets: acaoDisparadaPeloDev.tweets
        }
    }

    if(acaoDisparadaPeloDev.type === 'ADD_TWEET'){
        console.log(acaoDisparadaPeloDev)
        const tweetsAntigos = stateDentroDaStore.tweets
        const tweetNovo = acaoDisparadaPeloDev.tweet

        return {
            ...stateDentroDaStore,
            tweets: [tweetNovo, ...tweetsAntigos]
        }
    }

    if(acaoDisparadaPeloDev.type === 'REMOVE_TWEET'){
        console.log(acaoDisparadaPeloDev.idDoTweetQueVaiSumir)

        const idDoTweetQueVaiSumir = acaoDisparadaPeloDev.idDoTweetQueVaiSumir
        const listaAtualizadaDeTweets = stateDentroDaStore.tweets.filter((tweetAtual) => {
            return tweetAtual._id !== idDoTweetQueVaiSumir
        })

        console.log(listaAtualizadaDeTweets)

        return {
            ...stateDentroDaStore,
            tweets: listaAtualizadaDeTweets
        }
    }

    if(acaoDisparadaPeloDev.type === "ABRE_MODAL") {
        const idDoTweetQueVaiNoModal = acaoDisparadaPeloDev.idDoTweetQueVaiNoModal
        const tweetQueVaiFicarAtivo = stateDentroDaStore.tweets.find((tweetAtual) => {
            return tweetAtual._id === idDoTweetQueVaiNoModal
        })

        return {
            ...stateDentroDaStore,
            tweetAtivo: tweetQueVaiFicarAtivo
        }
    }

    if(acaoDisparadaPeloDev.type === "FECHA_MODAL") {
        console.log('passamo')
        return {
            ...stateDentroDaStore,
            tweetAtivo: {}
        }
    }

    if(acaoDisparadaPeloDev.type === 'LIKE') {
        const idTweetLikeado = acaoDisparadaPeloDev.idDoTweet
        console.log('dentro do reducer', idTweetLikeado)
        const listaNova = stateDentroDaStore.tweets.map((tweetAtual) => {
            const {likeado, totalLikes, _id} = tweetAtual
            if(idTweetLikeado === _id) {
                tweetAtual.likeado = !likeado
                tweetAtual.totalLikes = likeado ? totalLikes -1 : totalLikes + 1
            }

            return tweetAtual
        })

        return {
            ...stateDentroDaStore,
            tweets: listaNova
        }
    }

    return stateDentroDaStore
}

function noticacaoReducer(state = '', action) {
    if(action.type === "ADD_NOTIFICACAO") {
        console.log('notificacao', action.msg)
        return action.msg
    }

    if(action.type === "REMOVE_NOTIFICACAO") {
        console.log('notificacao', action.msg)
        return ''
    }

    return state
}

export default createStore(
    combineReducers({
        tweets: tweetsReducer,
        noticacao: noticacaoReducer
    }),
    applyMiddleware(thunk)
)