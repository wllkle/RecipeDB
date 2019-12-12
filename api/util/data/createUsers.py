from pymongo import MongoClient
from bcrypt import hashpw, gensalt

client = MongoClient("mongodb://127.0.0.1:27017")
db = client.RecipeDB
users = db.users

data = [
    {
        'name': 'Rob Wilkie',
        'username': 'rob',
        'password': b'password1',
        'email': 'rob@wilkie.io',
        'admin': True
    },
    {
        'name': 'Lola the Cat',
        'username': 'lola',
        'password': b'cat',
        'email': 'lola@wilkie.io',
        'admin': False
    }
]

for new_user in data:
    new_user["password"] = hashpw(new_user["password"], gensalt())
    users.insert_one(new_user)
