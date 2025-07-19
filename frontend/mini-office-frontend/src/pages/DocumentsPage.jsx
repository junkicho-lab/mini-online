import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  Download, 
  Search, 
  Filter, 
  FileText, 
  Image, 
  FileVideo, 
  FileAudio,
  File,
  Folder,
  Eye,
  Edit,
  Trash2,
  Plus,
  Calendar,
  User,
  Tag,
  MoreVertical,
  Grid,
  List,
  SortAsc,
  SortDesc
} from 'lucide-react';
import api from '../lib/api';

const DocumentsPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // 문서 카테고리
  const categories = [
    { id: 'all', name: '전체', icon: Folder, color: 'text-gray-600' },
    { id: 'document', name: '문서', icon: FileText, color: 'text-blue-600' },
    { id: 'image', name: '이미지', icon: Image, color: 'text-green-600' },
    { id: 'video', name: '비디오', icon: FileVideo, color: 'text-purple-600' },
    { id: 'audio', name: '오디오', icon: FileAudio, color: 'text-orange-600' },
    { id: 'other', name: '기타', icon: File, color: 'text-gray-600' }
  ];

  // 더미 데이터 (실제 API 연결 전까지 사용)
  const dummyDocuments = [
    {
      id: 1,
      name: '2025년 교육계획서.pdf',
      category: 'document',
      size: '2.5 MB',
      uploadDate: '2025-07-15',
      uploadedBy: '김선생',
      description: '2025년도 교육과정 계획서입니다.',
      downloadCount: 15,
      tags: ['교육', '계획서', '2025년'],
      fileType: 'pdf'
    },
    {
      id: 2,
      name: '학교행사_사진모음.zip',
      category: 'image',
      size: '45.2 MB',
      uploadDate: '2025-07-10',
      uploadedBy: '박선생',
      description: '지난 학교 행사 사진들을 모은 압축파일입니다.',
      downloadCount: 8,
      tags: ['행사', '사진', '추억'],
      fileType: 'zip'
    },
    {
      id: 3,
      name: '수업_동영상_1학기.mp4',
      category: 'video',
      size: '128.7 MB',
      uploadDate: '2025-07-08',
      uploadedBy: '이선생',
      description: '1학기 수업 동영상 자료입니다.',
      downloadCount: 23,
      tags: ['수업', '동영상', '1학기'],
      fileType: 'mp4'
    },
    {
      id: 4,
      name: '학교_소개_음성.mp3',
      category: 'audio',
      size: '8.9 MB',
      uploadDate: '2025-07-05',
      uploadedBy: '최선생',
      description: '학교 소개 음성 파일입니다.',
      downloadCount: 5,
      tags: ['소개', '음성', '학교'],
      fileType: 'mp3'
    },
    {
      id: 5,
      name: '학생명단_2025.xlsx',
      category: 'document',
      size: '1.2 MB',
      uploadDate: '2025-07-01',
      uploadedBy: '정선생',
      description: '2025년도 학생 명단 엑셀 파일입니다.',
      downloadCount: 12,
      tags: ['학생', '명단', '엑셀'],
      fileType: 'xlsx'
    },
    {
      id: 6,
      name: '교무회의_자료.pptx',
      category: 'document',
      size: '5.8 MB',
      uploadDate: '2025-06-28',
      uploadedBy: '김선생',
      description: '교무회의 발표 자료입니다.',
      downloadCount: 18,
      tags: ['회의', '발표', '교무'],
      fileType: 'pptx'
    }
  ];

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      // 실제 API 호출 (현재는 더미 데이터 사용)
      // const response = await api.get('/documents');
      // setDocuments(response.data);
      
      // 더미 데이터 사용
      setTimeout(() => {
        setDocuments(dummyDocuments);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('문서를 불러오는데 실패했습니다.');
      setLoading(false);
      // 에러 시에도 더미 데이터 표시
      setDocuments(dummyDocuments);
    }
  };

  // 파일 아이콘 반환
  const getFileIcon = (fileType, category) => {
    switch (category) {
      case 'document':
        return FileText;
      case 'image':
        return Image;
      case 'video':
        return FileVideo;
      case 'audio':
        return FileAudio;
      default:
        return File;
    }
  };

  // 파일 크기 포맷팅
  const formatFileSize = (size) => {
    return size; // 이미 포맷된 문자열로 가정
  };

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // 문서 필터링 및 정렬
  const filteredAndSortedDocuments = documents
    .filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'size':
          aValue = parseFloat(a.size);
          bValue = parseFloat(b.size);
          break;
        case 'date':
          aValue = new Date(a.uploadDate);
          bValue = new Date(b.uploadDate);
          break;
        case 'downloads':
          aValue = a.downloadCount;
          bValue = b.downloadCount;
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // 파일 업로드 처리
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadFile(file);
    setShowUploadModal(true);
  };

  // 업로드 모달에서 파일 업로드 실행
  const executeUpload = async (uploadData) => {
    try {
      setUploadProgress(0);
      
      // 실제 업로드 시뮬레이션
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      // 실제 API 호출
      // const formData = new FormData();
      // formData.append('file', uploadFile);
      // formData.append('category', uploadData.category);
      // formData.append('description', uploadData.description);
      // formData.append('tags', uploadData.tags.join(','));
      // const response = await api.post('/documents/upload', formData);

      setTimeout(() => {
        // 더미 데이터에 새 문서 추가
        const newDocument = {
          id: documents.length + 1,
          name: uploadFile.name,
          category: uploadData.category,
          size: `${(uploadFile.size / 1024 / 1024).toFixed(1)} MB`,
          uploadDate: new Date().toISOString().split('T')[0],
          uploadedBy: '시스템 관리자',
          description: uploadData.description,
          downloadCount: 0,
          tags: uploadData.tags,
          fileType: uploadFile.name.split('.').pop().toLowerCase()
        };
        
        setDocuments(prev => [newDocument, ...prev]);
        setShowUploadModal(false);
        setUploadFile(null);
        setUploadProgress(0);
      }, 2000);
    } catch (err) {
      setError('파일 업로드에 실패했습니다.');
    }
  };

  // 파일 다운로드
  const handleDownload = async (document) => {
    try {
      // 실제 다운로드 API 호출
      // const response = await api.get(`/documents/${document.id}/download`, {
      //   responseType: 'blob'
      // });
      
      // 더미 다운로드 (실제로는 파일을 다운로드하지 않음)
      alert(`"${document.name}" 파일을 다운로드합니다.`);
      
      // 다운로드 카운트 증가
      setDocuments(prev => 
        prev.map(doc => 
          doc.id === document.id 
            ? { ...doc, downloadCount: doc.downloadCount + 1 }
            : doc
        )
      );
    } catch (err) {
      setError('파일 다운로드에 실패했습니다.');
    }
  };

  // 문서 삭제
  const handleDelete = async (documentId) => {
    if (!window.confirm('정말로 이 문서를 삭제하시겠습니까?')) return;

    try {
      // 실제 API 호출
      // await api.delete(`/documents/${documentId}`);
      
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
    } catch (err) {
      setError('문서 삭제에 실패했습니다.');
    }
  };

  // 문서 상세보기
  const handleViewDetails = (document) => {
    setSelectedDocument(document);
    setShowDetailModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">문서 관리</h1>
        <p className="text-gray-600">학교 문서와 파일을 체계적으로 관리하세요</p>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* 컨트롤 바 */}
      <div className="mb-6 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        {/* 검색 및 필터 */}
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* 검색 */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="문서명, 설명, 태그로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 카테고리 필터 */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          {/* 정렬 */}
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field);
              setSortOrder(order);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="date-desc">최신순</option>
            <option value="date-asc">오래된순</option>
            <option value="name-asc">이름순 (A-Z)</option>
            <option value="name-desc">이름순 (Z-A)</option>
            <option value="size-desc">크기순 (큰 것부터)</option>
            <option value="size-asc">크기순 (작은 것부터)</option>
            <option value="downloads-desc">다운로드순</option>
          </select>
        </div>

        {/* 액션 버튼들 */}
        <div className="flex gap-2">
          {/* 보기 모드 전환 */}
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          {/* 파일 업로드 */}
          <label className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer flex items-center gap-2">
            <Upload className="h-4 w-4" />
            새 문서 업로드
            <input
              type="file"
              onChange={handleFileUpload}
              className="hidden"
              accept="*/*"
            />
          </label>
        </div>
      </div>

      {/* 카테고리 통계 */}
      <div className="mb-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map(category => {
          const count = category.id === 'all' 
            ? documents.length 
            : documents.filter(doc => doc.category === category.id).length;
          const IconComponent = category.icon;
          
          return (
            <div
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedCategory === category.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <IconComponent className={`h-5 w-5 ${category.color}`} />
                <span className="font-medium text-gray-900">{category.name}</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{count}</div>
            </div>
          );
        })}
      </div>

      {/* 문서 목록 */}
      {filteredAndSortedDocuments.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">문서가 없습니다</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || selectedCategory !== 'all' 
              ? '검색 조건에 맞는 문서가 없습니다.' 
              : '첫 번째 문서를 업로드해보세요.'}
          </p>
          <label className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer inline-flex items-center gap-2">
            <Upload className="h-4 w-4" />
            문서 업로드
            <input
              type="file"
              onChange={handleFileUpload}
              className="hidden"
              accept="*/*"
            />
          </label>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
          {filteredAndSortedDocuments.map(document => {
            const IconComponent = getFileIcon(document.fileType, document.category);
            const categoryInfo = categories.find(cat => cat.id === document.category);
            
            if (viewMode === 'grid') {
              return (
                <div key={document.id} className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                  {/* 파일 아이콘 */}
                  <div className="p-6 text-center">
                    <IconComponent className={`h-12 w-12 mx-auto mb-3 ${categoryInfo?.color || 'text-gray-600'}`} />
                    <h3 className="font-medium text-gray-900 mb-1 truncate" title={document.name}>
                      {document.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{formatFileSize(document.size)}</p>
                    <p className="text-xs text-gray-500 line-clamp-2">{document.description}</p>
                  </div>

                  {/* 메타 정보 */}
                  <div className="px-6 py-3 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {document.uploadedBy}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(document.uploadDate)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        {document.downloadCount}회
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${categoryInfo?.color || 'text-gray-600'} bg-gray-100`}>
                        {categoryInfo?.name || '기타'}
                      </span>
                    </div>
                  </div>

                  {/* 액션 버튼 */}
                  <div className="px-6 py-3 border-t border-gray-100 flex gap-2">
                    <button
                      onClick={() => handleViewDetails(document)}
                      className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
                    >
                      <Eye className="h-3 w-3" />
                      보기
                    </button>
                    <button
                      onClick={() => handleDownload(document)}
                      className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                    >
                      <Download className="h-3 w-3" />
                      다운로드
                    </button>
                    <button
                      onClick={() => handleDelete(document.id)}
                      className="bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 transition-colors flex items-center justify-center"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              );
            } else {
              // 리스트 뷰
              return (
                <div key={document.id} className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="p-4 flex items-center gap-4">
                    <IconComponent className={`h-8 w-8 ${categoryInfo?.color || 'text-gray-600'}`} />
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{document.name}</h3>
                      <p className="text-sm text-gray-600 truncate">{document.description}</p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {document.uploadedBy}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(document.uploadDate)}
                        </span>
                        <span>{formatFileSize(document.size)}</span>
                        <span className="flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          {document.downloadCount}회
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${categoryInfo?.color || 'text-gray-600'} bg-gray-100`}>
                        {categoryInfo?.name || '기타'}
                      </span>
                      <button
                        onClick={() => handleViewDetails(document)}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDownload(document)}
                        className="p-2 text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(document.id)}
                        className="p-2 text-red-600 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            }
          })}
        </div>
      )}

      {/* 업로드 모달 */}
      {showUploadModal && (
        <UploadModal
          file={uploadFile}
          onClose={() => {
            setShowUploadModal(false);
            setUploadFile(null);
            setUploadProgress(0);
          }}
          onUpload={executeUpload}
          progress={uploadProgress}
          categories={categories.filter(cat => cat.id !== 'all')}
        />
      )}

      {/* 상세보기 모달 */}
      {showDetailModal && selectedDocument && (
        <DetailModal
          document={selectedDocument}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedDocument(null);
          }}
          onDownload={handleDownload}
          onDelete={handleDelete}
          categories={categories}
        />
      )}
    </div>
  );
};

// 업로드 모달 컴포넌트
const UploadModal = ({ file, onClose, onUpload, progress, categories }) => {
  const [category, setCategory] = useState('document');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpload({
      category,
      description,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">문서 업로드</h2>
          
          {progress > 0 ? (
            <div className="space-y-4">
              <div className="text-center">
                <FileText className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-gray-600">업로드 중...</p>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              
              <p className="text-center text-sm text-gray-600">{progress}% 완료</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  파일명
                </label>
                <input
                  type="text"
                  value={file.name}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  카테고리 *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  설명
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="문서에 대한 설명을 입력하세요"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  태그
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="태그를 쉼표로 구분하여 입력하세요"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">예: 교육, 계획서, 2025년</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  업로드
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

// 상세보기 모달 컴포넌트
const DetailModal = ({ document, onClose, onDownload, onDelete, categories }) => {
  const IconComponent = document.category === 'document' ? FileText :
                       document.category === 'image' ? Image :
                       document.category === 'video' ? FileVideo :
                       document.category === 'audio' ? FileAudio : File;
  
  const categoryInfo = categories.find(cat => cat.id === document.category);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <IconComponent className={`h-8 w-8 ${categoryInfo?.color || 'text-gray-600'}`} />
              <div>
                <h2 className="text-xl font-bold text-gray-900">{document.name}</h2>
                <span className={`inline-block px-2 py-1 rounded-full text-xs ${categoryInfo?.color || 'text-gray-600'} bg-gray-100 mt-1`}>
                  {categoryInfo?.name || '기타'}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">파일 크기</label>
                <p className="text-gray-900">{document.size}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">다운로드 횟수</label>
                <p className="text-gray-900">{document.downloadCount}회</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">업로드한 사람</label>
                <p className="text-gray-900">{document.uploadedBy}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">업로드 날짜</label>
                <p className="text-gray-900">{new Date(document.uploadDate).toLocaleDateString('ko-KR')}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
              <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{document.description}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">태그</label>
              <div className="flex flex-wrap gap-2">
                {document.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-6 border-t border-gray-200 mt-6">
            <button
              onClick={() => onDownload(document)}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Download className="h-4 w-4" />
              다운로드
            </button>
            <button
              onClick={() => {
                onDelete(document.id);
                onClose();
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              삭제
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentsPage;

