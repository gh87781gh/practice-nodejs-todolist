const http = require('http')
const { v4: uuidv4 } = require('uuid')
const errorHandle = require('./errorHandle')
const headers = require('./headers')

// data
const todos = []

const requestListener = (req, res) => {
  // NOTE 接收 request 資料進來
  let body = ''
  req.on('data', (chunk) => {
    body += chunk //NOTE 資料會被拆分成好幾等份，在下面的 on 事件時才組裝完成
  })

  console.log('req:', req.url, req.method)
  if (req.url === '/todos' && req.method === 'GET') {
    res.writeHead(200, headers)
    res.write(
      JSON.stringify({
        status: 'success',
        data: todos
      })
    )
    res.end()
  } else if (req.url === '/todos' && req.method === 'POST') {
    req.on('end', () => {
      try {
        const title = JSON.parse(body).title
        if (title) {
          const todo = {
            title,
            id: uuidv4()
          }
          todos.push(todo)
          res.writeHead(200, headers)
          res.write(
            JSON.stringify({
              status: 'success',
              data: todo
            })
          )
          res.end()
        } else {
          errorHandle.handleError(res, 'WRONG_FORMAT')
        }
      } catch (err) {
        errorHandle.handleError(res, 'WRONG_404')
      }
    })
  } else if (req.url.startsWith('/todos/') && req.method === 'PATCH') {
    req.on('end', () => {
      try {
        const title = JSON.parse(body).title
        const uuid = req.url.split('/')[2]
        const index = todos.findIndex((item) => item.id === uuid)
        if (index < 0) {
          errorHandle.handleError(res, 'NOT_FOUND')
        }

        if (title) {
          todos[index].title = title
          res.writeHead(200, headers)
          res.write(
            JSON.stringify({
              status: 'success',
              data: todos[index]
            })
          )
          res.end()
        } else {
          errorHandle.handleError(res, 'WRONG_FORMAT')
        }
      } catch (err) {
        errorHandle.handleError(res, 'WRONG_404')
      }
    })
  } else if (req.url === '/todos' && req.method === 'DELETE') {
    todos.length = 0
    res.writeHead(200, headers)
    res.write(
      JSON.stringify({
        status: 'success',
        data: todos
      })
    )
    res.end()
  } else if (req.url.startsWith('/todos/') && req.method === 'DELETE') {
    try {
      const uuid = req.url.split('/')[2]
      const index = todos.findIndex((item) => item.id === uuid)
      if (index >= 0) {
        todos.splice(index, 1)
        res.writeHead(200, headers)
        res.write(
          JSON.stringify({
            status: 'success'
          })
        )
        res.end()
      } else {
        errorHandle.handleError(res, 'NOT_FOUND')
      }
    } catch (err) {
      errorHandle.handleError(res, 'WRONG_404')
    }
  } else if (req.method === 'OPTION') {
    res.writeHead(200, headers)
    res.end()
  } else {
    errorHandle.handleError(res, 'NO_URL')
  }
}

// 创建本地服务器来从其接收数据
const server = http.createServer(requestListener)
server.listen(8000)
