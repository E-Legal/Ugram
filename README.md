[![CircleCI](https://circleci.com/gh/GLO3112-classrooms/ugram-h2020-team-14.svg?style=shield&circle-token=6adb8aef89174cb1121c0dd87a674106a45634e9)](https://app.circleci.com/github/GLO3112-classrooms/ugram-h2020-team-14/pipelines)

# Deployment
## API:
http://ugram-api.eba-b322uwpn.us-west-2.elasticbeanstalk.com

## Website:
http://ugram-team14-front.s3-website-us-west-2.amazonaws.com/

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
