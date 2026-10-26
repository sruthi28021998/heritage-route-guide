import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <h2>404 – Page not found</h2>
      <Link to="/"><button>Back to home</button></Link>
    </div>
  );
}