# Abbey Stock Exchange Application

A dynamic pricing system for bars that simulates a stock market for drinks. Prices fluctuate based on demand (sales volume), creating an interactive experience for customers.

## Features

- Real-time price updates based on drink sales
- Responsive admin interface for inventory and sales management
- TV-optimized display interface for customers to view current prices
- Automatic daily backup system
- Custom logo support
- Cross-platform (Windows, macOS, Linux)

## Setup and Running (Python)

### Prerequisites

- Python 3.9 or higher
- pip (Python package manager)

### Installation

1. Clone this repository:
   ```
   git clone https://your-repository-url/Exchange3_dev.git
   cd Exchange3_dev
   ```

2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

### Running in Development Mode

1. Run the application:
   ```
   python app.py
   ```

2. The application will automatically open:
   - Admin interface: http://127.0.0.1:5050/admin/sales
   - Display interface: http://127.0.0.1:5050/display
   - A status window will also appear showing that the server is running

## Building Standalone Executable

### Windows

1. Run the build script:
   ```
   build_exe.bat
   ```

2. Find the executable in the `dist` folder

### macOS/Linux

1. Make the build script executable:
   ```
   chmod +x build_exe.sh
   ```

2. Run the build script:
   ```
   ./build_exe.sh
   ```

3. Find the executable in the `dist` folder

## Deployment

### Running the Executable

1. Copy the entire `dist` folder to your target machine
2. Run the `exchange3` executable inside the dist folder
3. The application will start automatically and open in your default web browser
4. For a customer-facing display, use a dedicated computer/screen pointing to the display URL

### Configuration Tips

- For a permanent installation, consider setting up the executable to run on system startup
- For the display screen, use a dedicated computer in kiosk mode pointing to the display URL
- Customize the appearance by adding your bar logo in the Settings page

## Backup System

The application uses a simplified daily backup system:

- Backups are created once per day and stored as YAML files named with the date (YYYY_MM_DD_Backup.yaml)
- Backups contain essential drink configuration (initial, minimum, and maximum prices)
- You can manually create a backup from the admin settings page
- Backups are automatically maintained for 30 days

### Migrating from Old Backup Format

If you're updating from a previous version, run the migration script to convert old backup folders to the new format:

```
python migrate_backups.py
```

After verifying the migration was successful, you can remove the old backup folders:

```
python cleanup_old_backups.py
```

## File Structure

- `app.py` - Main application entry point
- `static/` - CSS, JavaScript, and image files
- `templates/` - HTML templates for the UI
- `data/` - Application data storage
- `backups/` - Automated backup storage

## Troubleshooting

- If the application doesn't open in your browser automatically, manually navigate to http://127.0.0.1:5050/display
- If the executable fails to start, ensure all files from the dist directory are present
- Check the console output for any error messages
