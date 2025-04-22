# -*- mode: python ; coding: utf-8 -*-

import sys
from os import path

block_cipher = None

# Base path of your application
base_path = path.dirname(path.abspath('__file__'))

# Data files to be included
datas = [
    (path.join(base_path, 'static'), 'static'),
    (path.join(base_path, 'templates'), 'templates'),
    (path.join(base_path, 'data'), 'data'),
    (path.join(base_path, 'backups'), 'backups'),
]

a = Analysis(
    ['app.py'],
    pathex=[base_path],
    binaries=[],
    datas=datas,
    hiddenimports=[
        'flask',
        'flask.templating',
        'jinja2',
        'yaml',
        'datetime',
        'webbrowser',
        'tkinter',
        'tkinter.ttk',
        'pricing',
        'backup',
        'config',
    ],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)

pyz = PYZ(
    a.pure,
    a.zipped_data,
    cipher=block_cipher
)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    [],
    name='StockExchange',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=False,  # Set to True if you want to see console output for debugging
    icon=path.join(base_path, 'StockExchange.png') if path.exists(path.join(base_path, 'StockExchange.png')) else None,
)
