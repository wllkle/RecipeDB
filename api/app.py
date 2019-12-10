from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
from functools import wraps
from bcrypt import checkpw
from datetime import datetime, timedelta
from config import SECRET_KEY, ITEMS_PER_PAGE, MONGO
from jwt import encode, decode

app = Flask('RecipeDB')
app.config['SECRET_KEY'] = SECRET_KEY
CORS(app)

client = MongoClient(MONGO)
db = client.RecipeDB
users = db.users
blacklist = db.blacklist
recipes = db.recipes


# gets total count of items in a collection
# accidents.count_documents({}, None)


def jwt_required(func):
    @wraps(func)
    def jwt_required_wrapper(*args, **kwargs):
        token = None
        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']

        if not token:
            return jsonify({'message': 'Token is missing'}), 401

        try:
            jwt.decode(token, app.config['SECRET_KEY'])

        except:
            return response(401, 'Token is invalid.')

        bl_token = blacklist.find_one({"token": token})
        if bl_token is not None:
            return response(401, 'Token is invalid.')

        return func(*args, **kwargs)

    return jwt_required_wrapper


def admin_required(func):
    @wraps(func)
    def admin_required_wrapper(*args, **kwargs):
        token = request.headers['x-access-token']
        data = decode(token, app.config['SECRET_KEY'])
        if data["admin"]:
            return func(*args, **kwargs)

        else:
            return response(401, 'Admin required')

    return admin_required_wrapper


def response(statusCode, data):
    if isinstance(data, str):
        if statusCode is not 200:
            data = {'error': data}

        else:
            data = {'message': data}

    return make_response(jsonify(data), statusCode)


@app.route('/login', methods=['POST'])
def login():
    auth = request.authorization
    if auth:
        user = users.find_one({'username': auth.username})
        if user is not None:
            if checkpw(bytes(auth.password, 'UTF-8'), user['password']):
                exp = datetime.utcnow() + timedelta(minutes=60)
                token = encode({
                    'user': auth.username,
                    'admin': user['admin'],
                    'exp': exp
                }, app.config['SECRET_KEY'])

                return response(200, {'token': token.decode('UTF-8')})

            else:
                return response(401, 'Incorrect password.')

        else:
            return response(401, 'Incorrect username.')

    return response(401, 'Authentication required.')


@app.route('/logout', methods=['POST'])
@jwt_required
def logout():
    token = None
    if 'x-access-token' in request.headers:
        token = request.headers['x-access-token']

    if not token:
        return response(401, 'Token required.')

    blacklist.insert_one({'token': token})
    return response(200, 'Logout successful.')


@app.route('/recipes', methods=['GET'])
def get_recipes():
    page_num = 1
    if request.args.get('p'):
        page_num = int(request.args.get('p'))

    start = ITEMS_PER_PAGE * (page_num - 1)

    recipe_list = []
    results = recipes.find({}, {'title': 1, 'desc': 1, 'rating': 1, 'calories': 1}).skip(start).limit(ITEMS_PER_PAGE)
    for recipe in results:
        recipe['_id'] = str(recipe['_id'])
        recipe_list.append(recipe)
    return response(200, recipe_list)


@app.route('/recipe/<string:id>', methods=['GET'])
def get_recipe(id):
    recipe = recipes.find_one({'_id': ObjectId(id)}, {'comments': 0})

    if recipe is not None:
        recipe['_id'] = str(recipe['_id'])
        return response(200, recipe)
    else:
        return response(404, 'No recipe found')


@app.route('/recipe/<string:id>/comments', methods=['GET'])
def get_recipe_comments(id):
    result = recipes.find_one({'_id': ObjectId(id)}, {'comments': 1, '_id': 0})
    return_data = []
    for comment in result['comments']:
        comment['_id'] = str(comment['_id'])
        return_data.append(comment)
    return response(200, return_data)


if __name__ == '__main__':
    app.run(debug=True)
