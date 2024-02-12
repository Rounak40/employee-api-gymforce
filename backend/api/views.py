import json

from django.core.serializers import serialize

from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.authtoken.models import Token
from rest_framework import status
from django.contrib.auth.models import User
from .models import Employees

from rest_framework.response import Response
from rest_framework.views import APIView    
from rest_framework.permissions import IsAuthenticated
from rest_framework import exceptions
from rest_framework import authentication
from django.contrib.auth import authenticate, get_user_model
from rest_framework.authentication import SessionAuthentication

class ExampleAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        # Get the username and password
        auth_token = request.headers.get('Authorization', None)
     
        if not auth_token:
            raise exceptions.AuthenticationFailed(('No credentials provided.'))

        try:
            token = Token.objects.get(key=request.headers['Authorization'].split()[1].strip())
            return (token, None)  # authentication successful
        except:
            raise exceptions.AuthenticationFailed(('Token is invalid'))

        
class MyView(APIView):
    authentication_classes = (ExampleAuthentication,)

    def get(self, request, format=None):    
        token = Token.objects.get(key=request.headers['Authorization'].split()[1].strip())
        user = token.user
        employees_for_user = Employees.objects.filter(user=user)
        json_data = json.loads(serialize('json', employees_for_user))
        return  Response({"message":"success",'result':[{'id':i['pk'],**i['fields']} for i in json_data]})

    def delete(self, request, employee_id=None):    
        token = Token.objects.get(key=request.headers['Authorization'].split()[1].strip())
        user = token.user
        try:
            employee = Employees.objects.filter(user=user).get(id=employee_id)
            employee.delete()
            employees_for_user = Employees.objects.filter(user=user)
            json_data = json.loads(serialize('json', employees_for_user))
            return Response({"message":"success",'result':[{'id':i['pk'],**i['fields']} for i in json_data]})
        except:
            return Response({"message":"Emp not found"})
        
    def put(self, request, employee_id=None):    
        token = Token.objects.get(key=request.headers['Authorization'].split()[1].strip())
        user = token.user
        try:
            employee = Employees.objects.filter(user=user).get(id=employee_id)
            employee.first_name = request.data.get('first_name',employee.first_name)
            employee.last_name = request.data.get('last_name',employee.last_name)
            employee.email = request.data.get('email',employee.email)
            employee.salary = int(request.data.get('salary',employee.salary))
            employee.phone = int(request.data.get('phone',employee.phone))

            # Save the changes
            employee.save()
            employees_for_user = Employees.objects.filter(user=user)
            json_data = json.loads(serialize('json', employees_for_user))
            return Response({"message":"success",'result':[{'id':i['pk'],**i['fields']} for i in json_data]})
        except:
            return Response({"message":"Emp not found"})

    def post(self, request, format=None):
        token = Token.objects.get(key=request.headers['Authorization'].split()[1].strip())
        user = token.user
        try:
            Employees.objects.create(
                user=user,
                first_name=request.data['first_name'],
                last_name=request.data['last_name'],
                email=request.data['email'],
                salary=request.data['salary'],
                phone=request.data['phone']
            )
            employees_for_user = Employees.objects.filter(user=user)
            json_data = json.loads(serialize('json', employees_for_user))
            return Response({"message":"success",'result':[{'id':i['pk'],**i['fields']} for i in json_data]})
        except Exception as e:
            print(e)
            return Response({"message":"Failed to add emp"})


@api_view(["POST"])
def user_register_view(request):
    if request.method == "POST":
        username = request.data['username']
        password = request.data['password']

        if User.objects.filter(username = username).exists():
            return Response({"message": "username already exist"})
        account = User(username=username)
        account.set_password(password)
        account.save()

        return Response({'message':'Account has been created','username': account.username})

@api_view(["POST"])
def user_login_view(request):
    if request.method == "POST":
        username = request.data['username']
        password = request.data['password']
        if User.objects.filter(username = username).exists():
            account = User.objects.get(username=username)
            if account.check_password(password):
                token , _ = Token.objects.get_or_create(user=account)
                return Response({'message':'Success','token':token.key})
            else:
                return Response({"message": "Password is invalid"})
        else:
            return Response({"message": "username doesn't exist"})
        
@api_view(["GET"])
def logout_user(request):
    if request.method == "GET":
        if 'Authorization' in request.headers:
            try:
                Token.objects.get(key=request.headers['Authorization'].split()[1].strip()).delete()
                return Response({"message": "You are logged out."}, status=status.HTTP_200_OK)
            except:
                return Response({"message": "Token is invalid."}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "User isn't logged in."})