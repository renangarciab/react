import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

const stateInicial = []

function tweetsReducer(stateDentroDaStore = stateInicial, acaoDisparadaPeloDev) {
    if(acaoDisparadaPeloDev.type === 'CARREGA_TWEETS'){
        console.log('tentando carregar')
        return acaoDisparadaPeloDev.tweets
    }
    return stateDentroDaStore
}

export default createStore(
    tweetsReducer,
    applyMiddleware(thunk)
)