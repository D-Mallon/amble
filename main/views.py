<<<<<<< Updated upstream
from django.shortcuts import render
from django.conf import settings

from .mixins import Directions
print("CHECK 1")
'''Basic view for routing '''
def route(request):
	context = {"google_api_key": settings.GOOGLE_API_KEY}
	return render(request, 'main/route.html', context)

'''Basic view for displaying a map '''
def map(request):
	lat_a = request.GET.get("lat_a")
	long_a = request.GET.get("long_a")
	lat_wp1 = request.GET.get("lat_wp1")
	long_wp1 = request.GET.get("long_wp1")
	lat_wp2 = request.GET.get("lat_wp2")
	long_wp2 = request.GET.get("long_wp2")
	lat_wp3 = request.GET.get("lat_wp3")
	long_wp3 = request.GET.get("long_wp3")
	lat_b = request.GET.get("lat_b")
	long_b = request.GET.get("long_b")
	directions = Directions(
		lat_a = lat_a,
		long_a =long_a,
		lat_wp1 = lat_wp1,
		long_wp1 =long_wp1,
		lat_wp2 = lat_wp2,
		long_wp2 =long_wp2,
		lat_wp3 = lat_wp3,
		long_wp3 = long_wp3,
		lat_b = lat_b,
		long_b = long_b
		)
	
	context = {
	"google_api_key": settings.GOOGLE_API_KEY,
	"lat_a": lat_a,
	"long_a": long_a,
	"lat_wp1" : lat_wp1,
	"long_wp1" : long_wp1,
	"lat_wp2" : lat_wp2,
	"long_wp2" : long_wp2,
	"lat_wp3" : lat_wp3,
	"long_wp3" : long_wp3,
	"lat_b": lat_b,
	"long_b": long_b,
	"origin": f'{lat_a}, {long_a}',
	"destination": f'{lat_b}, {long_b}',
	"directions": directions,
	}
	return render(request, 'main/map.html', context)
=======
from django.shortcuts import render
from django.conf import settings

from .mixins import Directions
print("CHECK 1")
'''Basic view for routing '''
def route(request):
	context = {"google_api_key": settings.GOOGLE_API_KEY}
	return render(request, 'main/route.html', context)

'''Basic view for displaying a map '''
def map(request):
	lat_a = request.GET.get("lat_a")
	long_a = request.GET.get("long_a")
	lat_wp1 = request.GET.get("lat_wp1")
	long_wp1 = request.GET.get("long_wp1")
	lat_wp2 = request.GET.get("lat_wp2")
	long_wp2 = request.GET.get("long_wp2")
	lat_wp3 = request.GET.get("lat_wp3")
	long_wp3 = request.GET.get("long_wp3")
	lat_b = request.GET.get("lat_b")
	long_b = request.GET.get("long_b")
	directions = Directions(
		lat_a = lat_a,
		long_a =long_a,
		lat_wp1 = lat_wp1,
		long_wp1 =long_wp1,
		lat_wp2 = lat_wp2,
		long_wp2 =long_wp2,
		lat_wp3 = lat_wp3,
		long_wp3 = long_wp3,
		lat_b = lat_b,
		long_b = long_b
		)
	
	context = {
	"google_api_key": settings.GOOGLE_API_KEY,
	"lat_a": lat_a,
	"long_a": long_a,
	"lat_wp1" : lat_wp1,
	"long_wp1" : long_wp1,
	"lat_wp2" : lat_wp2,
	"long_wp2" : long_wp2,
	"lat_wp3" : lat_wp3,
	"long_wp3" : long_wp3,
	"lat_b": lat_b,
	"long_b": long_b,
	"origin": f'{lat_a}, {long_a}',
	"destination": f'{lat_b}, {long_b}',
	"directions": directions,
	}
	return render(request, 'main/map.html', context)
>>>>>>> Stashed changes
