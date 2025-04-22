#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Backup Migration Script

This script converts old backup format (multiple folders with timestamp names)
to the new format (single YAML file per day with drink configuration).
"""

import os
import shutil
import yaml
from datetime import datetime

def migrate_backups():
    """Migrate old backup folders to new backup files format"""
    # Path to backup directory
    backup_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'backups')
    
    if not os.path.exists(backup_dir):
        print("No backups directory found.")
        return
    
    # Get list of backup folders (old format)
    backup_folders = []
    for item in os.listdir(backup_dir):
        item_path = os.path.join(backup_dir, item)
        if os.path.isdir(item_path) and item.startswith('backup_'):
            try:
                # Extract timestamp from folder name
                timestamp_str = item.replace('backup_', '')
                timestamp = datetime.strptime(timestamp_str, '%Y%m%d_%H%M%S')
                backup_folders.append({
                    'path': item_path,
                    'name': item,
                    'timestamp': timestamp
                })
            except ValueError:
                # Skip folders with invalid names
                continue
    
    if not backup_folders:
        print("No old-format backups found to migrate.")
        return
    
    print(f"Found {len(backup_folders)} old-format backups to migrate.")
    
    # Group backups by date
    date_grouped_backups = {}
    for backup in backup_folders:
        date_key = backup['timestamp'].strftime('%Y_%m_%d')
        if date_key not in date_grouped_backups:
            date_grouped_backups[date_key] = []
        date_grouped_backups[date_key].append(backup)
    
    # For each date, convert the most recent backup to the new format
    migrated_count = 0
    for date_key, backups in date_grouped_backups.items():
        # Sort by timestamp (newest first)
        backups.sort(key=lambda x: x['timestamp'], reverse=True)
        newest_backup = backups[0]
        
        # Check if drinks.yaml exists in the backup
        drinks_path = os.path.join(newest_backup['path'], 'drinks.yaml')
        if not os.path.exists(drinks_path):
            print(f"Skip migration for {date_key}: no drinks.yaml found in {newest_backup['name']}")
            continue
        
        # Load drinks data
        with open(drinks_path, 'r') as f:
            drinks = yaml.safe_load(f)
        
        # Create new backup format
        backup_data = {}
        for drink_name, drink_info in drinks.items():
            backup_data[drink_name] = {
                'initial_price': drink_info.get('initial_price'),
                'min_price': drink_info.get('min_price'),
                'max_price': drink_info.get('max_price')
            }
        
        # Save new backup file
        new_backup_name = f"{date_key}_Backup.yaml"
        new_backup_path = os.path.join(backup_dir, new_backup_name)
        
        # Skip if already exists
        if os.path.exists(new_backup_path):
            print(f"Skip migration for {date_key}: {new_backup_name} already exists")
            continue
        
        with open(new_backup_path, 'w') as f:
            yaml.dump(backup_data, f)
        
        print(f"Migrated {newest_backup['name']} to {new_backup_name}")
        migrated_count += 1
    
    print(f"Migration complete. Migrated {migrated_count} backups to new format.")
    print("You can safely delete the old backup folders once you've verified the migration.")

if __name__ == '__main__':
    migrate_backups()
