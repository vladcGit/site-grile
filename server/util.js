const jwt = require('jsonwebtoken');

// cheia secreta pentru semnarea si verificarea unui token
const secret = process.env.SECRET;

// intoarce datele din token sau un obiect
// cu campul error in cazul in care token-ul este invalid
const decodeToken = (token) => {
  try {
    return jwt.verify(token, secret);
  } catch (e) {
    console.error(e.message);
    return { error: 'bad token' };
  }
};

// middleware-ul care va fi folosit de toate functiile
// unde autentificarea este necesara;
// verifica daca token-ul este valid si, daca da,
// seteaza in request datele din acesta
// daca token-ul nu este valid intoarce un cod si un obiect de eroare
const authenticationMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  // daca nu exista niciun token atunci inseamna ca nu s-a facut nicio
  // incercare de autentificare
  if (token == null)
    return res.status(401).json({ error: 'User not authenticated' });
  const userObject = decodeToken(token);
  // daca token-ul exista, dar este gresit, inseamna ca este invalid
  if (userObject.error) {
    return res.status(403).json({ error: 'Error when trying to authenticate' });
  }
  req.userId = userObject.userId;
  next();
};

module.exports = { authenticationMiddleware };
