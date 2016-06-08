Use Docker
-
```
docker build -t boilerplate .
docker run --name boilerplate-docker -v $PWD/workspace:/home/boilerplace/workspace -p 80:8000 -p 35729:35729 boilerplate
```
