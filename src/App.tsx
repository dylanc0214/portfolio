import { CanvasMap } from './components/CanvasMap';
import { DystroyPage } from './pages/DystroyPage';

function isDystroyRoute() {
  if (typeof window === 'undefined') return false;
  return /\/dystroy(\/|$)/i.test(window.location.pathname);
}

function App() {
  if (isDystroyRoute()) {
    return <DystroyPage />;
  }
  return (
    <div className="app">
      <CanvasMap />
    </div>
  );
}

export default App;
