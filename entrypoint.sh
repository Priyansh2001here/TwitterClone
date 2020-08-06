#!/bin/bash

echo "collect static"
python TwitterClone/manage.py collectstatic 

echo "no clct static migrations"
python TwitterClone/manage.py makemigrations 
python TwitterClone/manage.py migrate

echo "starting server"
python TwitterClone/manage.py runserver 0.0.0.0:8000