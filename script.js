// Default Initial Data
let profileData = {
  name: "Manjusha",
  title: "Psychologist & Technical Defence Specialist",
  photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
};

let posts = [
  {
    id: 1,
    type: "image",
    category: "spiritual",
    src: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600",
    caption: "Finding inner stillness amid outer chaos. Higher states of mind lead to ultimate freedom.",
    likes: 42,
    isLiked: false,
    comments: ["So peaceful!", "Truly inspiring visualization."]
  },
  {
    id: 2,
    type: "image",
    category: "technical",
    src: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600",
    caption: "Cybersecurity and defense architecture simulation models. Encrypted logic in action.",
    likes: 89,
    isLiked: false,
    comments: ["Incredible tech setup!", "Which framework is this?"]
  },
  {
    id: 3,
    type: "image",
    category: "psychology",
    src: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600",
    caption: "Behavioral analysis and neuro-linguistic pathways. Mind mapping masterclass.",
    likes: 64,
    isLiked: false,
    comments: ["Mind-blowing breakdown."]
  }
];

let activeCategory = 'all';
let activeType = 'all';
let activePostId = null;

// Initialize App
document.addEventListener("DOMContentLoaded", () => {
  renderProfile();
  renderFeed();
  setupSecurityListeners();
});

// Render Profile
function renderProfile() {
  document.getElementById("header-name").childNodes[0].nodeValue = profileData.name + " ";
  document.getElementById("header-title").textContent = profileData.title;
  document.getElementById("header-avatar").src = profileData.photo;
  document.getElementById("profile-preview-img").src = profileData.photo;
  document.getElementById("edit-name").value = profileData.name;
  document.getElementById("edit-title").value = profileData.title;
}

// Render Feed Cards
function renderFeed() {
  const grid = document.getElementById("feed-grid");
  grid.innerHTML = "";

  const filteredPosts = posts.filter(post => {
    const matchesCategory = (activeCategory === 'all' || post.category === activeCategory);
    const matchesType = (activeType === 'all' || post.type === activeType);
    return matchesCategory && matchesType;
  });

  if (filteredPosts.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 3rem;">No posts found in this category.</div>`;
    return;
  }

  filteredPosts.forEach(post => {
    const card = document.createElement("div");
    card.className = "post-card";

    let mediaHTML = post.type === 'image' 
      ? `<img src="${post.src}" alt="Post media">`
      : `<video src="${post.src}" controls preload="metadata"></video>`;

    card.innerHTML = `
      <div class="post-media-box" onclick="openDetailModal(${post.id})">
        ${mediaHTML}
        <span class="category-tag">${post.category}</span>
      </div>
      <div class="post-content">
        <div class="post-actions">
          <i class="${post.isLiked ? 'fas' : 'far'} fa-heart action-icon ${post.isLiked ? 'liked' : ''}" onclick="toggleLike(${post.id})"></i>
          <i class="far fa-comment action-icon" onclick="openDetailModal(${post.id})"></i>
        </div>
        <div class="post-caption">${post.caption}</div>
        <div class="post-stats">${post.likes} likes • ${post.comments.length} comments</div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Like Mechanism
function toggleLike(id) {
  const post = posts.find(p => p.id === id);
  if (post) {
    post.isLiked = !post.isLiked;
    post.likes += post.isLiked ? 1 : -1;
    renderFeed();
    if(activePostId === id) openDetailModal(id);
  }
}

// Filtering
function filterCategory(cat) {
  activeCategory = cat;
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  event.currentTarget.classList.add('active');
  renderFeed();
}

function filterType(type) {
  activeType = type;
  document.querySelectorAll('.type-btn').forEach(btn => btn.classList.remove('active'));
  event.currentTarget.classList.add('active');
  renderFeed();
}

// Modals
function openUploadModal() {
  document.getElementById('upload-modal').classList.add('active');
}

function openProfileModal() {
  document.getElementById('profile-modal').classList.add('active');
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('active');
}

// Preview Selected Upload
function previewFile(e) {
  const file = e.target.files[0];
  const container = document.getElementById('file-preview-container');
  container.innerHTML = '';
  if (!file) return;

  const url = URL.createObjectURL(file);
  if (file.type.startsWith('image/')) {
    container.innerHTML = `<img src="${url}" style="width:100%; border-radius:10px; margin-top:10px;">`;
  } else if (file.type.startsWith('video/')) {
    container.innerHTML = `<video src="${url}" controls style="width:100%; border-radius:10px; margin-top:10px;"></video>`;
  }
  container.classList.remove('hidden');
}

// Handle Upload Submission
function handleUpload(e) {
  e.preventDefault();
  const category = document.getElementById('upload-category').value;
  const caption = document.getElementById('upload-caption').value;
  const fileInput = document.getElementById('upload-file');
  const file = fileInput.files[0];

  if (!file) return;

  const isVideo = file.type.startsWith('video/');
  const newPost = {
    id: Date.now(),
    type: isVideo ? 'video' : 'image',
    category: category,
    src: URL.createObjectURL(file),
    caption: caption,
    likes: 0,
    isLiked: false,
    comments: []
  };

  posts.unshift(newPost);
  renderFeed();
  closeModal('upload-modal');
  showToast("Content published successfully!");
  document.getElementById('upload-form').reset();
  document.getElementById('file-preview-container').classList.add('hidden');
}

// Profile Edit & Preview
function previewProfilePhoto(e) {
  const file = e.target.files[0];
  if (file) {
    const url = URL.createObjectURL(file);
    document.getElementById('profile-preview-img').src = url;
  }
}

function handleProfileUpdate(e) {
  e.preventDefault();
  profileData.name = document.getElementById('edit-name').value;
  profileData.title = document.getElementById('edit-title').value;
  profileData.photo = document.getElementById('profile-preview-img').src;

  renderProfile();
  closeModal('profile-modal');
  showToast("Profile updated successfully!");
}

// Detailed Post View & Comments
function openDetailModal(id) {
  activePostId = id;
  const post = posts.find(p => p.id === id);
  if (!post) return;

  const detailBody = document.getElementById('post-detail-body');
  let mediaHTML = post.type === 'image' 
    ? `<img src="${post.src}">`
    : `<video src="${post.src}" controls autoplay></video>`;

  const commentsListHTML = post.comments.map(c => `<div class="comment-item"><strong>Guest:</strong> ${c}</div>`).join('');

  detailBody.innerHTML = `
    <div class="detail-media">${mediaHTML}</div>
    <div class="detail-sidebar">
      <div style="border-bottom: 1px solid var(--border-glass); padding-bottom:0.8rem; margin-bottom:0.8rem;">
        <h4>${profileData.name}</h4>
        <p style="font-size:0.8rem; color:var(--text-muted);">${post.category.toUpperCase()}</p>
      </div>
      <p style="font-size:0.9rem;">${post.caption}</p>
      <div class="comments-section" id="comments-list">${commentsListHTML}</div>
      <div class="comment-input-box">
        <input type="text" id="new-comment" placeholder="Add a comment..." style="flex:1;">
        <button class="btn btn-primary" onclick="addComment(${post.id})">Post</button>
      </div>
    </div>
  `;

  document.getElementById('post-detail-modal').classList.add('active');
}

function addComment(id) {
  const input = document.getElementById('new-comment');
  const commentText = input.value.trim();
  if (!commentText) return;

  const post = posts.find(p => p.id === id);
  post.comments.push(commentText);
  input.value = '';
  openDetailModal(id); // Refresh modal content
  renderFeed(); // Refresh main feed count
}

// Toast Notification
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 3000);
}

// Security Enforcement (Anti-Screenshot / Anti-Copying)
function setupSecurityListeners() {
  // Disable PrintScreen / Screenshot shortcuts
  window.addEventListener('keyup', (e) => {
    if (e.key === 'PrintScreen') {
      navigator.clipboard.writeText('');
      showToast("Screenshots are restricted on this portfolio!");
    }
  });

  // Block Developer Tools / Inspect Element shortcuts
  window.addEventListener('keydown', (e) => {
    if (
      e.key === 'F12' || 
      (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) || 
      (e.ctrlKey && e.key === 'U')
    ) {
      e.preventDefault();
      showToast("Source inspection disabled.");
    }
  });
}