import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, TransitionChild } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useNavigate } from "react-router-dom";

// Tradução para os pratos selecionados
const DISH_TRANSLATIONS = {
    // Breakfast
    "drinks": "Bebidas",
    "egg": "Ovos",
    "pancake": "Panquecas",
    "pastry": "Bolos e Tortas",
    "pies and tarts": "Tortas Doces",
    "sandwiches": "Sanduíches",
    "cereals": "Cereais",
    "ice cream and custard": "Sorvetes e Cremes",
    "pizza": "Pizza",

    // Lunch/Dinner
    "main course": "Prato Principal",
    "pasta": "Massas",
    "salad": "Saladas",
    "seafood": "Frutos do Mar",
    "side dish": "Acompanhamentos",
    "soup": "Sopas",
    "starter": "Entradas",
    "biscuits and cookies": "Biscoitos e Cookies",
    "bread": "Pães",
    "desserts": "Sobremesas"
};

// Arrays de pratos para cada refeição
const BREAKFAST_DISHES = [
    "drinks", "egg", "pancake", "pastry", "pies and tarts",
    "sandwiches", "cereals", "ice cream and custard", "pizza"
];

const LUNCH_DISHES = [
    "main course", "egg", "pasta", "pizza", "salad",
    "sandwiches", "seafood", "side dish", "soup",
    "starter", "biscuits and cookies", "bread",
    "cereals", "drinks", "pancake"
];

const DINNER_DISHES = [
    "main course", "egg", "pasta", "pizza", "salad",
    "sandwiches", "seafood", "soup", "drinks",
    "cereals", "desserts", "bread"
];

const mockData = {
    "plans": [
        {
            "dayOfWeek": "MONDAY",
            "meals": [
                {
                    "mealType": "Breakfast",
                    "uriEdamam": "RANDOM",
                    "imageUrl": "RANDOM",
                    "urlRecipe": "RANDOM",
                    "calories": 99999999,
                    "carbohydrate": 999999,
                    "protein": 9999999,
                    "fat": 999999,
                    "fiber": 99999,
                    "yield": 9999999,
                    "prepareInstructions": "99999999"
                },
                {
                    "mealType": "Lunch/dinner",
                    "uriEdamam": "http://www.edamam.com/ontologies/edamam.owl#recipe_39dc6e4297be6b0edb49325c27f7b937",
                    "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/17d/17ddc8628a870a74c9fe1b731dba7c01.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLWVhc3QtMSJGMEQCIFHbJ8L48gCNrLznFLJrHJktmGMwzAWG1jWV%2BH250I27AiBlpYXSnTDPy4VkbUP%2Fb1TQQqF2UeaQcQftwBbrfMIeqiq5BQg7EAAaDDE4NzAxNzE1MDk4NiIMn7c%2BkgNIiSxwC3pcKpYF97Vc4ZAEyuhJt4BfYKWeT9G%2Bi5sAPOvFny2pLo%2FLoiePxqH2TDLtrTmASjN8oONMPKy%2BsahcdqctgJcNiNEjdtfXQbVfs3MA%2FTdYR0qfalcTYh62pRgzFOadHYokRzKeQ17oFoG20zAK63i1TzYwks0h3OME7oF6HZCQ00TQRMQ94mtpIJ2kk4LszFcjtoOXjmk8FnDbb2AfU6flomJSKDv3eBEZfyu%2FeHjV%2FxWqol9ZrM0tpu8EdunVg9tOjb3YjYKIfBeXbS5wvogwGqXn9JvXPG%2BHBOTFAv8kc6jx4ZohGBv%2Fl1LEtms%2B4Rcqm9DqwVi4W6Aki3hSL0YNqZ6Cc28lYhHCxaskdb32VRNqUvUdb%2F9FGh2jxTMys9jKba4cqEoMAByZLmsn48sTBz3gEOfA3Fdqg4VWDiNlpVJsrXkamM%2BJsWAq0eQaIFxwJHSn3EuMAeu1DHJc6lreILz08xCSxSCIysnxC6ZEEkXXrtG6WsqOFb95wrU8VIPb4AaC2zMGI4FAFH9088mKhm7PVLqedHyRIUGGLlhE3TrnhI8pksdN1jSoUxKa4dqjcxhYOnkgHQDTuXUig1ocdOt5qlTfL0c8nTJQ0sh%2ByoeyplYPerSc%2BJQFWHXZ90GWcRBZTO6gGEkvHyThWMY3cfkwfB2zF%2Fa5V8Xe1%2FjXZFlaX%2FcCILq5gNtmp1PWlpfZ92EDZ298s4pplpbLy8xNnQGMK5yCuE%2FSvZlE0so%2FpHosyfYIlb2NfGl5i7i%2BCY%2FqAhRPjpvlb7FMIC5bwEH%2BaJHE3DffST80IfFJxchgxNDimPT6fDH8mOK6OWZl7dnUpWzGuXJNzlxkMkDohuwEylMeX4%2FTdq%2BN2GxqUNBRQ3HdHy7m2JrHIggwidW4wgY6sgGNYUwU7xM5qzEXOmiQxTlhTm%2BJEeNGwBtMI6GSiewBWBXjYWTllv6qJg6Eu2dNajwMJT5VO74oJuxUNRi6D%2BGJlWqNar3eGqICUl0eBIGzOj4vuLRhyF1R1qYaeNXjwCbujwIGG673mKoG22cIwDwO4KGlRieL0xN187LbUwcfSuT%2FXZmZsDjCQGwZHoUXfBKD%2FDOAWiMzzPNjLc843he0crPY2tenPIvZamMyXE2%2FgN3G&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250615T022622Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFKFYQV6B2%2F20250615%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=f5ec2b9b7e9dd26d10366751d545daa31896d6e5fc637d748f44fcae58018a29",
                    "urlRecipe": "http://www.bbcgoodfood.com/recipes/7746/grilled-mediterranean-veg-with-bean-mash",
                    "calories": 962.9842806411805,
                    "carbohydrate": 143.04891566212993,
                    "protein": 41.97461258465295,
                    "fat": 31.748941780941845,
                    "fiber": 44.93353502790279,
                    "yield": 2,
                    "prepareInstructions": "1 red pepper, deseeded and quartered, 1 aubergine, sliced lengthways, 2 courgette, sliced lengthways, 2 tbsp olive oil, 410g can haricot bean, rinsed, 1 garlic clove, crushed, 100ml vegetable stock, 1 tbsp chopped coriander, lemon wedges, to serve"
                },
                {
                    "mealType": "Lunch/dinner",
                    "uriEdamam": "http://www.edamam.com/ontologies/edamam.owl#recipe_348699c1b74786824f9359d26f8bb74c",
                    "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/e5c/e5c39a55314e7a435198084aefa7bcc0?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLWVhc3QtMSJGMEQCIFHbJ8L48gCNrLznFLJrHJktmGMwzAWG1jWV%2BH250I27AiBlpYXSnTDPy4VkbUP%2Fb1TQQqF2UeaQcQftwBbrfMIeqiq5BQg7EAAaDDE4NzAxNzE1MDk4NiIMn7c%2BkgNIiSxwC3pcKpYF97Vc4ZAEyuhJt4BfYKWeT9G%2Bi5sAPOvFny2pLo%2FLoiePxqH2TDLtrTmASjN8oONMPKy%2BsahcdqctgJcNiNEjdtfXQbVfs3MA%2FTdYR0qfalcTYh62pRgzFOadHYokRzKeQ17oFoG20zAK63i1TzYwks0h3OME7oF6HZCQ00TQRMQ94mtpIJ2kk4LszFcjtoOXjmk8FnDbb2AfU6flomJSKDv3eBEZfyu%2FeHjV%2FxWqol9ZrM0tpu8EdunVg9tOjb3YjYKIfBeXbS5wvogwGqXn9JvXPG%2BHBOTFAv8kc6jx4ZohGBv%2Fl1LEtms%2B4Rcqm9DqwVi4W6Aki3hSL0YNqZ6Cc28lYhHCxaskdb32VRNqUvUdb%2F9FGh2jxTMys9jKba4cqEoMAByZLmsn48sTBz3gEOfA3Fdqg4VWDiNlpVJsrXkamM%2BJsWAq0eQaIFxwJHSn3EuMAeu1DHJc6lreILz08xCSxSCIysnxC6ZEEkXXrtG6WsqOFb95wrU8VIPb4AaC2zMGI4FAFH9088mKhm7PVLqedHyRIUGGLlhE3TrnhI8pksdN1jSoUxKa4dqjcxhYOnkgHQDTuXUig1ocdOt5qlTfL0c8nTJQ0sh%2ByoeyplYPerSc%2BJQFWHXZ90GWcRBZTO6gGEkvHyThWMY3cfkwfB2zF%2Fa5V8Xe1%2FjXZFlaX%2FcCILq5gNtmp1PWlpfZ92EDZ298s4pplpbLy8xNnQGMK5yCuE%2FSvZlE0so%2FpHosyfYIlb2NfGl5i7i%2BCY%2FqAhRPjpvlb7FMIC5bwEH%2BaJHE3DffST80IfFJxchgxNDimPT6fDH8mOK6OWZl7dnUpWzGuXJNzlxkMkDohuwEylMeX4%2FTdq%2BN2GxqUNBRQ3HdHy7m2JrHIggwidW4wgY6sgGNYUwU7xM5qzEXOmiQxTlhTm%2BJEeNGwBtMI6GSiewBWBXjYWTllv6qJg6Eu2dNajwMJT5VO74oJuxUNRi6D%2BGJlWqNar3eGqICUl0eBIGzOj4vuLRhyF1R1qYaeNXjwCbujwIGG673mKoG22cIwDwO4KGlRieL0xN187LbUwcfSuT%2FXZmZsDjCQGwZHoUXfBKD%2FDOAWiMzzPNjLc843he0crPY2tenPIvZamMyXE2%2FgN3G&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250615T022622Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFKFYQV6B2%2F20250615%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=c95338b1d550a3dd75e22ef87a25428ad79f35f7d3203fe9c8a291c3cc396103",
                    "urlRecipe": "http://www.womaninreallife.com/2015/10/vegan-and-gluten-free-thai-red-curry.html",
                    "calories": 1881.28815,
                    "carbohydrate": 300.69525000000004,
                    "protein": 81.55130999999999,
                    "fat": 62.166318999999994,
                    "fiber": 123.237445,
                    "yield": 4,
                    "prepareInstructions": "1 cup brown rice, 1 Tbsp olive oil, 1 medium onion, sliced, 350g extra-firm tofu, cut into 1-inch cubes, 4 baby bok choy, split into leaves, 1 medium orange or yellow pepper, sliced thinly, 1 clove garlic, minced, 1 package (198g) Saffron Road Thai Red Curry Simmer Sauce, fresh basil leaves, salt, pepper"
                }
            ]
        },
        {
            "dayOfWeek": "TUESDAY",
            "meals": [
                {
                    "mealType": "Breakfast",
                    "uriEdamam": "http://www.edamam.com/ontologies/edamam.owl#recipe_0afbd5c5b9bb0d924634624e146f1827",
                    "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/ca4/ca4f13fc26606cd9771ea99995f3156e.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLWVhc3QtMSJGMEQCIFHbJ8L48gCNrLznFLJrHJktmGMwzAWG1jWV%2BH250I27AiBlpYXSnTDPy4VkbUP%2Fb1TQQqF2UeaQcQftwBbrfMIeqiq5BQg7EAAaDDE4NzAxNzE1MDk4NiIMn7c%2BkgNIiSxwC3pcKpYF97Vc4ZAEyuhJt4BfYKWeT9G%2Bi5sAPOvFny2pLo%2FLoiePxqH2TDLtrTmASjN8oONMPKy%2BsahcdqctgJcNiNEjdtfXQbVfs3MA%2FTdYR0qfalcTYh62pRgzFOadHYokRzKeQ17oFoG20zAK63i1TzYwks0h3OME7oF6HZCQ00TQRMQ94mtpIJ2kk4LszFcjtoOXjmk8FnDbb2AfU6flomJSKDv3eBEZfyu%2FeHjV%2FxWqol9ZrM0tpu8EdunVg9tOjb3YjYKIfBeXbS5wvogwGqXn9JvXPG%2BHBOTFAv8kc6jx4ZohGBv%2Fl1LEtms%2B4Rcqm9DqwVi4W6Aki3hSL0YNqZ6Cc28lYhHCxaskdb32VRNqUvUdb%2F9FGh2jxTMys9jKba4cqEoMAByZLmsn48sTBz3gEOfA3Fdqg4VWDiNlpVJsrXkamM%2BJsWAq0eQaIFxwJHSn3EuMAeu1DHJc6lreILz08xCSxSCIysnxC6ZEEkXXrtG6WsqOFb95wrU8VIPb4AaC2zMGI4FAFH9088mKhm7PVLqedHyRIUGGLlhE3TrnhI8pksdN1jSoUxKa4dqjcxhYOnkgHQDTuXUig1ocdOt5qlTfL0c8nTJQ0sh%2ByoeyplYPerSc%2BJQFWHXZ90GWcRBZTO6gGEkvHyThWMY3cfkwfB2zF%2Fa5V8Xe1%2FjXZFlaX%2FcCILq5gNtmp1PWlpfZ92EDZ298s4pplpbLy8xNnQGMK5yCuE%2FSvZlE0so%2FpHosyfYIlb2NfGl5i7i%2BCY%2FqAhRPjpvlb7FMIC5bwEH%2BaJHE3DffST80IfFJxchgxNDimPT6fDH8mOK6OWZl7dnUpWzGuXJNzlxkMkDohuwEylMeX4%2FTdq%2BN2GxqUNBRQ3HdHy7m2JrHIggwidW4wgY6sgGNYUwU7xM5qzEXOmiQxTlhTm%2BJEeNGwBtMI6GSiewBWBXjYWTllv6qJg6Eu2dNajwMJT5VO74oJuxUNRi6D%2BGJlWqNar3eGqICUl0eBIGzOj4vuLRhyF1R1qYaeNXjwCbujwIGG673mKoG22cIwDwO4KGlRieL0xN187LbUwcfSuT%2FXZmZsDjCQGwZHoUXfBKD%2FDOAWiMzzPNjLc843he0crPY2tenPIvZamMyXE2%2FgN3G&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250615T022622Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFKFYQV6B2%2F20250615%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=fc17cd6e0c49ebc43f49f6d1008a869b4349ad35bf4766fc229ce44a43def2c3",
                    "urlRecipe": "http://eatthegains.com/key-lime-pie-protein-overnight-oats/",
                    "calories": 898.5823333327612,
                    "carbohydrate": 120.3202616666177,
                    "protein": 40.71604999999256,
                    "fat": 28.063533333286554,
                    "fiber": 0,
                    "yield": 4,
                    "prepareInstructions": "* 2/3 cup unsweetened cashew milk, * 2 tablespoon plus 1 teaspoon fresh key lime juice (about 7 lime), * 2 tablespoon avocado, * 1/4 teaspoon vanilla, * 1 serving vanilla protein powder (i like fitppl), * 1/2 cup oat*, * 1 tablespoon chia seed, * 1/4 teaspoon key lime zest"
                },
                {
                    "mealType": "Lunch/dinner",
                    "uriEdamam": "http://www.edamam.com/ontologies/edamam.owl#recipe_f75410afe37e8fcb4f16dcd8b9164e1f",
                    "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/ec8/ec83b527a71a76d1b26b0b1362d07a5e.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLWVhc3QtMSJGMEQCIFHbJ8L48gCNrLznFLJrHJktmGMwzAWG1jWV%2BH250I27AiBlpYXSnTDPy4VkbUP%2Fb1TQQqF2UeaQcQftwBbrfMIeqiq5BQg7EAAaDDE4NzAxNzE1MDk4NiIMn7c%2BkgNIiSxwC3pcKpYF97Vc4ZAEyuhJt4BfYKWeT9G%2Bi5sAPOvFny2pLo%2FLoiePxqH2TDLtrTmASjN8oONMPKy%2BsahcdqctgJcNiNEjdtfXQbVfs3MA%2FTdYR0qfalcTYh62pRgzFOadHYokRzKeQ17oFoG20zAK63i1TzYwks0h3OME7oF6HZCQ00TQRMQ94mtpIJ2kk4LszFcjtoOXjmk8FnDbb2AfU6flomJSKDv3eBEZfyu%2FeHjV%2FxWqol9ZrM0tpu8EdunVg9tOjb3YjYKIfBeXbS5wvogwGqXn9JvXPG%2BHBOTFAv8kc6jx4ZohGBv%2Fl1LEtms%2B4Rcqm9DqwVi4W6Aki3hSL0YNqZ6Cc28lYhHCxaskdb32VRNqUvUdb%2F9FGh2jxTMys9jKba4cqEoMAByZLmsn48sTBz3gEOfA3Fdqg4VWDiNlpVJsrXkamM%2BJsWAq0eQaIFxwJHSn3EuMAeu1DHJc6lreILz08xCSxSCIysnxC6ZEEkXXrtG6WsqOFb95wrU8VIPb4AaC2zMGI4FAFH9088mKhm7PVLqedHyRIUGGLlhE3TrnhI8pksdN1jSoUxKa4dqjcxhYOnkgHQDTuXUig1ocdOt5qlTfL0c8nTJQ0sh%2ByoeyplYPerSc%2BJQFWHXZ90GWcRBZTO6gGEkvHyThWMY3cfkwfB2zF%2Fa5V8Xe1%2FjXZFlaX%2FcCILq5gNtmp1PWlpfZ92EDZ298s4pplpbLy8xNnQGMK5yCuE%2FSvZlE0so%2FpHosyfYIlb2NfGl5i7i%2BCY%2FqAhRPjpvlb7FMIC5bwEH%2BaJHE3DffST80IfFJxchgxNDimPT6fDH8mOK6OWZl7dnUpWzGuXJNzlxkMkDohuwEylMeX4%2FTdq%2BN2GxqUNBRQ3HdHy7m2JrHIggwidW4wgY6sgGNYUwU7xM5qzEXOmiQxTlhTm%2BJEeNGwBtMI6GSiewBWBXjYWTllv6qJg6Eu2dNajwMJT5VO74oJuxUNRi6D%2BGJlWqNar3eGqICUl0eBIGzOj4vuLRhyF1R1qYaeNXjwCbujwIGG673mKoG22cIwDwO4KGlRieL0xN187LbUwcfSuT%2FXZmZsDjCQGwZHoUXfBKD%2FDOAWiMzzPNjLc843he0crPY2tenPIvZamMyXE2%2FgN3G&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250615T022622Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFKFYQV6B2%2F20250615%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=086968b150cc6be0db24c99e0b5f280bf76aae196c3f19efc4b971b50e74dedd",
                    "urlRecipe": "http://www.howsweeteats.com/2011/01/roasted-garlic-red-pepper-and-mushroom-quinoa/",
                    "calories": 965.85,
                    "carbohydrate": 131.32334999999998,
                    "protein": 28.969049999999996,
                    "fat": 37.911500000000004,
                    "fiber": 14.864500000000001,
                    "yield": 2,
                    "prepareInstructions": "1 head garlic, 1 cup of quinoa, 2 tablespoons olive oil, 1/2 cup chopped red pepper, 1/2 cup chopped mushrooms, salt & pepper to taste"
                },
                {
                    "mealType": "Lunch/dinner",
                    "uriEdamam": "http://www.edamam.com/ontologies/edamam.owl#recipe_f8792a85f41ae17c9908b161e122f5db",
                    "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/7e1/7e1a74efcba7854be3d509fe9fe6e5f0?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLWVhc3QtMSJGMEQCIFHbJ8L48gCNrLznFLJrHJktmGMwzAWG1jWV%2BH250I27AiBlpYXSnTDPy4VkbUP%2Fb1TQQqF2UeaQcQftwBbrfMIeqiq5BQg7EAAaDDE4NzAxNzE1MDk4NiIMn7c%2BkgNIiSxwC3pcKpYF97Vc4ZAEyuhJt4BfYKWeT9G%2Bi5sAPOvFny2pLo%2FLoiePxqH2TDLtrTmASjN8oONMPKy%2BsahcdqctgJcNiNEjdtfXQbVfs3MA%2FTdYR0qfalcTYh62pRgzFOadHYokRzKeQ17oFoG20zAK63i1TzYwks0h3OME7oF6HZCQ00TQRMQ94mtpIJ2kk4LszFcjtoOXjmk8FnDbb2AfU6flomJSKDv3eBEZfyu%2FeHjV%2FxWqol9ZrM0tpu8EdunVg9tOjb3YjYKIfBeXbS5wvogwGqXn9JvXPG%2BHBOTFAv8kc6jx4ZohGBv%2Fl1LEtms%2B4Rcqm9DqwVi4W6Aki3hSL0YNqZ6Cc28lYhHCxaskdb32VRNqUvUdb%2F9FGh2jxTMys9jKba4cqEoMAByZLmsn48sTBz3gEOfA3Fdqg4VWDiNlpVJsrXkamM%2BJsWAq0eQaIFxwJHSn3EuMAeu1DHJc6lreILz08xCSxSCIysnxC6ZEEkXXrtG6WsqOFb95wrU8VIPb4AaC2zMGI4FAFH9088mKhm7PVLqedHyRIUGGLlhE3TrnhI8pksdN1jSoUxKa4dqjcxhYOnkgHQDTuXUig1ocdOt5qlTfL0c8nTJQ0sh%2ByoeyplYPerSc%2BJQFWHXZ90GWcRBZTO6gGEkvHyThWMY3cfkwfB2zF%2Fa5V8Xe1%2FjXZFlaX%2FcCILq5gNtmp1PWlpfZ92EDZ298s4pplpbLy8xNnQGMK5yCuE%2FSvZlE0so%2FpHosyfYIlb2NfGl5i7i%2BCY%2FqAhRPjpvlb7FMIC5bwEH%2BaJHE3DffST80IfFJxchgxNDimPT6fDH8mOK6OWZl7dnUpWzGuXJNzlxkMkDohuwEylMeX4%2FTdq%2BN2GxqUNBRQ3HdHy7m2JrHIggwidW4wgY6sgGNYUwU7xM5qzEXOmiQxTlhTm%2BJEeNGwBtMI6GSiewBWBXjYWTllv6qJg6Eu2dNajwMJT5VO74oJuxUNRi6D%2BGJlWqNar3eGqICUl0eBIGzOj4vuLRhyF1R1qYaeNXjwCbujwIGG673mKoG22cIwDwO4KGlRieL0xN187LbUwcfSuT%2FXZmZsDjCQGwZHoUXfBKD%2FDOAWiMzzPNjLc843he0crPY2tenPIvZamMyXE2%2FgN3G&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250615T022622Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFKFYQV6B2%2F20250615%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=2788437c46ef644619a2f1480ecf732ce659c48c752c23b576467407507644df",
                    "urlRecipe": "http://www.eatprayjuice.us/2015/02/roasted-cauliflower-curry-with-greens.html",
                    "calories": 1892.1218396364584,
                    "carbohydrate": 278.64959145478826,
                    "protein": 56.937747593604165,
                    "fat": 69.52079766680556,
                    "fiber": 0,
                    "yield": 4,
                    "prepareInstructions": "1 head cauliflower, cut into bite-sized florets, 2 tablespoons melted coconut oil, 1/4 teaspoon cayenne pepper, salt, 3 teaspoons melted coconut oil, 1 large yellow onion, chopped, 1 1/2 teaspoons ground ginger, 1 1/2 teaspoons ground turmeric, 3/4 teaspoon curry powder, 3/4 teaspoon ground cardamom, 1 1/2, 14 ounce cans coconut milk (21 ounces total, you can freeze any extra for next time), 3/4 cup water, 1 1/2 cups quinoa, rinsed well, 1/2 cup raisins, 1 teaspoon course salt, 1 tablespoon cider vinegar, 5 ounces baby kale or spinach, 2 green onions, chopped for garnish, red pepper flakes"
                }
            ]
        },
        {
            "dayOfWeek": "WEDNESDAY",
            "meals": [
                {
                    "mealType": "Breakfast",
                    "uriEdamam": "http://www.edamam.com/ontologies/edamam.owl#recipe_f3cafb99bce912cfc32f4eacdc43a6d4",
                    "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/6a8/6a86aaad0d6acbc6e16102e1557fbeb2?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLWVhc3QtMSJGMEQCIFHbJ8L48gCNrLznFLJrHJktmGMwzAWG1jWV%2BH250I27AiBlpYXSnTDPy4VkbUP%2Fb1TQQqF2UeaQcQftwBbrfMIeqiq5BQg7EAAaDDE4NzAxNzE1MDk4NiIMn7c%2BkgNIiSxwC3pcKpYF97Vc4ZAEyuhJt4BfYKWeT9G%2Bi5sAPOvFny2pLo%2FLoiePxqH2TDLtrTmASjN8oONMPKy%2BsahcdqctgJcNiNEjdtfXQbVfs3MA%2FTdYR0qfalcTYh62pRgzFOadHYokRzKeQ17oFoG20zAK63i1TzYwks0h3OME7oF6HZCQ00TQRMQ94mtpIJ2kk4LszFcjtoOXjmk8FnDbb2AfU6flomJSKDv3eBEZfyu%2FeHjV%2FxWqol9ZrM0tpu8EdunVg9tOjb3YjYKIfBeXbS5wvogwGqXn9JvXPG%2BHBOTFAv8kc6jx4ZohGBv%2Fl1LEtms%2B4Rcqm9DqwVi4W6Aki3hSL0YNqZ6Cc28lYhHCxaskdb32VRNqUvUdb%2F9FGh2jxTMys9jKba4cqEoMAByZLmsn48sTBz3gEOfA3Fdqg4VWDiNlpVJsrXkamM%2BJsWAq0eQaIFxwJHSn3EuMAeu1DHJc6lreILz08xCSxSCIysnxC6ZEEkXXrtG6WsqOFb95wrU8VIPb4AaC2zMGI4FAFH9088mKhm7PVLqedHyRIUGGLlhE3TrnhI8pksdN1jSoUxKa4dqjcxhYOnkgHQDTuXUig1ocdOt5qlTfL0c8nTJQ0sh%2ByoeyplYPerSc%2BJQFWHXZ90GWcRBZTO6gGEkvHyThWMY3cfkwfB2zF%2Fa5V8Xe1%2FjXZFlaX%2FcCILq5gNtmp1PWlpfZ92EDZ298s4pplpbLy8xNnQGMK5yCuE%2FSvZlE0so%2FpHosyfYIlb2NfGl5i7i%2BCY%2FqAhRPjpvlb7FMIC5bwEH%2BaJHE3DffST80IfFJxchgxNDimPT6fDH8mOK6OWZl7dnUpWzGuXJNzlxkMkDohuwEylMeX4%2FTdq%2BN2GxqUNBRQ3HdHy7m2JrHIggwidW4wgY6sgGNYUwU7xM5qzEXOmiQxTlhTm%2BJEeNGwBtMI6GSiewBWBXjYWTllv6qJg6Eu2dNajwMJT5VO74oJuxUNRi6D%2BGJlWqNar3eGqICUl0eBIGzOj4vuLRhyF1R1qYaeNXjwCbujwIGG673mKoG22cIwDwO4KGlRieL0xN187LbUwcfSuT%2FXZmZsDjCQGwZHoUXfBKD%2FDOAWiMzzPNjLc843he0crPY2tenPIvZamMyXE2%2FgN3G&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250615T022622Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFKFYQV6B2%2F20250615%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=b542b86300b5a6a65207e2ca82133435ed4c4209eed3704baeeb31aa0fc9223e",
                    "urlRecipe": "http://divaliciousrecipes.com/2017/05/07/strawberry-chia-jam/",
                    "calories": 223.89624999983135,
                    "carbohydrate": 35.88919999995878,
                    "protein": 6.056024999998998,
                    "fat": 8.28,
                    "fiber": 14.353249999999708,
                    "yield": 1,
                    "prepareInstructions": "2 cups strawberries fresh or frozen, 2 tablespoons erythritol or sugar substitute, 2 tablespoons chia seeds"
                },
                {
                    "mealType": "Lunch/dinner",
                    "uriEdamam": "http://www.edamam.com/ontologies/edamam.owl#recipe_61cbd7152bc40d7bacb314e4d73578b9",
                    "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/710/7101ee78bc7f2452bbeaa6020426c97e.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLWVhc3QtMSJGMEQCIFHbJ8L48gCNrLznFLJrHJktmGMwzAWG1jWV%2BH250I27AiBlpYXSnTDPy4VkbUP%2Fb1TQQqF2UeaQcQftwBbrfMIeqiq5BQg7EAAaDDE4NzAxNzE1MDk4NiIMn7c%2BkgNIiSxwC3pcKpYF97Vc4ZAEyuhJt4BfYKWeT9G%2Bi5sAPOvFny2pLo%2FLoiePxqH2TDLtrTmASjN8oONMPKy%2BsahcdqctgJcNiNEjdtfXQbVfs3MA%2FTdYR0qfalcTYh62pRgzFOadHYokRzKeQ17oFoG20zAK63i1TzYwks0h3OME7oF6HZCQ00TQRMQ94mtpIJ2kk4LszFcjtoOXjmk8FnDbb2AfU6flomJSKDv3eBEZfyu%2FeHjV%2FxWqol9ZrM0tpu8EdunVg9tOjb3YjYKIfBeXbS5wvogwGqXn9JvXPG%2BHBOTFAv8kc6jx4ZohGBv%2Fl1LEtms%2B4Rcqm9DqwVi4W6Aki3hSL0YNqZ6Cc28lYhHCxaskdb32VRNqUvUdb%2F9FGh2jxTMys9jKba4cqEoMAByZLmsn48sTBz3gEOfA3Fdqg4VWDiNlpVJsrXkamM%2BJsWAq0eQaIFxwJHSn3EuMAeu1DHJc6lreILz08xCSxSCIysnxC6ZEEkXXrtG6WsqOFb95wrU8VIPb4AaC2zMGI4FAFH9088mKhm7PVLqedHyRIUGGLlhE3TrnhI8pksdN1jSoUxKa4dqjcxhYOnkgHQDTuXUig1ocdOt5qlTfL0c8nTJQ0sh%2ByoeyplYPerSc%2BJQFWHXZ90GWcRBZTO6gGEkvHyThWMY3cfkwfB2zF%2Fa5V8Xe1%2FjXZFlaX%2FcCILq5gNtmp1PWlpfZ92EDZ298s4pplpbLy8xNnQGMK5yCuE%2FSvZlE0so%2FpHosyfYIlb2NfGl5i7i%2BCY%2FqAhRPjpvlb7FMIC5bwEH%2BaJHE3DffST80IfFJxchgxNDimPT6fDH8mOK6OWZl7dnUpWzGuXJNzlxkMkDohuwEylMeX4%2FTdq%2BN2GxqUNBRQ3HdHy7m2JrHIggwidW4wgY6sgGNYUwU7xM5qzEXOmiQxTlhTm%2BJEeNGwBtMI6GSiewBWBXjYWTllv6qJg6Eu2dNajwMJT5VO74oJuxUNRi6D%2BGJlWqNar3eGqICUl0eBIGzOj4vuLRhyF1R1qYaeNXjwCbujwIGG673mKoG22cIwDwO4KGlRieL0xN187LbUwcfSuT%2FXZmZsDjCQGwZHoUXfBKD%2FDOAWiMzzPNjLc843he0crPY2tenPIvZamMyXE2%2FgN3G&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250615T022622Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFKFYQV6B2%2F20250615%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=790f0533e5769293203f4fd5bd7f7e92b86c03b20be01169c730773c8bcbcee6",
                    "urlRecipe": "https://www.sweetmonday.co.uk/2020/07/recipe-vegan-tomato-ragu-butter-bean-mash.html",
                    "calories": 966.091,
                    "carbohydrate": 138.4716,
                    "protein": 40.437599999999996,
                    "fat": 37.51749,
                    "fiber": 32.474900000000005,
                    "yield": 2,
                    "prepareInstructions": "1 red onion, diced, 2 garlic cloves, crushed, 200g courgette, sliced into half moons, 120g chestnut mushrooms, sliced, 200g passata, 80g sundried tomatoes, 30g pitted black olives, 1 tsp dried basil, 240g butter beans, drained, 100ml boiling water, 2 tbsp oil, 40g spinach"
                },
                {
                    "mealType": "Lunch/dinner",
                    "uriEdamam": "http://www.edamam.com/ontologies/edamam.owl#recipe_45008036468eb91387aa204d1bcfb051",
                    "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/1f4/1f4373ca4e61ff6f2a7fff85f163e921.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLWVhc3QtMSJGMEQCIFHbJ8L48gCNrLznFLJrHJktmGMwzAWG1jWV%2BH250I27AiBlpYXSnTDPy4VkbUP%2Fb1TQQqF2UeaQcQftwBbrfMIeqiq5BQg7EAAaDDE4NzAxNzE1MDk4NiIMn7c%2BkgNIiSxwC3pcKpYF97Vc4ZAEyuhJt4BfYKWeT9G%2Bi5sAPOvFny2pLo%2FLoiePxqH2TDLtrTmASjN8oONMPKy%2BsahcdqctgJcNiNEjdtfXQbVfs3MA%2FTdYR0qfalcTYh62pRgzFOadHYokRzKeQ17oFoG20zAK63i1TzYwks0h3OME7oF6HZCQ00TQRMQ94mtpIJ2kk4LszFcjtoOXjmk8FnDbb2AfU6flomJSKDv3eBEZfyu%2FeHjV%2FxWqol9ZrM0tpu8EdunVg9tOjb3YjYKIfBeXbS5wvogwGqXn9JvXPG%2BHBOTFAv8kc6jx4ZohGBv%2Fl1LEtms%2B4Rcqm9DqwVi4W6Aki3hSL0YNqZ6Cc28lYhHCxaskdb32VRNqUvUdb%2F9FGh2jxTMys9jKba4cqEoMAByZLmsn48sTBz3gEOfA3Fdqg4VWDiNlpVJsrXkamM%2BJsWAq0eQaIFxwJHSn3EuMAeu1DHJc6lreILz08xCSxSCIysnxC6ZEEkXXrtG6WsqOFb95wrU8VIPb4AaC2zMGI4FAFH9088mKhm7PVLqedHyRIUGGLlhE3TrnhI8pksdN1jSoUxKa4dqjcxhYOnkgHQDTuXUig1ocdOt5qlTfL0c8nTJQ0sh%2ByoeyplYPerSc%2BJQFWHXZ90GWcRBZTO6gGEkvHyThWMY3cfkwfB2zF%2Fa5V8Xe1%2FjXZFlaX%2FcCILq5gNtmp1PWlpfZ92EDZ298s4pplpbLy8xNnQGMK5yCuE%2FSvZlE0so%2FpHosyfYIlb2NfGl5i7i%2BCY%2FqAhRPjpvlb7FMIC5bwEH%2BaJHE3DffST80IfFJxchgxNDimPT6fDH8mOK6OWZl7dnUpWzGuXJNzlxkMkDohuwEylMeX4%2FTdq%2BN2GxqUNBRQ3HdHy7m2JrHIggwidW4wgY6sgGNYUwU7xM5qzEXOmiQxTlhTm%2BJEeNGwBtMI6GSiewBWBXjYWTllv6qJg6Eu2dNajwMJT5VO74oJuxUNRi6D%2BGJlWqNar3eGqICUl0eBIGzOj4vuLRhyF1R1qYaeNXjwCbujwIGG673mKoG22cIwDwO4KGlRieL0xN187LbUwcfSuT%2FXZmZsDjCQGwZHoUXfBKD%2FDOAWiMzzPNjLc843he0crPY2tenPIvZamMyXE2%2FgN3G&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250615T022622Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFKFYQV6B2%2F20250615%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=738987a96c5b538b93fd24aaef3b858c51c6aa150fb0b65b1cbc89c1519cf0e0",
                    "urlRecipe": "https://tastefulventure.com/quinoa-fajita-bowls/",
                    "calories": 1893.6645112166723,
                    "carbohydrate": 244.54522289023737,
                    "protein": 62.00152980743913,
                    "fat": 85.22168420344914,
                    "fiber": 73.12762462165071,
                    "yield": 4,
                    "prepareInstructions": "1 cup uncooked Quinoa, 2 Tbs EVOO (extra virgin olive oil), 2 Baby Bella Red Peppers sliced thin, 2 Baby Bella Orange Peppers sliced thin, 2 Baby Bella Yellow Peppers sliced thin, 1/2 medium Yellow Onion sliced thin, 1 tsp Chili Powder, 1 tsp Paprika, 1 tsp Garlic Powder, 1 tsp Cumin, 1/2 tsp Oregano, 1 tsp Sea Salt, 1/2 tsp Black Pepper, 1/4 cup Water, 1/4 cup chopped fresh Cilantro, Juice from 1 Lime (about 2–3 Tbs), 1 15oz can Black Beans drained and rinsed, 3 Roma Tomatoes diced, 1 – 2 Avocados sliced, Chopped Romaine Lettuce, Lime wedges and more cilantro for garnish if desired"
                }
            ]
        },
        {
            "dayOfWeek": "THURSDAY",
            "meals": [
                {
                    "mealType": "Lunch/dinner",
                    "uriEdamam": "http://www.edamam.com/ontologies/edamam.owl#recipe_21815ca5eb911b210b9f4153233da5cb",
                    "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/423/4231b5b69a8c23443db355f99fc044d1?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLWVhc3QtMSJGMEQCIFHbJ8L48gCNrLznFLJrHJktmGMwzAWG1jWV%2BH250I27AiBlpYXSnTDPy4VkbUP%2Fb1TQQqF2UeaQcQftwBbrfMIeqiq5BQg7EAAaDDE4NzAxNzE1MDk4NiIMn7c%2BkgNIiSxwC3pcKpYF97Vc4ZAEyuhJt4BfYKWeT9G%2Bi5sAPOvFny2pLo%2FLoiePxqH2TDLtrTmASjN8oONMPKy%2BsahcdqctgJcNiNEjdtfXQbVfs3MA%2FTdYR0qfalcTYh62pRgzFOadHYokRzKeQ17oFoG20zAK63i1TzYwks0h3OME7oF6HZCQ00TQRMQ94mtpIJ2kk4LszFcjtoOXjmk8FnDbb2AfU6flomJSKDv3eBEZfyu%2FeHjV%2FxWqol9ZrM0tpu8EdunVg9tOjb3YjYKIfBeXbS5wvogwGqXn9JvXPG%2BHBOTFAv8kc6jx4ZohGBv%2Fl1LEtms%2B4Rcqm9DqwVi4W6Aki3hSL0YNqZ6Cc28lYhHCxaskdb32VRNqUvUdb%2F9FGh2jxTMys9jKba4cqEoMAByZLmsn48sTBz3gEOfA3Fdqg4VWDiNlpVJsrXkamM%2BJsWAq0eQaIFxwJHSn3EuMAeu1DHJc6lreILz08xCSxSCIysnxC6ZEEkXXrtG6WsqOFb95wrU8VIPb4AaC2zMGI4FAFH9088mKhm7PVLqedHyRIUGGLlhE3TrnhI8pksdN1jSoUxKa4dqjcxhYOnkgHQDTuXUig1ocdOt5qlTfL0c8nTJQ0sh%2ByoeyplYPerSc%2BJQFWHXZ90GWcRBZTO6gGEkvHyThWMY3cfkwfB2zF%2Fa5V8Xe1%2FjXZFlaX%2FcCILq5gNtmp1PWlpfZ92EDZ298s4pplpbLy8xNnQGMK5yCuE%2FSvZlE0so%2FpHosyfYIlb2NfGl5i7i%2BCY%2FqAhRPjpvlb7FMIC5bwEH%2BaJHE3DffST80IfFJxchgxNDimPT6fDH8mOK6OWZl7dnUpWzGuXJNzlxkMkDohuwEylMeX4%2FTdq%2BN2GxqUNBRQ3HdHy7m2JrHIggwidW4wgY6sgGNYUwU7xM5qzEXOmiQxTlhTm%2BJEeNGwBtMI6GSiewBWBXjYWTllv6qJg6Eu2dNajwMJT5VO74oJuxUNRi6D%2BGJlWqNar3eGqICUl0eBIGzOj4vuLRhyF1R1qYaeNXjwCbujwIGG673mKoG22cIwDwO4KGlRieL0xN187LbUwcfSuT%2FXZmZsDjCQGwZHoUXfBKD%2FDOAWiMzzPNjLc843he0crPY2tenPIvZamMyXE2%2FgN3G&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250615T022622Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFKFYQV6B2%2F20250615%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=ad25e1995cc765021bf27d2f2ef5462ffd9b2177aa7605d09a4c6c70f403637e",
                    "urlRecipe": "http://www.destinationdelish.com/carrot-cake-quinoa-bowls/",
                    "calories": 924.8016666666667,
                    "carbohydrate": 121.77170000000001,
                    "protein": 27.266249999999992,
                    "fat": 40.194833333333335,
                    "fiber": 17.717933333333335,
                    "yield": 4,
                    "prepareInstructions": "⅔ cup uncooked quinoa, 1 ¾ cups unsweetened coconut and/or almond milk, ¾ cup grated carrots, 1 teaspoon cinnamon, ½ teaspoon vanilla extract, 2 tablespoons maple syrup, 1 tablespoon almond butter + more for topping, Pinch of salt, ¼ cup chopped and toasted walnuts"
                },
                {
                    "mealType": "Lunch/dinner",
                    "uriEdamam": "http://www.edamam.com/ontologies/edamam.owl#recipe_15e05e29a7f3440cb1b20e96561f2364",
                    "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/6fe/6fef9a4c0417342786c49ba31ac3dc18.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLWVhc3QtMSJGMEQCIFHbJ8L48gCNrLznFLJrHJktmGMwzAWG1jWV%2BH250I27AiBlpYXSnTDPy4VkbUP%2Fb1TQQqF2UeaQcQftwBbrfMIeqiq5BQg7EAAaDDE4NzAxNzE1MDk4NiIMn7c%2BkgNIiSxwC3pcKpYF97Vc4ZAEyuhJt4BfYKWeT9G%2Bi5sAPOvFny2pLo%2FLoiePxqH2TDLtrTmASjN8oONMPKy%2BsahcdqctgJcNiNEjdtfXQbVfs3MA%2FTdYR0qfalcTYh62pRgzFOadHYokRzKeQ17oFoG20zAK63i1TzYwks0h3OME7oF6HZCQ00TQRMQ94mtpIJ2kk4LszFcjtoOXjmk8FnDbb2AfU6flomJSKDv3eBEZfyu%2FeHjV%2FxWqol9ZrM0tpu8EdunVg9tOjb3YjYKIfBeXbS5wvogwGqXn9JvXPG%2BHBOTFAv8kc6jx4ZohGBv%2Fl1LEtms%2B4Rcqm9DqwVi4W6Aki3hSL0YNqZ6Cc28lYhHCxaskdb32VRNqUvUdb%2F9FGh2jxTMys9jKba4cqEoMAByZLmsn48sTBz3gEOfA3Fdqg4VWDiNlpVJsrXkamM%2BJsWAq0eQaIFxwJHSn3EuMAeu1DHJc6lreILz08xCSxSCIysnxC6ZEEkXXrtG6WsqOFb95wrU8VIPb4AaC2zMGI4FAFH9088mKhm7PVLqedHyRIUGGLlhE3TrnhI8pksdN1jSoUxKa4dqjcxhYOnkgHQDTuXUig1ocdOt5qlTfL0c8nTJQ0sh%2ByoeyplYPerSc%2BJQFWHXZ90GWcRBZTO6gGEkvHyThWMY3cfkwfB2zF%2Fa5V8Xe1%2FjXZFlaX%2FcCILq5gNtmp1PWlpfZ92EDZ298s4pplpbLy8xNnQGMK5yCuE%2FSvZlE0so%2FpHosyfYIlb2NfGl5i7i%2BCY%2FqAhRPjpvlb7FMIC5bwEH%2BaJHE3DffST80IfFJxchgxNDimPT6fDH8mOK6OWZl7dnUpWzGuXJNzlxkMkDohuwEylMeX4%2FTdq%2BN2GxqUNBRQ3HdHy7m2JrHIggwidW4wgY6sgGNYUwU7xM5qzEXOmiQxTlhTm%2BJEeNGwBtMI6GSiewBWBXjYWTllv6qJg6Eu2dNajwMJT5VO74oJuxUNRi6D%2BGJlWqNar3eGqICUl0eBIGzOj4vuLRhyF1R1qYaeNXjwCbujwIGG673mKoG22cIwDwO4KGlRieL0xN187LbUwcfSuT%2FXZmZsDjCQGwZHoUXfBKD%2FDOAWiMzzPNjLc843he0crPY2tenPIvZamMyXE2%2FgN3G&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250615T022622Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3599&X-Amz-Credential=ASIASXCYXIIFKFYQV6B2%2F20250615%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=dc5f7e43a38aec4c174795e3f26fdb0cb42dc6057fbbb3957219e8a9b576e13e",
                    "urlRecipe": "https://www.allrecipes.com/recipe/273844/vegan-coconut-lentil-curry-with-sweet-potatoes",
                    "calories": 2885.736353351161,
                    "carbohydrate": 385.3498624752124,
                    "protein": 88.11665737774672,
                    "fat": 125.34335060388355,
                    "fiber": 0,
                    "yield": 6,
                    "prepareInstructions": "3 cups vegetable broth, 2 tablespoons coconut oil, 1 medium yellow onion, diced, 2 tablespoons garam masala, 2 tablespoons minced garlic, divided, 1 (28 ounce) can crushed tomatoes, 1 tablespoon minced fresh ginger root, 1 tablespoon turmeric, 2 teaspoons sea salt, 1 cup dried lentils, 1 medium sweet potato, cubed, 1 teaspoon cayenne pepper, or more to taste, 1 (15 ounce) can coconut milk, shaken, 3 cups cooked basmati rice, 1 tablespoon chopped fresh cilantro"
                },
                {
                    "mealType": "Lunch/dinner",
                    "uriEdamam": "http://www.edamam.com/ontologies/edamam.owl#recipe_b7f306e3cbb78b5c32c3c79b240ef0b8",
                    "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/460/460f46a9399c31b6f2f9c573ef98299b.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLWVhc3QtMSJGMEQCIFHbJ8L48gCNrLznFLJrHJktmGMwzAWG1jWV%2BH250I27AiBlpYXSnTDPy4VkbUP%2Fb1TQQqF2UeaQcQftwBbrfMIeqiq5BQg7EAAaDDE4NzAxNzE1MDk4NiIMn7c%2BkgNIiSxwC3pcKpYF97Vc4ZAEyuhJt4BfYKWeT9G%2Bi5sAPOvFny2pLo%2FLoiePxqH2TDLtrTmASjN8oONMPKy%2BsahcdqctgJcNiNEjdtfXQbVfs3MA%2FTdYR0qfalcTYh62pRgzFOadHYokRzKeQ17oFoG20zAK63i1TzYwks0h3OME7oF6HZCQ00TQRMQ94mtpIJ2kk4LszFcjtoOXjmk8FnDbb2AfU6flomJSKDv3eBEZfyu%2FeHjV%2FxWqol9ZrM0tpu8EdunVg9tOjb3YjYKIfBeXbS5wvogwGqXn9JvXPG%2BHBOTFAv8kc6jx4ZohGBv%2Fl1LEtms%2B4Rcqm9DqwVi4W6Aki3hSL0YNqZ6Cc28lYhHCxaskdb32VRNqUvUdb%2F9FGh2jxTMys9jKba4cqEoMAByZLmsn48sTBz3gEOfA3Fdqg4VWDiNlpVJsrXkamM%2BJsWAq0eQaIFxwJHSn3EuMAeu1DHJc6lreILz08xCSxSCIysnxC6ZEEkXXrtG6WsqOFb95wrU8VIPb4AaC2zMGI4FAFH9088mKhm7PVLqedHyRIUGGLlhE3TrnhI8pksdN1jSoUxKa4dqjcxhYOnkgHQDTuXUig1ocdOt5qlTfL0c8nTJQ0sh%2ByoeyplYPerSc%2BJQFWHXZ90GWcRBZTO6gGEkvHyThWMY3cfkwfB2zF%2Fa5V8Xe1%2FjXZFlaX%2FcCILq5gNtmp1PWlpfZ92EDZ298s4pplpbLy8xNnQGMK5yCuE%2FSvZlE0so%2FpHosyfYIlb2NfGl5i7i%2BCY%2FqAhRPjpvlb7FMIC5bwEH%2BaJHE3DffST80IfFJxchgxNDimPT6fDH8mOK6OWZl7dnUpWzGuXJNzlxkMkDohuwEylMeX4%2FTdq%2BN2GxqUNBRQ3HdHy7m2JrHIggwidW4wgY6sgGNYUwU7xM5qzEXOmiQxTlhTm%2BJEeNGwBtMI6GSiewBWBXjYWTllv6qJg6Eu2dNajwMJT5VO74oJuxUNRi6D%2BGJlWqNar3eGqICUl0eBIGzOj4vuLRhyF1R1qYaeNXjwCbujwIGG673mKoG22cIwDwO4KGlRieL0xN187LbUwcfSuT%2FXZmZsDjCQGwZHoUXfBKD%2FDOAWiMzzPNjLc843he0crPY2tenPIvZamMyXE2%2FgN3G&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250615T022622Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFKFYQV6B2%2F20250615%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=417a01c248258d66297e020b2086e7ce2e548246e96c045689e642aedc9082c7",
                    "urlRecipe": "http://www.food.com/recipe/black-bean-sweet-potato-jumble-367439",
                    "calories": 938.1832125859398,
                    "carbohydrate": 137.4727537072087,
                    "protein": 43.4903534149024,
                    "fat": 28.430619962267453,
                    "fiber": 48.581241348362795,
                    "yield": 2,
                    "prepareInstructions": "1 tablespoon olive oil, 1 teaspoon curry powder, 1 pinch cinnamon, 1 small sweet potato, cubed, 2 tablespoons onions, diced, 2 garlic cloves, minced, 1⁄2 red bell pepper, chopped, 3⁄4 teaspoon paprika, 1 (19 fluid ounce) can black beans, 1 1⁄2 tablespoons peanut butter, softened in a couple TBSP warm water, 1⁄2 cup warm water, 1⁄2 lime, juice of, 1 teaspoon brown sugar, salt and pepper"
                }
            ]
        },
        {
            "dayOfWeek": "FRIDAY",
            "meals": [
                {
                    "mealType": "Breakfast",
                    "uriEdamam": "http://www.edamam.com/ontologies/edamam.owl#recipe_ccf75dd559f9ecd82e702ad82874af21",
                    "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/13f/13fc98d29285ee10b0798acad88db583.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLWVhc3QtMSJGMEQCIFHbJ8L48gCNrLznFLJrHJktmGMwzAWG1jWV%2BH250I27AiBlpYXSnTDPy4VkbUP%2Fb1TQQqF2UeaQcQftwBbrfMIeqiq5BQg7EAAaDDE4NzAxNzE1MDk4NiIMn7c%2BkgNIiSxwC3pcKpYF97Vc4ZAEyuhJt4BfYKWeT9G%2Bi5sAPOvFny2pLo%2FLoiePxqH2TDLtrTmASjN8oONMPKy%2BsahcdqctgJcNiNEjdtfXQbVfs3MA%2FTdYR0qfalcTYh62pRgzFOadHYokRzKeQ17oFoG20zAK63i1TzYwks0h3OME7oF6HZCQ00TQRMQ94mtpIJ2kk4LszFcjtoOXjmk8FnDbb2AfU6flomJSKDv3eBEZfyu%2FeHjV%2FxWqol9ZrM0tpu8EdunVg9tOjb3YjYKIfBeXbS5wvogwGqXn9JvXPG%2BHBOTFAv8kc6jx4ZohGBv%2Fl1LEtms%2B4Rcqm9DqwVi4W6Aki3hSL0YNqZ6Cc28lYhHCxaskdb32VRNqUvUdb%2F9FGh2jxTMys9jKba4cqEoMAByZLmsn48sTBz3gEOfA3Fdqg4VWDiNlpVJsrXkamM%2BJsWAq0eQaIFxwJHSn3EuMAeu1DHJc6lreILz08xCSxSCIysnxC6ZEEkXXrtG6WsqOFb95wrU8VIPb4AaC2zMGI4FAFH9088mKhm7PVLqedHyRIUGGLlhE3TrnhI8pksdN1jSoUxKa4dqjcxhYOnkgHQDTuXUig1ocdOt5qlTfL0c8nTJQ0sh%2ByoeyplYPerSc%2BJQFWHXZ90GWcRBZTO6gGEkvHyThWMY3cfkwfB2zF%2Fa5V8Xe1%2FjXZFlaX%2FcCILq5gNtmp1PWlpfZ92EDZ298s4pplpbLy8xNnQGMK5yCuE%2FSvZlE0so%2FpHosyfYIlb2NfGl5i7i%2BCY%2FqAhRPjpvlb7FMIC5bwEH%2BaJHE3DffST80IfFJxchgxNDimPT6fDH8mOK6OWZl7dnUpWzGuXJNzlxkMkDohuwEylMeX4%2FTdq%2BN2GxqUNBRQ3HdHy7m2JrHIggwidW4wgY6sgGNYUwU7xM5qzEXOmiQxTlhTm%2BJEeNGwBtMI6GSiewBWBXjYWTllv6qJg6Eu2dNajwMJT5VO74oJuxUNRi6D%2BGJlWqNar3eGqICUl0eBIGzOj4vuLRhyF1R1qYaeNXjwCbujwIGG673mKoG22cIwDwO4KGlRieL0xN187LbUwcfSuT%2FXZmZsDjCQGwZHoUXfBKD%2FDOAWiMzzPNjLc843he0crPY2tenPIvZamMyXE2%2FgN3G&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250615T022622Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFKFYQV6B2%2F20250615%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=1c58897c5ed45e8019318da3eb77b154f245ea30ea985006408b1d732b8a6296",
                    "urlRecipe": "https://fitnessista.com/pumpkin-oatmeal-bake/",
                    "calories": 1851.0029999908702,
                    "carbohydrate": 302.7157499975654,
                    "protein": 57.07260999999999,
                    "fat": 52.71833000000001,
                    "fiber": 44.47840000000001,
                    "yield": 8,
                    "prepareInstructions": "* 2 cups oats, * 1 tbsp cinnamon, * 1/2 tsp pumpkin spice, * pinch salt, * 1/2 tsp baking powder, * 2 tbsp coconut oil, * 1 1/3 cup almond milk, * 1 mashed banana, * 1/4 cup coconut sugar, * 1/2 cup dried unsweetened cranberries, * 1/2 cup pumpkin"
                },
                {
                    "mealType": "Lunch/dinner",
                    "uriEdamam": "http://www.edamam.com/ontologies/edamam.owl#recipe_4b2441c0b8ee4c1aabd5f6d0152f3bce",
                    "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/b4a/b4ad6c35296e27a2d086293dbc40e772.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLWVhc3QtMSJGMEQCIFHbJ8L48gCNrLznFLJrHJktmGMwzAWG1jWV%2BH250I27AiBlpYXSnTDPy4VkbUP%2Fb1TQQqF2UeaQcQftwBbrfMIeqiq5BQg7EAAaDDE4NzAxNzE1MDk4NiIMn7c%2BkgNIiSxwC3pcKpYF97Vc4ZAEyuhJt4BfYKWeT9G%2Bi5sAPOvFny2pLo%2FLoiePxqH2TDLtrTmASjN8oONMPKy%2BsahcdqctgJcNiNEjdtfXQbVfs3MA%2FTdYR0qfalcTYh62pRgzFOadHYokRzKeQ17oFoG20zAK63i1TzYwks0h3OME7oF6HZCQ00TQRMQ94mtpIJ2kk4LszFcjtoOXjmk8FnDbb2AfU6flomJSKDv3eBEZfyu%2FeHjV%2FxWqol9ZrM0tpu8EdunVg9tOjb3YjYKIfBeXbS5wvogwGqXn9JvXPG%2BHBOTFAv8kc6jx4ZohGBv%2Fl1LEtms%2B4Rcqm9DqwVi4W6Aki3hSL0YNqZ6Cc28lYhHCxaskdb32VRNqUvUdb%2F9FGh2jxTMys9jKba4cqEoMAByZLmsn48sTBz3gEOfA3Fdqg4VWDiNlpVJsrXkamM%2BJsWAq0eQaIFxwJHSn3EuMAeu1DHJc6lreILz08xCSxSCIysnxC6ZEEkXXrtG6WsqOFb95wrU8VIPb4AaC2zMGI4FAFH9088mKhm7PVLqedHyRIUGGLlhE3TrnhI8pksdN1jSoUxKa4dqjcxhYOnkgHQDTuXUig1ocdOt5qlTfL0c8nTJQ0sh%2ByoeyplYPerSc%2BJQFWHXZ90GWcRBZTO6gGEkvHyThWMY3cfkwfB2zF%2Fa5V8Xe1%2FjXZFlaX%2FcCILq5gNtmp1PWlpfZ92EDZ298s4pplpbLy8xNnQGMK5yCuE%2FSvZlE0so%2FpHosyfYIlb2NfGl5i7i%2BCY%2FqAhRPjpvlb7FMIC5bwEH%2BaJHE3DffST80IfFJxchgxNDimPT6fDH8mOK6OWZl7dnUpWzGuXJNzlxkMkDohuwEylMeX4%2FTdq%2BN2GxqUNBRQ3HdHy7m2JrHIggwidW4wgY6sgGNYUwU7xM5qzEXOmiQxTlhTm%2BJEeNGwBtMI6GSiewBWBXjYWTllv6qJg6Eu2dNajwMJT5VO74oJuxUNRi6D%2BGJlWqNar3eGqICUl0eBIGzOj4vuLRhyF1R1qYaeNXjwCbujwIGG673mKoG22cIwDwO4KGlRieL0xN187LbUwcfSuT%2FXZmZsDjCQGwZHoUXfBKD%2FDOAWiMzzPNjLc843he0crPY2tenPIvZamMyXE2%2FgN3G&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250615T022622Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFKFYQV6B2%2F20250615%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=e0f526204537a9c607e1755e23af5c015af771f632225764b669d5c22212a289",
                    "urlRecipe": "https://www.allrecipes.com/marry-me-chickpeas-recipe-11688105",
                    "calories": 1922.7312285818116,
                    "carbohydrate": 228.87430651054683,
                    "protein": 70.26430655445049,
                    "fat": 91.21889338432335,
                    "fiber": 0,
                    "yield": 4,
                    "prepareInstructions": "1 tablespoon Grape Seed Oil or Olive Oil, or as needed, 2 Cloves Garlic, chopped, 1 Shallot, chopped, 1 teaspoon Smoked Paprika, or more to taste, 1 teaspoon Dried Oregano, ¼ teaspoon Salt, ¼ teaspoon Red Pepper Flakes, 2 tablespoon Tomato Paste, 1/3 Cup chopped Sun-Dried Tomatoes in Oil, 2 (15 ounce) Cans Chickpeas, 2 tablespoon Lemon Juice, 1 Cup Vegetable Broth, 1 Cup Coconut Milk"
                },
                {
                    "mealType": "Lunch/dinner",
                    "uriEdamam": "http://www.edamam.com/ontologies/edamam.owl#recipe_45a6141c4f7b638cccfc5eec626e4077",
                    "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/bd3/bd30fd611de7fc5b4652c6d9ed0ffe56.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLWVhc3QtMSJGMEQCIFHbJ8L48gCNrLznFLJrHJktmGMwzAWG1jWV%2BH250I27AiBlpYXSnTDPy4VkbUP%2Fb1TQQqF2UeaQcQftwBbrfMIeqiq5BQg7EAAaDDE4NzAxNzE1MDk4NiIMn7c%2BkgNIiSxwC3pcKpYF97Vc4ZAEyuhJt4BfYKWeT9G%2Bi5sAPOvFny2pLo%2FLoiePxqH2TDLtrTmASjN8oONMPKy%2BsahcdqctgJcNiNEjdtfXQbVfs3MA%2FTdYR0qfalcTYh62pRgzFOadHYokRzKeQ17oFoG20zAK63i1TzYwks0h3OME7oF6HZCQ00TQRMQ94mtpIJ2kk4LszFcjtoOXjmk8FnDbb2AfU6flomJSKDv3eBEZfyu%2FeHjV%2FxWqol9ZrM0tpu8EdunVg9tOjb3YjYKIfBeXbS5wvogwGqXn9JvXPG%2BHBOTFAv8kc6jx4ZohGBv%2Fl1LEtms%2B4Rcqm9DqwVi4W6Aki3hSL0YNqZ6Cc28lYhHCxaskdb32VRNqUvUdb%2F9FGh2jxTMys9jKba4cqEoMAByZLmsn48sTBz3gEOfA3Fdqg4VWDiNlpVJsrXkamM%2BJsWAq0eQaIFxwJHSn3EuMAeu1DHJc6lreILz08xCSxSCIysnxC6ZEEkXXrtG6WsqOFb95wrU8VIPb4AaC2zMGI4FAFH9088mKhm7PVLqedHyRIUGGLlhE3TrnhI8pksdN1jSoUxKa4dqjcxhYOnkgHQDTuXUig1ocdOt5qlTfL0c8nTJQ0sh%2ByoeyplYPerSc%2BJQFWHXZ90GWcRBZTO6gGEkvHyThWMY3cfkwfB2zF%2Fa5V8Xe1%2FjXZFlaX%2FcCILq5gNtmp1PWlpfZ92EDZ298s4pplpbLy8xNnQGMK5yCuE%2FSvZlE0so%2FpHosyfYIlb2NfGl5i7i%2BCY%2FqAhRPjpvlb7FMIC5bwEH%2BaJHE3DffST80IfFJxchgxNDimPT6fDH8mOK6OWZl7dnUpWzGuXJNzlxkMkDohuwEylMeX4%2FTdq%2BN2GxqUNBRQ3HdHy7m2JrHIggwidW4wgY6sgGNYUwU7xM5qzEXOmiQxTlhTm%2BJEeNGwBtMI6GSiewBWBXjYWTllv6qJg6Eu2dNajwMJT5VO74oJuxUNRi6D%2BGJlWqNar3eGqICUl0eBIGzOj4vuLRhyF1R1qYaeNXjwCbujwIGG673mKoG22cIwDwO4KGlRieL0xN187LbUwcfSuT%2FXZmZsDjCQGwZHoUXfBKD%2FDOAWiMzzPNjLc843he0crPY2tenPIvZamMyXE2%2FgN3G&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250615T022622Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFKFYQV6B2%2F20250615%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=922ddf0371d318140fbc377e91e0c0477b69acaabc034e9cfe9bfebfb9cfc3da",
                    "urlRecipe": "http://www.bbc.co.uk/food/recipes/spinachaubergineandc_88020",
                    "calories": 1876.9500000000003,
                    "carbohydrate": 254.58800000000002,
                    "protein": 86.12259999999999,
                    "fat": 74.671,
                    "fiber": 79.691,
                    "yield": 4,
                    "prepareInstructions": "1kg/2¼lb fresh spinach, 4 tbsp olive oil, 2 medium red onions, chopped, 200g/7oz tinned chickpeas, drained and rinsed, 2 garlic cloves, finely chopped, 2 fresh hot green chillies, halved and thinly sliced, seeds included, 1 tbsp coriander seeds, ground, 1 tbsp cumin seeds, 1 large aubergine, approx. 400g/14oz,cut into 2cm (3/4in) dice, 400g/14oz tinned chopped tomatoes, Salt"
                }
            ]
        },
        {
            "dayOfWeek": "SATURDAY",
            "meals": [
                {
                    "mealType": "Breakfast",
                    "uriEdamam": "http://www.edamam.com/ontologies/edamam.owl#recipe_78067c0bc46f1b5ec0747312c6901f85",
                    "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/2ff/2ff7e3994013564bf3d9b3b21d70d127.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLWVhc3QtMSJGMEQCIFHbJ8L48gCNrLznFLJrHJktmGMwzAWG1jWV%2BH250I27AiBlpYXSnTDPy4VkbUP%2Fb1TQQqF2UeaQcQftwBbrfMIeqiq5BQg7EAAaDDE4NzAxNzE1MDk4NiIMn7c%2BkgNIiSxwC3pcKpYF97Vc4ZAEyuhJt4BfYKWeT9G%2Bi5sAPOvFny2pLo%2FLoiePxqH2TDLtrTmASjN8oONMPKy%2BsahcdqctgJcNiNEjdtfXQbVfs3MA%2FTdYR0qfalcTYh62pRgzFOadHYokRzKeQ17oFoG20zAK63i1TzYwks0h3OME7oF6HZCQ00TQRMQ94mtpIJ2kk4LszFcjtoOXjmk8FnDbb2AfU6flomJSKDv3eBEZfyu%2FeHjV%2FxWqol9ZrM0tpu8EdunVg9tOjb3YjYKIfBeXbS5wvogwGqXn9JvXPG%2BHBOTFAv8kc6jx4ZohGBv%2Fl1LEtms%2B4Rcqm9DqwVi4W6Aki3hSL0YNqZ6Cc28lYhHCxaskdb32VRNqUvUdb%2F9FGh2jxTMys9jKba4cqEoMAByZLmsn48sTBz3gEOfA3Fdqg4VWDiNlpVJsrXkamM%2BJsWAq0eQaIFxwJHSn3EuMAeu1DHJc6lreILz08xCSxSCIysnxC6ZEEkXXrtG6WsqOFb95wrU8VIPb4AaC2zMGI4FAFH9088mKhm7PVLqedHyRIUGGLlhE3TrnhI8pksdN1jSoUxKa4dqjcxhYOnkgHQDTuXUig1ocdOt5qlTfL0c8nTJQ0sh%2ByoeyplYPerSc%2BJQFWHXZ90GWcRBZTO6gGEkvHyThWMY3cfkwfB2zF%2Fa5V8Xe1%2FjXZFlaX%2FcCILq5gNtmp1PWlpfZ92EDZ298s4pplpbLy8xNnQGMK5yCuE%2FSvZlE0so%2FpHosyfYIlb2NfGl5i7i%2BCY%2FqAhRPjpvlb7FMIC5bwEH%2BaJHE3DffST80IfFJxchgxNDimPT6fDH8mOK6OWZl7dnUpWzGuXJNzlxkMkDohuwEylMeX4%2FTdq%2BN2GxqUNBRQ3HdHy7m2JrHIggwidW4wgY6sgGNYUwU7xM5qzEXOmiQxTlhTm%2BJEeNGwBtMI6GSiewBWBXjYWTllv6qJg6Eu2dNajwMJT5VO74oJuxUNRi6D%2BGJlWqNar3eGqICUl0eBIGzOj4vuLRhyF1R1qYaeNXjwCbujwIGG673mKoG22cIwDwO4KGlRieL0xN187LbUwcfSuT%2FXZmZsDjCQGwZHoUXfBKD%2FDOAWiMzzPNjLc843he0crPY2tenPIvZamMyXE2%2FgN3G&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250615T022622Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFKFYQV6B2%2F20250615%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=3747f45ebbb846cd900d721cfcb55a9ca490002eac64d0db6465dfc180fcccc2",
                    "urlRecipe": "https://www.livesimplynatural.com/blueberry-banana-bliss/",
                    "calories": 889.8924999769929,
                    "carbohydrate": 136.62199999888009,
                    "protein": 25.041224998993695,
                    "fat": 30.71632499855952,
                    "fiber": 40.100499998880075,
                    "yield": 4,
                    "prepareInstructions": "2–3 banana, 1 pint of blueberries, 4 tbs hemp seeds, 2 tbs chia seeds, 1 cup water, 1 cup spinach (optional but highly recommended)"
                },
                {
                    "mealType": "Lunch/dinner",
                    "uriEdamam": "http://www.edamam.com/ontologies/edamam.owl#recipe_9fdbf916286d6b97d16bee11033c68f6",
                    "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/25b/25b4da308dd44c47f10fe043957d2c78.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLWVhc3QtMSJGMEQCIFHbJ8L48gCNrLznFLJrHJktmGMwzAWG1jWV%2BH250I27AiBlpYXSnTDPy4VkbUP%2Fb1TQQqF2UeaQcQftwBbrfMIeqiq5BQg7EAAaDDE4NzAxNzE1MDk4NiIMn7c%2BkgNIiSxwC3pcKpYF97Vc4ZAEyuhJt4BfYKWeT9G%2Bi5sAPOvFny2pLo%2FLoiePxqH2TDLtrTmASjN8oONMPKy%2BsahcdqctgJcNiNEjdtfXQbVfs3MA%2FTdYR0qfalcTYh62pRgzFOadHYokRzKeQ17oFoG20zAK63i1TzYwks0h3OME7oF6HZCQ00TQRMQ94mtpIJ2kk4LszFcjtoOXjmk8FnDbb2AfU6flomJSKDv3eBEZfyu%2FeHjV%2FxWqol9ZrM0tpu8EdunVg9tOjb3YjYKIfBeXbS5wvogwGqXn9JvXPG%2BHBOTFAv8kc6jx4ZohGBv%2Fl1LEtms%2B4Rcqm9DqwVi4W6Aki3hSL0YNqZ6Cc28lYhHCxaskdb32VRNqUvUdb%2F9FGh2jxTMys9jKba4cqEoMAByZLmsn48sTBz3gEOfA3Fdqg4VWDiNlpVJsrXkamM%2BJsWAq0eQaIFxwJHSn3EuMAeu1DHJc6lreILz08xCSxSCIysnxC6ZEEkXXrtG6WsqOFb95wrU8VIPb4AaC2zMGI4FAFH9088mKhm7PVLqedHyRIUGGLlhE3TrnhI8pksdN1jSoUxKa4dqjcxhYOnkgHQDTuXUig1ocdOt5qlTfL0c8nTJQ0sh%2ByoeyplYPerSc%2BJQFWHXZ90GWcRBZTO6gGEkvHyThWMY3cfkwfB2zF%2Fa5V8Xe1%2FjXZFlaX%2FcCILq5gNtmp1PWlpfZ92EDZ298s4pplpbLy8xNnQGMK5yCuE%2FSvZlE0so%2FpHosyfYIlb2NfGl5i7i%2BCY%2FqAhRPjpvlb7FMIC5bwEH%2BaJHE3DffST80IfFJxchgxNDimPT6fDH8mOK6OWZl7dnUpWzGuXJNzlxkMkDohuwEylMeX4%2FTdq%2BN2GxqUNBRQ3HdHy7m2JrHIggwidW4wgY6sgGNYUwU7xM5qzEXOmiQxTlhTm%2BJEeNGwBtMI6GSiewBWBXjYWTllv6qJg6Eu2dNajwMJT5VO74oJuxUNRi6D%2BGJlWqNar3eGqICUl0eBIGzOj4vuLRhyF1R1qYaeNXjwCbujwIGG673mKoG22cIwDwO4KGlRieL0xN187LbUwcfSuT%2FXZmZsDjCQGwZHoUXfBKD%2FDOAWiMzzPNjLc843he0crPY2tenPIvZamMyXE2%2FgN3G&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250615T022622Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFKFYQV6B2%2F20250615%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=0cfe7190819dd6004da54a9727ffc871fe4e53eee5b7abb49389a516e8035274",
                    "urlRecipe": "https://tastykitchen.com/recipes/main-courses/roasted-sweet-potato-black-bean-avocado-tostadas/",
                    "calories": 1937.1217676267627,
                    "carbohydrate": 246.69972340605315,
                    "protein": 51.64643169294687,
                    "fat": 94.437359801475,
                    "fiber": 78.9308774315,
                    "yield": 4,
                    "prepareInstructions": "1 whole Sweet Potato, Peeled And Cut Into About 1/4 Inch Thick Round Slices, 2 teaspoons Olive Oil, 1 teaspoon Cumin, 1 teaspoon Granulated Garlic, 1 Tablespoon Paprika, ½ teaspoons Salt, ¼ teaspoons Black Pepper, 10 whole Corn Tortillas, Olive Oil For Crisping Tortillas, 1 can (15 Oz. Size) Refried Black Beans, 2 whole Avocados, Peeled, Pitted, Sliced, Lime Wedges For Squeezing On Top, Cilantro Leaves, For Garnish"
                },
                {
                    "mealType": "Lunch/dinner",
                    "uriEdamam": "http://www.edamam.com/ontologies/edamam.owl#recipe_695e62d3983627cfef37727bc411be4f",
                    "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/401/401778427e63a84656fe10a153dd8c3a.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLWVhc3QtMSJGMEQCIFHbJ8L48gCNrLznFLJrHJktmGMwzAWG1jWV%2BH250I27AiBlpYXSnTDPy4VkbUP%2Fb1TQQqF2UeaQcQftwBbrfMIeqiq5BQg7EAAaDDE4NzAxNzE1MDk4NiIMn7c%2BkgNIiSxwC3pcKpYF97Vc4ZAEyuhJt4BfYKWeT9G%2Bi5sAPOvFny2pLo%2FLoiePxqH2TDLtrTmASjN8oONMPKy%2BsahcdqctgJcNiNEjdtfXQbVfs3MA%2FTdYR0qfalcTYh62pRgzFOadHYokRzKeQ17oFoG20zAK63i1TzYwks0h3OME7oF6HZCQ00TQRMQ94mtpIJ2kk4LszFcjtoOXjmk8FnDbb2AfU6flomJSKDv3eBEZfyu%2FeHjV%2FxWqol9ZrM0tpu8EdunVg9tOjb3YjYKIfBeXbS5wvogwGqXn9JvXPG%2BHBOTFAv8kc6jx4ZohGBv%2Fl1LEtms%2B4Rcqm9DqwVi4W6Aki3hSL0YNqZ6Cc28lYhHCxaskdb32VRNqUvUdb%2F9FGh2jxTMys9jKba4cqEoMAByZLmsn48sTBz3gEOfA3Fdqg4VWDiNlpVJsrXkamM%2BJsWAq0eQaIFxwJHSn3EuMAeu1DHJc6lreILz08xCSxSCIysnxC6ZEEkXXrtG6WsqOFb95wrU8VIPb4AaC2zMGI4FAFH9088mKhm7PVLqedHyRIUGGLlhE3TrnhI8pksdN1jSoUxKa4dqjcxhYOnkgHQDTuXUig1ocdOt5qlTfL0c8nTJQ0sh%2ByoeyplYPerSc%2BJQFWHXZ90GWcRBZTO6gGEkvHyThWMY3cfkwfB2zF%2Fa5V8Xe1%2FjXZFlaX%2FcCILq5gNtmp1PWlpfZ92EDZ298s4pplpbLy8xNnQGMK5yCuE%2FSvZlE0so%2FpHosyfYIlb2NfGl5i7i%2BCY%2FqAhRPjpvlb7FMIC5bwEH%2BaJHE3DffST80IfFJxchgxNDimPT6fDH8mOK6OWZl7dnUpWzGuXJNzlxkMkDohuwEylMeX4%2FTdq%2BN2GxqUNBRQ3HdHy7m2JrHIggwidW4wgY6sgGNYUwU7xM5qzEXOmiQxTlhTm%2BJEeNGwBtMI6GSiewBWBXjYWTllv6qJg6Eu2dNajwMJT5VO74oJuxUNRi6D%2BGJlWqNar3eGqICUl0eBIGzOj4vuLRhyF1R1qYaeNXjwCbujwIGG673mKoG22cIwDwO4KGlRieL0xN187LbUwcfSuT%2FXZmZsDjCQGwZHoUXfBKD%2FDOAWiMzzPNjLc843he0crPY2tenPIvZamMyXE2%2FgN3G&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250615T022622Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFKFYQV6B2%2F20250615%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=098f2a0ed9c26479b8f886debef6420093341118cfb096270214a7666188fd0b",
                    "urlRecipe": "https://www.allrecipes.com/recipe/245220/red-bean-stew/",
                    "calories": 946.9121256898063,
                    "carbohydrate": 131.60304901685,
                    "protein": 41.975365550860005,
                    "fat": 33.52928703092462,
                    "fiber": 34.66715653787937,
                    "yield": 2,
                    "prepareInstructions": "2 tablespoons olive oil, 1 onion, thinly sliced, 1 bunch fresh cilantro, stems removed and leaves minced, 2 cloves garlic, minced, 1/2 teaspoon ground cinnamon, 1/2 teaspoon ground coriander, 1/2 teaspoon ground cumin, 1 (14 ounce) can tomato sauce, 1 (15 ounce) can red beans, drained and rinsed, salt and ground black pepper to taste"
                }
            ]
        },
        {
            "dayOfWeek": "SUNDAY",
            "meals": [
                {
                    "mealType": "Breakfast",
                    "uriEdamam": "http://www.edamam.com/ontologies/edamam.owl#recipe_1a629e9eb93e0879ba04fcb332311ebb",
                    "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/f26/f26748da0dd1fb382706909bddb99003?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLWVhc3QtMSJGMEQCIFHbJ8L48gCNrLznFLJrHJktmGMwzAWG1jWV%2BH250I27AiBlpYXSnTDPy4VkbUP%2Fb1TQQqF2UeaQcQftwBbrfMIeqiq5BQg7EAAaDDE4NzAxNzE1MDk4NiIMn7c%2BkgNIiSxwC3pcKpYF97Vc4ZAEyuhJt4BfYKWeT9G%2Bi5sAPOvFny2pLo%2FLoiePxqH2TDLtrTmASjN8oONMPKy%2BsahcdqctgJcNiNEjdtfXQbVfs3MA%2FTdYR0qfalcTYh62pRgzFOadHYokRzKeQ17oFoG20zAK63i1TzYwks0h3OME7oF6HZCQ00TQRMQ94mtpIJ2kk4LszFcjtoOXjmk8FnDbb2AfU6flomJSKDv3eBEZfyu%2FeHjV%2FxWqol9ZrM0tpu8EdunVg9tOjb3YjYKIfBeXbS5wvogwGqXn9JvXPG%2BHBOTFAv8kc6jx4ZohGBv%2Fl1LEtms%2B4Rcqm9DqwVi4W6Aki3hSL0YNqZ6Cc28lYhHCxaskdb32VRNqUvUdb%2F9FGh2jxTMys9jKba4cqEoMAByZLmsn48sTBz3gEOfA3Fdqg4VWDiNlpVJsrXkamM%2BJsWAq0eQaIFxwJHSn3EuMAeu1DHJc6lreILz08xCSxSCIysnxC6ZEEkXXrtG6WsqOFb95wrU8VIPb4AaC2zMGI4FAFH9088mKhm7PVLqedHyRIUGGLlhE3TrnhI8pksdN1jSoUxKa4dqjcxhYOnkgHQDTuXUig1ocdOt5qlTfL0c8nTJQ0sh%2ByoeyplYPerSc%2BJQFWHXZ90GWcRBZTO6gGEkvHyThWMY3cfkwfB2zF%2Fa5V8Xe1%2FjXZFlaX%2FcCILq5gNtmp1PWlpfZ92EDZ298s4pplpbLy8xNnQGMK5yCuE%2FSvZlE0so%2FpHosyfYIlb2NfGl5i7i%2BCY%2FqAhRPjpvlb7FMIC5bwEH%2BaJHE3DffST80IfFJxchgxNDimPT6fDH8mOK6OWZl7dnUpWzGuXJNzlxkMkDohuwEylMeX4%2FTdq%2BN2GxqUNBRQ3HdHy7m2JrHIggwidW4wgY6sgGNYUwU7xM5qzEXOmiQxTlhTm%2BJEeNGwBtMI6GSiewBWBXjYWTllv6qJg6Eu2dNajwMJT5VO74oJuxUNRi6D%2BGJlWqNar3eGqICUl0eBIGzOj4vuLRhyF1R1qYaeNXjwCbujwIGG673mKoG22cIwDwO4KGlRieL0xN187LbUwcfSuT%2FXZmZsDjCQGwZHoUXfBKD%2FDOAWiMzzPNjLc843he0crPY2tenPIvZamMyXE2%2FgN3G&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250615T022622Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFKFYQV6B2%2F20250615%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=33067817fe7b064f4e26ec223e22d5ad67766e045c76bc3822377703fb1e9bf7",
                    "urlRecipe": "http://www.glutenfreeveganpantry.com/dark-chocolate-zucchini-bread-vegan-gluten-free/",
                    "calories": 2666.2284999999997,
                    "carbohydrate": 384.48044999999996,
                    "protein": 71.05220000000001,
                    "fat": 119.22879999999998,
                    "fiber": 0,
                    "yield": 12,
                    "prepareInstructions": "1½ cups Teff Flour, 1 tsp baking powder, 1 tsp baking soda, 1½ tsp xantham gum, ½ cup cocoa powder, 1½ cups grated zucchini, ½ cup maple syrup, 2 flax eggs (2 Tbsp ground flax seeds + 6 Tbsp water), 1¼ cups coconut milk, ¼ c cacao nibs, ½ cup chopped walnuts (optional)"
                },
                {
                    "mealType": "Lunch/dinner",
                    "uriEdamam": "http://www.edamam.com/ontologies/edamam.owl#recipe_0221f08f2c2da3a9d7bdf8af0cba190e",
                    "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/d32/d32b943a87670a066d91af9128e280a8?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLWVhc3QtMSJGMEQCIFHbJ8L48gCNrLznFLJrHJktmGMwzAWG1jWV%2BH250I27AiBlpYXSnTDPy4VkbUP%2Fb1TQQqF2UeaQcQftwBbrfMIeqiq5BQg7EAAaDDE4NzAxNzE1MDk4NiIMn7c%2BkgNIiSxwC3pcKpYF97Vc4ZAEyuhJt4BfYKWeT9G%2Bi5sAPOvFny2pLo%2FLoiePxqH2TDLtrTmASjN8oONMPKy%2BsahcdqctgJcNiNEjdtfXQbVfs3MA%2FTdYR0qfalcTYh62pRgzFOadHYokRzKeQ17oFoG20zAK63i1TzYwks0h3OME7oF6HZCQ00TQRMQ94mtpIJ2kk4LszFcjtoOXjmk8FnDbb2AfU6flomJSKDv3eBEZfyu%2FeHjV%2FxWqol9ZrM0tpu8EdunVg9tOjb3YjYKIfBeXbS5wvogwGqXn9JvXPG%2BHBOTFAv8kc6jx4ZohGBv%2Fl1LEtms%2B4Rcqm9DqwVi4W6Aki3hSL0YNqZ6Cc28lYhHCxaskdb32VRNqUvUdb%2F9FGh2jxTMys9jKba4cqEoMAByZLmsn48sTBz3gEOfA3Fdqg4VWDiNlpVJsrXkamM%2BJsWAq0eQaIFxwJHSn3EuMAeu1DHJc6lreILz08xCSxSCIysnxC6ZEEkXXrtG6WsqOFb95wrU8VIPb4AaC2zMGI4FAFH9088mKhm7PVLqedHyRIUGGLlhE3TrnhI8pksdN1jSoUxKa4dqjcxhYOnkgHQDTuXUig1ocdOt5qlTfL0c8nTJQ0sh%2ByoeyplYPerSc%2BJQFWHXZ90GWcRBZTO6gGEkvHyThWMY3cfkwfB2zF%2Fa5V8Xe1%2FjXZFlaX%2FcCILq5gNtmp1PWlpfZ92EDZ298s4pplpbLy8xNnQGMK5yCuE%2FSvZlE0so%2FpHosyfYIlb2NfGl5i7i%2BCY%2FqAhRPjpvlb7FMIC5bwEH%2BaJHE3DffST80IfFJxchgxNDimPT6fDH8mOK6OWZl7dnUpWzGuXJNzlxkMkDohuwEylMeX4%2FTdq%2BN2GxqUNBRQ3HdHy7m2JrHIggwidW4wgY6sgGNYUwU7xM5qzEXOmiQxTlhTm%2BJEeNGwBtMI6GSiewBWBXjYWTllv6qJg6Eu2dNajwMJT5VO74oJuxUNRi6D%2BGJlWqNar3eGqICUl0eBIGzOj4vuLRhyF1R1qYaeNXjwCbujwIGG673mKoG22cIwDwO4KGlRieL0xN187LbUwcfSuT%2FXZmZsDjCQGwZHoUXfBKD%2FDOAWiMzzPNjLc843he0crPY2tenPIvZamMyXE2%2FgN3G&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250615T022622Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFKFYQV6B2%2F20250615%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=07d4f793f6a69c5d4ef3f59ccc84b0ce2f415304c3269e0c7fc052bdd139a542",
                    "urlRecipe": "http://momspotted.com/2013/09/three-bean-veggie-salad-with-whole-wheat-pitas-lemon-garlic-hummas-recipe.html",
                    "calories": 3875.7273149145244,
                    "carbohydrate": 528.159176812177,
                    "protein": 171.02548921844226,
                    "fat": 139.00388864213093,
                    "fiber": 142.4642290989949,
                    "yield": 8,
                    "prepareInstructions": "2 cans chickpeas, rinsed and drained, ⅓ cup fresh lemon juice (2 lemons), 4 cloves garlic, chopped, ¼ C sesame tahini, ¾ C flat leaf parsley, chopped, pinch of fine sea salt, pinch of black pepper, 1½ T olive oil, 1 (14 ounce) cans red kidney beans, rinsed & drained, 1 (14 ounce) can chickpeas, rinsed & drained, 1 (14 ounce) can pinto beans, rinsed & drained, 1/2 small red onion, chopped, 1/4 C olive oil, 1 C corn (I used fresh off the cob corn), 3 garlic cloves, minced, 1/3 C fresh lemon juice (2 lemons), 1 C broccoli, chopped, 1/2 english cucumber, seeded & chopped, 1/4 C flat leaf parsley, chopped, 4 fresh mint leaves, chopped, 1/2 teaspoon fine sea salt"
                },
                {
                    "mealType": "Breakfast",
                    "uriEdamam": "http://www.edamam.com/ontologies/edamam.owl#recipe_ec86f872069ded50deb6d2993eefb9a4",
                    "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/604/604c83e34713099d5e54f01d30c4388b.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLWVhc3QtMSJGMEQCIFHbJ8L48gCNrLznFLJrHJktmGMwzAWG1jWV%2BH250I27AiBlpYXSnTDPy4VkbUP%2Fb1TQQqF2UeaQcQftwBbrfMIeqiq5BQg7EAAaDDE4NzAxNzE1MDk4NiIMn7c%2BkgNIiSxwC3pcKpYF97Vc4ZAEyuhJt4BfYKWeT9G%2Bi5sAPOvFny2pLo%2FLoiePxqH2TDLtrTmASjN8oONMPKy%2BsahcdqctgJcNiNEjdtfXQbVfs3MA%2FTdYR0qfalcTYh62pRgzFOadHYokRzKeQ17oFoG20zAK63i1TzYwks0h3OME7oF6HZCQ00TQRMQ94mtpIJ2kk4LszFcjtoOXjmk8FnDbb2AfU6flomJSKDv3eBEZfyu%2FeHjV%2FxWqol9ZrM0tpu8EdunVg9tOjb3YjYKIfBeXbS5wvogwGqXn9JvXPG%2BHBOTFAv8kc6jx4ZohGBv%2Fl1LEtms%2B4Rcqm9DqwVi4W6Aki3hSL0YNqZ6Cc28lYhHCxaskdb32VRNqUvUdb%2F9FGh2jxTMys9jKba4cqEoMAByZLmsn48sTBz3gEOfA3Fdqg4VWDiNlpVJsrXkamM%2BJsWAq0eQaIFxwJHSn3EuMAeu1DHJc6lreILz08xCSxSCIysnxC6ZEEkXXrtG6WsqOFb95wrU8VIPb4AaC2zMGI4FAFH9088mKhm7PVLqedHyRIUGGLlhE3TrnhI8pksdN1jSoUxKa4dqjcxhYOnkgHQDTuXUig1ocdOt5qlTfL0c8nTJQ0sh%2ByoeyplYPerSc%2BJQFWHXZ90GWcRBZTO6gGEkvHyThWMY3cfkwfB2zF%2Fa5V8Xe1%2FjXZFlaX%2FcCILq5gNtmp1PWlpfZ92EDZ298s4pplpbLy8xNnQGMK5yCuE%2FSvZlE0so%2FpHosyfYIlb2NfGl5i7i%2BCY%2FqAhRPjpvlb7FMIC5bwEH%2BaJHE3DffST80IfFJxchgxNDimPT6fDH8mOK6OWZl7dnUpWzGuXJNzlxkMkDohuwEylMeX4%2FTdq%2BN2GxqUNBRQ3HdHy7m2JrHIggwidW4wgY6sgGNYUwU7xM5qzEXOmiQxTlhTm%2BJEeNGwBtMI6GSiewBWBXjYWTllv6qJg6Eu2dNajwMJT5VO74oJuxUNRi6D%2BGJlWqNar3eGqICUl0eBIGzOj4vuLRhyF1R1qYaeNXjwCbujwIGG673mKoG22cIwDwO4KGlRieL0xN187LbUwcfSuT%2FXZmZsDjCQGwZHoUXfBKD%2FDOAWiMzzPNjLc843he0crPY2tenPIvZamMyXE2%2FgN3G&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250615T022622Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFKFYQV6B2%2F20250615%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=6553d544ce96296cc2d683175b6867a8c38f07e0a416df6e902dacbb7c508724",
                    "urlRecipe": "http://beautyandthebeets.com/quinoa-fruit-breakfast-bowl/",
                    "calories": 1833.67,
                    "carbohydrate": 278.1253,
                    "protein": 58.528299999999994,
                    "fat": 59.11395,
                    "fiber": 41.60975,
                    "yield": 8,
                    "prepareInstructions": "* 2 cup quinoa, * 1/2 cup unsweetened vanilla almond milk, * 1/2 cup strawberry, washed and sliced, * 1/2 cup blueberry, washed and stemmed, * 1/2 cup mango, diced, * 1/4 cup kiwi, peeled and sliced, * 1/2 cup avocado chopped, * 1/4 cup sliced almond, * 1/4 cup shredded coconut"
                }
            ]
        }
    ]
}



export default function MealPlanner() {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const [generatedPlan, setGeneratedPlan] = useState(null);
    const [showPreview, setShowPreview] = useState(false);


    // Estado para pratos selecionados
    const [selectedDishes, setSelectedDishes] = useState({
        breakfast: [],
        lunch: [],
        dinner: []
    });

    const [userData, setUserData] = useState({
        dietLabels: "",
        healthLabels: []
    });

    // Função para calcular as calorias por refeição baseada no total
    const calculateMealKcal = (total) => ({
        breakfast: Math.round(total * 0.20), // 20%
        lunch: Math.round(total * 0.38),    // 38%
        dinner: Math.round(total * 0.42),   // 42%
        total: total                        // Mantém o total original
    });

    // Estado para limites de calorias
    const [maxKcal, setMaxKcal] = useState({
        breakfast: 600,
        lunch: 900,
        dinner: 900,
        total: 2000
    });

    // Estado para o modal
    const [open, setOpen] = useState(false);


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8080/api/user/meal-details', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUserData({
                    dietLabels: response.data.dietLabels,
                    healthLabels: response.data.healthLabels
                });
                // Atualiza TODOS os valores (total + refeições) com base no TDEE
                const newTotal = response.data.tdee;
                setMaxKcal(calculateMealKcal(newTotal));
            } catch (error) {
                console.error("Erro ao carregar dados do usuário:", error);
                toast.error("Erro ao carregar preferências do usuário");
                localStorage.removeItem("token");
                navigate("/");

            }
        };

        fetchUserData();
    }, []);

    // Alternar seleção de prato
    const toggleDish = (meal, dish) => {
        setSelectedDishes(prev => {
            const newSelection = [...prev[meal]];
            const index = newSelection.indexOf(dish);

            if (index === -1) {
                newSelection.push(dish);
            } else {
                newSelection.splice(index, 1);
            }

            return {
                ...prev,
                [meal]: newSelection
            };
        });
    };

    const generateMealPlan = async () => {
        const requestData = {
            size: 7,
            plan: {
                accept: {
                    all: [
                        {
                            health: userData.healthLabels
                        },
                        {
                            diet: [userData.dietLabels]
                        }
                    ]
                },
                fit: {
                    ENERC_KCAL: {
                        min: 1000,
                        max: maxKcal.total
                    }
                },
                sections: {
                    Breakfast: {
                        accept: {
                            all: [
                                { dish: selectedDishes.breakfast },
                                { meal: ["breakfast"] }
                            ]
                        },
                        fit: {
                            ENERC_KCAL: {
                                min: 100,
                                max: maxKcal.breakfast
                            }
                        }
                    },
                    Lunch: {
                        accept: {
                            all: [
                                { dish: selectedDishes.lunch },
                                { meal: ["lunch/dinner"] }
                            ]
                        },
                        fit: {
                            ENERC_KCAL: {
                                min: 300,
                                max: maxKcal.lunch
                            }
                        }
                    },
                    Dinner: {
                        accept: {
                            all: [
                                { dish: selectedDishes.dinner },
                                { meal: ["lunch/dinner"] }
                            ]
                        },
                        fit: {
                            ENERC_KCAL: {
                                min: 200,
                                max: maxKcal.dinner
                            }
                        }
                    }
                }
            }
        };

        try {
            const response = await axios.post(
                'https://api.edamam.com/api/meal-planner/v1/1a407993/select?type=public',
                requestData,
                {
                    headers: {
                        'accept': 'application/json',
                        'Edamam-Account-User': '1a407993',
                        'Authorization': 'Basic MWE0MDc5OTM6NjU4OTFmMzEyMDExMWJiODZjOGYwYzM3YmNkYjc0YjQ=',
                        'Content-Type': 'application/json'
                    }
                }
            );

            toast.success("Cardápios alimentar criado com sucesso!");
            return response.data;
        } catch (error) {
            toast.error("Erro ao criar Cardápios alimentar");
            console.error(error);
        }
    };

    function extractAllRecipeUris(apiResponse) {
        // Verifica se a resposta é válida
        if (!apiResponse?.selection || !Array.isArray(apiResponse.selection)) {
            console.error("Formato de resposta inválido");
            return [];
        }

        // Extrai todos os links assigned em uma lista única
        const allRecipes = apiResponse.selection.flatMap(day =>
            Object.values(day.sections || {})
                .map(section => section?.assigned)
                .filter(link => link) // Remove valores undefined/null
        ).slice(0, -1);

        return allRecipes;
    }

    const fetchRecipesByUris = async (uris) => {
        try {
            // Configurações da API
            const app_id = '1a407993';
            const app_key = '65891f3120111bb86c8f0c37bcdb74b4';
            const fields = ['uri', 'image', 'url', 'yield', 'ingredientLines', 'calories', 'mealType', 'totalNutrients'];

            // Preparar os parâmetros da URL
            const params = new URLSearchParams();
            uris.forEach(uri => params.append('uri', uri));
            fields.forEach(field => params.append('field', field));
            params.append('app_id', app_id);
            params.append('app_key', app_key);

            // Configurar os headers
            const headers = {
                'accept': 'application/json',
                'Accept-Language': 'en',
                'Edamam-Account-User': app_id
            };

            // Fazer a requisição
            const response = await axios.get('https://api.edamam.com/api/recipes/v2/by-uri', {
                params,
                headers
            });

            return response.data;
        } catch (error) {
            console.error('Error fetching recipes:', error);
            throw error;
        }

    };

    const buildMealPlanToBackend = async (recipesFromEdamam) => {
        // Dias da semana para associar cada receita (exemplo simples com dias fixos)
        const daysOfWeek = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

        // Inicializa estrutura de planos com os dias da semana
        const mealPlan = daysOfWeek.map((day) => ({
            dayOfWeek: day,
            meals: []
        }));

        // Percorre cada receita recebida
        const meals = recipesFromEdamam.hits.map(hit => {
            const recipe = hit.recipe;
            const mealType = recipe.mealType?.[0] || "Breakfast";
            return {
                mealType: mealType.charAt(0).toUpperCase() + mealType.slice(1),
                uriEdamam: recipe.uri,
                imageUrl: recipe.image,
                urlRecipe: recipe.url,
                calories: recipe.calories || 0,
                carbohydrate: recipe.totalNutrients?.CHOCDF?.quantity || 0,
                protein: recipe.totalNutrients?.PROCNT?.quantity || 0,
                fat: recipe.totalNutrients?.FAT?.quantity || 0,
                fiber: recipe.totalNutrients?.FIBTG?.quantity || 0,
                yield: recipe.yield || 1,
                prepareInstructions: recipe.ingredientLines?.join(', ') || "Sem instruções"
            };
        });

        if (meals.length === 20) {
            meals.push({ ...meals[0] });
        }

        meals.forEach((meal, index) => {
            const dayIndex = Math.floor(index / 3); // 3 refeições por dia
            if (mealPlan[dayIndex]) {
                mealPlan[dayIndex].meals.push(meal);
            }
        });

        // Monta objeto final
        // const finalPayload = { plans: mealPlan };
        const finalPayload = { plans: mealPlan };
        return finalPayload;
    };

    const mealPlanRebuild = async () => {

        try {
            setLoading(true);
            const responseMealPlan = await generateMealPlan();
            const recipeAssigned = extractAllRecipeUris(responseMealPlan);
            const responseURIs = await fetchRecipesByUris(recipeAssigned);
            const formatMeal = await buildMealPlanToBackend(responseURIs);

            setGeneratedPlan(formatMeal);
            setShowPreview(true);
        } catch (error) {
            toast.error("Erro ao gerar Cardápios alimentar");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const confirmAndSavePlan = async () => {
        try {
            setLoading(true);
            await handleSubmit(generatedPlan);
            toast.success("Cardápios alimentar salvo com sucesso!");
            setShowPreview(false);
            // Opcional: redirecionar ou limpar o formulário
        } catch (error) {
            toast.error("Erro ao salvar Cardápios alimentar");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (formatMeal) => {
        setLoading(true)
        // setError("")

        try {

            // Obter o token do localStorage
            const token = localStorage.getItem('token');
            // Fazer a requisição PUT com o header Authorization
            const response = await axios.put('http://localhost:8080/api/dia/rebuildplan', formatMeal.plans, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            // Se o registro for bem-sucedido
            console.log("Registro bem-sucedido:", response.data)
        } catch (err) {
            // console.error("Erro no registro:", err)
            console.log(err)
            setError(err.response?.data?.message || "Erro ao criar conta. Tente novamente.")
        } finally {
            setLoading(false)
        }
    }


    // Componente para renderizar os pratos de uma refeição
    const renderMealSection = (meal, dishes) => (
        <div className="mb-8 p-6 bg-white rounded-xl shadow-xl">
            <h2 className="text-xl font-bold mb-4 capitalize text-gray-800">{meal === 'breakfast' ? 'Café da Manhã' : meal === 'lunch' ? 'Almoço' : 'Jantar'}</h2>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Calorias máximas:</label>
                <input
                    type="number"
                    value={maxKcal[meal]}
                    onChange={(e) => setMaxKcal(prev => ({
                        ...prev,
                        [meal]: parseInt(e.target.value) || 0
                    }))}
                    className="border border-gray-300 p-2 rounded-lg w-24 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
            </div>

            <div className="flex flex-wrap gap-3 mb-4">
                {dishes.map(dish => (
                    <button
                        key={dish}
                        onClick={() => toggleDish(meal, dish)}
                        className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${selectedDishes[meal].includes(dish)
                            ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        title={dish} // Mostra o nome original como tooltip
                    >
                        {DISH_TRANSLATIONS[dish] || dish} {/* Mostra a tradução ou o original se não houver tradução */}
                    </button>
                ))}
            </div>

            {selectedDishes[meal].length > 0 && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-700 mb-2">Pratos selecionados:</p>
                    <p className="text-gray-600">
                        {selectedDishes[meal].map(dish => DISH_TRANSLATIONS[dish] || dish).join(", ")}
                    </p>
                </div>
            )}
        </div>
    );
    const PreviewMealPlan = ({ plan, onConfirm, onCancel }) => {
        const daysTranslation = {
            MONDAY: "Segunda-feira",
            TUESDAY: "Terça-feira",
            WEDNESDAY: "Quarta-feira",
            THURSDAY: "Quinta-feira",
            FRIDAY: "Sexta-feira",
            SATURDAY: "Sábado",
            SUNDAY: "Domingo"
        };

        const mealListName = ["Café da Manhã", "Almoço", "Jantar"];
        let convertMealName = false; // Deve ser let para permitir reatribuição

        const convertMealsNames = (mealType) => {

            if (mealType === "Breakfast") {
                return mealListName[0]; // Café da Manhã
            }

            if (mealType === "Lunch/dinner") {
                if (!convertMealName) {
                    convertMealName = true;
                    return mealListName[1];
                } else {
                    convertMealName = false;
                    return mealListName[2];
                }
            }

            return mealType;
        };

        return (
            <Dialog open={true} onClose={onCancel} className="relative z-50">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
                />

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <DialogPanel
                            transition
                            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-4xl data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                        >
                            <div className="flex flex-col h-[80vh]">
                                <div className="flex justify-between items-center p-4 border-b">
                                    <DialogTitle as="h3" className="text-lg font-semibold text-gray-900">
                                        Pré-visualização do Cardápios Alimentar
                                    </DialogTitle>
                                    <button
                                        onClick={onCancel}
                                        className="text-gray-400 hover:text-gray-500"
                                    >
                                        <span className="sr-only">Fechar</span>
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto p-4">
                                    {plan.plans.map((dayPlan) => (
                                        <div key={dayPlan.dayOfWeek} className="mb-8 border-b pb-6 last:border-b-0">
                                            <h3 className="text-xl font-bold mb-4 text-gray-800">
                                                {daysTranslation[dayPlan.dayOfWeek] || dayPlan.dayOfWeek}
                                            </h3>

                                            <div className="space-y-4">
                                                {dayPlan.meals.map((meal, index) => (
                                                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                                        <h4 className="font-semibold text-green-700 mb-2">
                                                            {convertMealsNames(meal.mealType)}
                                                        </h4>
                                                        <div className="flex flex-col sm:flex-row gap-4">
                                                            {meal.imageUrl && (
                                                                <img
                                                                    src={meal.imageUrl}
                                                                    alt={meal.mealType}
                                                                    className="w-32 h-32 object-cover rounded-lg"
                                                                />
                                                            )}
                                                            <div className="flex-1 space-y-2">
                                                                <div className="grid grid-cols-2 gap-2">
                                                                    <div className="bg-white p-2 rounded">
                                                                        <p className="text-sm text-gray-500">Calorias</p>
                                                                        <p className="font-medium">{Math.round(meal.calories)} kcal</p>
                                                                    </div>
                                                                    <div className="bg-white p-2 rounded">
                                                                        <p className="text-sm text-gray-500">Porções</p>
                                                                        <p className="font-medium">{meal.yield}</p>
                                                                    </div>
                                                                    <div className="bg-white p-2 rounded">
                                                                        <p className="text-sm text-gray-500">Proteínas</p>
                                                                        <p className="font-medium">{meal.protein.toFixed(1)}g</p>
                                                                    </div>
                                                                    <div className="bg-white p-2 rounded">
                                                                        <p className="text-sm text-gray-500">Carboidratos</p>
                                                                        <p className="font-medium">{meal.carbohydrate.toFixed(1)}g</p>
                                                                    </div>
                                                                    <div className="bg-white p-2 rounded">
                                                                        <p className="text-sm text-gray-500">Gorduras</p>
                                                                        <p className="font-medium">{meal.fat.toFixed(1)}g</p>
                                                                    </div>
                                                                    <div className="bg-white p-2 rounded">
                                                                        <p className="text-sm text-gray-500">Fibras</p>
                                                                        <p className="font-medium">{meal.fiber.toFixed(1)}g</p>
                                                                    </div>
                                                                </div>

                                                                {meal.urlRecipe && (
                                                                    <a
                                                                        href={meal.urlRecipe}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="inline-block text-green-600 hover:underline text-sm"
                                                                    >
                                                                        Ver receita completa
                                                                    </a>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t p-4 bg-gray-50">
                                    <div className="flex justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={onCancel}
                                            className="inline-flex justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                        >
                                            Voltar para editar
                                        </button>
                                        <button
                                            type="button"
                                            onClick={onConfirm}
                                            className="inline-flex justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700"
                                        >
                                            Confirmar e Salvar Cardápios
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        );
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 p-4">
            {/* Modal de Menu */}
            <Dialog open={open} onClose={setOpen} className="relative z-10">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-gray-500/75 transition-opacity duration-500 ease-in-out data-closed:opacity-0"
                />

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
                            <DialogPanel
                                transition
                                className="pointer-events-auto relative w-screen max-w-md transform transition duration-500 ease-in-out data-closed:translate-x-full sm:duration-700"
                            >
                                <TransitionChild>
                                    <div className="absolute top-0 left-0 -ml-8 flex pt-4 pr-2 duration-500 ease-in-out data-closed:opacity-0 sm:-ml-10 sm:pr-4">
                                        <button
                                            type="button"
                                            onClick={() => setOpen(false)}
                                            className="relative rounded-md text-gray-300 hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-hidden"
                                        >
                                            <span className="absolute -inset-2.5" />
                                            <span className="sr-only">Close panel</span>
                                            <XMarkIcon aria-hidden="true" className="size-6" />
                                        </button>
                                    </div>
                                </TransitionChild>
                                <div className="flex h-full flex-col overflow-y-auto bg-white py-6 shadow-xl">
                                    <div className="px-4 sm:px-6">
                                        <DialogTitle className="text-2xl font-bold text-green-500">Menu de Opções</DialogTitle>
                                    </div>
                                    <div className="relative mt-6 flex-col px-4 sm:px-6 justify-between h-full">
                                        <div className="flex flex-col h-full justify-between">
                                            <div>
                                                <button
                                                    onClick={() => {
                                                        setOpen(false);
                                                        navigate("/");
                                                    }}
                                                    className="w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors"
                                                >
                                                    Página de Refeições
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </DialogPanel>
                        </div>
                    </div>
                </div>
            </Dialog>

            <div className="max-w-3xl mx-auto mb-8 p-6 bg-white rounded-xl shadow-xl animate-fadeIn">
                {/* Cabeçalho */}
                <header className="flex justify-between items-center mb-8 p-6 bg-white rounded-xl shadow-xl">
                    <h1 className="text-2xl font-bold text-gray-800">Recriar Refeições</h1>
                    <button
                        onClick={() => setOpen(true)}
                        className="p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </header>

                {/* Controle de calorias totais */}
                <div className="mb-8 p-6 bg-white rounded-xl shadow-xl">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">Configurações Gerais</h2>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Calorias totais máximas por dia:</label>
                        <span className="border border-gray-300 p-2 rounded-lg w-32 focus:ring-2 focus:ring-green-500 focus:border-transparent">
                            {maxKcal.total}
                        </span>
                    </div>
                </div>

                {/* Seções de refeições */}
                {renderMealSection('breakfast', BREAKFAST_DISHES)}
                {renderMealSection('lunch', LUNCH_DISHES)}
                {renderMealSection('dinner', DINNER_DISHES)}


                <button
                    onClick={mealPlanRebuild}
                    className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition-all duration-300 shadow-lg font-bold"
                >
                    Buscar Refeições
                </button>
            </div>
            {showPreview && generatedPlan && (
                <PreviewMealPlan
                    plan={generatedPlan}
                    onConfirm={confirmAndSavePlan}
                    onCancel={() => setShowPreview(false)}
                />
            )}
        </div>
    );
}
