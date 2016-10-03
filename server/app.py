
import json
import argparse
from server import server, config

# parse command line arguments
parser = argparse.ArgumentParser(description='Process some integers.')

parser.add_argument('-c', '--config', default=config.cfg_file,
                    help='config file')

args = parser.parse_args()

# load config data from specified file
with open(args.config) as f:
    config_data = json.load(f)

# set the data in config
config.data = config_data

# run the server!!
if __name__ == '__main__':
    server.run()
