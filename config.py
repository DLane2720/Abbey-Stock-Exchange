#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import yaml
import os

def load_settings(settings_file):
    """Load application settings from YAML file"""
    if not os.path.exists(settings_file):
        return {
            'update_interval': 90,  # seconds
            'price_change_amount': 0.50,  # dollars
            'logo_path': '',
            'last_update': 0,
            'last_backup': 0
        }
    
    with open(settings_file, 'r') as f:
        settings = yaml.safe_load(f)
    
    # Ensure all required settings are present
    defaults = {
        'update_interval': 90,
        'price_change_amount': 0.50,
        'logo_path': '',
        'last_update': 0,
        'last_backup': 0
    }
    
    for key, value in defaults.items():
        if key not in settings:
            settings[key] = value
    
    return settings

def save_settings(settings_file, settings):
    """Save application settings to YAML file"""
    with open(settings_file, 'w') as f:
        yaml.dump(settings, f)
