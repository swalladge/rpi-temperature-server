# utility standalone functions to be used throughout the server

import datetime


def now(integer=False):
    """ returns the current utc timestamp - optionally as an int"""
    if integer:
        return round(datetime.datetime.utcnow().timestamp())
    else:
        return datetime.datetime.utcnow().timestamp()
