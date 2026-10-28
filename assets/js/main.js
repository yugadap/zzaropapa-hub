/**
 * 짜로파파의 AI 연구소 - 메인 스크립트
 * content/posts.json 동적 렌더링 및 인터랙션 제어
 */

document.addEventListener('DOMContentLoaded', () => {
  loadRecentPosts();
});

async function loadRecentPosts() {
  const container = document.getElementById('posts-container');
  if (!container) return;

  try {
    const response = await fetch('./content/posts.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const posts = await response.json();

    if (!Array.isArray(posts) || posts.length === 0) {
      container.innerHTML = '<p class="empty-state">아직 등록된 글이 없습니다.</p>';
      return;
    }

    const channelConfig = {
      naver: { label: '네이버 블로그', tagClass: 'tag-naver', icon: '📗' },
      tistory: { label: '티스토리', tagClass: 'tag-tistory', icon: '📙' },
      instagram: { label: '인스타그램', tagClass: 'tag-instagram', icon: '📸' },
      threads: { label: '스레드', tagClass: 'tag-threads', icon: '🧵' }
    };

    container.innerHTML = posts.map(post => {
      const cfg = channelConfig[post.channelKey] || { label: post.channel, tagClass: 'tag-default', icon: '📝' };
      const badge = post.badge ? `<span class="post-badge">${post.badge}</span>` : '';
      
      return `
        <article class="post-card">
          <a href="${post.url}" target="_blank" rel="noopener noreferrer" class="post-card-inner">
            <div class="post-thumb-wrap">
              <img src="${post.thumbnail}" alt="${escapeHtml(post.title)}" class="post-thumb" loading="lazy" />
              <div class="post-channel-chip ${cfg.tagClass}">
                <span class="chip-icon">${cfg.icon}</span>
                <span>${cfg.label}</span>
              </div>
            </div>
            <div class="post-content">
              <div class="post-meta">
                <span class="post-date">${post.date}</span>
                ${badge}
              </div>
              <h3 class="post-title">${escapeHtml(post.title)}</h3>
              <p class="post-summary">${escapeHtml(post.summary || '')}</p>
              <div class="post-link-label">
                <span>보러 가기</span>
                <span class="arrow-icon">→</span>
              </div>
            </div>
          </a>
        </article>
      `;
    }).join('');

  } catch (err) {
    console.error('[Posts Load Error]', err);
    container.innerHTML = `
      <div class="error-notice">
        <p>최근 글 목록을 불러오는 중 문제가 발생했습니다.</p>
        <small>content/posts.json 파일 구조를 확인해 주세요.</small>
      </div>
    `;
  }
}

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
