# TwitterClone
Django Based Twitter Like website

I have used vanilla JS and Django, DjangoRestFramework to make this website, although the frontend is not so good but backend works perfect most of the functionality can be foound  at homepage and contribution is highly appreciated

There are two methods to run this project on your machine

1. Intall packages from requirements.txt and setup postgress
2. Use Docker and you are done in just two commands

If you go with first then,

```
$ pip install -r requirements.txt
```

If you have python2 installed in your machine

```
$ pip3 install -r requirements.txt
```

If you go with second then,

First of all ensure that you have docker installed by
```
$ docker --version
```
if you are able to see the version of docker installed on your machine then you are ready to go

```
$ docker-compose buils
$ docker-compose up
```

from virtualenv to db these two commands will setup everything for you
