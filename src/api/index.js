import requests from './request'

//推荐歌单
export const reqCategoryList = (limit)=>{
    return requests({url:'/personalized',method:"post",data:{limit}})
}

//推荐新音乐
export const reqNewsong = (limit)=>{
    return requests({url:'/personalized/newsong',method:"get",params:{limit}})
}

//音乐是否可用
export const reqCheck = (id)=>{
    return requests({url:'/check/music',method:"post",data:{id}})
}

//获取音乐url
export const reqSong = (id)=>{
    return requests({url:'/song/url',method:"get",params:{id}})
}

//获取歌单详情
export const reqDetail = (id)=>{
    return requests({url:'/playlist/detail',method:'get',params:{id}})
}

//获取歌单歌曲
export const reqPlaylistTrack = (params)=>{
    return requests({url:'/playlist/track/all',method:'get',params})
}

//手机登录 (获取用户Id和token)
export const reqLogin = (data)=>{
    return requests({url:'/login/cellphone',method:'get',params:{phone:data.email,password:data.password}})
}

//刷新登录
export const reqLoginOn = ()=>{
    return requests({url:'/login/refresh',method:'get'})
}

//用户账号信息
export const reqAccount = ()=>{
    return requests({url:'/user/account',method:'get'})
}

//获取用户详情
export const reqDetailUser = (id)=>{
    return requests({url:'/user/binding',method:'get',params:{id}})
}

//退出登录
export const reqLogout = ()=>{
    return requests({url:'/logout'})
}

//获取歌单评论
export const reqComment = (params)=>{
    return requests({url:"/comment/playlist",method:'get',params})
}

//发送/删除评论
export const sendComment = (params)=>{
    return requests({url:"/comment",method:'get',params})
}

//榜单内容摘要
export const topList = (params)=>{
    return requests({url:"/toplist/detail",method:"get",params})
}

//热搜列表(简略)
export const searchHot = ()=>{
    return requests({url:"/search/hot",method:"get"})
}

//搜索
export const reqSearch = (params)=>{
    return requests({url:"/search",method:"get",params})
}

//获取歌词
export const reqLyric = (params)=>{
    return requests({url:"/lyric",method:"get",params})
}