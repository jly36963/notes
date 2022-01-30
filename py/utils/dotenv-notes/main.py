import os
from dotenv import load_dotenv


def main():
    """
    Load .env file into environment
    """
    # Determine if development or production
    dev = os.getenv('PYTHON_ENV') != 'production'
    path = './dev.env' if dev else './.env'
    # Load .env into environment
    load_dotenv(
        dotenv_path=path,
        verbose=True
    )
    # Use env vars
    print(os.getenv('API_TOKEN'))


if __name__ == '__main__':
    main()
