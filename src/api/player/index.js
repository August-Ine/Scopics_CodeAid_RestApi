// ---------------------------------------------------------------------------------------------
// YOU CAN MODIFY THE CODE BELOW IN ORDER TO COMPLETE THE TASK
// YOU SHOULD NOT CHANGE THE EXPORTED VALUE OF THIS FILE
// ---------------------------------------------------------------------------------------------

export default (app) => {
  app.put(
    `/player/:id`,
    require('./update').default
  );
  app.delete(
    `/player/:id`,
    authenticateToken,
    require('./delete').default
  );
  app.get(
    `/player`,
    require('./getList').default
  );
  app.post(
    `/player`,
    require('./create').default
  );
};

// Middleware to authenticate the delete Bearer token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; //split 'bearer' and select token value

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  //token verification using the provided value
  if (token !== 'SkFabTZibXE1aE14ckpQUUxHc2dnQ2RzdlFRTTM2NFE2cGI4d3RQNjZmdEFITmdBQkE=') {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Token is valid, proceed to the next middleware or route handler
  next();
}