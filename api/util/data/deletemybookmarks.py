from pymongo import MongoClient
from bson import ObjectId

client = MongoClient("mongodb://127.0.0.1:27017")
db = client.RecipeDB
users = db.users

users.update_one({'_id': ObjectId('5df419c2cf0d96d5a135acd2')}, {
    '$set': {
        'bookmarks': []
    }
})
