import Tweet from '../components/Tweet'
import * as TweetsActions from '../actions/TweetsActions'
import { connect } from 'react-redux'

const mapStateToProps = (state) => {return {}}
const mapDispatchToProps = (dispatch, propsRecebidas) => {
    return {
        removeHandler: function() {
            dispatch(TweetsActions.removeTweet(propsRecebidas.id))
            dispatch({type: 'FECHA_MODAL'})
        }
    }
}

const TweetPadraoContainer = connect (mapStateToProps, mapDispatchToProps)(Tweet)
export default TweetPadraoContainer