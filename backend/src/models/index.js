const User = require('./User');
const Announcement = require('./Announcement');
const Document = require('./Document');
const Schedule = require('./Schedule');
const Notification = require('./Notification');

// 모델 간 관계 정의

// User와 Announcement 관계 (1:N)
User.hasMany(Announcement, {
  foreignKey: 'author_id',
  as: 'announcements'
});
Announcement.belongsTo(User, {
  foreignKey: 'author_id',
  as: 'author'
});

// User와 Document 관계 (1:N)
User.hasMany(Document, {
  foreignKey: 'uploader_id',
  as: 'documents'
});
Document.belongsTo(User, {
  foreignKey: 'uploader_id',
  as: 'uploader'
});

// User와 Schedule 관계 (1:N)
User.hasMany(Schedule, {
  foreignKey: 'creator_id',
  as: 'schedules'
});
Schedule.belongsTo(User, {
  foreignKey: 'creator_id',
  as: 'creator'
});

// User와 Notification 관계 (1:N)
User.hasMany(Notification, {
  foreignKey: 'user_id',
  as: 'notifications'
});
Notification.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

module.exports = {
  User,
  Announcement,
  Document,
  Schedule,
  Notification
};

