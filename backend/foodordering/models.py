from django.db import models
from django.core.validators import RegexValidator
from django.contrib.auth.hashers import make_password, check_password
import uuid
from cloudinary.models import CloudinaryField

# Create your models here.

# User Model
class User(models.Model):
    first_name = models.CharField(max_length = 50)
    last_name = models.CharField(max_length = 50)
    email = models.EmailField(max_length = 50, unique = True)
    mobile = models.CharField(
        max_length=15,
        blank=True,
        null=True,
        validators=[RegexValidator(regex=r'^\+?\d{10,15}$', message="Invalid phone number")]
    )
    password = models.CharField(max_length=128)  # hashed passwords
    reg_date = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

# Category Model
class Category(models.Model):
    category_name = models.CharField(max_length = 50)
    creation_date = models.DateTimeField(auto_now_add = True)

    def __str__(self):
        return self.category_name
   
# Food Model 
class Food(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    item_name = models.CharField(max_length = 50)
    item_price = models.DecimalField(max_digits=10, decimal_places=2)
    item_description = models.TextField(max_length = 500, null=True, blank=True)
    # image = models.ImageField(upload_to= 'food_images/')
    image = CloudinaryField('image', blank=True, null=True)
    item_quantity = models.CharField(max_length=50)
    is_available = models.BooleanField(default = True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.item_name} ({self.item_quantity})"
    
# Order Model 
class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    food = models.ForeignKey('Food', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    is_order_placed = models.BooleanField(default=False)
    order_number = models.CharField(max_length=128, null=True)
    
    @property
    def total_price(self):
        return self.food.item_price * self.quantity

    def __str__(self):
        return f"Order {self.order_number} ({self.user})"
    

# Order Address Model 
class OrderAddress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    order_number = models.CharField(max_length=128, null=True)
    address = models.TextField()
    order_time = models.DateTimeField(auto_now_add=True)
    order_final_status = models.CharField(max_length=200, null=True)

    
    def __str__(self):
        return f"Order {self.order_number} ({self.user})"
    
# Order Tracking Model 
class OrderTracking(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    remark = models.CharField(max_length=200, null=True)
    status = models.CharField(max_length=200, null=True)
    address = models.TextField()
    status_date = models.DateTimeField(auto_now_add=True)
    order_cancelled_by_user = models.BooleanField( null=True, blank=True)

    def __str__(self):
        return f"Order {self.order} - {self.status}"
    
    
# Payment Detail Model 
class PaymentDetail(models.Model):
    PAYMENT_CHOICES = [
        ("cod", "Cash on Delivery"),
        ("online", "Online Payment")
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    order_number = models.CharField(max_length = 100, null=True)
    payment_mode = models.CharField(max_length = 30, choices=PAYMENT_CHOICES)
    card_number = models.CharField(max_length = 50, null=True, blank=True)
    expiry_date = models.CharField(max_length = 20, null=True, blank=True)
    cvv = models.CharField(max_length = 5, null=True, blank=True)
    payment_date = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.order_number} - {self.payment_mode}"
    
# Review Model 
class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    food = models.ForeignKey(Food, on_delete=models.CASCADE)
    rating = models.PositiveIntegerField(default=1)
    comment = models.TextField(null = True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review by  {self.user.first_name} for {self.food.item_name} - {self.rating} stars"
    
# Wishlist Model 
class Wishlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    food = models.ForeignKey(Food, on_delete=models.CASCADE)
    added_on = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ("user", "food")

    def __str__(self):
        return f"{self.user.first_name} - {self.food.item_name}"