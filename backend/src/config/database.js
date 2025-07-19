const { Sequelize } = require('sequelize');
const path = require('path');

// 환경 변수에서 데이터베이스 경로 가져오기
const dbPath = process.env.DB_PATH || './data/database.sqlite';
const fullDbPath = path.resolve(dbPath);

// Sequelize 인스턴스 생성
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: fullDbPath,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: false,
    freezeTableName: true
  }
});

// 데이터베이스 연결 테스트
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ 데이터베이스 연결이 성공적으로 설정되었습니다.');
  } catch (error) {
    console.error('❌ 데이터베이스 연결에 실패했습니다:', error);
    process.exit(1);
  }
};

// 데이터베이스 동기화
const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log('✅ 데이터베이스 동기화가 완료되었습니다.');
  } catch (error) {
    console.error('❌ 데이터베이스 동기화에 실패했습니다:', error);
    throw error;
  }
};

module.exports = {
  sequelize,
  testConnection,
  syncDatabase
};

