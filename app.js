// PDF Management Tool - Client-side JavaScript
// Wait for PDFLib to load
let PDFDocument, degrees;

// Initialize PDFLib when available
if (typeof PDFLib !== 'undefined') {
    ({ PDFDocument, degrees } = PDFLib);
} else {
    console.warn('PDFLib not loaded yet, waiting for script to load...');
    window.addEventListener('load', () => {
        if (typeof PDFLib !== 'undefined') {
            ({ PDFDocument, degrees } = PDFLib);
        } else {
            console.error('PDFLib failed to load. Please check your internet connection.');
        }
    });
}

// Tab switching
document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
        const targetTab = button.dataset.tab;
        
        // Update buttons
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Update content
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        document.getElementById(targetTab).classList.add('active');
    });
});

// ============= MERGE PDFs =============
let mergeFiles = [];

document.getElementById('merge-files').addEventListener('change', (e) => {
    const newFiles = Array.from(e.target.files);
    mergeFiles = [...mergeFiles, ...newFiles];
    updateMergeFileList();
    document.getElementById('merge-btn').disabled = mergeFiles.length < 2;
});

function updateMergeFileList() {
    const listDiv = document.getElementById('merge-file-list');
    if (mergeFiles.length === 0) {
        listDiv.innerHTML = '';
        return;
    }
    
    listDiv.innerHTML = '<h3>Selected Files:</h3>';
    mergeFiles.forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <span>${index + 1}. ${file.name}</span>
            <div class="file-item-buttons">
                <button onclick="moveMergeFileUp(${index})" ${index === 0 ? 'disabled' : ''} class="reorder-btn" title="Move up">▲</button>
                <button onclick="moveMergeFileDown(${index})" ${index === mergeFiles.length - 1 ? 'disabled' : ''} class="reorder-btn" title="Move down">▼</button>
                <button onclick="removeMergeFile(${index})" class="remove-btn">Remove</button>
            </div>
        `;
        listDiv.appendChild(fileItem);
    });
}

function removeMergeFile(index) {
    mergeFiles.splice(index, 1);
    updateMergeFileList();
    document.getElementById('merge-btn').disabled = mergeFiles.length < 2;
}

function moveMergeFileUp(index) {
    if (index > 0) {
        [mergeFiles[index - 1], mergeFiles[index]] = [mergeFiles[index], mergeFiles[index - 1]];
        updateMergeFileList();
    }
}

function moveMergeFileDown(index) {
    if (index < mergeFiles.length - 1) {
        [mergeFiles[index], mergeFiles[index + 1]] = [mergeFiles[index + 1], mergeFiles[index]];
        updateMergeFileList();
    }
}

document.getElementById('merge-btn').addEventListener('click', async () => {
    const statusDiv = document.getElementById('merge-status');
    
    if (typeof PDFDocument === 'undefined') {
        statusDiv.className = 'status error';
        statusDiv.textContent = 'Error: PDF library not loaded. Please check your internet connection and reload the page.';
        return;
    }
    
    statusDiv.className = 'status info';
    statusDiv.textContent = 'Merging PDFs...';
    
    try {
        const mergedPdf = await PDFDocument.create();
        
        for (const file of mergeFiles) {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await PDFDocument.load(arrayBuffer);
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach(page => mergedPdf.addPage(page));
        }
        
        const pdfBytes = await mergedPdf.save();
        downloadPDF(pdfBytes, 'merged.pdf');
        
        statusDiv.className = 'status success';
        statusDiv.textContent = `Successfully merged ${mergeFiles.length} PDFs!`;
        
        // Reset
        mergeFiles = [];
        updateMergeFileList();
        document.getElementById('merge-files').value = '';
        document.getElementById('merge-btn').disabled = true;
    } catch (error) {
        statusDiv.className = 'status error';
        statusDiv.textContent = `Error: ${error.message}`;
    }
});

// ============= SPLIT/EXTRACT =============
let splitFile = null;
let splitPdfDoc = null;

document.getElementById('split-file').addEventListener('change', async (e) => {
    if (e.target.files.length === 0) return;
    
    splitFile = e.target.files[0];
    const arrayBuffer = await splitFile.arrayBuffer();
    splitPdfDoc = await PDFDocument.load(arrayBuffer);
    
    const pageCount = splitPdfDoc.getPageCount();
    document.getElementById('split-info').innerHTML = `
        <strong>File:</strong> ${splitFile.name}<br>
        <strong>Pages:</strong> ${pageCount}
    `;
    
    document.getElementById('split-btn').disabled = false;
});

document.getElementById('split-btn').addEventListener('click', async () => {
    const pageRange = document.getElementById('page-range').value.trim();
    const statusDiv = document.getElementById('split-status');
    
    if (!pageRange) {
        statusDiv.className = 'status error';
        statusDiv.textContent = 'Please specify page range!';
        return;
    }
    
    statusDiv.className = 'status info';
    statusDiv.textContent = 'Extracting pages...';
    
    try {
        const pages = parsePageRange(pageRange, splitPdfDoc.getPageCount());
        
        if (pages.length === 0) {
            throw new Error('No valid pages selected');
        }
        
        const newPdf = await PDFDocument.create();
        const copiedPages = await newPdf.copyPages(splitPdfDoc, pages);
        copiedPages.forEach(page => newPdf.addPage(page));
        
        const pdfBytes = await newPdf.save();
        downloadPDF(pdfBytes, `extracted_pages_${pageRange.replace(/\s/g, '')}.pdf`);
        
        statusDiv.className = 'status success';
        statusDiv.textContent = `Successfully extracted ${pages.length} page(s)!`;
    } catch (error) {
        statusDiv.className = 'status error';
        statusDiv.textContent = `Error: ${error.message}`;
    }
});

// ============= ROTATE PAGES =============
let rotateFile = null;
let rotatePdfDoc = null;

document.getElementById('rotate-file').addEventListener('change', async (e) => {
    if (e.target.files.length === 0) return;
    
    rotateFile = e.target.files[0];
    const arrayBuffer = await rotateFile.arrayBuffer();
    rotatePdfDoc = await PDFDocument.load(arrayBuffer);
    
    const pageCount = rotatePdfDoc.getPageCount();
    document.getElementById('rotate-info').innerHTML = `
        <strong>File:</strong> ${rotateFile.name}<br>
        <strong>Pages:</strong> ${pageCount}
    `;
    
    document.getElementById('rotate-btn').disabled = false;
});

document.getElementById('rotate-btn').addEventListener('click', async () => {
    const pageInput = document.getElementById('rotate-pages').value.trim();
    const rotationDegrees = parseInt(document.getElementById('rotate-degrees').value);
    const statusDiv = document.getElementById('rotate-status');
    
    if (!pageInput) {
        statusDiv.className = 'status error';
        statusDiv.textContent = 'Please specify pages to rotate!';
        return;
    }
    
    statusDiv.className = 'status info';
    statusDiv.textContent = 'Rotating pages...';
    
    try {
        let pages;
        if (pageInput.toLowerCase() === 'all') {
            pages = Array.from({ length: rotatePdfDoc.getPageCount() }, (_, i) => i);
        } else {
            pages = parsePageRange(pageInput, rotatePdfDoc.getPageCount());
        }
        
        if (pages.length === 0) {
            throw new Error('No valid pages selected');
        }
        
        pages.forEach(pageIndex => {
            const page = rotatePdfDoc.getPage(pageIndex);
            page.setRotation(degrees(rotationDegrees));
        });
        
        const pdfBytes = await rotatePdfDoc.save();
        downloadPDF(pdfBytes, `rotated_${rotateFile.name}`);
        
        statusDiv.className = 'status success';
        statusDiv.textContent = `Successfully rotated ${pages.length} page(s) by ${rotationDegrees}°!`;
    } catch (error) {
        statusDiv.className = 'status error';
        statusDiv.textContent = `Error: ${error.message}`;
    }
});

// ============= VIEW METADATA =============
document.getElementById('metadata-file').addEventListener('change', async (e) => {
    if (e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    const displayDiv = document.getElementById('metadata-info');
    displayDiv.innerHTML = '<h3>PDF Metadata</h3>';
    
    const metadata = {
        'File Name': file.name,
        'File Size': formatFileSize(file.size),
        'Number of Pages': pdfDoc.getPageCount(),
        'Title': pdfDoc.getTitle() || 'Not set',
        'Author': pdfDoc.getAuthor() || 'Not set',
        'Subject': pdfDoc.getSubject() || 'Not set',
        'Creator': pdfDoc.getCreator() || 'Not set',
        'Producer': pdfDoc.getProducer() || 'Not set',
        'Creation Date': pdfDoc.getCreationDate() ? pdfDoc.getCreationDate().toLocaleString() : 'Not set',
        'Modification Date': pdfDoc.getModificationDate() ? pdfDoc.getModificationDate().toLocaleString() : 'Not set',
        'Keywords': pdfDoc.getKeywords() || 'Not set'
    };
    
    const table = document.createElement('table');
    table.className = 'metadata-table';
    
    for (const [key, value] of Object.entries(metadata)) {
        const row = table.insertRow();
        const cellKey = row.insertCell(0);
        const cellValue = row.insertCell(1);
        cellKey.innerHTML = `<strong>${key}</strong>`;
        cellValue.textContent = value;
    }
    
    displayDiv.appendChild(table);
    
    // Display page dimensions for first page
    const firstPage = pdfDoc.getPage(0);
    const { width, height } = firstPage.getSize();
    
    const pageSizeInfo = document.createElement('div');
    pageSizeInfo.className = 'file-info';
    pageSizeInfo.style.marginTop = '20px';
    pageSizeInfo.innerHTML = `
        <strong>First Page Dimensions:</strong><br>
        Width: ${width.toFixed(2)} points<br>
        Height: ${height.toFixed(2)} points<br>
        <small>(1 point = 1/72 inch)</small>
    `;
    displayDiv.appendChild(pageSizeInfo);
});

// ============= UTILITY FUNCTIONS =============
function parsePageRange(rangeStr, totalPages) {
    const pages = new Set();
    const parts = rangeStr.split(',');
    
    for (const part of parts) {
        const trimmed = part.trim();
        if (trimmed.includes('-')) {
            const [start, end] = trimmed.split('-').map(s => parseInt(s.trim()));
            if (isNaN(start) || isNaN(end)) continue;
            for (let i = Math.max(1, start); i <= Math.min(end, totalPages); i++) {
                pages.add(i - 1); // Convert to 0-based index
            }
        } else {
            const pageNum = parseInt(trimmed);
            if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
                pages.add(pageNum - 1); // Convert to 0-based index
            }
        }
    }
    
    return Array.from(pages).sort((a, b) => a - b);
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function downloadPDF(pdfBytes, filename) {
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
