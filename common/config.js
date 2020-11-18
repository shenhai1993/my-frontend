let url_config = ""

if(process.env.NODE_ENV === 'development'){
    // 开发环境
    //url_config = 'https://10.104.10.40:32802'
	url_config = 'https://www.007978wei.com:32802'
}else{
    // 生产环境
    url_config = 'https://www.007978wei.com:32802'
}

export default url_config