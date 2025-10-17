# Testing Guide for PDF Management Tool

This guide will help you test all features of the PDF Management Tool.

## Prerequisites

1. A modern web browser (Chrome, Firefox, Safari, or Edge)
2. A few sample PDF files for testing (you can create simple PDFs from any document editor)

## Testing Each Feature

### 1. Testing Merge PDFs

**Steps:**
1. Open `index.html` in your browser
2. Make sure you're on the "Merge PDFs" tab (default)
3. Click "Choose PDF Files" and select 2 or more PDF files
4. You should see the files listed with their names
5. You can remove files by clicking the "Remove" button next to any file
6. Click "Merge PDFs" button
7. A new PDF named `merged.pdf` should download automatically
8. Open the merged PDF to verify all pages are included in order

**Expected Result:** A single PDF containing all pages from all selected files in the order they were added.

---

### 2. Testing Split/Extract Pages

**Steps:**
1. Click on the "Split/Extract" tab
2. Click "Choose PDF File" and select a PDF with multiple pages (at least 5 pages)
3. You should see the file information showing the filename and page count
4. In the "Pages to extract" field, enter a page range, for example:
   - `1-3` to extract pages 1, 2, and 3
   - `1,3,5` to extract pages 1, 3, and 5
   - `1-3,5,7-9` to extract pages 1, 2, 3, 5, 7, 8, and 9
5. Click "Extract Pages"
6. A new PDF should download with a name like `extracted_pages_1-3.pdf`
7. Open the extracted PDF to verify only the specified pages are included

**Expected Result:** A new PDF containing only the pages you specified.

---

### 3. Testing Rotate Pages

**Steps:**
1. Click on the "Rotate Pages" tab
2. Click "Choose PDF File" and select a PDF
3. You should see the file information showing the filename and page count
4. In the "Pages to rotate" field, enter either:
   - `all` to rotate all pages
   - A page range like `1-3` or `1,3,5`
5. Select the rotation angle from the dropdown:
   - 90° Clockwise
   - 180°
   - 270° Clockwise (90° Counter-clockwise)
6. Click "Rotate Pages"
7. A new PDF named `rotated_[original-filename].pdf` should download
8. Open the rotated PDF to verify the specified pages are rotated

**Expected Result:** A new PDF with the specified pages rotated by the chosen angle.

---

### 4. Testing View Metadata

**Steps:**
1. Click on the "View Metadata" tab
2. Click "Choose PDF File" and select any PDF
3. Metadata should immediately display in a table showing:
   - File Name
   - File Size
   - Number of Pages
   - Title, Author, Subject, Creator, Producer
   - Creation Date and Modification Date
   - Keywords
   - First Page Dimensions

**Expected Result:** A comprehensive table of metadata from the PDF file.

---

## Sample Test Cases

### Test Case 1: Merge Three PDFs
- **Input:** 3 PDF files (test1.pdf with 2 pages, test2.pdf with 3 pages, test3.pdf with 1 page)
- **Expected Output:** merged.pdf with 6 pages total

### Test Case 2: Extract Middle Pages
- **Input:** A 10-page PDF, extract pages "3-5,8"
- **Expected Output:** extracted_pages_3-5,8.pdf with 4 pages (pages 3, 4, 5, and 8)

### Test Case 3: Rotate Odd Pages
- **Input:** A 6-page PDF, rotate pages "1,3,5" by 90°
- **Expected Output:** rotated_[filename].pdf with pages 1, 3, and 5 rotated 90° clockwise

### Test Case 4: View Metadata
- **Input:** Any PDF file
- **Expected Output:** Complete metadata table displayed on screen

---

## Troubleshooting

### Issue: "Error: PDF library not loaded"
**Solution:** Make sure you have an active internet connection. The pdf-lib library is loaded from a CDN. Refresh the page if needed.

### Issue: "No valid pages selected"
**Solution:** Check your page range syntax. Use commas to separate individual pages and hyphens for ranges. Make sure page numbers are within the document's page count.

### Issue: Downloaded file won't open
**Solution:** Ensure the original PDF files are valid and not corrupted. Try with different PDF files.

### Issue: File upload button not working
**Solution:** Make sure you're clicking the blue "Choose PDF File(s)" button, not the disabled action buttons below.

---

## Browser Compatibility

The tool has been tested on:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

---

## Privacy Notice

Remember: All processing happens entirely in your browser. No files are uploaded to any server. You can even use this tool offline after the initial page load (though the CDN library needs to load first).

---

## Performance Notes

- **Small PDFs (< 10 MB):** Process almost instantly
- **Medium PDFs (10-50 MB):** May take a few seconds
- **Large PDFs (> 50 MB):** May take longer, please be patient

The processing time depends on:
- File size
- Number of pages
- Number of files being merged
- Your computer's processing power

---

## Advanced Testing

### Edge Cases to Test

1. **Single page extraction:** Extract page "1" from a 1-page PDF
2. **Reverse page order:** Extract pages "5,4,3,2,1" from a 5-page PDF
3. **Rotate all pages 360°:** Rotate all pages by 90° four times (should return to original)
4. **Merge single file:** Try merging just one PDF (should require at least 2)
5. **Empty page range:** Try extracting with no page range specified (should show error)

---

For issues or questions, please refer to the README.md file or check the browser console for detailed error messages.
