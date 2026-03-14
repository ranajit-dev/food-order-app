# convert django-model to json (serialization)
# convert json to django-model (deserialization)

from rest_framework import serializers
from .models import *

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'category_name', 'creation_date']
        
        
class FoodSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source= 'category.category_name', read_only = True)
    
    image = serializers.ImageField(use_url=True, required = False)
    is_available = serializers.BooleanField(default = True)
    
    class Meta:
        model = Food
        fields = ['id', 'category', 'category_name','item_name', 'item_price', 'item_description', 'image', 'item_quantity', 'is_available', 'created_at', 'updated_at']


class CartOrderSerializer(serializers.ModelSerializer):
    food = FoodSerializer()
    class Meta:
        model = Order
        fields = ['id', 'food', 'quantity']
        
        
class MyOrdersListSerializer(serializers.ModelSerializer):
    order_final_status = serializers.SerializerMethodField()
    
    class Meta:
        model = OrderAddress
        fields = ['order_number', 'order_time', 'order_final_status']
        
    def get_order_final_status(self, obj):
        return obj.order_final_status or "Waiting for Restaurant confirmation"
    
    

class OrderSerializer(serializers.ModelSerializer):
    food = FoodSerializer()
    class Meta:
        model = Order
        fields = [ 'food', 'quantity']
        
        
        
class OrderAddressSerializer(serializers.ModelSerializer):
    payment_mode = serializers.SerializerMethodField()
    
    class Meta:
        model = OrderAddress
        fields = ['order_number','address', 'order_time', 'order_final_status', 'payment_mode']
        
    def get_payment_mode(self, obj):
        try:
            payment = PaymentDetail.objects.get(order_number = obj.order_number)
            return payment.payment_mode
        except:
            return None
        
class UserSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(
        required=True,
        allow_blank=False,
        error_messages={
            "blank": "First name cannot be empty"
        }
    )

    last_name = serializers.CharField(
        required=True,
        allow_blank=False,
        error_messages={
            "blank": "Last name cannot be empty"
        }
    )
    class Meta:
        model = User
        fields = [ 'id','first_name', 'last_name', 'email', 'mobile', 'reg_date']



class OrderSummarySerializer(serializers.ModelSerializer):

    class Meta:
        model = OrderAddress
        fields = [ 'id','order_number', 'order_time']
        
        

class OrderDetailSerializer(serializers.ModelSerializer):
    user_first_name = serializers.CharField(source = 'user.first_name')
    user_last_name = serializers.CharField(source = 'user.last_name')
    user_email = serializers.CharField(source = 'user.email')
    user_mobile = serializers.CharField(source = 'user.mobile')
    
    class Meta:
        model = OrderAddress
        fields = [ 'order_number', 'order_time', 'order_final_status', 'address', 'user_first_name', 'user_last_name', 'user_email', 'user_mobile']

class OrderedFoodSerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(source = 'food.item_name')
    item_price = serializers.CharField(source = 'food.item_price')
    image = serializers.ImageField(source = 'food.image')
    
    class Meta:
        model = Order
        fields = [ 'item_name','item_price', 'image']
        

class OrderTrackingSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = OrderTracking
        fields = [ 'remark','status', 'status_date', 'order_cancelled_by_user']


class WishlistSerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(source = 'food.item_name')
    item_price = serializers.CharField(source = 'food.item_price')
    item_description = serializers.CharField(source = 'food.item_description')
    item_quantity = serializers.CharField(source = 'food.item_quantity')
    image = serializers.ImageField(source = 'food.image')
    is_available = serializers.CharField(source = 'food.is_available')

    
    class Meta:
        model = Wishlist
        fields = [ 'food_id','item_name', 'item_price', 'item_description','is_available' ,'image', 'item_quantity']


class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    food_name = serializers.CharField(source = 'food.item_name', read_only = True)
    user_id = serializers.IntegerField(source = 'user.id', read_only = True)
    
    class Meta:
        model = Review
        fields = ['id','user','user_id', 'user_name', 'food', 'food_name', 'rating', 'comment', 'created_at']
        
    def get_user_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"