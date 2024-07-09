const splitFile = require('split-file');
const fs = require('fs');
const path = require('path');

// Đường dẫn đến thư mục chứa các phần nhỏ
const chunksDir = 'path/to/my-api';

// Tạo một đối tượng để lưu trữ dữ liệu ghép nối
const writeStream = fs.createWriteStream(path.join(chunksDir, 'reconstructed-api.zip'));

// Ghép nối lại từ các phần nhỏ
const promises = [];
fs.readdirSync(chunksDir).forEach((file) => {
  const chunkPath = path.join(chunksDir, file);
  promises.push(fs.promises.readFile(chunkPath));
});

// Đợi tất cả các phần đều được đọc xong
Promise.all(promises)
  .then((buffers) => {
    buffers.forEach((buffer) => {
      writeStream.write(buffer);
    });
    writeStream.end();
    console.log('API reconstructed successfully.');
  })
  .catch((err) => {
    console.error('Error reconstructing API:', err);
  });