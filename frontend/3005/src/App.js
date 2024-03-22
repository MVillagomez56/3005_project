import './App.css';
import { AuthProvider } from './store/AuthContext';
import { AppRouter } from './AppRouter';
function App() {

  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
