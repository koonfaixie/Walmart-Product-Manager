# Walmart Product Manager
This application is written in Javascript using Nodejs/Express, Reactjs/Redux, and PostgreSQL
Python 2.7 was used for collecting product information from Walmart's Search API

To run this application, begin by cloning this repository

Requirements:
  * Nodejs and npm,
  * Python 2.7 or higher and pip
  * PostgreSQL

On your terminal 'cd' to the root directory of this application and run:

    npm install

it should take a few minutes for the node packages to download.

After you've finished downloading the necessary packages, you're going to need to configure
your PostgreSQL.

if your PostgreSQL server is not running:

	pg_ctl -D /usr/local/var/postgres start && brew services start postgresql

configure psql:

  >$ createuser wpm --createdb
  >
  >$ createdb wpm_db -U wpm
  >
  >$ psql wpm_db -U wpm
  >
  >wpm_db=> CREATE TABLE products (id serial PRIMARY KEY, item_id integer, name varchar, url varchar, brand varchar, category varchar, price real, msrp real, review_score real, review_count integer, cereal boolean, cold_cereal boolean, day integer, cereal_order integer, cold_cereal_order integer, image varchar);
  >
  >wpm_db=> \COPY products (id,item_id,name,url,brand,category,price,msrp,review_score,review_count,cereal,cold_cereal,day,cereal_order,cold_cereal_order,image) FROM 'products-day2.csv' DELIMITER ',' CSV HEADER;


run and explore on localhost:3000 :

  	node app


Application preview:

![WPM img]()

***
# How to use application/ Application features:
***

  * Enter search keyword in the search input box below 'Walmart Product Manager', to obtain
  database. The time range is in days, and you can change it by clicking the dropdown select option next to 'Day'.

  * If the search keyword you entered in the search input is not in the list of keywords (ie: not 'cereal' or 'cold cereal'), you'll get all of the products back from the database.

  * If you want to filter your search results, you can click on the light-green '+' icon and a modal will pop up and ask for either a brand or keyword filter input. You can filter by brand or keyword. You can also apply both types or multiple filters of one type as well.
    * Note - if you apply more than one of the same filter type, for example two brand filters - like Cheerios and Kellogg's, then the results for Cheerios and Kellogg's will be combined. Same goes for keywords. However when applying both keywords and brands the opposite happens. Only results that match both the keyword and brand will be filtered. (things get messy if you apply more than two filters for both filter type)
    * Filtering is good for when you want to refine your results, or when you want to know how many products of a specific brand or type there is in your results.

  * If you want to sort by product name, price or review scores, you can do so by clicking on the table header. Default sort is by 'Relevance'.

  * You have to option to skip to certain pages and results, as well as the option to move the next or previous page by clicking on the caret buttons next the the page input.

  * You can edit the brand's name of a product by clicking on the name td. An input box will appear and you will get suggestions based on what you type. Click save to have the brand saved to the database or cancel to forget the changes.

  * You can click on the popup icon next to the product's name to view the product in a new tab.

  * You can save or share your results by copying the url address. If you revisit the url, it will pick up off where you left (filters, sort, query, day are all saved in the url).

  * The results information above the page input shows the filtered results count as well as the total result count (in parenthesis).


***
# Data collected:
***

#### Day: One

Search Term: Cereal

    Cheerios:
      a. 35/1090 or 3.21%
      b. 1/3 or 33.3%

    Kashi:
      a. 37/1090 or 3.39%
      b. 0/3 or 0%

    Kellogg's:
      a. 123/1090 or 11.28%
      b. 0/3 or 0%

    Post:
      a. 36/1090 or 3.3%
      b. 0/3 or 0%


Search Term: Cold Cereal

    Cheerios:
      a. 31/1071 or 2.89%
      b. 0/3 or 0%

    Kashi:
      a. 41/1071 or 3.82%
      b. 0/3 or 0%

    Kellogg's:
      a. 128/1071 or 11.95%
      b. 0/3 or 0%

    Post:
      a. 35/1071 or 3.26%
      b. 0/3 or 0%


#### Day: Two

Search Term: Cereal

    Cheerios:
      a. 35/1112 or 3.15%
      b. 1/3 or 33.3%

    Kashi:
      a. 36/1112 or 3.24%
      b. 0/3 or 0%

    Kellogg's:
      a. 133/1112 or 11.96%
      b. 0/3 or 0%

    Post:
      a. 36/1112 or 3.24%
      b. 0/3 or 0%


Search Term: Cold Cereal

    Cheerios:
      a. 31/1069 or 2.9%
      b. 0/3 or 0%

    Kashi:
      a. 39/1069 or 3.65%
      b. 0/3 or 0%

    Kellogg's:
      a. 132/1069 or 12.35%
      b. 0/3 or 0%

    Post:
      a. 35/1069 or 3.27%
      b. 0/3 or 0%
