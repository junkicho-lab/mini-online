const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  is_admin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// 비밀번호 해싱 메서드
User.prototype.setPassword = async function(password) {
  const saltRounds = 10;
  this.password_hash = await bcrypt.hash(password, saltRounds);
};

// 비밀번호 검증 메서드
User.prototype.validatePassword = async function(password) {
  return await bcrypt.compare(password, this.password_hash);
};

// JSON 변환 시 비밀번호 해시 제외
User.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  delete values.password_hash;
  return values;
};

// 사용자 생성 전 비밀번호 해싱
User.beforeCreate(async (user) => {
  if (user.password_hash && !user.password_hash.startsWith('$2b$')) {
    await user.setPassword(user.password_hash);
  }
});

// 사용자 업데이트 전 비밀번호 해싱
User.beforeUpdate(async (user) => {
  if (user.changed('password_hash') && !user.password_hash.startsWith('$2b$')) {
    await user.setPassword(user.password_hash);
  }
});

module.exports = User;

