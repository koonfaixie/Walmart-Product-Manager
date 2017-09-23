# -*- coding: utf-8 -*-
# pip install psycopg2, requests ( global or virtualenv )

# Purpose of script is to search and log the brand field of a queried product to the BRAND input,
# since it doesn't look like theres any other way to correctly obtain the product's brand name from the api

# Sample use:
# inputs = (API_KEY, BRAND, DAY) - (#####, 'Cheerios', 1)
# use's walmart api to search for any products with 'cheerios' in the name
# logs all of the data to database, updates product if it already exists
# specific to the DAY value

import psycopg2;
import requests;
import time;

# make sure you have a database in psql called 'wpm_db'
conn = psycopg2.connect("dbname=wpm_db user=wpm")
cur = conn.cursor()

# uncomment and run once if you do not have a products table
# cur.execute("CREATE TABLE products (id serial PRIMARY KEY, item_id integer, name varchar, image varchar, url varchar, brand varchar, category varchar, price real, msrp real, review_score real, review_count integer, cereal boolean, cold_cereal boolean, day integer, cereal_order integer, cold_cereal_order integer);")
# conn.commit()


def log_item(item, DAY, BRAND):
    item_id = item['itemId']
    item_image = item['thumbnailImage']
    item_name = item['name']
    item_url = item['productUrl']
    item_category = item['categoryPath'].replace('/', ' > ')
    item_price = item['salePrice']
    try:
        item_msrp = item['msrp']
    except:
        item_msrp = None
    try:
        item_review_score = item['customerRating']
    except:
        item_review_score = None
    try:
        item_review_count = item['numReviews']
    except:
        item_review_count = None
    cur.execute('SELECT * FROM products WHERE item_id = %s AND day=%s;', (item_id, DAY,) )
    fetch_one = cur.fetchone()
    if fetch_one:
        count = 1
        cur.execute("UPDATE products SET brand=%s WHERE id =%s AND day=%s",
            (BRAND, fetch_one[0], DAY))
        conn.commit()
    else:
        cur.execute("INSERT INTO products (item_id, name, image, url, brand, category, price, msrp, review_score, review_count, day) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
            (item_id, item_name, item_image, item_url, BRAND, item_category, item_price, item_msrp, item_review_score, item_review_count, DAY))
        conn.commit()

def main():
    WALMART_API_URL = "http://api.walmartlabs.com/v1/search?apiKey=";
    # Default API_KEY
    API_KEY = ""
    new_api_key = raw_input('Please enter your walmart api key (or press enter to use default): ');
    if len(new_api_key) > 0:
        API_KEY = new_api_key;
    print("""

    Walmart Product Fetcher

    Brand input must be the brand name.

    """);
    BRAND = raw_input("Please enter the brand's name: ");
    DAY = None;
    try:
        DAY = int(raw_input('Enter the day (number): '))
    except:
        while type(DAY) != int:
            try:
                DAY = int(raw_input('Enter the day (has to be a integer): '))
            except:
                pass
    start = 1;
    error_log = []
    continue_query = True
    while continue_query:
        try:
            r = requests.get(WALMART_API_URL+API_KEY+'&query='+BRAND+'&numItems=25&start='+str(start));
            # limited to 5 requests per second.
            time.sleep(0.2)
            rjson = r.json()
            for item in rjson['items']:
                log_item(item, DAY, BRAND)
            if len(rjson['items']) < 25:
                continue_query = False;
            print(start, 'completed')
            start += 1;
        except:
            error_log.append({'brand': BRAND, 'start': start});
            print(start, 'error')
            start += 1;
    print('query finished', 'errors: ', error_log)
main()
