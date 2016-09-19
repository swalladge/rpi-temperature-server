# utility standalone functions to be used throughout the server

import datetime
import math


def now(integer=False):
    """ returns the current utc timestamp - optionally as an int"""
    if integer:
        return round(datetime.datetime.utcnow().timestamp())
    else:
        return datetime.datetime.utcnow().timestamp()

def validate_bounds(lower, upper):

    # make sure we have valid numbers
    lower = math.ceil(float(lower))
    upper = int(float(upper))

    # lower bound should not be greater than upper bound
    assert lower <= upper

    # sensible values
    assert lower >= 0
    assert upper >= 0

    return (lower, upper)
