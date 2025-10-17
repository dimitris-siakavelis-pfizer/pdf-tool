# PDF Management Tool

A client-side PDF management tool that lets you work with PDF files entirely in your browser. No data is uploaded to any server - all processing happens locally.

## Features

### 📑 Merge PDFs
Combine multiple PDF files into a single document. Upload two or more PDFs and merge them in the order you select.

### ✂️ Split/Extract Pages
Extract specific pages from a PDF file. Use page ranges like:
- `1-3` to extract pages 1 through 3
- `1,3,5` to extract pages 1, 3, and 5
- `1-3,5,7-9` to combine ranges and individual pages

### 🔄 Rotate Pages
Rotate specific pages or all pages in your PDF document. Choose from:
- 90° clockwise
- 180°
- 270° clockwise (90° counter-clockwise)

Specify pages using ranges (e.g., `1-3,5`) or use `all` to rotate all pages.

### 📊 View Metadata
Extract and view comprehensive PDF file metadata including:
- File information (name, size, page count)
- Document properties (title, author, subject, creator, producer)
- Dates (creation and modification)
- Keywords
- Page dimensions

## Usage

### Running Locally

1. Clone this repository:
```bash
git clone https://github.com/dimitris-siakavelis-pfizer/pdf-tool-static.git
cd pdf-tool-static
```

2. Open `index.html` in your web browser:
```bash
# On macOS
open index.html

# On Linux
xdg-open index.html

# On Windows
start index.html
```

Alternatively, you can serve it using a simple HTTP server:
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js
npx http-server
```

Then navigate to `http://localhost:8000` in your browser.

### Using the Tool

1. **Select a Feature**: Click on one of the tabs (Merge PDFs, Split/Extract, Rotate Pages, or View Metadata)

2. **Upload PDF(s)**: Click the "Choose PDF File(s)" button and select your file(s)

3. **Configure**: 
   - For merging: Add multiple files, reorder if needed
   - For splitting: Enter page ranges to extract
   - For rotating: Specify pages and rotation angle
   - For metadata: Automatically displayed upon upload

4. **Execute**: Click the action button (Merge, Extract, or Rotate)

5. **Download**: The processed PDF will automatically download to your computer

## Technology

- **pdf-lib**: A powerful JavaScript library for creating and modifying PDFs
- **Vanilla JavaScript**: No frameworks required
- **Client-side Processing**: All operations happen in your browser for privacy and speed

## Browser Compatibility

Works in all modern browsers that support:
- ES6+ JavaScript
- FileReader API
- Blob API

Tested on:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Privacy & Security

🔒 **Your files never leave your device.** All PDF processing happens entirely in your browser using JavaScript. No files are uploaded to any server, ensuring complete privacy and security.

## License

MIT License - Feel free to use and modify as needed.