const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    //console.log(req);
    const token = req.headers.authorization.split(' ')[1];
    console.log("decodedToken = ", decodedToken);
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);

    console.log("req.body = ", req.body);

    const userId = decodedToken.userId;
    
    if (req.body.userId && req.body.userId !== userId) {
      throw 'UTILISATEUR INVALIDE';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('REQUETE INVALIDE')
    });
  }
};