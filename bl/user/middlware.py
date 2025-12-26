
# from django.http import HttpResponse

# class Checkuserlogin:
#     def __init__(self,get_response):
#         self.get_response=get_response
#         self.protect=['/t/']
#     def __call__(self, request):
#         print("brfore middlre")
#         if any(request.path.startswith(p) for p  in self.protect):
#             print("isme dekho")
#             if not request.user.is_superuser:
#                   return HttpResponse("<h1 style='color:red'>firuhfurfhurh</h1>")
#         print("after vv")
#         response=self.get_response(request)
#         return response
    
# class Authmai:
#     def __init__(self,get_response):
#          self.get_response=get_response
         
#     def __call__(self,request):
#         print("kkkkkkkk")
#         response =self.get_response(request)
#         print("oooooooo")
#         return response
    
# class Pro:
#     def __init__(self,get_response):
#        self.get_response=get_response

#     def __call__(self,request):
#         reponse =self.get_response(request)
#         return reponse
    
#     def process_view(self,request,view_func,view_args,view_kwargs):
#         try:
#             print(view_args,"aur",view_kwargs,"cccc",view_func,"r",request,"f",self)
#             if view_func.__name__=="dashboard"  and not request.user.is_superuser:
#                 return HttpResponse("<h1 style='color:red'>llllllllll</h1>")
#         except Exception as e:
#             return self.process_exception(request,e)
#         return None
#     def process_exception(self,request,exception):
#         return HttpResponse("<h1>humhai{exception}</h1>")