
import psycopg2;
import requests;
import time;

# how to use:
# Walmart's search API doesn't include their brands so you have to do it manually.
# This script will print a list of products with empty brand fields,
# simply add any of brands you see into this script's 'list of brands' array
# then loop the script and continue adding any brands you see until the number of
# products returned from this script is zero.

# make sure you have a database in psql called 'wpm_db'
conn = psycopg2.connect("dbname=wpm_db user=wpm")
cur = conn.cursor()

# uncomment and run once if you do not have a products table
# cur.execute("CREATE TABLE products (id serial PRIMARY KEY, item_id integer, name varchar, image varchar, url varchar, brand varchar, category varchar, price real, msrp real, review_score real, review_count integer, cereal boolean, cold_cereal boolean, day integer, cereal_order integer, cold_cereal_order integer);")
# conn.commit()

list_of_brands = [
    "Kellogg's",
    "Post",
    "Cheerios",
    "Kashi",
    "Froot Loops",
    "Cinnamon Toast Crunch",
    "Lucky Charms",
    "Golden Grahams",
    "Cap'n Crunch",
    "Cookie Crisp",
    "Great Value",
    "Quaker",
    "Life",
    "Nature Valley",
    "Malt-O-Meal",
    "Total",
    "Fiber One",
    "Reese's",
    "Cocoa Puffs",
    "KixBerry",
    "All-Bran",
    "Trix",
    "Honey Bunches of Oats",
    "Kix",
    "Apple Jacks",
    "Special K",
    "Arrowhead Mills",
    "Bear Naked",
    "Cascadian Farm",
    "Honey Comb",
    ]

def main():
    continue_query = True
    counter = 1
    DAY = None;
    try:
        DAY = int(raw_input('Enter the day (number): '))
    except:
        while type(DAY) != int:
            try:
                DAY = int(raw_input('Enter the day (has to be a integer): '))
            except:
                pass
    while continue_query:
        try:
            cur.execute('SELECT * FROM products WHERE id=%s', (counter,))
            fetch_one = cur.fetchone()
            executed = False
            if fetch_one:
                for brand in list_of_brands:
                    if brand in fetch_one[2]:
                        cur.execute("UPDATE products SET brand=%s WHERE id =%s AND day=%s",
                            (brand, fetch_one[0], DAY))
                        conn.commit()
                        executed = True
                        break;
            if not executed:
                print(counter, fetch_one[2])
            counter += 1
        except:
            continue_query = False
    print('query finished')
main()
