// route specific middleware
const sayHello = (req, res, next) => {
  console.log('Hello from middleware');
  next();
};

module.exports = sayHello;
