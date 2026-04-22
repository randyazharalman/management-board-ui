import React, { useEffect } from 'react';
import { IonApp, setupIonicReact } from '@ionic/react';
import { BoardPage } from './features/board/components/BoardPage';
import { ToastProvider } from './shared/components/ToastProvider';
import { useKanbanStore } from './store/kanbanStore';
import './theme/global.css';

/* Core Ionic CSS */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';

setupIonicReact();

const AppContent: React.FC = () => {
  const darkMode = useKanbanStore((s) => s.darkMode);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
      document.documentElement.classList.add('ion-palette-dark');
    } else {
      document.body.classList.remove('dark-mode');
      document.documentElement.classList.remove('ion-palette-dark');
    }
  }, [darkMode]);

  return (
    <IonApp style={{ background: 'var(--kb-bg)' }}>
      <ToastProvider>
        <div style={{ minHeight: '100vh', background: 'var(--kb-bg)', color: 'var(--kb-text)', transition: 'all 0.3s' }}>
          <BoardPage />
        </div>
      </ToastProvider>
    </IonApp>
  );
};

const App: React.FC = () => <AppContent />;

export default App;
