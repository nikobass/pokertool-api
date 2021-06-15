const jwt = require('jsonwebtoken');

exports.auth = function(req, res, next){

  console.log('req.body', req.body);

    // Que me renvoie le FRONT ?
    //let accessToken = req.body.jwt

    // if (!accessToken){
    //     return res.status(403).send()
    // }

    let payload;

    try{

        //payload = jwt.verify(accessToken, process.env.TOKEN_SECRET);
        payload = jwt.verify(req.body.token, process.env.TOKEN_SECRET);
        console.log('payload', payload);
        next();
    }
    catch(err){

        return res.status(401).send();
    }
}
