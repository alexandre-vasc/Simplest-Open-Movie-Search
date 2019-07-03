const app = require('express')();
const consign = require('consign');
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.json());
app.use(cors());

consign()
  .then('./conf.js')
  .then('./utils')
  .then('./controllers')
  .then('./routes.js')
  .into(app);

app.listen(app.conf.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Running SQQA backend at port ${app.conf.port}...`);
});
