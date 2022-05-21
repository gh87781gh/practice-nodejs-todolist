const headers = require('./headers')

const errorMsg = {
  WRONG_404: '404 錯誤',
  WRONG_FORMAT: '欄位格式錯誤',
  NOT_FOUND: 'Not found',
  NO_URL: '無此網站路由'
}

module.exports = {
  handleError: (res, msgType) => {
    res.writeHead(400, headers)
    res.write(
      JSON.stringify({
        status: 'false',
        data: errorMsg[msgType]
      })
    )
    res.end()
  }
}
