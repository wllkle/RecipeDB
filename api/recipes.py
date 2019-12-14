from flask import request
from pymongo import MongoClient
from config import ITEMS_PER_PAGE, MONGO
from bson import ObjectId
from datetime import datetime
from random import shuffle

from util import response, trim

client = MongoClient(MONGO)
db = client.RecipeDB
recipes = db.recipes
users = db.users


def get_recipe(_id, _user):
    recipe = recipes.find_one({'_id': ObjectId(_id)}, {'comments': 0})
    if recipe is not None:
        recipe['_id'] = str(recipe['_id'])
        if _user is not None:
            user = users.find_one({'_id': ObjectId(_user['_id'])}, {'bookmarks': 1})
            if user is not None:
                for bookmark in user['bookmarks']:
                    if bookmark['recipeId'] == _id:
                        recipe['bookmarked'] = True
        if recipe.get('bookmarked') is None:
            recipe['bookmarked'] = False
        return response(200, recipe)
    else:
        return response(404, 'No recipe found')


def get_recipes():
    page_num = 1
    if request.args.get('p'):
        page_num = int(request.args.get('p'))

    start = ITEMS_PER_PAGE * (page_num - 1)

    recipe_list = []
    results = recipes.find({}, {'title': 1, 'desc': 1, 'rating': 1, 'calories': 1}).skip(start).limit(ITEMS_PER_PAGE)
    for recipe in results:
        recipe['_id'] = str(recipe['_id'])
        recipe['desc'] = trim(recipe['desc'], 160)
        recipe_list.append(recipe)
    return response(200, recipe_list)


def get_recipe_comments(_id):
    result = recipes.find_one({'_id': ObjectId(_id)}, {'comments': 1, '_id': 0})
    return_data = []
    for comment in result['comments']:
        comment['_id'] = str(comment['_id'])
        return_data.append(comment)
    return response(200, return_data)


def new_recipe_comment(_id, user):
    comment = {
        '_id': ObjectId(),
        'user_id': user['_id'],
        'user_name': user['username'],
        'body': request.form['body'],
        'date': datetime.utcnow()
    }
    recipes.update_one({'_id': ObjectId(_id)}, {'$push': {'comments': comment}})
    return get_recipe_comments(_id)


def delete_recipe_comment(_id, _cid, user_id):
    result = recipes.find_one({'comments._id': ObjectId(_cid)}, {'comments.$': 1, '_id': 0})
    if result is not None:
        result = result['comments']
        if len(result) == 1:
            result = result[0]
            if result['user_id'] == user_id:
                recipes.update_one({'_id': ObjectId(_id)}, {'$pull': {'comments': {'_id': ObjectId(_cid)}}})
                return get_recipe_comments(_id)
            else:
                return response(403, 'This is not your comment to delete.')

    return response(404, 'No item found')


def get_top_recipes():
    results = recipes.find({'rating': 5}, {'title': 1, 'desc': 1, 'rating': 1, 'calories': 1}).limit(100)
    recipe_list = []
    for recipe in results:
        recipe['_id'] = str(recipe['_id'])
        recipe['desc'] = trim(recipe['desc'], 160)
        recipe_list.append(recipe)
    shuffle(recipe_list)
    return response(200, recipe_list[:6])


def search_recipes():
    criteria = str(request.args.get('criteria'))
    if len(criteria) != 0:
        page_num = 1

        start = ITEMS_PER_PAGE * (page_num - 1)
        recipe_list = []
        for r in recipes.find({'title': {'$regex': criteria, "$options": "-i"}},
                              {'title': 1, 'desc': 1, 'rating': 1, 'calories': 1}).skip(start).limit(ITEMS_PER_PAGE):
            r['_id'] = str(r['_id'])
            recipe_list.append(r)

        return response(200, recipe_list)
    else:
        return response(400, 'No search criteria provided.')


def bookmark_recipe(_id, _user):
    user = users.find_one({'_id': ObjectId(_user['_id'])}, {'bookmarks': 1})
    for bookmark in user['bookmarks']:
        if bookmark['recipeId'] == _id:
            return response(202, 'This recipe is already in your bookmarks.')
    bookmark = {
        '_id': ObjectId(),
        'recipeId': _id
    }
    users.update_one({'_id': ObjectId(_user['_id'])}, {'$push': {'bookmarks': bookmark}})
    return response(200, 'Bookmark added.')


def unbookmark_recipe(_id, _user):
    user = users.find_one({'_id': ObjectId(_user['_id'])}, {'bookmarks': 1})
    i = 0
    removed = False
    while i < len(user['bookmarks']):
        bookmark = user['bookmarks'][i]
        if str(bookmark['recipeId']) == _id:
            users.update_one({'_id': ObjectId(_user['_id'])}, {'$pull': {'bookmarks': {'_id': bookmark['_id']}}})
            removed = True

        if i + 1 == len(user['bookmarks']):
            if removed:
                return response(200, 'Bookmark removed.')
            else:
                return response(202, 'Not bookmarked.')
        i += 1
    return response(202, 'Recipe not bookmarked.')


def bookmarks(_id):
    result = users.find_one({'_id': ObjectId(_id)}, {'bookmarks': 1})
    bookmark_list = []
    for bookmark in result['bookmarks']:
        r = recipes.find_one({'_id': ObjectId(bookmark['recipeId'])},
                             {'title': 1, 'desc': 1, 'rating': 1, 'calories': 1})
        r['_id'] = str(r['_id'])
        bookmark_list.append(r)
    return response(200, bookmark_list)
