from flask import Flask, request, jsonify
from flask_cors import CORS
from functools import wraps
from config import SECRET_KEY, MONGO
from jwt import decode
from pymongo import MongoClient

from util import response
from auth import login, logout, register
from recipes import get_recipes, get_recipe, get_recipe_comments, new_recipe_comment, delete_recipe_comment, get_top_recipes

app = Flask('RecipeDB')
CORS(app)

client = MongoClient(MONGO)
db = client.RecipeDB
blacklist = db.blacklist

_user = None


# gets total count of items in a collection
# accidents.count_documents({}, None)


def jwt_required(func):
    @wraps(func)
    def jwt_required_wrapper(*args, **kwargs):  #
        global _user
        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']

        if not token:
            return jsonify({'message': 'Token is missing'}), 401

        try:
            _user = decode(token, SECRET_KEY)

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
        data = decode(token, SECRET_KEY)
        if data["admin"]:
            return func(*args, **kwargs)

        else:
            return response(401, 'Admin required')

    return admin_required_wrapper


@app.route('/login', methods=['POST'])
def app_login():
    return login()


@app.route('/logout', methods=['POST'])
@jwt_required
def app_logout():
    return logout()


@app.route('/register', methods=['POST'])
def app_register():
    return register()


@app.route('/recipes', methods=['GET'])
def recipes():
    return get_recipes()


@app.route('/recipes/top', methods=['GET'])
def top_recipes():
    return get_top_recipes()


@app.route('/recipe/<string:_id>', methods=['GET'])
def recipe(_id):
    return get_recipe(_id)


@app.route('/recipe/<string:_id>/comments', methods=['GET'])
def recipe_comments(_id):
    return get_recipe_comments(_id)


@app.route('/recipe/<string:_id>/comments', methods=['POST'])
@jwt_required
def new_comment(_id):
    global _user
    return new_recipe_comment(_id, _user)


@app.route('/recipe/<string:_id>/comments/<string:_cid>', methods=['DELETE'])
@jwt_required
def delete_comment(_id, _cid):
    global _user
    return delete_recipe_comment(_id, _cid, _user['_id'])


if __name__ == '__main__':
    app.run(debug=True, port=1234)
