const express = require('express')
const next = require('next')

const port = parseInt(process.env.PORT, 10) || 443
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const routes = require('./routes')
const handler = routes.getRequestHandler(app)

app.prepare()
  .then(() => {
    express().use(handler).listen(port)
  })
