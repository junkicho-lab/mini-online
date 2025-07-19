const { User } = require('../models');
const { Op } = require('sequelize');

// 사용자 목록 조회 (관리자만)
const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'email', 'name', 'phone', 'is_admin', 'is_active', 'created_at'],
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        users
      }
    });
  } catch (error) {
    console.error('사용자 목록 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'USER_LIST_ERROR',
        message: '사용자 목록 조회 중 오류가 발생했습니다.'
      }
    });
  }
};

// 새 사용자 생성 (관리자만)
const createUser = async (req, res) => {
  try {
    const { email, name, phone, password, isAdmin } = req.body;

    // 입력 검증
    if (!email || !name || !password) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_REQUIRED_FIELDS',
          message: '이메일, 이름, 비밀번호는 필수 입력 항목입니다.'
        }
      });
    }

    // 이메일 중복 확인
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'EMAIL_ALREADY_EXISTS',
          message: '이미 존재하는 이메일입니다.'
        }
      });
    }

    // 비밀번호 길이 검증
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_PASSWORD',
          message: '비밀번호는 최소 8자 이상이어야 합니다.'
        }
      });
    }

    // 새 사용자 생성
    const newUser = await User.create({
      email,
      name,
      phone,
      password_hash: password, // beforeCreate 훅에서 해싱됨
      is_admin: isAdmin || false
    });

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          phone: newUser.phone,
          isAdmin: newUser.is_admin,
          isActive: newUser.is_active,
          createdAt: newUser.created_at
        }
      }
    });
  } catch (error) {
    console.error('사용자 생성 오류:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'USER_CREATE_ERROR',
        message: '사용자 생성 중 오류가 발생했습니다.'
      }
    });
  }
};

// 사용자 정보 수정
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, email } = req.body;

    // 권한 확인 (본인 또는 관리자만)
    if (!req.user.is_admin && req.user.id !== parseInt(id)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: '본인의 정보만 수정할 수 있습니다.'
        }
      });
    }

    // 사용자 조회
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: '사용자를 찾을 수 없습니다.'
        }
      });
    }

    // 이메일 중복 확인 (변경하는 경우)
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ 
        where: { 
          email,
          id: { [Op.ne]: id }
        }
      });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: {
            code: 'EMAIL_ALREADY_EXISTS',
            message: '이미 존재하는 이메일입니다.'
          }
        });
      }
    }

    // 사용자 정보 업데이트
    const updateData = {};
    if (name) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (email) updateData.email = email;

    await user.update(updateData);

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          isAdmin: user.is_admin,
          isActive: user.is_active
        }
      }
    });
  } catch (error) {
    console.error('사용자 정보 수정 오류:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'USER_UPDATE_ERROR',
        message: '사용자 정보 수정 중 오류가 발생했습니다.'
      }
    });
  }
};

// 비밀번호 변경
const changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    // 권한 확인 (본인만)
    if (req.user.id !== parseInt(id)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: '본인의 비밀번호만 변경할 수 있습니다.'
        }
      });
    }

    // 입력 검증
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_PASSWORDS',
          message: '현재 비밀번호와 새 비밀번호를 입력해주세요.'
        }
      });
    }

    // 새 비밀번호 길이 검증
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_NEW_PASSWORD',
          message: '새 비밀번호는 최소 8자 이상이어야 합니다.'
        }
      });
    }

    // 사용자 조회
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: '사용자를 찾을 수 없습니다.'
        }
      });
    }

    // 현재 비밀번호 확인
    const isValidPassword = await user.validatePassword(currentPassword);
    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_CURRENT_PASSWORD',
          message: '현재 비밀번호가 올바르지 않습니다.'
        }
      });
    }

    // 비밀번호 업데이트
    await user.update({ password_hash: newPassword });

    res.json({
      success: true,
      data: {
        message: '비밀번호가 성공적으로 변경되었습니다.'
      }
    });
  } catch (error) {
    console.error('비밀번호 변경 오류:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'PASSWORD_CHANGE_ERROR',
        message: '비밀번호 변경 중 오류가 발생했습니다.'
      }
    });
  }
};

// 사용자 비활성화 (관리자만)
const deactivateUser = async (req, res) => {
  try {
    const { id } = req.params;

    // 자기 자신은 비활성화할 수 없음
    if (req.user.id === parseInt(id)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'CANNOT_DEACTIVATE_SELF',
          message: '자기 자신의 계정은 비활성화할 수 없습니다.'
        }
      });
    }

    // 사용자 조회
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: '사용자를 찾을 수 없습니다.'
        }
      });
    }

    // 사용자 비활성화
    await user.update({ is_active: false });

    res.json({
      success: true,
      data: {
        message: '사용자가 비활성화되었습니다.'
      }
    });
  } catch (error) {
    console.error('사용자 비활성화 오류:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'USER_DEACTIVATE_ERROR',
        message: '사용자 비활성화 중 오류가 발생했습니다.'
      }
    });
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  changePassword,
  deactivateUser
};

