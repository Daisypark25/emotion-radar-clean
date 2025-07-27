export function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('✅ Service Worker registered with scope:', registration.scope);

          registration.onupdatefound = () => {
            const newWorker = registration.installing;
            newWorker.onstatechange = () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('🚀 새 버전이 다운로드 되었습니다.');
                if (window.showUpdateToast) {
                  window.showUpdateToast();
                }
              }
            };
          };

        })
        .catch(error => {
          console.error('💥 Service Worker registration failed:', error);
        });
    });
  }
}