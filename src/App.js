import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Layout } from 'antd';
import "antd/dist/antd.css";

import LandingPage from './pages/LandingPage';
import MovieLogger from './pages/MovieLogger';
import PopularMovies from './pages/PopularMovies';
import NavBar from './components/NavBar';

const { Header, Content } = Layout;

function App() {
    return (
      <Router>
        <Layout className="layout">
          <Header>
            <NavBar />
          </Header>
          <Content style={{ padding: '0 50px' }}>
            <Routes>
              <Route path="/movie_fetcher" element={<LandingPage />} />
              <Route path="/movielogger" element={<MovieLogger />} />
              <Route path="/popularmovies" element={<PopularMovies />} />
            </Routes>
          </Content>
        </Layout>
      </Router>
    );
}

export default App;