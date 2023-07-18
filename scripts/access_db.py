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

# Execute a SQL query to select data
query = "SELECT * FROM users_nodes"
cursor.execute(query)

results = cursor.fetchall() # Fetch the results

# Close the cursor and database connection
cursor.close()
conn.close()

for r in results:
    if r[2] == 'park':
        print(r[1])

# from users.models import Nodes

# # Retrieve selected records from the model
# filtered_data = Nodes.objects.filter(type='walking_nodes')

# for item in filtered_data:
#     print(item)








