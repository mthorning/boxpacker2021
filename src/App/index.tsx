import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Home } from '../pages/Home'
import './App.css'

function App() {
  return (
    <div className="app">
      <Router>
        <Switch>
          <Route path="/" component={Home} />
      </Switch>
      </Router>
    </div>
  );
}

export default App;
