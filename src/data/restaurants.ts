import { Restaurant } from '../types';
import spicePalaceImg from '../assets/spice-palace.jpg';
import pizzaCornerImg from '../assets/pizza-corner.jpg';
import dragonWokImg from '../assets/dragon-wok.jpg';
import sushiZenImg from '../assets/sushi-zen.jpg';
import casaMexicoImg from '../assets/casa-mexico.jpg';
import burgerBarnImg from '../assets/burger-barn.jpg';
import leCroissantImg from '../assets/le-croissant.jpg';
import oliveGardenImg from '../assets/olive-garden.jpg';

export const restaurants: Restaurant[] = [
  {
    id: 'spice-palace',
    name: 'Spice Palace',
    cuisine: 'Indian',
    rating: 4.5,
    deliveryTime: '30-45 min',
    image: spicePalaceImg,
    description: 'Authentic Indian flavors with traditional spices and recipes passed down through generations.',
    menu: [
      // Starters
      {
        id: 'sp-1',
        name: 'Chicken 65',
        description: 'Spicy deep-fried chicken with curry leaves and green chilies',
        price: 280,
        image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400',
        category: 'Starters',
        isVeg: false
      },
      {
        id: 'sp-2',
        name: 'Paneer Tikka',
        description: 'Grilled cottage cheese marinated in spices and yogurt',
        price: 240,
        image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400',
        category: 'Starters',
        isVeg: true
      },
      {
        id: 'sp-3',
        name: 'Samosa Chat',
        description: 'Crispy samosas topped with chutneys and yogurt',
        price: 120,
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400',
        category: 'Starters',
        isVeg: true
      },
      {
        id: 'sp-14',
        name: 'Fish Tikka',
        description: 'Marinated fish pieces grilled to perfection',
        price: 320,
        image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400',
        category: 'Starters',
        isVeg: false
      },
      {
        id: 'sp-15',
        name: 'Aloo Tikki Chat',
        description: 'Potato patties with tangy chutneys',
        price: 140,
        image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400',
        category: 'Starters',
        isVeg: true
      },
      // Main Course
      {
        id: 'sp-4',
        name: 'Butter Chicken',
        description: 'Tender chicken in rich tomato and butter gravy',
        price: 380,
        image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400',
        category: 'Main Course',
        isVeg: false
      },
      {
        id: 'sp-5',
        name: 'Dal Makhani',
        description: 'Creamy black lentils slow-cooked with butter and cream',
        price: 280,
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400',
        category: 'Main Course',
        isVeg: true
      },
      {
        id: 'sp-6',
        name: 'Mutton Rogan Josh',
        description: 'Aromatic lamb curry with Kashmiri spices',
        price: 480,
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400',
        category: 'Main Course',
        isVeg: false
      },
      {
        id: 'sp-16',
        name: 'Palak Paneer',
        description: 'Cottage cheese in creamy spinach gravy',
        price: 300,
        image: 'https://images.unsplash.com/photo-1631292784640-2b24be784d5d?w=400',
        category: 'Main Course',
        isVeg: true
      },
      {
        id: 'sp-17',
        name: 'Chicken Korma',
        description: 'Mild chicken curry with cashews and cream',
        price: 360,
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
        category: 'Main Course',
        isVeg: false
      },
      {
        id: 'sp-18',
        name: 'Fish Curry',
        description: 'Fresh fish in coconut-based curry',
        price: 420,
        image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400',
        category: 'Main Course',
        isVeg: false
      },
      // Biryani & Rice
      {
        id: 'sp-7',
        name: 'Hyderabadi Chicken Biryani',
        description: 'Fragrant basmati rice layered with spiced chicken',
        price: 420,
        image: 'https://images.unsplash.com/photo-1563379091339-03246963d117?w=400',
        category: 'Biryani & Rice',
        isVeg: false
      },
      {
        id: 'sp-8',
        name: 'Vegetable Biryani',
        description: 'Aromatic rice with mixed vegetables and saffron',
        price: 320,
        image: 'https://images.unsplash.com/photo-1563379091339-03246963d117?w=400',
        category: 'Biryani & Rice',
        isVeg: true
      },
      {
        id: 'sp-9',
        name: 'Jeera Rice',
        description: 'Fragrant basmati rice tempered with cumin',
        price: 180,
        image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400',
        category: 'Biryani & Rice',
        isVeg: true
      },
      {
        id: 'sp-19',
        name: 'Mutton Biryani',
        description: 'Tender mutton layered with aromatic rice',
        price: 520,
        image: 'https://images.unsplash.com/photo-1563379091339-03246963d117?w=400',
        category: 'Biryani & Rice',
        isVeg: false
      },
      {
        id: 'sp-20',
        name: 'Egg Biryani',
        description: 'Spiced rice with boiled eggs',
        price: 280,
        image: 'https://images.unsplash.com/photo-1563379091339-03246963d117?w=400',
        category: 'Biryani & Rice',
        isVeg: false
      },
      // Indian Breads
      {
        id: 'sp-21',
        name: 'Butter Naan',
        description: 'Soft bread brushed with butter',
        price: 80,
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
        category: 'Indian Breads',
        isVeg: true
      },
      {
        id: 'sp-22',
        name: 'Garlic Naan',
        description: 'Naan bread topped with fresh garlic',
        price: 100,
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
        category: 'Indian Breads',
        isVeg: true
      },
      {
        id: 'sp-23',
        name: 'Tandoori Roti',
        description: 'Whole wheat bread cooked in tandoor',
        price: 60,
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
        category: 'Indian Breads',
        isVeg: true
      },
      // Desserts
      {
        id: 'sp-24',
        name: 'Gulab Jamun',
        description: 'Soft milk dumplings in sugar syrup',
        price: 120,
        image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400',
        category: 'Desserts',
        isVeg: true
      },
      {
        id: 'sp-25',
        name: 'Kulfi',
        description: 'Traditional Indian ice cream',
        price: 100,
        image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400',
        category: 'Desserts',
        isVeg: true
      },
      // Beverages
      {
        id: 'sp-10',
        name: 'Mango Lassi',
        description: 'Creamy yogurt drink with fresh mango',
        price: 120,
        image: 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=400',
        category: 'Beverages',
        isVeg: true
      },
      {
        id: 'sp-26',
        name: 'Sweet Lassi',
        description: 'Traditional yogurt drink',
        price: 80,
        image: 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=400',
        category: 'Beverages',
        isVeg: true
      },
      {
        id: 'sp-27',
        name: 'Fresh Lime Water',
        description: 'Refreshing lime juice with mint',
        price: 60,
        image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400',
        category: 'Beverages',
        isVeg: true
      },
      // Alcoholic Beverages
      {
        id: 'sp-11',
        name: 'Kingfisher Beer',
        description: 'Premium Indian lager beer - 650ml bottle',
        price: 280,
        image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400',
        category: 'Alcoholic Beverages',
        isAlcoholic: true
      },
      {
        id: 'sp-12',
        name: 'Old Monk Rum',
        description: 'Classic Indian dark rum - 180ml bottle',
        price: 480,
        image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400',
        category: 'Alcoholic Beverages',
        isAlcoholic: true
      },
      {
        id: 'sp-28',
        name: 'Royal Challenge Whisky',
        description: 'Premium Indian whisky - 180ml bottle',
        price: 520,
        image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400',
        category: 'Alcoholic Beverages',
        isAlcoholic: true
      }
    ]
  },
  {
    id: 'pizza-corner',
    name: 'Pizza Corner',
    cuisine: 'Italian',
    rating: 4.3,
    deliveryTime: '25-40 min',
    image: pizzaCornerImg,
    description: 'Authentic wood-fired pizzas and Italian delicacies made with imported ingredients.',
    menu: [
      {
        id: 'pc-1',
        name: 'Garlic Bread',
        description: 'Toasted bread with garlic butter and herbs',
        price: 180,
        image: 'https://images.unsplash.com/photo-1573140401552-3fab0b24306f?w=400',
        category: 'Starters',
        isVeg: true
      },
      {
        id: 'pc-2',
        name: 'Chicken Wings',
        description: 'Spicy buffalo wings with ranch dip',
        price: 320,
        image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400',
        category: 'Starters',
        isVeg: false
      },
      {
        id: 'pc-3',
        name: 'Margherita Pizza',
        description: 'Classic pizza with tomato, mozzarella, and fresh basil',
        price: 480,
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
        category: 'Pizzas',
        isVeg: true
      },
      {
        id: 'pc-4',
        name: 'Pepperoni Pizza',
        description: 'Spicy pepperoni with mozzarella cheese',
        price: 580,
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400',
        category: 'Pizzas',
        isVeg: false
      },
      {
        id: 'pc-5',
        name: 'Chicken Supreme',
        description: 'Chicken, bell peppers, onions, and olives',
        price: 680,
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
        category: 'Pizzas',
        isVeg: false
      },
      {
        id: 'pc-6',
        name: 'Spaghetti Carbonara',
        description: 'Creamy pasta with bacon and parmesan',
        price: 420,
        image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400',
        category: 'Pasta',
        isVeg: false
      },
      {
        id: 'pc-7',
        name: 'Penne Arrabbiata',
        description: 'Spicy tomato sauce with garlic and red chilies',
        price: 380,
        image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400',
        category: 'Pasta',
        isVeg: true
      },
      {
        id: 'pc-8',
        name: 'Italian Soda',
        description: 'Refreshing lemon and mint soda',
        price: 120,
        image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400',
        category: 'Beverages',
        isVeg: true
      },
      {
        id: 'pc-9',
        name: 'Chianti Wine',
        description: 'Classic Italian red wine - 750ml bottle',
        price: 1200,
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400',
        category: 'Alcoholic Beverages',
        isAlcoholic: true
      },
      {
        id: 'pc-10',
        name: 'Heineken Beer',
        description: 'Premium Dutch lager - 330ml bottle',
        price: 320,
        image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400',
        category: 'Alcoholic Beverages',
        isAlcoholic: true
      }
    ]
  },
  {
    id: 'dragon-wok',
    name: 'Dragon Wok',
    cuisine: 'Chinese',
    rating: 4.4,
    deliveryTime: '20-35 min',
    image: dragonWokImg,
    description: 'Authentic Chinese cuisine with traditional wok-cooked dishes and Asian flavors.',
    menu: [
      {
        id: 'dw-1',
        name: 'Spring Rolls',
        description: 'Crispy vegetable rolls with sweet and sour sauce',
        price: 220,
        image: 'https://images.unsplash.com/photo-1559847844-d98b7fc4ffda?w=400',
        category: 'Starters',
        isVeg: true
      },
      {
        id: 'dw-2',
        name: 'Chicken Dumplings',
        description: 'Steamed dumplings filled with seasoned chicken',
        price: 280,
        image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400',
        category: 'Starters',
        isVeg: false
      },
      {
        id: 'dw-3',
        name: 'Sweet and Sour Chicken',
        description: 'Crispy chicken with bell peppers in tangy sauce',
        price: 380,
        image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400',
        category: 'Main Course',
        isVeg: false
      },
      {
        id: 'dw-4',
        name: 'Kung Pao Chicken',
        description: 'Spicy chicken stir-fry with peanuts and vegetables',
        price: 360,
        image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400',
        category: 'Main Course',
        isVeg: false
      },
      {
        id: 'dw-5',
        name: 'Vegetable Fried Rice',
        description: 'Wok-fried rice with mixed vegetables and soy sauce',
        price: 280,
        image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
        category: 'Rice & Noodles',
        isVeg: true
      },
      {
        id: 'dw-6',
        name: 'Hakka Noodles',
        description: 'Stir-fried noodles with vegetables and sauces',
        price: 300,
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
        category: 'Rice & Noodles',
        isVeg: true
      },
      {
        id: 'dw-7',
        name: 'Hot and Sour Soup',
        description: 'Traditional Chinese soup with tofu and vegetables',
        price: 180,
        image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
        category: 'Soups',
        isVeg: true
      },
      {
        id: 'dw-8',
        name: 'Chinese Green Tea',
        description: 'Traditional aromatic green tea',
        price: 80,
        image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400',
        category: 'Beverages',
        isVeg: true
      }
    ]
  },
  {
    id: 'sushi-zen',
    name: 'Sushi Zen',
    cuisine: 'Japanese',
    rating: 4.6,
    deliveryTime: '35-50 min',
    image: sushiZenImg,
    description: 'Premium Japanese sushi and authentic dishes prepared by experienced chefs.',
    menu: [
      {
        id: 'sz-1',
        name: 'California Roll',
        description: 'Avocado, cucumber, and crab meat roll',
        price: 480,
        image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400',
        category: 'Sushi Rolls',
        isVeg: false
      },
      {
        id: 'sz-2',
        name: 'Salmon Nigiri',
        description: 'Fresh salmon over seasoned rice',
        price: 380,
        image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400',
        category: 'Nigiri',
        isVeg: false
      },
      {
        id: 'sz-3',
        name: 'Chicken Teriyaki',
        description: 'Grilled chicken glazed with teriyaki sauce',
        price: 420,
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400',
        category: 'Main Course',
        isVeg: false
      },
      {
        id: 'sz-4',
        name: 'Vegetable Tempura',
        description: 'Lightly battered and fried mixed vegetables',
        price: 320,
        image: 'https://images.unsplash.com/photo-1606850779734-9478f7ad47fe?w=400',
        category: 'Appetizers',
        isVeg: true
      },
      {
        id: 'sz-5',
        name: 'Miso Soup',
        description: 'Traditional soybean paste soup',
        price: 180,
        image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
        category: 'Soups',
        isVeg: true
      },
      {
        id: 'sz-6',
        name: 'Green Tea',
        description: 'Premium Japanese green tea',
        price: 100,
        image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400',
        category: 'Beverages',
        isVeg: true
      },
      {
        id: 'sz-7',
        name: 'Sake',
        description: 'Traditional Japanese rice wine - 300ml',
        price: 800,
        image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400',
        category: 'Alcoholic Beverages',
        isAlcoholic: true
      }
    ]
  },
  {
    id: 'casa-mexico',
    name: 'Casa Mexico',
    cuisine: 'Mexican',
    rating: 4.2,
    deliveryTime: '30-45 min',
    image: casaMexicoImg,
    description: 'Vibrant Mexican flavors with fresh ingredients and traditional recipes.',
    menu: [
      {
        id: 'cm-1',
        name: 'Chicken Tacos',
        description: 'Soft tacos filled with seasoned chicken and fresh salsa',
        price: 320,
        image: 'https://images.unsplash.com/photo-1565299585323-38174c4a6018?w=400',
        category: 'Tacos',
        isVeg: false
      },
      {
        id: 'cm-2',
        name: 'Veggie Burrito',
        description: 'Large tortilla filled with beans, rice, and vegetables',
        price: 380,
        image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400',
        category: 'Burritos',
        isVeg: true
      },
      {
        id: 'cm-3',
        name: 'Beef Quesadilla',
        description: 'Grilled tortilla with cheese and seasoned beef',
        price: 420,
        image: 'https://images.unsplash.com/photo-1571066811602-716837d681de?w=400',
        category: 'Quesadillas',
        isVeg: false
      },
      {
        id: 'cm-4',
        name: 'Guacamole & Chips',
        description: 'Fresh avocado dip with crispy tortilla chips',
        price: 240,
        image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400',
        category: 'Appetizers',
        isVeg: true
      },
      {
        id: 'cm-5',
        name: 'Mexican Rice',
        description: 'Seasoned rice with tomatoes and spices',
        price: 180,
        image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400',
        category: 'Sides',
        isVeg: true
      },
      {
        id: 'cm-6',
        name: 'Horchata',
        description: 'Traditional rice and cinnamon drink',
        price: 140,
        image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400',
        category: 'Beverages',
        isVeg: true
      },
      {
        id: 'cm-7',
        name: 'Corona Beer',
        description: 'Mexican lager beer - 330ml bottle',
        price: 280,
        image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400',
        category: 'Alcoholic Beverages',
        isAlcoholic: true
      }
    ]
  },
  {
    id: 'burger-barn',
    name: 'Burger Barn',
    cuisine: 'American',
    rating: 4.1,
    deliveryTime: '20-30 min',
    image: burgerBarnImg,
    description: 'Juicy gourmet burgers and classic American comfort food.',
    menu: [
      {
        id: 'bb-1',
        name: 'Classic Cheeseburger',
        description: 'Beef patty with cheese, lettuce, tomato, and onion',
        price: 380,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
        category: 'Burgers',
        isVeg: false
      },
      {
        id: 'bb-2',
        name: 'Veggie Burger',
        description: 'Plant-based patty with fresh vegetables',
        price: 320,
        image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400',
        category: 'Burgers',
        isVeg: true
      },
      {
        id: 'bb-3',
        name: 'Chicken Wings',
        description: 'Crispy wings with buffalo sauce',
        price: 320,
        image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400',
        category: 'Appetizers',
        isVeg: false
      },
      {
        id: 'bb-4',
        name: 'French Fries',
        description: 'Golden crispy potato fries',
        price: 180,
        image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400',
        category: 'Sides',
        isVeg: true
      },
      {
        id: 'bb-5',
        name: 'Chocolate Milkshake',
        description: 'Rich chocolate milkshake with whipped cream',
        price: 220,
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
        category: 'Beverages',
        isVeg: true
      },
      {
        id: 'bb-6',
        name: 'Craft Beer',
        description: 'Local craft beer - 500ml bottle',
        price: 350,
        image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400',
        category: 'Alcoholic Beverages',
        isAlcoholic: true
      }
    ]
  },
  {
    id: 'le-croissant',
    name: 'Le Croissant',
    cuisine: 'French',
    rating: 4.4,
    deliveryTime: '25-40 min',
    image: leCroissantImg,
    description: 'Authentic French pastries and delicate cuisine from the heart of France.',
    menu: [
      {
        id: 'lc-1',
        name: 'Butter Croissant',
        description: 'Flaky, buttery pastry baked fresh daily',
        price: 120,
        image: 'https://images.unsplash.com/photo-1549903072-7e6e0bedb7fb?w=400',
        category: 'Pastries',
        isVeg: true
      },
      {
        id: 'lc-2',
        name: 'Pain au Chocolat',
        description: 'Croissant pastry filled with dark chocolate',
        price: 150,
        image: 'https://images.unsplash.com/photo-1549903072-7e6e0bedb7fb?w=400',
        category: 'Pastries',
        isVeg: true
      },
      {
        id: 'lc-3',
        name: 'Quiche Lorraine',
        description: 'Traditional French tart with bacon and cheese',
        price: 380,
        image: 'https://images.unsplash.com/photo-1571197200816-7c0b79f1da74?w=400',
        category: 'Main Course',
        isVeg: false
      },
      {
        id: 'lc-4',
        name: 'French Onion Soup',
        description: 'Classic soup with caramelized onions and cheese',
        price: 280,
        image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
        category: 'Soups',
        isVeg: true
      },
      {
        id: 'lc-5',
        name: 'Crème Brûlée',
        description: 'Classic French custard with caramelized sugar',
        price: 240,
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400',
        category: 'Desserts',
        isVeg: true
      },
      {
        id: 'lc-6',
        name: 'French Press Coffee',
        description: 'Rich, full-bodied coffee',
        price: 120,
        image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400',
        category: 'Beverages',
        isVeg: true
      },
      {
        id: 'lc-7',
        name: 'Bordeaux Wine',
        description: 'Premium French red wine - 750ml bottle',
        price: 1500,
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400',
        category: 'Alcoholic Beverages',
        isAlcoholic: true
      }
    ]
  },
  {
    id: 'olive-garden',
    name: 'Olive Garden',
    cuisine: 'Mediterranean',
    rating: 4.3,
    deliveryTime: '30-45 min',
    image: oliveGardenImg,
    description: 'Fresh Mediterranean cuisine with olive oil, herbs, and traditional recipes.',
    menu: [
      {
        id: 'og-1',
        name: 'Greek Salad',
        description: 'Fresh vegetables with feta cheese and olives',
        price: 280,
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400',
        category: 'Salads',
        isVeg: true
      },
      {
        id: 'og-2',
        name: 'Grilled Lamb',
        description: 'Tender lamb with Mediterranean herbs',
        price: 580,
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400',
        category: 'Main Course',
        isVeg: false
      },
      {
        id: 'og-3',
        name: 'Hummus Platter',
        description: 'Creamy chickpea dip with pita bread',
        price: 240,
        image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400',
        category: 'Appetizers',
        isVeg: true
      },
      {
        id: 'og-4',
        name: 'Moussaka',
        description: 'Traditional Greek casserole with eggplant',
        price: 480,
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400',
        category: 'Main Course',
        isVeg: true
      },
      {
        id: 'og-5',
        name: 'Baklava',
        description: 'Sweet pastry with nuts and honey',
        price: 180,
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400',
        category: 'Desserts',
        isVeg: true
      },
      {
        id: 'og-6',
        name: 'Ouzo',
        description: 'Traditional Greek anise liqueur - 200ml',
        price: 450,
        image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400',
        category: 'Alcoholic Beverages',
        isAlcoholic: true
      }
    ]
  },
  {
    id: 'thai-garden',
    name: 'Thai Garden',
    cuisine: 'Thai',
    rating: 4.5,
    deliveryTime: '25-40 min',
    image: 'https://images.unsplash.com/photo-1552566651-e8e44c37b2a6?w=800',
    description: 'Authentic Thai flavors with fresh herbs, spices, and traditional cooking methods.',
    menu: [
      {
        id: 'tg-1',
        name: 'Pad Thai',
        description: 'Stir-fried rice noodles with shrimp and peanuts',
        price: 380,
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
        category: 'Noodles',
        isVeg: false
      },
      {
        id: 'tg-2',
        name: 'Green Curry',
        description: 'Spicy coconut curry with vegetables',
        price: 360,
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400',
        category: 'Curries',
        isVeg: true
      },
      {
        id: 'tg-3',
        name: 'Tom Yum Soup',
        description: 'Hot and sour soup with shrimp',
        price: 280,
        image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
        category: 'Soups',
        isVeg: false
      },
      {
        id: 'tg-4',
        name: 'Som Tam',
        description: 'Spicy papaya salad with peanuts',
        price: 240,
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400',
        category: 'Salads',
        isVeg: true
      },
      {
        id: 'tg-5',
        name: 'Mango Sticky Rice',
        description: 'Sweet coconut rice with fresh mango',
        price: 200,
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400',
        category: 'Desserts',
        isVeg: true
      },
      {
        id: 'tg-6',
        name: 'Thai Iced Tea',
        description: 'Sweet milk tea with ice',
        price: 120,
        image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400',
        category: 'Beverages',
        isVeg: true
      },
      {
        id: 'tg-7',
        name: 'Singha Beer',
        description: 'Thai lager beer - 330ml bottle',
        price: 280,
        image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400',
        category: 'Alcoholic Beverages',
        isAlcoholic: true
      }
    ]
  },
  {
    id: 'korean-bbq',
    name: 'Seoul Kitchen',
    cuisine: 'Korean',
    rating: 4.4,
    deliveryTime: '30-45 min',
    image: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800',
    description: 'Authentic Korean BBQ and traditional dishes with bold flavors and fresh ingredients.',
    menu: [
      {
        id: 'sk-1',
        name: 'Bulgogi',
        description: 'Marinated beef BBQ with vegetables',
        price: 480,
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400',
        category: 'BBQ',
        isVeg: false
      },
      {
        id: 'sk-2',
        name: 'Bibimbap',
        description: 'Mixed rice bowl with vegetables and egg',
        price: 380,
        image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400',
        category: 'Rice Bowls',
        isVeg: true
      },
      {
        id: 'sk-3',
        name: 'Kimchi',
        description: 'Fermented cabbage with spices',
        price: 180,
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400',
        category: 'Sides',
        isVeg: true
      },
      {
        id: 'sk-4',
        name: 'Korean Fried Chicken',
        description: 'Crispy chicken with sweet and spicy glaze',
        price: 420,
        image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400',
        category: 'Chicken',
        isVeg: false
      },
      {
        id: 'sk-5',
        name: 'Japchae',
        description: 'Sweet potato noodles with vegetables',
        price: 320,
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
        category: 'Noodles',
        isVeg: true
      },
      {
        id: 'sk-6',
        name: 'Soju',
        description: 'Korean rice wine - 375ml bottle',
        price: 380,
        image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400',
        category: 'Alcoholic Beverages',
        isAlcoholic: true
      }
    ]
  },
  {
    id: 'viet-pho',
    name: 'Saigon Street',
    cuisine: 'Vietnamese',
    rating: 4.3,
    deliveryTime: '25-40 min',
    image: 'https://images.unsplash.com/photo-1555992336-03a23bd9e382?w=800',
    description: 'Fresh Vietnamese cuisine with aromatic herbs, light broths, and authentic flavors.',
    menu: [
      {
        id: 'ss-1',
        name: 'Pho Bo',
        description: 'Traditional beef noodle soup with herbs',
        price: 380,
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
        category: 'Soups',
        isVeg: false
      },
      {
        id: 'ss-2',
        name: 'Banh Mi',
        description: 'Vietnamese sandwich with pork and vegetables',
        price: 280,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
        category: 'Sandwiches',
        isVeg: false
      },
      {
        id: 'ss-3',
        name: 'Fresh Spring Rolls',
        description: 'Rice paper rolls with vegetables and herbs',
        price: 240,
        image: 'https://images.unsplash.com/photo-1559847844-d98b7fc4ffda?w=400',
        category: 'Appetizers',
        isVeg: true
      },
      {
        id: 'ss-4',
        name: 'Bun Cha',
        description: 'Grilled pork with noodles and herbs',
        price: 420,
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
        category: 'Noodles',
        isVeg: false
      },
      {
        id: 'ss-5',
        name: 'Vietnamese Coffee',
        description: 'Strong coffee with condensed milk',
        price: 120,
        image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400',
        category: 'Beverages',
        isVeg: true
      },
      {
        id: 'ss-6',
        name: 'Saigon Beer',
        description: 'Vietnamese lager beer - 330ml bottle',
        price: 260,
        image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400',
        category: 'Alcoholic Beverages',
        isAlcoholic: true
      }
    ]
  },
  {
    id: 'desert-rose',
    name: 'Desert Rose',
    cuisine: 'Middle Eastern',
    rating: 4.2,
    deliveryTime: '30-45 min',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800',
    description: 'Authentic Middle Eastern cuisine with aromatic spices and traditional recipes.',
    menu: [
      {
        id: 'dr-1',
        name: 'Shawarma',
        description: 'Spiced meat in pita bread with tahini',
        price: 320,
        image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400',
        category: 'Wraps',
        isVeg: false
      },
      {
        id: 'dr-2',
        name: 'Falafel Plate',
        description: 'Crispy chickpea balls with hummus',
        price: 280,
        image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400',
        category: 'Vegetarian',
        isVeg: true
      },
      {
        id: 'dr-3',
        name: 'Kebab Platter',
        description: 'Mixed grilled meats with rice',
        price: 520,
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400',
        category: 'Grills',
        isVeg: false
      },
      {
        id: 'dr-4',
        name: 'Tabbouleh',
        description: 'Fresh parsley salad with tomatoes',
        price: 220,
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400',
        category: 'Salads',
        isVeg: true
      },
      {
        id: 'dr-5',
        name: 'Kunafa',
        description: 'Sweet cheese pastry with syrup',
        price: 240,
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400',
        category: 'Desserts',
        isVeg: true
      },
      {
        id: 'dr-6',
        name: 'Mint Tea',
        description: 'Traditional Middle Eastern tea',
        price: 80,
        image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400',
        category: 'Beverages',
        isVeg: true
      }
    ]
  },
  {
    id: 'cafe-mocha',
    name: 'Café Mocha',
    cuisine: 'Cafe',
    rating: 4.1,
    deliveryTime: '15-25 min',
    image: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800',
    description: 'Cozy café serving premium coffee, fresh pastries, and light meals.',
    menu: [
      {
        id: 'cm-1',
        name: 'Cappuccino',
        description: 'Espresso with steamed milk and foam',
        price: 180,
        image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400',
        category: 'Coffee',
        isVeg: true
      },
      {
        id: 'cm-2',
        name: 'Chicken Sandwich',
        description: 'Grilled chicken with lettuce and mayo',
        price: 280,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
        category: 'Sandwiches',
        isVeg: false
      },
      {
        id: 'cm-3',
        name: 'Blueberry Muffin',
        description: 'Fresh baked muffin with blueberries',
        price: 150,
        image: 'https://images.unsplash.com/photo-1549903072-7e6e0bedb7fb?w=400',
        category: 'Pastries',
        isVeg: true
      },
      {
        id: 'cm-4',
        name: 'Caesar Salad',
        description: 'Romaine lettuce with parmesan and croutons',
        price: 260,
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400',
        category: 'Salads',
        isVeg: true
      },
      {
        id: 'cm-5',
        name: 'Cheesecake',
        description: 'New York style cheesecake',
        price: 220,
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400',
        category: 'Desserts',
        isVeg: true
      },
      {
        id: 'cm-6',
        name: 'Iced Latte',
        description: 'Cold espresso with milk and ice',
        price: 160,
        image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400',
        category: 'Coffee',
        isVeg: true
      }
    ]
  },
  {
    id: 'ocean-breeze',
    name: 'Ocean Breeze',
    cuisine: 'Seafood',
    rating: 4.6,
    deliveryTime: '35-50 min',
    image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800',
    description: 'Fresh seafood and coastal cuisine with the finest catches of the day.',
    menu: [
      {
        id: 'ob-1',
        name: 'Grilled Salmon',
        description: 'Fresh Atlantic salmon with herbs',
        price: 580,
        image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400',
        category: 'Main Course',
        isVeg: false
      },
      {
        id: 'ob-2',
        name: 'Fish & Chips',
        description: 'Beer battered fish with crispy fries',
        price: 420,
        image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400',
        category: 'Main Course',
        isVeg: false
      },
      {
        id: 'ob-3',
        name: 'Seafood Paella',
        description: 'Spanish rice with mixed seafood',
        price: 680,
        image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400',
        category: 'Rice Dishes',
        isVeg: false
      },
      {
        id: 'ob-4',
        name: 'Clam Chowder',
        description: 'Creamy soup with fresh clams',
        price: 320,
        image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
        category: 'Soups',
        isVeg: false
      },
      {
        id: 'ob-5',
        name: 'Lobster Roll',
        description: 'Fresh lobster in a toasted roll',
        price: 780,
        image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400',
        category: 'Sandwiches',
        isVeg: false
      },
      {
        id: 'ob-6',
        name: 'White Wine',
        description: 'Crisp white wine - 750ml bottle',
        price: 1200,
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400',
        category: 'Alcoholic Beverages',
        isAlcoholic: true
      }
    ]
  },
  {
    id: 'veggie-delight',
    name: 'Veggie Delight',
    cuisine: 'Vegetarian',
    rating: 4.4,
    deliveryTime: '20-35 min',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800',
    description: 'Creative vegetarian cuisine with fresh, organic ingredients and innovative recipes.',
    menu: [
      {
        id: 'vd-1',
        name: 'Quinoa Bowl',
        description: 'Protein-rich quinoa with vegetables',
        price: 320,
        image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400',
        category: 'Bowls',
        isVeg: true
      },
      {
        id: 'vd-2',
        name: 'Veggie Burger',
        description: 'House-made patty with avocado',
        price: 280,
        image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400',
        category: 'Burgers',
        isVeg: true
      },
      {
        id: 'vd-3',
        name: 'Green Smoothie',
        description: 'Spinach, banana, and mango smoothie',
        price: 180,
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
        category: 'Beverages',
        isVeg: true
      },
      {
        id: 'vd-4',
        name: 'Vegan Pizza',
        description: 'Plant-based cheese and vegetables',
        price: 420,
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
        category: 'Pizza',
        isVeg: true
      },
      {
        id: 'vd-5',
        name: 'Buddha Bowl',
        description: 'Mixed vegetables and grains',
        price: 380,
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400',
        category: 'Bowls',
        isVeg: true
      },
      {
        id: 'vd-6',
        name: 'Raw Chocolate Cake',
        description: 'Healthy dessert with dates and nuts',
        price: 240,
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400',
        category: 'Desserts',
        isVeg: true
      }
    ]
  },
  {
    id: 'steakhouse-prime',
    name: 'Prime Steakhouse',
    cuisine: 'Steakhouse',
    rating: 4.7,
    deliveryTime: '40-55 min',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800',
    description: 'Premium cuts of beef and fine dining experience with exceptional steaks.',
    menu: [
      {
        id: 'ps-1',
        name: 'Ribeye Steak',
        description: 'Premium ribeye cooked to perfection',
        price: 880,
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400',
        category: 'Steaks',
        isVeg: false
      },
      {
        id: 'ps-2',
        name: 'Filet Mignon',
        description: 'Tender beef tenderloin with herbs',
        price: 1200,
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400',
        category: 'Steaks',
        isVeg: false
      },
      {
        id: 'ps-3',
        name: 'Loaded Baked Potato',
        description: 'Potato with cheese, bacon, and sour cream',
        price: 220,
        image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400',
        category: 'Sides',
        isVeg: false
      },
      {
        id: 'ps-4',
        name: 'Caesar Salad',
        description: 'Classic salad with grilled chicken',
        price: 320,
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400',
        category: 'Salads',
        isVeg: false
      },
      {
        id: 'ps-5',
        name: 'Chocolate Lava Cake',
        description: 'Warm chocolate cake with vanilla ice cream',
        price: 280,
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400',
        category: 'Desserts',
        isVeg: true
      },
      {
        id: 'ps-6',
        name: 'Cabernet Sauvignon',
        description: 'Full-bodied red wine - 750ml bottle',
        price: 1800,
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400',
        category: 'Alcoholic Beverages',
        isAlcoholic: true
      }
    ]
  },
  {
    id: 'noodle-house',
    name: 'Golden Noodle House',
    cuisine: 'Asian Fusion',
    rating: 4.3,
    deliveryTime: '25-40 min',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800',
    description: 'Asian fusion noodle dishes combining flavors from across Asia.',
    menu: [
      {
        id: 'gnh-1',
        name: 'Ramen Bowl',
        description: 'Rich pork broth with fresh noodles',
        price: 380,
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
        category: 'Noodles',
        isVeg: false
      },
      {
        id: 'gnh-2',
        name: 'Chicken Teriyaki',
        description: 'Grilled chicken with teriyaki glaze',
        price: 420,
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400',
        category: 'Main Course',
        isVeg: false
      },
      {
        id: 'gnh-3',
        name: 'Vegetable Stir Fry',
        description: 'Wok-fried vegetables with soy sauce',
        price: 280,
        image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400',
        category: 'Vegetarian',
        isVeg: true
      },
      {
        id: 'gnh-4',
        name: 'Gyoza',
        description: 'Pan-fried pork dumplings',
        price: 240,
        image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400',
        category: 'Appetizers',
        isVeg: false
      },
      {
        id: 'gnh-5',
        name: 'Miso Soup',
        description: 'Traditional Japanese soup',
        price: 120,
        image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
        category: 'Soups',
        isVeg: true
      },
      {
        id: 'gnh-6',
        name: 'Jasmine Tea',
        description: 'Fragrant Chinese tea',
        price: 80,
        image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400',
        category: 'Beverages',
        isVeg: true
      }
    ]
  },
  {
    id: 'ice-cream-parlor',
    name: 'Sweet Dreams Parlor',
    cuisine: 'Ice Cream',
    rating: 4.5,
    deliveryTime: '15-25 min',
    image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800',
    description: 'Artisanal ice cream and frozen treats made with premium ingredients.',
    menu: [
      {
        id: 'sdp-1',
        name: 'Vanilla Bean',
        description: 'Classic vanilla ice cream with real vanilla beans',
        price: 180,
        image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400',
        category: 'Ice Cream',
        isVeg: true
      },
      {
        id: 'sdp-2',
        name: 'Chocolate Fudge',
        description: 'Rich chocolate ice cream with fudge swirls',
        price: 200,
        image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400',
        category: 'Ice Cream',
        isVeg: true
      },
      {
        id: 'sdp-3',
        name: 'Strawberry Sorbet',
        description: 'Fresh strawberry sorbet',
        price: 160,
        image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400',
        category: 'Sorbet',
        isVeg: true
      },
      {
        id: 'sdp-4',
        name: 'Cookie Dough',
        description: 'Vanilla ice cream with cookie dough chunks',
        price: 220,
        image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400',
        category: 'Ice Cream',
        isVeg: true
      },
      {
        id: 'sdp-5',
        name: 'Banana Split',
        description: 'Three scoops with banana and toppings',
        price: 320,
        image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400',
        category: 'Sundaes',
        isVeg: true
      },
      {
        id: 'sdp-6',
        name: 'Milkshake',
        description: 'Thick vanilla milkshake',
        price: 180,
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
        category: 'Beverages',
        isVeg: true
      }
    ]
  },
  {
    id: 'taco-fiesta',
    name: 'Taco Fiesta',
    cuisine: 'Mexican',
    rating: 4.2,
    deliveryTime: '20-35 min',
    image: 'https://images.unsplash.com/photo-1565299585323-38174c4a6018?w=800',
    description: 'Authentic Mexican street food with fresh ingredients and bold flavors.',
    menu: [
      {
        id: 'tf-1',
        name: 'Beef Tacos',
        description: 'Seasoned ground beef with lettuce and cheese',
        price: 280,
        image: 'https://images.unsplash.com/photo-1565299585323-38174c4a6018?w=400',
        category: 'Tacos',
        isVeg: false
      },
      {
        id: 'tf-2',
        name: 'Fish Tacos',
        description: 'Grilled fish with cabbage slaw',
        price: 320,
        image: 'https://images.unsplash.com/photo-1565299585323-38174c4a6018?w=400',
        category: 'Tacos',
        isVeg: false
      },
      {
        id: 'tf-3',
        name: 'Chicken Burrito',
        description: 'Large tortilla with chicken and beans',
        price: 380,
        image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400',
        category: 'Burritos',
        isVeg: false
      },
      {
        id: 'tf-4',
        name: 'Nachos Supreme',
        description: 'Tortilla chips with cheese and toppings',
        price: 340,
        image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400',
        category: 'Appetizers',
        isVeg: true
      },
      {
        id: 'tf-5',
        name: 'Churros',
        description: 'Fried dough with cinnamon sugar',
        price: 180,
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400',
        category: 'Desserts',
        isVeg: true
      },
      {
        id: 'tf-6',
        name: 'Margarita',
        description: 'Classic lime margarita - 250ml',
        price: 420,
        image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400',
        category: 'Alcoholic Beverages',
        isAlcoholic: true
      }
    ]
  },
  {
    id: 'wings-palace',
    name: 'Wings Palace',
    cuisine: 'American',
    rating: 4.1,
    deliveryTime: '25-40 min',
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=800',
    description: 'Crispy chicken wings with a variety of sauces and American comfort food.',
    menu: [
      {
        id: 'wp-1',
        name: 'Buffalo Wings',
        description: 'Classic buffalo wings with celery',
        price: 380,
        image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400',
        category: 'Wings',
        isVeg: false
      },
      {
        id: 'wp-2',
        name: 'BBQ Wings',
        description: 'Sweet and smoky BBQ glazed wings',
        price: 380,
        image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400',
        category: 'Wings',
        isVeg: false
      },
      {
        id: 'wp-3',
        name: 'Loaded Nachos',
        description: 'Crispy chips with cheese and jalapeños',
        price: 320,
        image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400',
        category: 'Appetizers',
        isVeg: true
      },
      {
        id: 'wp-4',
        name: 'Mac and Cheese',
        description: 'Creamy macaroni and cheese',
        price: 240,
        image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400',
        category: 'Sides',
        isVeg: true
      },
      {
        id: 'wp-5',
        name: 'Onion Rings',
        description: 'Crispy beer-battered onion rings',
        price: 180,
        image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400',
        category: 'Sides',
        isVeg: true
      },
      {
        id: 'wp-6',
        name: 'Root Beer Float',
        description: 'Root beer with vanilla ice cream',
        price: 160,
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
        category: 'Beverages',
        isVeg: true
      }
    ]
  },
  {
    id: 'pizza-express',
    name: 'Pizza Express',
    cuisine: 'Italian',
    rating: 4.0,
    deliveryTime: '20-30 min',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800',
    description: 'Fast pizza delivery with thin crust pizzas and Italian favorites.',
    menu: [
      {
        id: 'pe-1',
        name: 'Quattro Stagioni',
        description: 'Four seasons pizza with varied toppings',
        price: 520,
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
        category: 'Pizza',
        isVeg: false
      },
      {
        id: 'pe-2',
        name: 'Veggie Supreme',
        description: 'Loaded vegetable pizza',
        price: 480,
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
        category: 'Pizza',
        isVeg: true
      },
      {
        id: 'pe-3',
        name: 'Meat Lovers',
        description: 'Pizza with multiple meat toppings',
        price: 620,
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400',
        category: 'Pizza',
        isVeg: false
      },
      {
        id: 'pe-4',
        name: 'Garlic Knots',
        description: 'Twisted bread with garlic and herbs',
        price: 160,
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
        category: 'Sides',
        isVeg: true
      },
      {
        id: 'pe-5',
        name: 'Italian Soda',
        description: 'Sparkling flavored water',
        price: 120,
        image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400',
        category: 'Beverages',
        isVeg: true
      },
      {
        id: 'pe-6',
        name: 'Gelato',
        description: 'Italian ice cream - vanilla or chocolate',
        price: 180,
        image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400',
        category: 'Desserts',
        isVeg: true
      }
    ]
  },
  {
    id: 'dosa-delight',
    name: 'Dosa Delight',
    cuisine: 'South Indian',
    rating: 4.6,
    deliveryTime: '25-35 min',
    image: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=800',
    description: 'Authentic South Indian dosas, idlis, and traditional breakfast items.',
    menu: [
      {
        id: 'dd-1',
        name: 'Masala Dosa',
        description: 'Crispy dosa filled with spiced potato filling',
        price: 120,
        image: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=400',
        category: 'Dosas',
        isVeg: true
      },
      {
        id: 'dd-2',
        name: 'Paper Dosa',
        description: 'Extra crispy thin dosa',
        price: 100,
        image: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=400',
        category: 'Dosas',
        isVeg: true
      },
      {
        id: 'dd-3',
        name: 'Mysore Masala Dosa',
        description: 'Dosa with spicy red chutney and potato filling',
        price: 140,
        image: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=400',
        category: 'Dosas',
        isVeg: true
      },
      {
        id: 'dd-4',
        name: 'Rava Dosa',
        description: 'Crispy semolina dosa with onions and peppers',
        price: 130,
        image: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=400',
        category: 'Dosas',
        isVeg: true
      },
      {
        id: 'dd-5',
        name: 'Idli Sambar',
        description: 'Steamed rice cakes with lentil soup and chutneys',
        price: 80,
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400',
        category: 'Breakfast',
        isVeg: true
      },
      {
        id: 'dd-6',
        name: 'Medu Vada',
        description: 'Crispy fried lentil donuts with chutney',
        price: 70,
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400',
        category: 'Breakfast',
        isVeg: true
      },
      {
        id: 'dd-7',
        name: 'Pongal',
        description: 'Rice and lentil porridge with ghee',
        price: 90,
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400',
        category: 'Breakfast',
        isVeg: true
      },
      {
        id: 'dd-8',
        name: 'Uttapam',
        description: 'Thick pancake with onions and tomatoes',
        price: 110,
        image: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=400',
        category: 'Breakfast',
        isVeg: true
      },
      {
        id: 'dd-9',
        name: 'Filter Coffee',
        description: 'Traditional South Indian coffee',
        price: 50,
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400',
        category: 'Beverages',
        isVeg: true
      },
      {
        id: 'dd-10',
        name: 'Rasam Rice',
        description: 'Steamed rice with tangy rasam',
        price: 100,
        image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400',
        category: 'Main Course',
        isVeg: true
      }
    ]
  },
  {
    id: 'kebab-corner',
    name: 'Kebab Corner',
    cuisine: 'Mughlai',
    rating: 4.5,
    deliveryTime: '35-45 min',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800',
    description: 'Authentic Mughlai kebabs, biryanis, and rich curries.',
    menu: [
      {
        id: 'kc-1',
        name: 'Seekh Kebab',
        description: 'Grilled minced meat kebabs with spices',
        price: 320,
        image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400',
        category: 'Kebabs',
        isVeg: false
      },
      {
        id: 'kc-2',
        name: 'Chicken Tikka',
        description: 'Marinated chicken pieces grilled in tandoor',
        price: 340,
        image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400',
        category: 'Kebabs',
        isVeg: false
      },
      {
        id: 'kc-3',
        name: 'Mutton Boti Kebab',
        description: 'Tender mutton pieces marinated and grilled',
        price: 420,
        image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400',
        category: 'Kebabs',
        isVeg: false
      },
      {
        id: 'kc-4',
        name: 'Paneer Tikka',
        description: 'Marinated cottage cheese grilled to perfection',
        price: 280,
        image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400',
        category: 'Kebabs',
        isVeg: true
      },
      {
        id: 'kc-5',
        name: 'Lucknowi Biryani',
        description: 'Aromatic rice with tender chicken in dum style',
        price: 380,
        image: 'https://images.unsplash.com/photo-1563379091339-03246963d117?w=400',
        category: 'Biryani',
        isVeg: false
      },
      {
        id: 'kc-6',
        name: 'Mutton Korma',
        description: 'Rich mutton curry with cashew and cream',
        price: 450,
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400',
        category: 'Main Course',
        isVeg: false
      },
      {
        id: 'kc-7',
        name: 'Shahi Paneer',
        description: 'Cottage cheese in rich tomato and cream gravy',
        price: 320,
        image: 'https://images.unsplash.com/photo-1631292784640-2b24be784d5d?w=400',
        category: 'Main Course',
        isVeg: true
      },
      {
        id: 'kc-8',
        name: 'Roomali Roti',
        description: 'Thin handkerchief-style bread',
        price: 50,
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
        category: 'Breads',
        isVeg: true
      },
      {
        id: 'kc-9',
        name: 'Sheermal',
        description: 'Sweet saffron-flavored naan',
        price: 80,
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
        category: 'Breads',
        isVeg: true
      },
      {
        id: 'kc-10',
        name: 'Mughlai Paratha',
        description: 'Stuffed paratha with egg and minced meat',
        price: 150,
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
        category: 'Breads',
        isVeg: false
      }
    ]
  },
  {
    id: 'thai-orchid',
    name: 'Thai Orchid',
    cuisine: 'Thai',
    rating: 4.4,
    deliveryTime: '30-40 min',
    image: 'https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=800',
    description: 'Authentic Thai cuisine with fresh herbs and bold flavors.',
    menu: [
      {
        id: 'to-1',
        name: 'Tom Yum Soup',
        description: 'Spicy and sour Thai soup with shrimp',
        price: 280,
        image: 'https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=400',
        category: 'Soups',
        isVeg: false
      },
      {
        id: 'to-2',
        name: 'Thai Green Curry',
        description: 'Coconut curry with Thai basil and vegetables',
        price: 340,
        image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400',
        category: 'Main Course',
        isVeg: true
      },
      {
        id: 'to-3',
        name: 'Pad Thai',
        description: 'Stir-fried rice noodles with tofu and peanuts',
        price: 320,
        image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400',
        category: 'Noodles',
        isVeg: true
      },
      {
        id: 'to-4',
        name: 'Thai Basil Chicken',
        description: 'Stir-fried chicken with holy basil',
        price: 360,
        image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400',
        category: 'Main Course',
        isVeg: false
      },
      {
        id: 'to-5',
        name: 'Mango Sticky Rice',
        description: 'Sweet glutinous rice with fresh mango',
        price: 180,
        image: 'https://images.unsplash.com/photo-1536943342299-b51f2b12cb8e?w=400',
        category: 'Desserts',
        isVeg: true
      },
      {
        id: 'to-6',
        name: 'Thai Iced Tea',
        description: 'Creamy orange-colored iced tea',
        price: 120,
        image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400',
        category: 'Beverages',
        isVeg: true
      },
      {
        id: 'to-7',
        name: 'Spring Rolls',
        description: 'Fresh vegetable rolls with peanut sauce',
        price: 220,
        image: 'https://images.unsplash.com/photo-1559847844-d98b7fc4ffda?w=400',
        category: 'Appetizers',
        isVeg: true
      },
      {
        id: 'to-8',
        name: 'Massaman Curry',
        description: 'Rich Thai curry with potatoes and peanuts',
        price: 380,
        image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400',
        category: 'Main Course',
        isVeg: false
      }
    ]
  },
  {
    id: 'street-chaat',
    name: 'Street Chaat House',
    cuisine: 'Street Food',
    rating: 4.3,
    deliveryTime: '15-25 min',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800',
    description: 'Authentic Indian street food and chaats with tangy flavors.',
    menu: [
      {
        id: 'sc-1',
        name: 'Pani Puri',
        description: 'Crispy puris with spiced water and filling',
        price: 60,
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400',
        category: 'Chaat',
        isVeg: true
      },
      {
        id: 'sc-2',
        name: 'Bhel Puri',
        description: 'Puffed rice with vegetables and chutneys',
        price: 70,
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400',
        category: 'Chaat',
        isVeg: true
      },
      {
        id: 'sc-3',
        name: 'Sev Puri',
        description: 'Crispy puris topped with sev and chutneys',
        price: 80,
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400',
        category: 'Chaat',
        isVeg: true
      },
      {
        id: 'sc-4',
        name: 'Dahi Puri',
        description: 'Puris with yogurt and sweet chutney',
        price: 90,
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400',
        category: 'Chaat',
        isVeg: true
      },
      {
        id: 'sc-5',
        name: 'Chole Bhature',
        description: 'Spicy chickpeas with fried bread',
        price: 150,
        image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400',
        category: 'Main Course',
        isVeg: true
      },
      {
        id: 'sc-6',
        name: 'Pav Bhaji',
        description: 'Spiced vegetable mash with buttered bread',
        price: 140,
        image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400',
        category: 'Main Course',
        isVeg: true
      },
      {
        id: 'sc-7',
        name: 'Vada Pav',
        description: 'Spiced potato fritter in a bun',
        price: 50,
        image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400',
        category: 'Snacks',
        isVeg: true
      },
      {
        id: 'sc-8',
        name: 'Dabeli',
        description: 'Kutchi snack with spiced potato filling',
        price: 60,
        image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400',
        category: 'Snacks',
        isVeg: true
      },
      {
        id: 'sc-9',
        name: 'Masala Chai',
        description: 'Spiced Indian tea',
        price: 30,
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
        category: 'Beverages',
        isVeg: true
      },
      {
        id: 'sc-10',
        name: 'Lassi',
        description: 'Sweet or salted yogurt drink',
        price: 60,
        image: 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=400',
        category: 'Beverages',
        isVeg: true
      }
    ]
  },
  {
    id: 'wok-n-roll',
    name: 'Wok N Roll',
    cuisine: 'Indo-Chinese',
    rating: 4.2,
    deliveryTime: '25-35 min',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800',
    description: 'Indo-Chinese fusion with spicy noodles, manchurian, and more.',
    menu: [
      {
        id: 'wnr-1',
        name: 'Veg Manchurian',
        description: 'Fried vegetable balls in tangy sauce',
        price: 220,
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
        category: 'Main Course',
        isVeg: true
      },
      {
        id: 'wnr-2',
        name: 'Chicken Manchurian',
        description: 'Crispy chicken in manchurian sauce',
        price: 280,
        image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400',
        category: 'Main Course',
        isVeg: false
      },
      {
        id: 'wnr-3',
        name: 'Schezwan Noodles',
        description: 'Spicy noodles with schezwan sauce',
        price: 240,
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
        category: 'Noodles',
        isVeg: true
      },
      {
        id: 'wnr-4',
        name: 'Chicken Fried Rice',
        description: 'Wok-tossed rice with chicken and vegetables',
        price: 260,
        image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
        category: 'Rice',
        isVeg: false
      },
      {
        id: 'wnr-5',
        name: 'Chilli Paneer',
        description: 'Crispy paneer in spicy chilli sauce',
        price: 260,
        image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400',
        category: 'Starters',
        isVeg: true
      },
      {
        id: 'wnr-6',
        name: 'Chilli Chicken',
        description: 'Crispy chicken in spicy chilli sauce',
        price: 300,
        image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400',
        category: 'Starters',
        isVeg: false
      },
      {
        id: 'wnr-7',
        name: 'Honey Chilli Potato',
        description: 'Crispy potatoes in sweet and spicy sauce',
        price: 200,
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
        category: 'Starters',
        isVeg: true
      },
      {
        id: 'wnr-8',
        name: 'Dragon Chicken',
        description: 'Fiery hot chicken preparation',
        price: 340,
        image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400',
        category: 'Main Course',
        isVeg: false
      },
      {
        id: 'wnr-9',
        name: 'Sweet Corn Soup',
        description: 'Creamy corn soup with vegetables',
        price: 140,
        image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
        category: 'Soups',
        isVeg: true
      },
      {
        id: 'wnr-10',
        name: 'Manchow Soup',
        description: 'Spicy soup with crispy noodles',
        price: 160,
        image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
        category: 'Soups',
        isVeg: true
      }
    ]
  }
];
