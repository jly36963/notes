# imports
from dotenv import load_dotenv

# load dotenv
load_dotenv(verbose=True)

# use env vars
print(os.getenv('API_TOKEN'))
