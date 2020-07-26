[![CircleCI](https://circleci.com/gh/GLO3112-classrooms/ugram-h2020-team-14.svg?style=shield&circle-token=6adb8aef89174cb1121c0dd87a674106a45634e9)](https://app.circleci.com/github/GLO3112-classrooms/ugram-h2020-team-14/pipelines)

# Deployment
## API:
http://ugram-api.eba-b322uwpn.us-west-2.elasticbeanstalk.com

## Website:
http://ugram-team14-front.s3-website-us-west-2.amazonaws.com/

## Concernant la feature de prise de photo avec notre Webcam

Lors du développement de ce bonus nous n'avions pas pris en compte le fait que les navigateurs bloquent les accès aux périphériques internes à l'ordinateur lorsqu'il s'agit d'une url non sécurisée ce qui est le cas pour notre front c'est pourquoi si vous souhaitez voir notre bonus merci de suivre le tuto suivant https://medium.com/@Carmichaelize/enabling-the-microphone-camera-in-chrome-for-local-unsecure-origins-9c90c3149339
qui permet de désactiver le blocage de la webcam ou si vous n'utilisez pas chrome merci de lancer le projet en local

# Getting Started
## Starting the application:
```sh
$ yarn start
#runs sudo docker-compose -f ./API/docker-compose.yml up -d && sudo docker-compose -f ./WEB/docker-compose.yml up -d
```

## Run the API 
### From project's root:
```sh
$ yarn run api
```

### From API directory:
```sh
$ cd API
$ sudo docker-compose up
```

### Run in development mode
```sh
$ cd API
$ yarn start
```

## Run the website
### From project's root:
```sh
$ yarn run web
```

### From WEB directory:
```sh
$ cd WEB
$ sudo docker-compose up
```
# Equipes

### Web:
- **Eliott**
- **Thibault**
- **Maxence**
- **Nathan**
### API:
- **Philippe**
