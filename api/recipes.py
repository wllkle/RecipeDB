from flask import request
from pymongo import MongoClient
from config import ITEMS_PER_PAGE, MONGO, HEADERS
from bson import ObjectId
from datetime import datetime
from random import shuffle, randrange
from bs4 import BeautifulSoup
from requests import get
from math import ceil

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
                if len(user['bookmarks']) > 0:
                    for bookmark in user['bookmarks']:
                        if bookmark['recipeId'] == _id:
                            recipe['bookmarked'] = True
                if recipe.get('bookmarked') is None:
                    recipe['bookmarked'] = False
        return response(200, recipe)
    else:
        return response(404, 'No recipe found')


# unused endpoint
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
        if request.args.get('p'):
            page_num = int(request.args.get('p'))

        total = recipes.count_documents({'title': {'$regex': criteria, "$options": "-i"}}, None)

        page_count = ceil(total / ITEMS_PER_PAGE)

        if page_num > page_count:
            page_num = page_count

        start = ITEMS_PER_PAGE * (page_num - 1)
        if start < 0:
            start = 0

        recipe_list = []
        for r in recipes.find({'title': {'$regex': criteria, "$options": "-i"}},
                              {'title': 1, 'desc': 1, 'rating': 1, 'calories': 1}).skip(start).limit(ITEMS_PER_PAGE):
            r['_id'] = str(r['_id'])
            r['desc'] = trim(r['desc'], 160)
            recipe_list.append(r)

        return response(200, {
            'data': recipe_list,
            'page': page_num,
            'pageCount': page_count,
            'perPage': ITEMS_PER_PAGE,
            'total': total
        })
    else:
        return response(400, 'No search criteria provided.')


def new_recipe():
    url = request.form['url']
    if 'bbcgoodfood.com' not in url:
        return response(400, 'Not a BBC link.')

    if url is not None:
        data = get(url, headers=HEADERS)
        soup = BeautifulSoup(data.content, 'html.parser')

        recipe = {
            '_id': ObjectId(),
            'title': soup.find(class_='recipe-header__title').getText(),
            'desc': soup.find(class_='recipe-header__description').getText(),
            'comments': [],
            'rating': randrange(2, 5),
            'categories': []
        }

        for i in soup.find(class_='nutrition'):
            label = i.find(class_='nutrition__label').getText()
            value = i.find(class_='nutrition__value').getText().replace('g', '')
            if label == 'fat':
                recipe['fat'] = value
            elif label == 'protein':
                recipe['protein'] = value
            elif label == 'salt':
                # 5g salt = 2000mg sodium (* 400)
                recipe['sodium'] = round(float(value) * 400)
            elif label == 'kcal':
                recipe['calories'] = value

        ingredients = []
        for i in soup.find(class_='ingredients-list__group'):
            ingredients.append(i.getText())
        recipe['ingredients'] = ingredients

        directions = []
        for i in soup.find(class_='method__list'):
            directions.append(i.getText())
        recipe['directions'] = directions
        recipes.insert_one(recipe)
        return response(200, {'inserted': str(recipe['_id'])})

    else:
        return response(400, 'No suitable url provided.')


def delete_recipe(_id):
    recipes.delete_one({'_id': ObjectId(_id)})
    return response(200, 'Recipe deleted.')
