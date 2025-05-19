#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import shutil
import time
from datetime import datetime, timedelta
import yaml
from collections import OrderedDict

# Add YAML representer for OrderedDict to preserve order
yaml.add_representer(OrderedDict, lambda dumper, data: dumper.represent_mapping('tag:yaml.org,2002:map', data.items()))

def create_backup(data_dir):
    """
    Create a daily backup of drinks data
    
    Args:
        data_dir: Path to the data directory
    
    Returns:
        str: Path to the backup file, or None if no backup was created
    """
    # Create backups directory if it doesn't exist
    backup_dir = os.path.join(os.path.dirname(data_dir), 'backups')
    if not os.path.exists(backup_dir):
        os.makedirs(backup_dir)
    
    # Format today's date for the backup filename
    today_date = datetime.now().strftime('%Y_%m_%d')
    backup_filename = f"{today_date}_Backup.yaml"
    backup_path = os.path.join(backup_dir, backup_filename)
    
    # Check if today's backup already exists
    if os.path.exists(backup_path):
        print(f"Backup for today ({backup_filename}) already exists. Skipping creation.")
        return None
    
    # Load drinks data
    drinks_file = os.path.join(data_dir, 'drinks.yaml')
    if not os.path.exists(drinks_file):
        print("No drinks data found to backup.")
        return None
    
    with open(drinks_file, 'r') as f:
        drinks = yaml.safe_load(f)
    
    # Ensure ordering is maintained by using an OrderedDict
    if not isinstance(drinks, OrderedDict):
        drinks = OrderedDict(drinks)
    
    # Sort drinks by position
    sorted_drinks = sorted(drinks.items(), key=lambda x: x[1].get('position', 0))
    
    # Create backup with essential drink information
    backup_data = OrderedDict()
    for drink_name, drink_info in sorted_drinks:
        backup_data[drink_name] = {
            'initial_price': drink_info.get('initial_price'),
            'min_price': drink_info.get('min_price'),
            'max_price': drink_info.get('max_price'),
            'position': drink_info.get('position', 0)
        }
    
    # Write backup file
    with open(backup_path, 'w') as f:
        yaml.dump(backup_data, f)
    
    # Update last backup timestamp in settings
    settings_file = os.path.join(data_dir, 'settings.yaml')
    if os.path.exists(settings_file):
        with open(settings_file, 'r') as f:
            settings = yaml.safe_load(f)
        
        settings['last_backup'] = time.time()
        
        with open(settings_file, 'w') as f:
            yaml.dump(settings, f)
    
    print(f"Created daily backup: {backup_filename}")
    return backup_path

def restore_from_backup(backup_dir, backup_name, data_dir):
    """
    Restore drink data from a backup
    
    Args:
        backup_dir: Path to the backups directory
        backup_name: Name of the backup file
        data_dir: Path to the data directory
    
    Returns:
        bool: True if successful, False otherwise
    """
    backup_path = os.path.join(backup_dir, backup_name)
    
    if not os.path.exists(backup_path):
        print(f"Backup file {backup_name} not found.")
        return False
    
    # Ensure data directory exists
    if not os.path.exists(data_dir):
        os.makedirs(data_dir)
    
    # Load backup data
    with open(backup_path, 'r') as f:
        backup_data = yaml.safe_load(f)
    
    if not backup_data:
        print(f"Backup file {backup_name} is empty or invalid.")
        return False
        
    # Load current drinks file
    drinks_file = os.path.join(data_dir, 'drinks.yaml')
    if os.path.exists(drinks_file):
        with open(drinks_file, 'r') as f:
            current_drinks = yaml.safe_load(f)
            
        # Ensure ordering is maintained by using an OrderedDict
        if not isinstance(current_drinks, OrderedDict):
            current_drinks = OrderedDict(current_drinks)
    else:
        current_drinks = OrderedDict()
    
    # Update drinks with backup data while preserving current_price and sales_count
    for drink_name, backup_info in backup_data.items():
        if drink_name in current_drinks:
            # Preserve current_price and sales_count, update other attributes
            current_price = current_drinks[drink_name].get('current_price', backup_info['initial_price'])
            sales_count = current_drinks[drink_name].get('sales_count', 0)
            trend = current_drinks[drink_name].get('trend', 'stable')
            position = backup_info.get('position', current_drinks[drink_name].get('position', 0))
            
            current_drinks[drink_name].update(backup_info)
            current_drinks[drink_name]['current_price'] = current_price
            current_drinks[drink_name]['sales_count'] = sales_count
            current_drinks[drink_name]['trend'] = trend
            current_drinks[drink_name]['position'] = position
        else:
            # New drink from backup
            current_drinks[drink_name] = backup_info.copy()
            current_drinks[drink_name]['current_price'] = backup_info['initial_price']
            current_drinks[drink_name]['sales_count'] = 0
            current_drinks[drink_name]['trend'] = 'stable'
            
            # Ensure position is set
            if 'position' not in current_drinks[drink_name]:
                # Find the highest position
                highest_position = 0
                for drink_data in current_drinks.values():
                    position = drink_data.get('position', 0)
                    highest_position = max(highest_position, position)
                current_drinks[drink_name]['position'] = highest_position + 1
    
    # Sort drinks by position
    sorted_drinks = OrderedDict(sorted(current_drinks.items(), key=lambda x: x[1].get('position', 0)))
    
    # Save updated drinks file
    with open(drinks_file, 'w') as f:
        yaml.dump(sorted_drinks, f)
    
    print(f"Successfully restored drinks data from {backup_name}")
    return True

def list_backups(backup_dir):
    """
    List all available backups
    
    Args:
        backup_dir: Path to the backups directory
    
    Returns:
        list: List of backup file info, sorted by date (newest first)
    """
    if not os.path.exists(backup_dir):
        return []
    
    backups = []
    
    for item in os.listdir(backup_dir):
        item_path = os.path.join(backup_dir, item)
        if os.path.isfile(item_path) and item.endswith('_Backup.yaml'):
            # Extract date from filename
            try:
                date_str = item.replace('_Backup.yaml', '')
                date = datetime.strptime(date_str, '%Y_%m_%d')
                
                # Create a dict with backup info
                backups.append({
                    'name': item,
                    'timestamp': date,
                    'readable_time': date.strftime('%B %d, %Y')
                })
            except ValueError:
                # Skip files with invalid names
                continue
    
    # Sort backups by date (newest first)
    backups.sort(key=lambda x: x['timestamp'], reverse=True)
    
    return backups

def cleanup_old_backups(backup_dir, keep_days=30):
    """
    Delete backups older than the specified number of days
    
    Args:
        backup_dir: Path to the backups directory
        keep_days: Number of days to keep backups (default: 30)
    """
    if not os.path.exists(backup_dir):
        return
    
    # Get all backups
    backups = list_backups(backup_dir)
    
    # Calculate cutoff time
    cutoff_time = datetime.now() - timedelta(days=keep_days)
    
    # Delete old backups
    for backup in backups:
        if backup['timestamp'] < cutoff_time:
            backup_path = os.path.join(backup_dir, backup['name'])
            try:
                os.remove(backup_path)
                print(f"Removed old backup: {backup['name']}")
            except OSError as e:
                print(f"Error removing backup {backup['name']}: {e}")
                continue
