from pymongo import MongoClient
from bson import ObjectId

client = MongoClient("mongodb://127.0.0.1:27017")
db = client.RecipeDB
users = db.users
recipes = db.recipes

comment = recipes.find_one({'comments._id': ObjectId('5dfae6e251a429fc832cd161')}, {'_id': 1, 'comments.$': 1})
print(comment['_id'])
