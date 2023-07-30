import math

#Bottom left corner - Central Park
blc_lat = 40.76809979802234
blc_lon = -73.98184556738406

#Bottom right corner - Central Park
brc_lat = 40.7645217879644
brc_lon = -73.973058668744

#Top left corner - Central Park
tlc_lat = 40.800594570557614
tlc_lon = -73.95818349388941

#Top Right corner - Central Park
trc_lat = 40.800594570557614
trc_lon = -73.95818349388941

x = blc_lat - brc_lat
y = blc_lon - brc_lon
z = math.sqrt(x**2 + y**2)

print(f'x = {x}, y = {y}, #z = {z}')

firstz = 0.3333 * z 
secondz = 0.6667 * z 