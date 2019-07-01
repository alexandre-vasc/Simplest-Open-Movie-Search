const app = require('express')()
const consign = require('consign')

consign().then('./middlewares.js')
    .then('./utils')
    .then('./controllers')
    .then('./routes.js')
    .into(app)

app.listen(5000, () => {
    console.log('Running Simplest Movie Search backend...')
})