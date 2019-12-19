from pymongo import MongoClient
from config import MONGO
from bson import ObjectId

from util import response, trim

client = MongoClient(MONGO)
db = client.RecipeDB
recipes = db.recipes
users = db.users


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


def get_bookmarks(_id):
    result = users.find_one({'_id': ObjectId(_id)}, {'bookmarks': 1})
    bookmark_list = []
    for bookmark in result['bookmarks']:
        r = recipes.find_one({'_id': ObjectId(bookmark['recipeId'])},
                             {'title': 1, 'desc': 1, 'rating': 1, 'calories': 1})
        if r is not None:
            r['_id'] = str(r['_id'])
            r['desc'] = trim(r['desc'], 160)
            bookmark_list.append(r)
        else:
            users.update_one({'_id': ObjectId(_id)}, {'$pull': {'bookmarks': {'_id': bookmark['_id']}}})
    return response(200, bookmark_list)
