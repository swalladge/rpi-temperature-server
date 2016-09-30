# utility standalone functions to be used throughout the server

import time
import math


def now(integer=False):
    """ returns the current utc timestamp - optionally as an int"""
    if integer:
        return round(time.time())
    else:
        return time.time()

def validate_bounds(lower, upper):

    if upper is None:
        upper = now(True)

    if lower is None:
        lower = 0

    # make sure we have valid numbers
    lower = math.ceil(float(lower))
    upper = int(float(upper))

    # sensible values
    if lower < 0 or upper < 0:
        raise ValueError('values must not be negative')

    return (lower, upper)
