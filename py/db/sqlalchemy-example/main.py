from dotenv import load_dotenv

from utils.pg import PostgresDAL


def main():
    load_dotenv(verbose=True)
    pg_dal = PostgresDAL()

    pg_dal.insert_ninja(ninja={"first_name": "Kakashi", "last_name": "Hatake"})
    ninja = pg_dal.get_ninja(ninja_id=1)
    pg_dal.update_ninja(
        ninja_id=1,
        updates={
            "first_name": "Kaka",
            "last_name": "Sensei",
        },
    )
    pg_dal.insert_jutsu(
        jutsu={
            "name": "Chidori",
            "chakra_nature": "Lightning",
            "description": "Lightning blade",
        }
    )
    jutsu = pg_dal.get_jutsu(jutsu_id=1)
    pg_dal.update_jutsu(jutsu_id=1, updates={"description": "A thousand birds"})
    pg_dal.add_known_jutsu(ninja_id=1, jutsu_id=1)
    ninja_with_related_jutsu = pg_dal.get_ninja_with_related_jutsu(ninja_id=1)
    jutsu_with_related_ninja = pg_dal.get_jutsu_with_related_ninja(jutsu_id=1)

    print(
        "ninja",
        ninja,
        "jutsu",
        jutsu,
        "ninja_with_related_jutsu",
        ninja_with_related_jutsu,
        "jutsu_with_related_ninja",
        jutsu_with_related_ninja,
        sep="\n\n",
    )


main()
