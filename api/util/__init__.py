from flask import make_response, jsonify


def response(status_code, data):
    if isinstance(data, str):
        if 199 < status_code < 300:
            data = {'message': data}
        else:
            data = {'error': data}
    return make_response(jsonify(data), status_code)


def trim(value, length):
    return (value[:length + 2] + '..') if len(value) > length else value
