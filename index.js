const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors")
const jwt = require("jsonwebtoken")

const jwtSecret = 'djisaidwauhduhsahuwdua'

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

function auth(req, res, next) {
  const authToken = req.headers['authorization'];

  if (authToken != undefined) {

    const bearer = authToken.split(' ');
    const token = bearer[1];

    jwt.verify(token, jwtSecret, (err, data) => {
      if (err) {
        res.status(401);
        res.json({ err: "Token inválido" });
      } else {
        req.token = token;
        req.loggedUser = { id: data.id, email: data.email };
        next();
      }
    });

  } else {
    res.status(401);
    res.json({ err: "Token inválido!" })
  }
}

const DB = {
  games: [
    {
      id: 0,
      title: "Call of duty MW",
      year: 2019,
      price: 60
    },
    {
      id: 1,
      title: "Sea of thieves",
      year: 2018,
      price: 40
    },
    {
      id: 2,
      title: "Minecraft",
      year: 2012,
      price: 20
    }
  ],
  users: [
    {
      id: 1,
      name: "Eduardo Santos",
      email: "eduardosantos@gmail.com",
      password: "nodejs<3"
    },
    {
      id: 20,
      name: "Guilherme",
      email: "guigg@gmail.com",
      password: "java123"
    }
  ]
}

app.post("/auth", (req, res) => {
  const { email, password } = req.body;

  if (email != undefined) {
    const user = DB.users.find(u => u.email == email);
    if (user != undefined) {
      if (user.password == password) {
        jwt.sign({ id: user.id, email: user.email }, jwtSecret, { expiresIn: '48h' }, (err, token) => {
          if (err) {
            res.status(400);
            res.json({ err: "Falha Interna" })
          } else {
            res.status(200);
            res.json({ token: token });
          }
        })

      } else {
        res.status(401);
        res.json({ err: "Credenciais inválidas" })
      }
    } else {
      res.status(404);
    }
  } else {
    res.status(400);
    res.json({ err: "O E-mail inviado é inválido!" })
  }
});

app.get("/games", auth, (req, res) => {

  res.statusCode = 200;
  res.json({ user: req.loggedUser, games: DB.games });
});

app.get("/games/:id", auth, (req, res) => {
  if (isNaN(req.params.id)) {
    res.sendStatus(400);
  } else {

    const id = parseInt(req.params.id);

    const game = DB.games.find(g => g.id == id);

    if (game != undefined) {
      res.statusCode = 200;
      res.json(game);
    } else {
      res.sendStatus(404);
    }
  }
});

app.post("/games", auth, (req, res) => {
  const { title, price, year } = req.body;
  const game = {
    title, price, year, id: DB.games.length + 1
  }
  DB.games.push(game);
  res.status(200);
  res.send(game)
})

app.delete("/games/:id", auth, (req, res) => {
  if (isNaN(req.params.id)) {
    res.sendStatus(400);
  } else {
    const id = parseInt(req.params.id);
    const index = DB.games.findIndex(g => g.id == id);

    if (index == -1) {
      res.sendStatus(404);
    } else {
      DB.games.splice(index, 1);
      res.sendStatus(200);
    }
  }
});

app.put("/games/:id", auth, (req, res) => {
  if (isNaN(req.params.id)) {
    res.sendStatus(400);
  } else {
    const id = parseInt(req.params.id);

    const game = DB.games.find(g => g.id == id);
    if (game != undefined) {
      const { title, price, year } = req.body;
      if (title != undefined) {
        game.title = title;
      }
      if (price != undefined) {
        game.price = price;
      }
      if (year != undefined) {
        game.year = year;
      }
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  }
});

app.listen(45678, () => {
  console.log("API RODANDO!");
});
