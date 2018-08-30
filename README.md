# web

Frontend code for WordCannon.

# local development

## build

```
git clone https://github.com/WordCannon/web.git
cd web
npm install
```

## run

```
npm start
```

Open a browser and go to http://localhost:8888

# docker

## docker build

```
docker build -t wordcannon/web .
```

## docker run

```
docker run --rm -p 8888:8888 wordcannon/web
```

# Credits

Word animation code from [Random Words!](https://codepen.io/LandonSchropp/pen/xLtif) - [MIT License](https://blog.codepen.io/legal/licensing/)
