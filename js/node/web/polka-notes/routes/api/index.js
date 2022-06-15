// imports
const polka = require('polka');
const router = polka();

// middleware import
const sayHello = require('../../middleware/say-hello');

// routes
router.get('/', sayHello, (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Hello world!' }));
});

router.post('/', (req, res) => {
  const { body } = req;
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ body }));
});

router.get('/users/:id', (req, res) => {
  const { id } = req.params;
  const data = { id };
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ data }));
});

router.get('/search', (req, res) => {
  const { query } = req;
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ query }));
});

module.exports = router;
