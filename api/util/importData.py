import json
from pymongo import MongoClient

client = MongoClient('mongodb://127.0.0.1:27017')
db = client.RecipeDB
recipes = db.recipes

mongo_data = []

with open('../../data/full_format_recipes.json') as file:
    content = json.load(file)
    di = True
    for recipe in content:
        desc = recipe.get('desc')
        calories = recipe.get('calories')
        fat = recipe.get('fat')
        protein = recipe.get('protein')
        sodium = recipe.get('sodium')

        if desc and sodium and fat and calories and protein:
            recipe['comments'] = []
            recipe['title'] = recipe.get('title').strip()

            if len(recipe['directions']) == 1:
                directions = recipe['directions'][0]
                recipe['directions'] = directions.split('. ')

            mongo_data.append(recipe)

recipes.insert_many(mongo_data)

print(f'{len(content) - len(mongo_data)} items removed due to insufficient data.')
