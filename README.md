# Google Image FX Downloader

A Tampermonkey script to automate prompt copying, seed extraction, image downloading, and JSON saving on Google Image FX.

## Installation
1. Install [Tampermonkey](https://www.tampermonkey.net/).
2. Copy-paste `GoogleImageFX-Automation.user.js` into a new Tampermonkey script.
3. Save and enable it.

## Usage
Go to [Google Image FX](https://labs.google/fx/tools/image-fx) and click the **"Run Script Actions"** button.  
The script will download images and save metadata as JSON.

## Flask Image Gallery
Use my [Flask Image Gallery](https://github.com/onurakay/image-fx-gallery) to view and manage these images.  
It reads the JSON files as a database for displaying images.

### Adding JSON to the Gallery
- The script generates JSON metadata for each image set.  
- A fetcher script exists on Flask Image Gallery app but **new JSON files must be manually added** to the gallery’s database. 

## License
MIT
