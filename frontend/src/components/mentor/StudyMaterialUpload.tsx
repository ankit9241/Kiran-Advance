'use client';

import { useState } from 'react';

interface StudyMaterialUploadProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: 'student' | 'mentor' | 'admin';
    avatar?: string;
    class?: string;
    year?: string;
  };
}

export default function StudyMaterialUpload({ user }: StudyMaterialUploadProps) {
  // Mock students/classes for selection
  const allStudents = [
    { id: '1', name: 'Alice Johnson', class: '10' },
    { id: '2', name: 'Bob Smith', class: '11' },
    { id: '3', name: 'Carol Davis', class: '12' }
  ];
  const allClasses = ['10', '11', '12'];

  // Folder/Subject/Resource Hierarchy
  const [folders, setFolders] = useState([
    {
      id: 'f1',
      name: 'Scratch Series',
      access: ['10'],
      subjects: [
        {
          id: 's1',
          name: 'Math',
          resources: [
            { id: 'r1', title: 'Scratch Basics', type: 'PDF', size: '1.2 MB', uploadDate: '2024-01-10' }
          ]
        },
        {
          id: 's2',
          name: 'Physics',
          resources: []
        }
      ]
    },
    {
      id: 'f2',
      name: 'Physics Mastery',
      access: ['11', '12'],
      subjects: [
        { id: 's3', name: 'Mechanics', resources: [] },
        { id: 's4', name: 'Optics', resources: [] }
      ]
    }
  ]);
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<{ folderId: string; subjectId: string } | null>(null);

  // Folder creation
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [folderAccess, setFolderAccess] = useState<string[]>([]);

  // Subject creation
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [subjectName, setSubjectName] = useState('');
  const [subjectFolderId, setSubjectFolderId] = useState<string>('');

  // Resource upload
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceType, setResourceType] = useState('PDF');
  const [resourceFile, setResourceFile] = useState<File | null>(null);

  // Edit Access
  const [showEditAccessModal, setShowEditAccessModal] = useState(false);
  const [editingFolder, setEditingFolder] = useState<any>(null);
  const [editAccess, setEditAccess] = useState<string[]>([]);
  const [showFolderDropdown, setShowFolderDropdown] = useState<string | null>(null);
  const [showDeleteFolderConfirm, setShowDeleteFolderConfirm] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<string | null>(null);
  const [resourceToDelete, setResourceToDelete] = useState<{folderId: string, subjectId: string, resourceId: string} | null>(null);
  const [editingFolderName, setEditingFolderName] = useState('');

  // Delete folder function
  const handleDeleteFolder = (folderId: string) => {
    setFolders(folders.filter(folder => folder.id !== folderId));
    setShowDeleteFolderConfirm(false);
    setFolderToDelete(null);
  };

  // Delete resource function
  const handleDeleteResource = (folderId: string, subjectId: string, resourceId: string) => {
    setFolders(folders.map(folder => {
      if (folder.id === folderId) {
        return {
          ...folder,
          subjects: folder.subjects.map(subject => {
            if (subject.id === subjectId) {
              return {
                ...subject,
                resources: subject.resources.filter(resource => resource.id !== resourceId)
              };
            }
            return subject;
          })
        };
      }
      return folder;
    }));
    setResourceToDelete(null);
  };

  // Update folder name and access
  const handleUpdateFolder = () => {
    if (!editingFolder || !editingFolderName.trim()) return;
    
    setFolders(folders.map(folder => 
      folder.id === editingFolder.id 
        ? { ...folder, name: editingFolderName, access: editAccess }
        : folder
    ));
    setShowEditAccessModal(false);
    setEditingFolder(null);
    setEditingFolderName('');
    setEditAccess([]);
  };

  // --- Send Resource to Student Section ---
  const [sendStudentId, setSendStudentId] = useState('');
  const [sendResourceTitle, setSendResourceTitle] = useState('');
  const [sendResourceFile, setSendResourceFile] = useState<File | null>(null);
  // Mock sent history (in real app, fetch from backend)
  const [sentHistory, setSentHistory] = useState([
    { id: 'h1', studentId: '1', title: 'Algebra Notes', type: 'PDF', size: '1.1 MB', uploadDate: '2024-04-01' },
    { id: 'h2', studentId: '2', title: 'Physics Video', type: 'Video', size: '120 MB', uploadDate: '2024-04-02' },
    { id: 'h3', studentId: '1', title: 'English Essay', type: 'DOC', size: '0.5 MB', uploadDate: '2024-04-03' }
  ]);
  const handleSendResource = () => {
    if (!sendStudentId || !sendResourceTitle || !sendResourceFile) return;
    setSentHistory(prev => [
      ...prev,
      {
        id: 'h' + (prev.length + 1),
        studentId: sendStudentId,
        title: sendResourceTitle,
        type: sendResourceFile.type.includes('video') ? 'Video' : sendResourceFile.type.includes('pdf') ? 'PDF' : 'DOC',
        size: (sendResourceFile.size / 1024 / 1024).toFixed(1) + ' MB',
        uploadDate: new Date().toISOString().slice(0, 10)
      }
    ]);
    setSendStudentId('');
    setSendResourceTitle('');
    setSendResourceFile(null);
  };

  // Only show folders/materials to students with access
  const canAccessFolder = (folder: any) => {
    if (user.role === 'mentor' || user.role === 'admin') return true;
    const userClass = (user as any).class || (user as any).year || '';
    return folder.access.includes(user.id) || (userClass && folder.access.includes(userClass));
  };

  // Sidebar expand/collapse
  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev =>
      prev.includes(folderId) ? prev.filter(id => id !== folderId) : [...prev, folderId]
    );
  };

  // --- Enhanced UI ---
  return (
    <div className="flex flex-col md:flex-row h-[90vh] md:h-[80vh] bg-gradient-to-br from-blue-50 via-white to-purple-100 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-md border border-blue-100 w-full max-w-full mx-2 md:mx-4 my-2 md:my-4">
      {/* Mobile header for sidebar toggle */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white/80 border-b border-blue-100">
        <h2 className="text-xl font-bold text-blue-900">Study Materials</h2>
        <button 
          onClick={() => setExpandedFolders(expandedFolders.length ? [] : folders.map(f => f.id))}
          className="text-blue-600"
        >
          {expandedFolders.length ? 'Collapse All' : 'Expand All'}
        </button>
      </div>
      
      {/* Sidebar: Folders & Subjects */}
      <div className="w-full md:w-80 bg-white/80 border-b md:border-r border-blue-100 p-4 md:p-6 flex flex-col backdrop-blur-xl flex-shrink-0">
        <button
          onClick={() => setShowFolderModal(true)}
          className="mb-4 md:mb-6 bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 md:px-5 md:py-2.5 rounded-xl shadow transition-all font-bold text-base md:text-lg flex items-center justify-center gap-2 w-full md:w-auto"
        >
          <i className="ri-folder-add-line text-lg md:text-xl"></i>
          <span>Create Folder</span>
        </button>
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
          {folders.filter(canAccessFolder).map(folder => (
            <div key={folder.id} className="mb-4">
              <div className="flex items-center justify-between cursor-pointer group">
                <div
                  className="flex items-center space-x-3 flex-1"
                  onClick={() => toggleFolder(folder.id)}
                >
                  <i className={`ri-arrow-${expandedFolders.includes(folder.id) ? 'down' : 'right'}-s-line text-blue-400 text-lg`}></i>
                  <span className="font-semibold text-blue-800 group-hover:underline text-lg">{folder.name}</span>
                </div>
                <div className="relative">
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowFolderDropdown(showFolderDropdown === folder.id ? null : folder.id); }}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <i className="ri-more-2-fill text-gray-500"></i>
                  </button>
                  {showFolderDropdown === folder.id && (
                    <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                      <button
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          setEditingFolder(folder);
                          setEditingFolderName(folder.name);
                          setEditAccess(folder.access); 
                          setShowEditAccessModal(true);
                          setShowFolderDropdown(null);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center"
                      >
                        <i className="ri-edit-line mr-2"></i> Edit Folder
                      </button>
                      <button
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          setSubjectFolderId(folder.id); 
                          setShowSubjectModal(true);
                          setShowFolderDropdown(null);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center"
                      >
                        <i className="ri-add-circle-line text-green-500 mr-2"></i> Add Subject
                      </button>
                      <button
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          setFolderToDelete(folder.id);
                          setShowDeleteFolderConfirm(true);
                          setShowFolderDropdown(null);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                      >
                        <i className="ri-delete-bin-line mr-2"></i> Delete Folder
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {expandedFolders.includes(folder.id) && (
                <ul className="ml-7 mt-2 space-y-2">
                  {folder.subjects.map(subject => (
                    <li key={subject.id}>
                      <button
                        className={`text-left w-full px-3 py-1.5 rounded-lg transition-all text-base ${
                          selectedSubject?.subjectId === subject.id 
                            ? 'bg-blue-100 text-blue-900 font-bold shadow' 
                            : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                        }`}
                        onClick={() => setSelectedSubject({ folderId: folder.id, subjectId: subject.id })}
                      >
                        <i className="ri-book-line mr-2 text-blue-400"></i>
                        {subject.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Main Panel: Resources & Send Resource Section */}
      <div className="flex-1 p-4 md:p-6 overflow-auto bg-white/70 backdrop-blur-xl relative">
        {/* Main Resource Panel (Primary) */}
        {selectedSubject ? (() => {
          const folder = folders.find(f => f.id === selectedSubject.folderId);
          const subject = folder?.subjects.find(s => s.id === selectedSubject.subjectId);
          if (!folder || !subject) return null;
          return (
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100 mb-12">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                <h2 className="text-2xl font-extrabold text-blue-800 tracking-tight flex items-center gap-2">
                  <i className="ri-book-2-line text-blue-400"></i>
                  {subject.name} Resources
                </h2>
                <button
                  onClick={() => setShowResourceModal(true)}
                  className="bg-blue-100 text-blue-800 px-5 py-2 rounded-xl shadow hover:bg-blue-200 transition-all font-bold text-base"
                >
                  <i className="ri-upload-line mr-2"></i>
                  Upload Resource
                </button>
              </div>
              <ul className="space-y-4">
                {subject.resources.length === 0 && (
                  <li className="text-gray-400 italic">No resources uploaded yet.</li>
                )}
                {subject.resources.map(res => (
                  <li key={res.id} className="group bg-blue-50 rounded-xl shadow p-5 flex items-center space-x-4 hover:bg-blue-100 transition-all">
                    <i className="ri-file-line text-2xl text-blue-400"></i>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-blue-900 text-lg truncate">{res.title}</p>
                      <p className="text-xs text-gray-500">{res.type} • {res.size} • Uploaded: {res.uploadDate}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setResourceToDelete({
                          folderId: folder.id,
                          subjectId: subject.id,
                          resourceId: res.id
                        });
                      }}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors"
                      title="Delete resource"
                    >
                      <i className="ri-delete-bin-line"></i>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })() : (
          <div className="flex justify-center mb-8">
            <div className="max-w-md w-full bg-white rounded-xl shadow p-6 border border-blue-100 text-center">
              <i className="ri-folder-open-line text-3xl text-blue-400 mb-2"></i>
              <div className="text-blue-800 font-semibold text-base">Open any subject from a folder/series to view resources.</div>
            </div>
          </div>
        )}
        {/* Divider */}
        {(user.role === 'mentor' || user.role === 'admin') && (
          <div className="w-full flex items-center my-8">
            <div className="flex-1 h-px bg-blue-100 opacity-60" />
            <span className="mx-4 text-gray-400 text-sm font-medium">or send personally</span>
            <div className="flex-1 h-px bg-blue-100 opacity-60" />
          </div>
        )}
        {/* Send Resource to Student Section (Secondary) */}
        {(user.role === 'mentor' || user.role === 'admin') && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-sm border border-blue-50 w-full">
            <h3 className="text-lg font-semibold text-blue-700 mb-3 flex items-center gap-2">
              <i className="ri-send-plane-2-line text-xl text-blue-400"></i>
              Send Resource to Student
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-4">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-blue-700 mb-1">Select Student</label>
                <select
                  value={sendStudentId}
                  onChange={e => setSendStudentId(e.target.value)}
                  className="w-full px-3 py-2 border border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-transparent bg-white"
                >
                  <option value="">Choose student...</option>
                  {allStudents.map(s => (
                    <option key={s.id} value={s.id}>{s.name} (Class {s.class})</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-xs font-semibold text-blue-700 mb-1">Resource Title</label>
                <input
                  type="text"
                  value={sendResourceTitle}
                  onChange={e => setSendResourceTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-transparent bg-white"
                  placeholder="Enter resource title"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-semibold text-blue-700 mb-1">Upload File</label>
                <input
                  type="file"
                  onChange={e => setSendResourceFile(e.target.files?.[0] || null)}
                  className="w-full"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.mp4,.avi,.mov"
                />
                {sendResourceFile && (
                  <div className="mt-1 text-xs text-blue-700">Selected: {sendResourceFile.name} ({(sendResourceFile.size / 1024 / 1024).toFixed(2)} MB)</div>
                )}
              </div>
              <button
                onClick={handleSendResource}
                className="bg-blue-100 text-blue-800 px-6 py-2 rounded-lg shadow hover:bg-blue-200 transition-all font-bold text-base ml-0 md:ml-4 mt-4 md:mt-0"
                disabled={!sendStudentId || !sendResourceTitle || !sendResourceFile}
              >
                <i className="ri-send-plane-2-fill mr-2"></i>Send
              </button>
            </div>
            {/* Sent History */}
            <div className="mt-6">
              <h4 className="text-base font-semibold text-blue-600 mb-2 flex items-center gap-2"><i className="ri-history-line"></i>Sent History</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm md:text-base">
                  <thead>
                    <tr className="text-blue-700">
                      <th className="py-2 px-4 text-left">Student</th>
                      <th className="py-2 px-4 text-left">Title</th>
                      <th className="py-2 px-4 text-left">Type</th>
                      <th className="py-2 px-4 text-left">Size</th>
                      <th className="py-2 px-4 text-left">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sentHistory.length === 0 && (
                      <tr><td colSpan={5} className="text-center text-gray-400 py-4">No resources sent yet.</td></tr>
                    )}
                    {sentHistory.map(h => (
                      <tr key={h.id} className="hover:bg-blue-100 transition-all">
                        <td className="py-2 px-4 font-medium text-blue-900">{allStudents.find(s => s.id === h.studentId)?.name || 'Unknown'}</td>
                        <td className="py-2 px-4">{h.title}</td>
                        <td className="py-2 px-4">{h.type}</td>
                        <td className="py-2 px-4">{h.size}</td>
                        <td className="py-2 px-4">{h.uploadDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
                </div>

      {/* Folder Modal */}
      {showFolderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white/90 rounded-2xl shadow-2xl max-w-md w-full mx-4 p-10 border border-blue-100">
            <h2 className="text-2xl font-bold mb-6 text-blue-800">Create New Folder</h2>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-blue-700 mb-2">Folder Name</label>
              <input
                type="text"
                value={folderName}
                onChange={e => setFolderName(e.target.value)}
                className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white"
                placeholder="Enter folder name"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-blue-700 mb-2">Who can access?</label>
              <div className="flex flex-wrap gap-3">
                {allClasses.map(cls => (
                  <label key={cls} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={folderAccess.includes(cls)}
                      onChange={e => setFolderAccess(prev => e.target.checked ? [...prev, cls] : prev.filter(c => c !== cls))}
                    />
                    <span className="text-sm">Class {cls}</span>
                  </label>
                ))}
                {allStudents.map(s => (
                  <label key={s.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={folderAccess.includes(s.id)}
                      onChange={e => setFolderAccess(prev => e.target.checked ? [...prev, s.id] : prev.filter(c => c !== s.id))}
                    />
                    <span className="text-sm">{s.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <button
              onClick={() => {
                if (!folderName || folderAccess.length === 0) return;
                setFolders(prev => [
                  ...prev,
                  {
                    id: 'f' + (prev.length + 1),
                    name: folderName,
                    access: folderAccess,
                    subjects: []
                  }
                ]);
                setShowFolderModal(false);
                setFolderName(''); setFolderAccess([]);
              }}
              className="w-full bg-blue-100 text-blue-800 py-2.5 rounded-xl font-bold hover:bg-blue-200 transition-all mt-2"
              disabled={!folderName || folderAccess.length === 0}
            >
              Create Folder
            </button>
            <button onClick={() => setShowFolderModal(false)} className="mt-4 w-full bg-gray-100 text-gray-700 py-2 rounded-lg font-semibold">Cancel</button>
          </div>
        </div>
      )}

      {/* Subject Modal */}
      {showSubjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white/90 rounded-2xl shadow-2xl max-w-md w-full mx-4 p-10 border border-blue-100">
            <h2 className="text-2xl font-bold mb-6 text-blue-800">Add Subject</h2>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-blue-700 mb-2">Subject Name</label>
              <input
                type="text"
                value={subjectName}
                onChange={e => setSubjectName(e.target.value)}
                className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white"
                placeholder="Enter subject name"
              />
            </div>
            <button
              onClick={() => {
                if (!subjectName || !subjectFolderId) return;
                setFolders(prev => prev.map(f =>
                  f.id === subjectFolderId
                    ? { ...f, subjects: [...f.subjects, { id: 's' + (f.subjects.length + 1), name: subjectName, resources: [] }] }
                    : f
                ));
                setShowSubjectModal(false);
                setSubjectName(''); setSubjectFolderId('');
              }}
              className="w-full bg-green-100 text-green-700 py-2.5 rounded-xl font-bold hover:bg-green-200 transition-all mt-2"
              disabled={!subjectName}
            >
              Add Subject
            </button>
            <button onClick={() => setShowSubjectModal(false)} className="mt-4 w-full bg-gray-100 text-gray-700 py-2 rounded-lg font-semibold">Cancel</button>
          </div>
        </div>
      )}

      {/* Resource Modal */}
      {showResourceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white/90 rounded-2xl shadow-2xl max-w-md w-full mx-4 p-10 border border-blue-100">
            <h2 className="text-2xl font-bold mb-6 text-blue-800">Upload Resource</h2>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-blue-700 mb-2">Resource Title</label>
              <input
                type="text"
                value={resourceTitle}
                onChange={e => setResourceTitle(e.target.value)}
                className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white"
                placeholder="Enter resource title"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-blue-700 mb-2">Resource Type</label>
                  <select
                value={resourceType}
                onChange={e => setResourceType(e.target.value)}
                className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white"
                  >
                    <option value="PDF">PDF Document</option>
                    <option value="Video">Video</option>
                    <option value="ZIP">ZIP Archive</option>
                    <option value="DOC">Word Document</option>
                    <option value="PPT">PowerPoint</option>
                  </select>
                </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-blue-700 mb-2">Upload File</label>
                  <input
                    type="file"
                onChange={e => setResourceFile(e.target.files?.[0] || null)}
                className="w-full"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.mp4,.avi,.mov"
                  />
              {resourceFile && (
                <div className="mt-2 text-xs text-blue-700">Selected: {resourceFile.name} ({(resourceFile.size / 1024 / 1024).toFixed(2)} MB)</div>
              )}
            </div>
            <button
              onClick={() => {
                if (!resourceTitle || !resourceFile || !selectedSubject) return;
                setFolders(prev => prev.map(f =>
                  f.id === selectedSubject.folderId
                    ? {
                        ...f,
                        subjects: f.subjects.map(s =>
                          s.id === selectedSubject.subjectId
                            ? {
                                ...s,
                                resources: [
                                  ...s.resources,
                                  {
                                    id: 'r' + (s.resources.length + 1),
                                    title: resourceTitle,
                                    type: resourceType,
                                    size: (resourceFile.size / 1024 / 1024).toFixed(1) + ' MB',
                                    uploadDate: new Date().toISOString().slice(0, 10)
                                  }
                                ]
                              }
                            : s
                        )
                      }
                    : f
                ));
                setShowResourceModal(false);
                setResourceTitle(''); setResourceType('PDF'); setResourceFile(null);
              }}
              className="w-full bg-blue-100 text-blue-800 py-2.5 rounded-xl font-bold hover:bg-blue-200 transition-all mt-2"
              disabled={!resourceTitle || !resourceFile}
            >
              Upload
            </button>
            <button onClick={() => setShowResourceModal(false)} className="mt-4 w-full bg-gray-100 text-gray-700 py-2 rounded-lg font-semibold">Cancel</button>
          </div>
                    </div>
      )}

      {/* Delete Folder Confirmation Modal */}
      {showDeleteFolderConfirm && folderToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Folder</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this folder? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteFolderConfirm(false);
                  setFolderToDelete(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteFolder(folderToDelete)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Resource Confirmation Modal */}
      {resourceToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Resource</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this resource? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setResourceToDelete(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (resourceToDelete) {
                    handleDeleteResource(
                      resourceToDelete.folderId,
                      resourceToDelete.subjectId,
                      resourceToDelete.resourceId
                    );
                  }
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Access Modal */}
      {showEditAccessModal && editingFolder && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white/90 rounded-2xl shadow-2xl max-w-md w-full mx-4 p-10 border border-blue-100">
            <h2 className="text-2xl font-bold mb-6 text-blue-800">Edit Folder</h2>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Folder Name</label>
              <input
                type="text"
                value={editingFolderName}
                onChange={e => setEditingFolderName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-transparent"
                placeholder="Enter folder name"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Access Control</label>
              <div className="flex flex-wrap gap-3">
                {allClasses.map(cls => (
                  <label key={cls} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editAccess.includes(cls) || (editingFolder.access && editingFolder.access.includes(cls))}
                      onChange={e => setEditAccess(prev => e.target.checked ? [...prev, cls] : prev.filter(c => c !== cls))}
                    />
                    <span className="text-sm">Class {cls}</span>
                  </label>
                ))}
                {allStudents.map(s => (
                  <label key={s.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editAccess.includes(s.id) || (editingFolder.access && editingFolder.access.includes(s.id))}
                      onChange={e => setEditAccess(prev => e.target.checked ? [...prev, s.id] : prev.filter(c => c !== s.id))}
                    />
                    <span className="text-sm">{s.name}</span>
                  </label>
                ))}
              </div>
            </div>
              <button
              onClick={() => {
                if (!editingFolder) return;
                setFolders(prev => prev.map(f => f.id === editingFolder.id ? { ...f, access: editAccess } : f));
                setShowEditAccessModal(false);
                setEditingFolder(null); setEditAccess([]);
              }}
              className="w-full bg-blue-100 text-blue-800 py-2.5 rounded-xl font-bold hover:bg-blue-200 transition-all mt-2"
            >
              Save Access
              </button>
            <button onClick={() => setShowEditAccessModal(false)} className="mt-4 w-full bg-gray-100 text-gray-700 py-2 rounded-lg font-semibold">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}