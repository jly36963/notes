import os
from src.examples import (
    basic_constructor,
    basic_csv,
    basic_json,
    basic_df_concat,
    basic_df_attributes,
    basic_df_conversion,
    basic_df_indexing,
    basic_column_assignment,
    basic_column_mapping,
    basic_df_descriptive_methods,
    basic_df_methods,
    basic_column_aggregations,
)


dev = os.getenv('PYTHON_ENV') != 'production'


def main():
    # Construction
    print('Basic Constructor example')
    basic_constructor()
    print('Basic CSV example')
    basic_csv()
    print('Basic JSON example')
    basic_json()
    print('Basic concat example')
    basic_df_concat()
    print('Basic df attributes example')
    basic_df_attributes()
    print('Basic df conversion example')
    basic_df_conversion()
    print('Basic df indexing example')
    basic_df_indexing()
    print('Basic column assignment example')
    basic_column_assignment()
    print('Basic column mapping example')
    basic_column_mapping()
    print('Basic df descriptive methods example')
    basic_df_descriptive_methods()
    print('Basic df methods example')
    basic_df_methods()
    print('Basic column aggregations example')
    basic_column_aggregations()


if __name__ == "__main__":
    main()
