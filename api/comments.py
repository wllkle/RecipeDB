from flask import request
from pymongo import MongoClient
from config import MONGO
from bson import ObjectId
from datetime import datetime

from util import response

client = MongoClient(MONGO)
db = client.RecipeDB
recipes = db.recipes


def get_recipe_comments(_id):
    result = recipes.find_one({'_id': ObjectId(_id)}, {'comments': 1, '_id': 0})
    return_data = []
    if result is not None:
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


def update_recipe_comment(_id, _user):
    try:
        current_comment = recipes.find_one({'comments._id': ObjectId(_id)}, {'_id': 1, 'comments.$': 1})
        if _user['_id'] != current_comment['comments'][0]['user_id']:
            return response(400, 'This is not your comment to update.')
    except:
        return response(400, 'No comment found.')

    updated_comment = {
        'comments.$.user_id': current_comment['comments'][0]['user_id'],
        'comments.$.body': request.form['body'],
        'comments.$.date': datetime.utcnow()
    }
    recipes.update_one({'comments._id': ObjectId(_id)}, {'$set': updated_comment})
    return get_recipe_comments(current_comment['_id'])


def delete_recipe_comment(_id, user_id):
    result = recipes.find_one({'comments._id': ObjectId(_id)}, {'comments.$': 1, '_id': 1})
    if result is not None:
        recipe_id = str(result['_id'])
        print(recipe_id)
        result = result['comments']
        if len(result) == 1:
            result = result[0]
            if result['user_id'] == user_id:
                recipes.update_one({'_id': ObjectId(recipe_id)}, {'$pull': {'comments': {'_id': ObjectId(result['_id'])}}})
                return get_recipe_comments(recipe_id)
            else:
                return response(403, 'This is not your comment to delete.')

    return response(404, 'No item found')
