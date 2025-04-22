#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Old Backup Cleanup Script

This script removes the old folder-based backup directories after migrating
to the new file-based backup format.
"""

import os
import shutil
from datetime import datetime

def cleanup_old_backups():
    """Delete old backup folders after migration"""
    # Path to backup directory
    backup_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'backups')
    
    if not os.path.exists(backup_dir):
        print("No backups directory found.")
        return
    
    # Get list of old backup folders
    old_backup_folders = []
    for item in os.listdir(backup_dir):
        item_path = os.path.join(backup_dir, item)
        if os.path.isdir(item_path) and item.startswith('backup_'):
            old_backup_folders.append(item_path)
    
    if not old_backup_folders:
        print("No old backup folders found to clean up.")
        return
    
    # Ask for confirmation before proceeding
    answer = input(f"This will permanently delete {len(old_backup_folders)} old backup folders. Are you sure? (y/N): ")
    
    if answer.lower() != 'y':
        print("Operation cancelled.")
        return
    
    # Remove old backup folders
    deleted_count = 0
    for folder_path in old_backup_folders:
        try:
            shutil.rmtree(folder_path)
            print(f"Deleted {os.path.basename(folder_path)}")
            deleted_count += 1
        except Exception as e:
            print(f"Error deleting {os.path.basename(folder_path)}: {e}")
    
    print(f"Cleanup complete. Deleted {deleted_count} old backup folders.")

if __name__ == '__main__':
    cleanup_old_backups()
