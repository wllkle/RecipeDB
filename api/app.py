from flask import Flask, request
from flask_cors import CORS
from functools import wraps
from config import SECRET_KEY, MONGO, MONGO_INDEXES
from jwt import decode
from pymongo import MongoClient, TEXT

from util import response
from auth import login, logout, register
from recipes import get_recipe, search_recipes, new_recipe, delete_recipe, get_top_recipes
from comments import get_recipe_comments, new_recipe_comment, update_recipe_comment, delete_recipe_comment
from bookmarks import get_bookmarks, bookmark_recipe, unbookmark_recipe

app = Flask('RecipeDB')
CORS(app)

client = MongoClient(MONGO)
db = client.RecipeDB
blacklist = db.blacklist

_user = None

for index in MONGO_INDEXES:
    if index['name'] not in db.recipes.index_information():
        db.recipes.create_index([(index['field'], TEXT)], name=index['name'], default_language='english')


def jwt_required(func):
    @wraps(func)
    def jwt_required_wrapper(*args, **kwargs):
        global _user
        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']

        if not token:
            return response(401, 'Token is missing')

        try:
            _user = decode(token, SECRET_KEY)

        except:
            return response(401, 'Token is invalid.')

        bl_token = blacklist.find_one({"token": token})
        if bl_token is not None:
            return response(401, 'Token is invalid.')

        return func(*args, **kwargs)

    return jwt_required_wrapper


def jwt_optional(func):
    @wraps(func)
    def jwt_optional_wrapper(*args, **kwargs):
        global _user
        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']
        try:
            usr = decode(token, SECRET_KEY)
            bl_token = blacklist.find_one({"token": token})
            if bl_token is None:
                _user = usr
            return func(*args, **kwargs)
        except:
            return func(*args, **kwargs)

    return jwt_optional_wrapper


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


@app.route('/recipes/top', methods=['GET'])
def app_get_top_recipes():
    return get_top_recipes()


@app.route('/recipes/search', methods=['GET'])
def app_search_recipes():
    return search_recipes()


@app.route('/recipe/<string:_id>', methods=['GET'])
@jwt_optional
def app_get_recipe(_id):
    global _user
    return get_recipe(_id, _user)


@app.route('/recipe/<string:_id>', methods=['DELETE'])
@admin_required
def app_delete_recipe(_id):
    return delete_recipe(_id)


@app.route('/recipe/<string:_id>/comments', methods=['GET'])
def app_get_recipe_comments(_id):
    return get_recipe_comments(_id)


@app.route('/recipe/<string:_id>/comments', methods=['POST'])
@jwt_required
def app_new_recipe_comment(_id):
    global _user
    return new_recipe_comment(_id, _user)


@app.route('/recipe/<string:_id>/comments', methods=['PUT'])
@jwt_required
def app_update_recipe_comment(_id):
    global _user
    return update_recipe_comment(_id, _user)


@app.route('/recipe/<string:_id>/comments/<string:_cid>', methods=['DELETE'])
@jwt_required
def app_delete_recipe_comment(_id, _cid):
    global _user
    return delete_recipe_comment(_id, _cid, _user['_id'])


@app.route('/recipe/<string:_id>/bookmark', methods=['POST'])
@jwt_required
def app_bookmark_recipe(_id):
    global _user
    return bookmark_recipe(_id, _user)


@app.route('/recipe/<string:_id>/bookmark', methods=['DELETE'])
@jwt_required
def app_unbookmark_recipe(_id):
    global _user
    return unbookmark_recipe(_id, _user)


@app.route('/bookmarks', methods=['GET'])
@jwt_required
def app_get_bookmarks():
    global _user
    return get_bookmarks(_user['_id'])


@app.route('/recipes', methods=['POST'])
@admin_required
def app_new_recipe():
    return new_recipe()


if __name__ == '__main__':
    app.run(debug=True)
