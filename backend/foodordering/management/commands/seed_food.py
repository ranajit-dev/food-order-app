from django.core.management.base import BaseCommand
from foodordering.models import Food, Category
from decimal import Decimal

class Command(BaseCommand):
    help = "Seed food data into database"

    def handle(self, *args, **kwargs):

        data = [
            {"name": "Veg Fried Rice", "category": "Main Course", "image": "https://images.unsplash.com/photo-1603133872878-684f208fb84b", "description": "Stir-fried rice with fresh vegetables and soy sauce.", "quantity": 1, "price": 159},
            {"name": "Chicken Noodles", "category": "Main Course", "image": "https://images.unsplash.com/photo-1589308078056-f4c6f42b6c39", "description": "Delicious noodles tossed with chicken and spices.", "quantity": 1, "price": 179},
            {"name": "Paneer Tikka", "category": "Snacks", "image": "https://images.unsplash.com/photo-1598514982849-9c5a7b2d7e6d", "description": "Grilled paneer cubes marinated in spicy yogurt mix.", "quantity": 1, "price": 199},
            {"name": "Spring Rolls", "category": "Snacks", "image": "https://images.unsplash.com/photo-1604908177522-040f3b4a6d0b", "description": "Crispy rolls filled with vegetables and served with sauce.", "quantity": 4, "price": 129},
            {"name": "Masala Dosa", "category": "Main Course", "image": "https://images.unsplash.com/photo-1617196038434-2b9d3e5b8f2d", "description": "South Indian crispy dosa stuffed with spicy potato filling.", "quantity": 1, "price": 119},
            {"name": "Idli Sambar", "category": "Main Course", "image": "https://images.unsplash.com/photo-1625944238800-3b6c1e1d5b3d", "description": "Soft steamed rice cakes served with sambar and chutney.", "quantity": 3, "price": 99},
            {"name": "Tandoori Chicken", "category": "Main Course", "image": "https://images.unsplash.com/photo-1600891963935-cf2c42b6d52c", "description": "Spicy roasted chicken cooked in traditional tandoor.", "quantity": 1, "price": 299},
            {"name": "Butter Naan", "category": "Bread", "image": "https://images.unsplash.com/photo-1625944525425-8c5cbd8768c0", "description": "Soft Indian bread topped with butter.", "quantity": 2, "price": 49},
            {"name": "Garlic Naan", "category": "Bread", "image": "https://images.unsplash.com/photo-1601050690455-3b2c1b8c6c2e", "description": "Naan bread infused with garlic and herbs.", "quantity": 2, "price": 59},
            {"name": "Mango Juice", "category": "Beverages", "image": "https://images.unsplash.com/photo-1571687949920-8b4c3c7b9f9a", "description": "Fresh mango juice, sweet and refreshing.", "quantity": 1, "price": 79},
            {"name": "Lassi", "category": "Beverages", "image": "https://images.unsplash.com/photo-1627308595181-d3e6c5f4c3e2", "description": "Traditional yogurt-based drink.", "quantity": 1, "price": 69},
            {"name": "Ice Cream Sundae", "category": "Desserts", "image": "https://images.unsplash.com/photo-1563805042-7684c019e1cb", "description": "Vanilla ice cream topped with chocolate syrup.", "quantity": 1, "price": 149},
            {"name": "Brownie", "category": "Desserts", "image": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c", "description": "Rich chocolate brownie served warm.", "quantity": 1, "price": 99},
            {"name": "Club Sandwich", "category": "Fast Food", "image": "https://images.unsplash.com/photo-1553909489-cd47e0ef937f", "description": "Triple-layer sandwich with veggies and mayo.", "quantity": 1, "price": 149},
            {"name": "Hot Dog", "category": "Fast Food", "image": "https://images.unsplash.com/photo-1550547660-d9450f859349", "description": "Grilled sausage in a bun with sauces.", "quantity": 1, "price": 129}
        ]

        for item in data:
            category_obj, _ = Category.objects.get_or_create(
                category_name=item["category"]
            )

            Food.objects.get_or_create(
                item_name=item["name"],
                defaults={
                    "category": category_obj,
                    "item_price": Decimal(item["price"]),
                    "item_description": item["description"],
                    "item_quantity": str(item["quantity"]),
                    "image": item["image"]
                }
            )

        self.stdout.write(self.style.SUCCESS("✅ Food data seeded successfully"))