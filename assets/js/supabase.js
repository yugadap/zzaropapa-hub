/**
 * 짜로파파의 AI 연구소 - 알림 신청 연동 모듈 (Supabase 연동 자리)
 * 
 * [동작 원칙]
 * - 현재는 로컬 전용 단계이므로 전송 버튼이 '준비 중'으로 비활성화되어 있습니다.
 * - 추후 Supabase 프로젝트 생성 및 배포 시, 환경변수나 설정값(SUPABASE_URL, SUPABASE_ANON_KEY)이
 *   주입되면 자동으로 Supabase REST API를 통해 이메일을 안전하게 등록하도록 구성되어 있습니다.
 */

(function () {
  // 환경변수 또는 글로벌 설정 객체 탐색 (Vercel 배포 시 window.__ENV__ 또는 스크립트 주입 활용)
  const env = window.__ENV__ || {};
  const SUPABASE_URL = env.SUPABASE_URL || '';
  const SUPABASE_ANON_KEY = env.SUPABASE_ANON_KEY || '';

  const isConfigured = Boolean(
    SUPABASE_URL &&
    SUPABASE_ANON_KEY &&
    !SUPABASE_URL.includes('your-project') &&
    SUPABASE_URL.startsWith('https://')
  );

  const form = document.getElementById('newsletter-form');
  const emailInput = document.getElementById('newsletter-email');
  const submitBtn = document.getElementById('newsletter-submit');
  const statusMsg = document.getElementById('newsletter-status');

  if (!form || !submitBtn) return;

  if (isConfigured) {
    // Supabase 설정이 완료된 상태: 버튼 활성화 및 실시간 전송 연결
    submitBtn.disabled = false;
    submitBtn.textContent = '알림 신청하기 ✉️';
    submitBtn.classList.remove('btn-disabled');

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      const email = emailInput.value.trim();

      if (!email || !email.includes('@')) {
        showStatus('올바른 이메일 주소를 입력해 주세요.', 'error');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = '신청 중...';

      try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/subscribers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            email: email,
            created_at: new Date().toISOString(),
            source: 'hub_site'
          })
        });

        if (response.ok) {
          showStatus('🎉 알림 신청이 완료되었습니다! 새 소식을 가장 먼저 보내드릴게요.', 'success');
          emailInput.value = '';
          submitBtn.textContent = '신청 완료 ✨';
        } else {
          showStatus('신청 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.', 'error');
          submitBtn.disabled = false;
          submitBtn.textContent = '알림 신청하기 ✉️';
        }
      } catch (err) {
        console.error('[Supabase Error]', err);
        showStatus('네트워크 연결에 문제가 있습니다.', 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = '알림 신청하기 ✉️';
      }
    });
  } else {
    // 로컬 전용 / 설정 대기 모드: 버튼 비활성화 상태 유지
    submitBtn.disabled = true;
    submitBtn.textContent = '준비 중 (곧 오픈돼요!)';
    submitBtn.classList.add('btn-disabled');

    console.info(
      '%c[짜로파파 알림 폼 안내]%c Supabase 설정이 대기 모드입니다. (로컬 검토 단계에서는 DB에 연결하지 않습니다)',
      'background: #ffe066; color: #2d2d2d; font-weight: bold; padding: 2px 6px; border-radius: 4px;',
      'color: #666; margin-left: 6px;'
    );
  }

  function showStatus(text, type) {
    if (!statusMsg) return;
    statusMsg.textContent = text;
    statusMsg.className = `status-msg ${type}`;
    statusMsg.style.display = 'block';
  }
})();
