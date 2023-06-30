
import Header from './Components/Layout/Header';
import Footer from './Components/Layout/Footer'
import Home from './Components/Home/Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>

      <div className='App'>
        <Header />

        <div className='container container-fluid'>
          <Routes>
            <Route path="/" Component={Home} exact />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>


  );
}

export default App;
