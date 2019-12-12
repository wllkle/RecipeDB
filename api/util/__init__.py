from flask import jsonify, make_response


def response(status_code, data):
    if isinstance(data, str):
        if status_code is not 200:
            data = {'error': data}

        else:
            data = {'message': data}

    return make_response(jsonify(data), status_code)


def trim(value, length):
    return (value[:length + 2] + '..') if len(value) > length else value
