const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { upload, handleUploadError } = require('../middleware/upload');
const { 
  getDocuments, 
  getDocument, 
  uploadDocument, 
  downloadDocument, 
  updateDocument, 
  deleteDocument 
} = require('../controllers/documentController');

// 모든 라우트에 인증 미들웨어 적용
router.use(authenticateToken);

// 문서 목록 조회
router.get('/', getDocuments);

// 새 문서 업로드
router.post('/', upload.single('file'), handleUploadError, uploadDocument);

// 특정 문서 정보 조회
router.get('/:id', getDocument);

// 문서 다운로드
router.get('/:id/download', downloadDocument);

// 문서 정보 수정 (업로더 또는 관리자만)
router.put('/:id', updateDocument);

// 문서 삭제 (업로더 또는 관리자만)
router.delete('/:id', deleteDocument);

module.exports = router;

