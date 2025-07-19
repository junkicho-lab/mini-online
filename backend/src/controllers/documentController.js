const { Document, User } = require('../models');
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs');
const { deleteFile, uploadDir } = require('../middleware/upload');

// 문서 목록 조회
const getDocuments = async (req, res) => {
  try {
    const { limit = 10, offset = 0, category, search } = req.query;

    // 검색 조건 설정
    const whereClause = {};
    if (category && category !== 'all') {
      whereClause.category = category;
    }
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { original_filename: { [Op.like]: `%${search}%` } }
      ];
    }

    const documents = await Document.findAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'uploader',
        attributes: ['id', 'name', 'email']
      }],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // 전체 개수 조회
    const totalCount = await Document.count({ where: whereClause });

    res.json({
      success: true,
      data: {
        documents,
        pagination: {
          total: totalCount,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: parseInt(offset) + parseInt(limit) < totalCount
        }
      }
    });
  } catch (error) {
    console.error('문서 목록 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'DOCUMENT_LIST_ERROR',
        message: '문서 목록 조회 중 오류가 발생했습니다.'
      }
    });
  }
};

// 특정 문서 정보 조회
const getDocument = async (req, res) => {
  try {
    const { id } = req.params;

    const document = await Document.findByPk(id, {
      include: [{
        model: User,
        as: 'uploader',
        attributes: ['id', 'name', 'email']
      }]
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'DOCUMENT_NOT_FOUND',
          message: '문서를 찾을 수 없습니다.'
        }
      });
    }

    res.json({
      success: true,
      data: {
        document
      }
    });
  } catch (error) {
    console.error('문서 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'DOCUMENT_GET_ERROR',
        message: '문서 조회 중 오류가 발생했습니다.'
      }
    });
  }
};

// 새 문서 업로드
const uploadDocument = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const file = req.file;

    // 파일 업로드 확인
    if (!file) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'NO_FILE_UPLOADED',
          message: '업로드할 파일을 선택해주세요.'
        }
      });
    }

    // 입력 검증
    if (!title || !category) {
      // 업로드된 파일 삭제
      deleteFile(file.filename);
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_REQUIRED_FIELDS',
          message: '제목과 카테고리는 필수 입력 항목입니다.'
        }
      });
    }

    // 카테고리 검증
    const validCategories = ['공문', '회의자료', '양식', '기타'];
    if (!validCategories.includes(category)) {
      deleteFile(file.filename);
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_CATEGORY',
          message: '유효하지 않은 카테고리입니다.'
        }
      });
    }

    // 제목 길이 검증
    if (title.length > 255) {
      deleteFile(file.filename);
      return res.status(400).json({
        success: false,
        error: {
          code: 'TITLE_TOO_LONG',
          message: '제목은 255자를 초과할 수 없습니다.'
        }
      });
    }

    // 새 문서 생성
    const document = await Document.create({
      title,
      description: description || '',
      filename: file.filename,
      original_filename: file.originalname,
      file_size: file.size,
      file_type: file.mimetype,
      category,
      uploader_id: req.user.id
    });

    // 업로더 정보와 함께 조회
    const createdDocument = await Document.findByPk(document.id, {
      include: [{
        model: User,
        as: 'uploader',
        attributes: ['id', 'name', 'email']
      }]
    });

    res.status(201).json({
      success: true,
      data: {
        document: createdDocument
      }
    });
  } catch (error) {
    // 오류 발생 시 업로드된 파일 삭제
    if (req.file) {
      deleteFile(req.file.filename);
    }
    
    console.error('문서 업로드 오류:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'DOCUMENT_UPLOAD_ERROR',
        message: '문서 업로드 중 오류가 발생했습니다.'
      }
    });
  }
};

// 문서 다운로드
const downloadDocument = async (req, res) => {
  try {
    const { id } = req.params;

    // 문서 조회
    const document = await Document.findByPk(id);
    if (!document) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'DOCUMENT_NOT_FOUND',
          message: '문서를 찾을 수 없습니다.'
        }
      });
    }

    // 파일 경로 확인
    const filePath = path.join(uploadDir, document.filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'FILE_NOT_FOUND',
          message: '파일을 찾을 수 없습니다.'
        }
      });
    }

    // 다운로드 횟수 증가
    await document.increment('download_count');

    // 파일 다운로드
    res.download(filePath, document.original_filename, (err) => {
      if (err) {
        console.error('파일 다운로드 오류:', err);
        if (!res.headersSent) {
          res.status(500).json({
            success: false,
            error: {
              code: 'DOWNLOAD_ERROR',
              message: '파일 다운로드 중 오류가 발생했습니다.'
            }
          });
        }
      }
    });
  } catch (error) {
    console.error('문서 다운로드 오류:', error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: {
          code: 'DOCUMENT_DOWNLOAD_ERROR',
          message: '문서 다운로드 중 오류가 발생했습니다.'
        }
      });
    }
  }
};

// 문서 정보 수정
const updateDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category } = req.body;

    // 문서 조회
    const document = await Document.findByPk(id);
    if (!document) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'DOCUMENT_NOT_FOUND',
          message: '문서를 찾을 수 없습니다.'
        }
      });
    }

    // 권한 확인 (업로더 또는 관리자만)
    if (!req.user.is_admin && document.uploader_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: '문서를 수정할 권한이 없습니다.'
        }
      });
    }

    // 입력 검증
    if (title && title.length > 255) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'TITLE_TOO_LONG',
          message: '제목은 255자를 초과할 수 없습니다.'
        }
      });
    }

    if (category) {
      const validCategories = ['공문', '회의자료', '양식', '기타'];
      if (!validCategories.includes(category)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_CATEGORY',
            message: '유효하지 않은 카테고리입니다.'
          }
        });
      }
    }

    // 업데이트할 데이터 준비
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;

    // 문서 정보 업데이트
    await document.update(updateData);

    // 업데이트된 문서 조회
    const updatedDocument = await Document.findByPk(id, {
      include: [{
        model: User,
        as: 'uploader',
        attributes: ['id', 'name', 'email']
      }]
    });

    res.json({
      success: true,
      data: {
        document: updatedDocument
      }
    });
  } catch (error) {
    console.error('문서 수정 오류:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'DOCUMENT_UPDATE_ERROR',
        message: '문서 수정 중 오류가 발생했습니다.'
      }
    });
  }
};

// 문서 삭제
const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;

    // 문서 조회
    const document = await Document.findByPk(id);
    if (!document) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'DOCUMENT_NOT_FOUND',
          message: '문서를 찾을 수 없습니다.'
        }
      });
    }

    // 권한 확인 (업로더 또는 관리자만)
    if (!req.user.is_admin && document.uploader_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: '문서를 삭제할 권한이 없습니다.'
        }
      });
    }

    // 파일 삭제
    deleteFile(document.filename);

    // 데이터베이스에서 문서 삭제
    await document.destroy();

    res.json({
      success: true,
      data: {
        message: '문서가 삭제되었습니다.'
      }
    });
  } catch (error) {
    console.error('문서 삭제 오류:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'DOCUMENT_DELETE_ERROR',
        message: '문서 삭제 중 오류가 발생했습니다.'
      }
    });
  }
};

module.exports = {
  getDocuments,
  getDocument,
  uploadDocument,
  downloadDocument,
  updateDocument,
  deleteDocument
};

