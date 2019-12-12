from flask import request
from pymongo import MongoClient
from bcrypt import hashpw, gensalt, checkpw
from config import MONGO, SECRET_KEY
from util import response
from datetime import datetime, timedelta
from jwt import encode, decode
from json import dumps

client = MongoClient(MONGO)
db = client.RecipeDB
users = db.users
blacklist = db.blacklist


def login():
    form = request.form
    username = form['username']
    password = form['password']

    if username and password:
        user = users.find_one({'username': username})
        if user is not None:
            if checkpw(bytes(password, 'UTF-8'), user['password']):
                exp = datetime.utcnow() + timedelta(hours=24)
                token = encode({
                    '_id': str(user['_id']),
                    'username': username,
                    'admin': user['admin'],
                    'exp': exp
                }, SECRET_KEY)

                exp_clean = dumps(exp.isoformat())
                exp_clean = exp_clean[1:-1]

                return response(200, {
                    'token': token.decode('UTF-8'),
                    'username': username,
                    'name': user['name'],
                    'exp': exp_clean
                })

            else:
                return response(401, 'Incorrect password.')

        else:
            return response(401, 'Incorrect username.')

    return response(401, 'Authentication required.')


def logout():
    token = None
    if 'x-access-token' in request.headers:
        token = request.headers['x-access-token']

    if not token:
        return response(401, 'Token required.')

    blacklist.insert_one({'token': token})
    return response(200, 'Logout successful.')


def register():
    def is_null(value):
        return len(value) == 0

    name = request.form['name']
    username = request.form['username']
    email = request.form['email']
    password = request.form['password']

    if is_null(name):
        return response(400, 'Name cannot be null')

    if is_null(username):
        return response(400, 'Username cannot be null')

    if is_null(email):
        return response(400, 'Email cannot be null')

    if is_null(password):
        return response(400, 'Password cannot be null')

    user_list = users.find({'username': username})

    for u in user_list:
        if u['username'] == username:
            return response(400, 'A user already exists with the username you provided.')

    user = {
        'name': name,
        'email': email,
        'username': username,
        'password': hashpw(str(password).encode('UTF-8'), gensalt()),
        'admin': False
    }
    users.insert_one(user)

    return response(200, 'Signup successful.')
