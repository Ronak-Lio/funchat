export const initialState = null

export const reducer = (state , action) => {
    if(action.type === "USER"){
        return action.payload
    }
    if(action.type === "CLEAR"){
        return null
    }
    if(action.type === "UPDATEPIC"){
        return{
            ...state,
            pic : action.payload
        }
    }
    if(action.type === "UPDATECHATS"){
        return{
            ...state,
            chats : action.payload.chats
        }
    }
    if(action.type === "OPEN_SEARCH_POPUP"){
        return{
            ...state,
            openSearchPopup : action.payload
        }
    }
    if(action.type === "OPEN_GROUP_POPUP"){
        return{
            ...state,
            openGroupPopup : action.payload
        }
    }
    if(action.type === "CLEAR"){
        return null
    }
    return state
}