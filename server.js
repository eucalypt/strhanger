const { createServer } = require('https')
const { parse } = require('url')
const next = require('next')
const fs = require('fs')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = 3000

// 準備 Next.js 應用程式
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

// SSL 憑證路徑
const httpsOptions = {
  key: fs.readFileSync('./ssl/localhost-key.pem'),
  cert: fs.readFileSync('./ssl/localhost.pem')
}

app.prepare().then(() => {
  createServer(httpsOptions, async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })
    .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Ready on https://${hostname}:${port}`)
    })
}) 