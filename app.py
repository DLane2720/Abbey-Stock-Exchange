#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from flask import Flask, render_template, request, redirect, url_for, jsonify
import os
import time
import yaml
import json
import webbrowser
import threading
import tkinter as tk
from tkinter import ttk
import sys
from datetime import datetime
from pricing import update_prices
from backup import create_backup, restore_from_backup, list_backups
from config import load_settings, save_settings

app = Flask(__name__)
app.config['SECRET_KEY'] = 'bar-stock-exchange-secret-key'

# Add current year to all templates
@app.context_processor
def inject_now():
    from datetime import datetime
    return {'now': datetime.now()}

# Add timestamp filter for templates
@app.template_filter('timestamp_to_datetime')
def timestamp_to_datetime(timestamp):
    from datetime import datetime
    if timestamp:
        return datetime.fromtimestamp(timestamp).strftime('%Y-%m-%d %H:%M:%S')
    return 'Never'

# Data file paths
DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data')
SETTINGS_FILE = os.path.join(DATA_DIR, 'settings.yaml')
DRINKS_FILE = os.path.join(DATA_DIR, 'drinks.yaml')
SALES_FILE = os.path.join(DATA_DIR, 'sales.yaml')

# Ensure data directory exists
if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR)

# Initialize application data
def init_app_data():
    # Initialize settings if not exists
    if not os.path.exists(SETTINGS_FILE):
        settings = {
            'update_interval': 90,  # seconds
            'price_change_amount': 0.50,  # dollars
            'logo_path': '',
            'last_update': time.time(),
            'last_backup': time.time()
        }
        with open(SETTINGS_FILE, 'w') as f:
            yaml.dump(settings, f)
    
    # Initialize drinks if not exists
    if not os.path.exists(DRINKS_FILE):
        drinks = {
            'Beer': {
                'initial_price': 5.00,
                'current_price': 5.00,
                'min_price': 3.00,
                'max_price': 8.00,
                'trend': 'stable',
                'sales_count': 0
            },
            'Wine': {
                'initial_price': 7.00,
                'current_price': 7.00,
                'min_price': 5.00,
                'max_price': 12.00,
                'trend': 'stable',
                'sales_count': 0
            },
            'Cocktail': {
                'initial_price': 8.00,
                'current_price': 8.00,
                'min_price': 6.00,
                'max_price': 15.00,
                'trend': 'stable',
                'sales_count': 0
            }
        }
        with open(DRINKS_FILE, 'w') as f:
            yaml.dump(drinks, f)
    
    # Initialize sales if not exists
    if not os.path.exists(SALES_FILE):
        sales = []
        with open(SALES_FILE, 'w') as f:
            yaml.dump(sales, f)
    
    # Remove any existing tabs file since functionality has been removed
    tabs_file = os.path.join(DATA_DIR, 'tabs.yaml')
    if os.path.exists(tabs_file):
        try:
            os.remove(tabs_file)
            print("Removed tabs.yaml as the functionality has been removed")
        except Exception as e:
            print(f"Error removing tabs.yaml: {e}")


# Check if we need to update prices
def check_price_update():
    settings = load_settings(SETTINGS_FILE)
    current_time = time.time()
    last_update = settings.get('last_update', 0)
    update_interval = settings.get('update_interval', 90)
    
    if current_time - last_update >= update_interval:
        # Create daily backup if one doesn't exist yet
        # This will only create a backup file once per day
        create_backup(DATA_DIR)
        
        # Update prices
        update_prices(DRINKS_FILE, SALES_FILE, settings)
        
        # Update last update time
        settings['last_update'] = current_time
        save_settings(SETTINGS_FILE, settings)
        
        return True
    
    return False

# Routes

@app.route('/')
def index():
    return redirect(url_for('display_menu'))

@app.route('/display')
def display_menu():
    settings = load_settings(SETTINGS_FILE)
    
    # Load drinks data
    with open(DRINKS_FILE, 'r') as f:
        drinks = yaml.safe_load(f)
    
    # Calculate time until next update
    current_time = time.time()
    last_update = settings.get('last_update', 0)
    update_interval = settings.get('update_interval', 90)
    time_until_update = max(0, update_interval - (current_time - last_update))
    
    return render_template('display/menu.html', 
                          drinks=drinks, 
                          settings=settings,
                          time_until_update=time_until_update)

@app.route('/admin')
def admin_index():
    return redirect(url_for('admin_sales'))

@app.route('/admin/sales', methods=['GET', 'POST'])
def admin_sales():
    # Check if we need to update prices
    price_updated = check_price_update()
    
    # Load settings
    settings = load_settings(SETTINGS_FILE)
    
    # Load drinks data
    with open(DRINKS_FILE, 'r') as f:
        drinks = yaml.safe_load(f)
    
    # Handle POST request
    if request.method == 'POST':
        action = request.form.get('action', '')
        item_name = request.form.get('item_name')
        
        # Debug information
        print(f"Action: {action}")
        print(f"Item name: {item_name}")
        print(f"Form data: {request.form}")
        
        # Adding an item (simple sale)
        if item_name and item_name in drinks:
            print(f"Adding {item_name}")
            
            # Record the sale
            sale = {
                'timestamp': datetime.now().isoformat(),
                'item_name': item_name,
                'price': drinks[item_name]['current_price']
            }
            
            # Add to sales list
            with open(SALES_FILE, 'r') as f:
                sales = yaml.safe_load(f) or []
            
            sales.append(sale)
            
            with open(SALES_FILE, 'w') as f:
                yaml.dump(sales, f)
            
            # Update sales count for the drink
            drinks[item_name]['sales_count'] += 1
            
            with open(DRINKS_FILE, 'w') as f:
                yaml.dump(drinks, f)
            
            return redirect(url_for('admin_sales'))
    
    # Calculate time remaining until next update
    current_time = time.time()
    last_update = settings.get('last_update', 0)
    update_interval = settings.get('update_interval', 90)
    time_until_update = max(0, update_interval - (current_time - last_update))
    
    return render_template('admin/sales.html', 
                          drinks=drinks, 
                          settings=settings,
                          price_updated=price_updated,
                          time_until_update=time_until_update)

# Admin Inventory has been moved to Settings page

# Tabs functionality has been removed

@app.route('/admin/settings', methods=['GET', 'POST'])
def admin_settings():
    settings = load_settings(SETTINGS_FILE)
    
    # Load drinks data for inventory management
    with open(DRINKS_FILE, 'r') as f:
        drinks = yaml.safe_load(f)
    
    # Handle POST request for settings or inventory management
    if request.method == 'POST':
        action = request.form.get('action', '')
        
        # Handle create backup action
        if action == 'create_backup':
            backup_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'backups')
            # Force a new backup even if one exists today
            today_date = datetime.now().strftime('%Y_%m_%d')
            backup_filename = f"{today_date}_Backup.yaml"
            backup_path = os.path.join(backup_dir, backup_filename)
            
            # Remove existing backup for today if it exists
            if os.path.exists(backup_path):
                os.remove(backup_path)
            
            # Create a new backup
            result = create_backup(DATA_DIR)
            
            if result:
                print(f"Manually created backup: {result}")
            else:
                print("Failed to create backup manually")
                
            return redirect(url_for('admin_settings'))
        
        # Handle inventory actions
        elif action in ['add', 'edit', 'delete']:
            if action == 'add' or action == 'edit':
                name = request.form.get('name')
                original_name = request.form.get('original_name', name)  # Get original name if specified
                initial_price = float(request.form.get('initial_price', 0))
                min_price = float(request.form.get('min_price', 0))
                max_price = float(request.form.get('max_price', 0))
                
                # If custom_min_price is not checked, use initial price as min price
                custom_min_price = request.form.get('custom_min_price')
                if not custom_min_price:
                    min_price = initial_price
                
                if name:
                    # For editing: check if name has changed
                    if action == 'edit' and original_name in drinks and original_name != name:
                        # Copy the existing drink with new name
                        drink_data = drinks[original_name].copy()
                        # Update with new values
                        drink_data['initial_price'] = initial_price
                        drink_data['min_price'] = min_price
                        drink_data['max_price'] = max_price
                        # Add with new name
                        drinks[name] = drink_data
                        # Remove old name
                        del drinks[original_name]
                    elif action == 'add' or name not in drinks:
                        # For a new drink
                        drinks[name] = {
                            'initial_price': initial_price,
                            'current_price': initial_price,
                            'min_price': min_price,
                            'max_price': max_price,
                            'trend': 'stable',
                            'sales_count': 0
                        }
                    else:  # For editing without changing the name
                        # Update the drink properties
                        drinks[name]['initial_price'] = initial_price
                        drinks[name]['min_price'] = min_price
                        drinks[name]['max_price'] = max_price
                    
                    with open(DRINKS_FILE, 'w') as f:
                        yaml.dump(drinks, f)
            
            elif action == 'delete':
                name = request.form.get('name')
                
                if name and name in drinks:
                    del drinks[name]
                    
                    with open(DRINKS_FILE, 'w') as f:
                        yaml.dump(drinks, f)
            
            return redirect(url_for('admin_settings'))
        
        # Settings update
        else:  # If no action or unknown action, it's a settings update
            settings['update_interval'] = int(request.form.get('update_interval', 90))
            settings['price_change_amount'] = float(request.form.get('price_change_amount', 0.5))
            
            # Handle logo upload (simplified - in a real app, you'd save the file)
            logo_path = request.form.get('logo_path', '')
            settings['logo_path'] = logo_path
            
            save_settings(SETTINGS_FILE, settings)
            
            return redirect(url_for('admin_settings'))
    
    # Get list of available backups
    backups = list_backups(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'backups'))
    
    return render_template('admin/settings.html', 
                          settings=settings,
                          backups=backups,
                          drinks=drinks)

@app.route('/admin/restore/<backup_name>')
def restore_backup(backup_name):
    backup_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'backups')
    success = restore_from_backup(backup_dir, backup_name, DATA_DIR)
    
    if success:
        # Flash a success message if you're using Flask's flash system
        return redirect(url_for('admin_settings'))
    else:
        return "Failed to restore backup. Check server logs for details.", 500

@app.route('/admin/delete_backup/<backup_name>')
def delete_backup(backup_name):
    backup_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'backups')
    backup_path = os.path.join(backup_dir, backup_name)
    
    if os.path.exists(backup_path):
        try:
            os.remove(backup_path)
            print(f"Successfully deleted backup: {backup_name}")
        except Exception as e:
            print(f"Error deleting backup {backup_name}: {e}")
            return "Failed to delete backup. Check server logs for details.", 500
    
    return redirect(url_for('admin_settings'))

# API Endpoints for AJAX requests

@app.route('/api/drinks')
def api_drinks():
    # Check if we need to update prices
    check_price_update()
    
    # Load drinks data
    with open(DRINKS_FILE, 'r') as f:
        drinks = yaml.safe_load(f)
    
    # Load settings for countdown
    settings = load_settings(SETTINGS_FILE)
    current_time = time.time()
    last_update = settings.get('last_update', 0)
    update_interval = settings.get('update_interval', 90)
    time_until_update = max(0, update_interval - (current_time - last_update))
    
    return jsonify({
        'drinks': drinks,
        'time_until_update': int(time_until_update)
    })

def create_status_window():
    # Create the tkinter window
    root = tk.Tk()
    root.title("Stock Exchange - Server Status")
    root.geometry("300x150")
    root.resizable(False, False)
    
    # Add a label to show status
    status_label = ttk.Label(root, text="Server is RUNNING", font=("Arial", 12, "bold"))
    status_label.pack(pady=20)
    
    # Add URL information
    urls_label = ttk.Label(root, text="URLs opened in browser:\n- Display: http://127.0.0.1:5050/display\n- Admin: http://127.0.0.1:5050/admin/sales")
    urls_label.pack(pady=10)
    
    # Add quit button
    quit_button = ttk.Button(root, text="Quit Application", command=lambda: os._exit(0))
    quit_button.pack(pady=10)
    
    # Return the root window to be started in the main thread
    return root

def open_browser():
    # Wait a moment for the server to start
    time.sleep(1.5)
    # Open the main display page in a new window
    webbrowser.open_new('http://127.0.0.1:5050/display')
    # Wait a moment before opening the second page
    time.sleep(0.5)
    # Open the admin sales page in another new window
    webbrowser.open_new('http://127.0.0.1:5050/admin/sales')

def run_flask():
    # Run the Flask application
    app.run(debug=False, host='127.0.0.1', port='5050')

if __name__ == '__main__':
    # Initialize application data
    init_app_data()
    
    # Start Flask in a separate thread
    flask_thread = threading.Thread(target=run_flask)
    flask_thread.daemon = True  # Thread will close when main thread exits
    flask_thread.start()
    
    # Start the browser opening function in a thread
    threading.Thread(target=open_browser, daemon=True).start()
    
    # Create and run the status window in the main thread
    root = create_status_window()
    root.mainloop()
