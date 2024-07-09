const splitFile = require('split-file');
const fs = require('fs');
const path = require('path');

// Đường dẫn đến thư mục gốc của API
const apiRootPath = 'path/to/my-api';

// Kích thước mỗi phần (ở đây là 1MB)
const chunkSize = 1024 * 1024; // 1MB

// Chia nhỏ từng thư mục trong cấu trúc dự án
const splitFolders = async () => {
  try {
    // Lấy danh sách các thư mục trong thư mục gốc
    const folders = fs.readdirSync(apiRootPath, { withFileTypes: true })
                      .filter(dirent => dirent.isDirectory())
                      .map(dirent => dirent.name);

    // Chia nhỏ từng thư mục
    for (const folder of folders) {
      const folderPath = path.join(apiRootPath, folder);
      await splitFile.splitFile(folderPath, chunkSize);
      console.log(`Folder ${folder} splitted successfully.`);
    }

    console.log('All folders splitted successfully.');
  } catch (err) {
    console.error('Error splitting folders:', err);
  }
};

splitFolders();
