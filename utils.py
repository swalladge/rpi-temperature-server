# utility standalone functions to be used throughout the server

import time
import math
import utils


def now(integer=False):
    """ returns the current utc timestamp - optionally as an int"""
    if integer:
        return round(time.time())
    else:
        return time.time()

def validate_bounds(lower, upper):

    if upper is None:
        upper = utils.now(True)

    if lower is None:
        lower = 0

    # make sure we have valid numbers
    lower = math.ceil(float(lower))
    upper = int(float(upper))

    # sensible values
    assert lower >= 0
    assert upper >= 0

    return (lower, upper)
