#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import yaml
import time
from datetime import datetime

def update_prices(drinks_file, sales_file, settings):
    """
    Update prices based on demand (sales volume)
    
    Algorithm:
    1. Items sold during an interval increase in price
    2. Items not sold during an interval decrease in price
    3. Prices are constrained by minimum and maximum values
    4. Price changes occur by a fixed amount
    """
    # Load drinks data
    with open(drinks_file, 'r') as f:
        drinks = yaml.safe_load(f)
    
    # Get price change amount
    price_change = settings.get('price_change_amount', 0.50)
    
    for drink_name, drink_data in drinks.items():
        # Get current sales count
        sales_count = drink_data.get('sales_count', 0)
        
        # Determine price direction
        if sales_count > 0:
            # Increase price (high demand)
            new_price = min(
                drink_data['current_price'] + price_change,
                drink_data['max_price']
            )
            trend = 'up' if new_price > drink_data['current_price'] else 'stable'
        else:
            # Decrease price (low demand)
            new_price = max(
                drink_data['current_price'] - price_change,
                drink_data['min_price']
            )
            trend = 'down' if new_price < drink_data['current_price'] else 'stable'
        
        # Update drink data
        drink_data['current_price'] = round(new_price, 2)
        drink_data['trend'] = trend
        drink_data['sales_count'] = 0  # Reset sales count for next interval
    
    # Save updated drinks data
    with open(drinks_file, 'w') as f:
        yaml.dump(drinks, f)
    
    return drinks
