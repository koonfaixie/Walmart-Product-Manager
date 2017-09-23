# -*- coding: utf-8 -*-
# pip install psycopg2, requests ( global or virtualenv )

# Creates/updates products in search query (cold cereal and cereal)
# You can add more queries to the queries_dict but make sure to update your products table schema
# to include the query's boolean and order number (ie: cold_cereal boolean, cold_cereal_order integer)
# postgreSQL: ALTER TABLE products ADD _queryname_ boolean, _queryname_order_ integer;

import psycopg2;
import requests;
import time;

# make sure you have a database in psql called 'wpm_db'
conn = psycopg2.connect("dbname=wpm_db user=wpm")
cur = conn.cursor()

# uncomment and run once if you do not have a products table
# cur.execute("CREATE TABLE products (id serial PRIMARY KEY, item_id integer, name varchar, image varchar, url varchar, brand varchar, category varchar, price real, msrp real, review_score real, review_count integer, cereal boolean, cold_cereal boolean, day integer, cereal_order integer, cold_cereal_order integer);")
# conn.commit()

QUERIES_DICT = {
    'cereal': {'sql1': 'cereal', 'sql2': 'cereal_order'},
    'cold cereal': {'sql1': 'cold_cereal', 'sql2': 'cold_cereal_order'},
}

def log_item(item, DAY, current_query, order_count):
        item_id = item['itemId']
        item_url = item['productUrl']
        item_image = item['thumbnailImage']
        item_name = item['name']
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
            cur.execute("UPDATE products SET name=%s, image=%s, url=%s, category=%s, price=%s, msrp=%s, review_score=%s, review_count=%s,"+current_query['sql1']+"=%s, "+current_query['sql2']+"=%s WHERE id =%s AND day=%s",
                (item_name, item_image, item_url, item_category, item_price, item_msrp, item_review_score, item_review_count, True, order_count, fetch_one[0], DAY))
            conn.commit()
        else:
            cur.execute("INSERT INTO products (item_id, name, image, url, category, price, msrp, review_score, review_count, "+current_query['sql1']+", "+current_query['sql2']+", day) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
                (item_id, item_name, item_image, item_url, item_category, item_price, item_msrp, item_review_score, item_review_count, True, order_count, DAY))
            conn.commit()

def main():
    WALMART_API_URL = "http://api.walmartlabs.com/v1/search?apiKey=";
    # DEFAULT API KEY
    API_KEY = ""
    new_api_key = raw_input('Please enter your walmart api key (or press enter to use the default): ');
    if len(new_api_key) > 0:
        API_KEY = new_api_key;
    DAY = None;
    try:
        DAY = int(raw_input('Enter the day (number): '))
    except:
        while type(DAY) != int:
            try:
                DAY = int(raw_input('Enter the day (has to be a integer): '))
            except:
                pass
    QUERY = raw_input('Enter your search query: ');
    continue_query1 = True
    if QUERY in QUERIES_DICT.keys():
        current_query = QUERIES_DICT[QUERY]
    else:
        continue_query1 = False
    if continue_query1:
        products_dict = {}
        start = None;
        # In case there was an error/timeout and you want to start from a specific number
        try:
            start = int(raw_input('Enter your the number you want to start your search with: '))
        except:
            while type(start) != int:
                try:
                    start = int(raw_input('Enter your the number you want to start your search with: '))
                except:
                    pass
        error_log = []
        continue_query2 = True
        order_count = 1
        while continue_query2:
            # try:
            r = requests.get(WALMART_API_URL+API_KEY+'&query='+QUERY+'&numItems=25&start='+str(start));
            # limited to 5 requests per second.
            time.sleep(0.2)
            rjson = r.json()
            for item in rjson['items']:
                item_id = item['itemId']
                item_url = item['productUrl']
                try:
                    # avoids repeats of items in query
                    if products_dict[item_id]:
                        # counter for all of the duplicates
                        products_dict[item_id] = products_dict[item_id]+1;
                except:
                    # only new items will have their order count updated
                    log_item(item, DAY, current_query, order_count)
                    products_dict[item_id] = 1;
                    order_count += 1;
            if len(rjson['items']) < 25:
                continue_query2 = False;
            print(start, 'completed', order_count)
            start += 1;
            # except:
            #     error_log.append({'query': QUERY, 'start': start});
            #     print(start, 'error', order_count)
            #     start += 1;
        print('query finished', 'errors: ', error_log, products_dict)
main()
