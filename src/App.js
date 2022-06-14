import './App.css';
import { 
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom';
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUp';
import HomePage from './pages/HomePage';
import PrivateRoute from './PrivateRoute';
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route 
            exact 
            path="/login"
            element = { <LoginPage />}
          />

          <Route 
            exact 
            path="/signup"
            element = { <SignUpPage />}
          />
          
          <Route 
            exact 
            path="/"
            element = { <PrivateRoute><HomePage /></PrivateRoute>}
          />
          
        </Routes>
      </Router>
    </div>
  );
}

export default App;
