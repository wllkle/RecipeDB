SECRET_KEY = '2c05f68c5b4b7a4088ff3561028252e95314f672ac8bcda016a9792e8dc35092'
ITEMS_PER_PAGE = 15
MONGO = 'mongodb://127.0.0.1:27017'
MONGO_INDEXES = [
    {
        'name': 'search_index',
        'field': 'title'
    }
]
