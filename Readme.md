# Vending machine

## sever

### inital config

setup env file with admin user, or rename _env.local to .env.local (`.local` is not part of git) in `server/config/environment` directory, example of .env file with admin user and db name
```
ADMIN_EMAIL=admin@admin.test
ADMIN_PASSWORD=$2b$04$GA/8yrEF3aUJmta7Pcj4dOj.LxRy7Ie/vlOgWd7kDTWeTaAqewzLy
```

### run

```
cd server
npm i
npm start
```

### Interactive documentation

Swagger for REST API http://localhost:3001/swagger
Graphql playground http://localhost:3001/graphql

## client

```
cd client
npm i
npm start
```

