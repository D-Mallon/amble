import psycopg2

#Set up environmental variables
from dotenv import load_dotenv
import os
load_dotenv()

# Establish a connection to PostgreSQL
conn = psycopg2.connect(
    host='127.0.0.1',
    database= os.environ.get('DATABASE_NAME'),
    user=os.environ.get('DATABASE_USER'),
    password=os.environ.get('DATABASE_PASS'),
)
cursor = conn.cursor() # Create a cursor object to execute SQL queries

# # Execute some sample SQL queries to select data
# query = "SELECT * FROM users_nodes WHERE type = 'park' and name != 'Unknown Park'"
# cursor.execute(query)
# results = cursor.fetchall() # Fetch the results

# query2 = "SELECT * FROM public.users_nodes WHERE wheelchair_accessible = 'yes' and type = 'library'"
# cursor.execute(query2)
# results2 = cursor.fetchall() # Fetch the results

# query3 = "SELECT * FROM public.users_userpref"
# cursor.execute(query3)
# results3 = cursor.fetchall() # Fetch the results

query4 = "SELECT * FROM public.users_user"
cursor.execute(query4)
results4 = cursor.fetchall() # Fetch the results

# Close the cursor and database connection
cursor.close()
conn.close()

# Print Queries
# print('\n------------------ Query 1 ------------------------------\n')
# for r in results:
#     print(r[1])
# print('\n------------------ Query 2 ------------------------------\n')
# for r in results2:
#     print(r[1])
# print('\n------------------ Query 3 ------------------------------\n')
# for r in results3:
#     print(r[1])
print('\n------------------ Query 4 ------------------------------\n')
for r in results4:
    print(f'Password = {r[3]} : Username = {r[5]}')

# username = '1@gmail.com'
# password = 'xxxx'

def checklogin (username,password):
    check = False
    for r in results4:
        if r[3] == str(password) and r[5] == str(username):
            check = True
            print(f'There is a match so {check}')
            return check
    print(f'This is from access_db = {check}')   
    return check

# username = '2@gmail.com'
# password = 'xxxx'

# checklogin(username,password)








