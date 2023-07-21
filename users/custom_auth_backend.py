from django.contrib.auth.backends import ModelBackend

class CustomModelBackend(ModelBackend):
    def authenticate(self, request, email=None, password=None, **kwargs):

        # Implement the authentication logic here using your custom User model
        from .models import User  # Import your custom User model
        print('Imported User')
        try:
            print('Entered Try')
            user = User.objects.get(email=email)  # Assuming email is the unique identifier
            print('Got email')
            if user.check_password(password):
                print('checked password')
                return user
                
            else:
                print('Did not check password')
                return None
                
        except User.DoesNotExist:
            print('Did not complete try')
            return None