//储存token
export const setToken = (token) =>{
    localStorage.setItem("TOKENs",token)
}

//获取token
export const getToken = ()=>{

    return localStorage.getItem("TOKENs")
}

//清除本地储存的token
export const removeToken=()=>{
    localStorage.removeItem("TOKENs")
}