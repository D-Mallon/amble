import sys
def application(environ, start_response):
    response_body = 'mod_wsgi Python version: {}'.format(sys.version)
    response_headers = [('Content-Type', 'text/plain'),
                        ('Content-Length', str(len(response_body)))]
    start_response('200 OK', response_headers)
    return [response_body.encode()]
