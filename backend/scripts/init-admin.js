require('dotenv').config();
const { User } = require('../src/models');
const { testConnection, syncDatabase } = require('../src/config/database');

const createInitialAdmin = async () => {
  try {
    console.log('🔧 초기 관리자 계정 생성을 시작합니다...');
    
    // 데이터베이스 연결 및 동기화
    await testConnection();
    await syncDatabase();
    
    // 기존 관리자 계정 확인
    const existingAdmin = await User.findOne({ where: { is_admin: true } });
    if (existingAdmin) {
      console.log('⚠️  이미 관리자 계정이 존재합니다:', existingAdmin.email);
      return;
    }
    
    // 초기 관리자 계정 생성
    const adminUser = await User.create({
      email: 'admin@school.edu',
      name: '시스템 관리자',
      phone: '010-0000-0000',
      password_hash: 'admin123!', // beforeCreate 훅에서 해싱됨
      is_admin: true,
      is_active: true
    });
    
    console.log('✅ 초기 관리자 계정이 생성되었습니다:');
    console.log('   이메일: admin@school.edu');
    console.log('   비밀번호: admin123!');
    console.log('   이름: 시스템 관리자');
    console.log('');
    console.log('⚠️  보안을 위해 첫 로그인 후 비밀번호를 변경해주세요.');
    
  } catch (error) {
    console.error('❌ 초기 관리자 계정 생성 실패:', error);
    process.exit(1);
  }
};

// 스크립트 실행
createInitialAdmin()
  .then(() => {
    console.log('🎉 초기 설정이 완료되었습니다.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ 초기 설정 실패:', error);
    process.exit(1);
  });

