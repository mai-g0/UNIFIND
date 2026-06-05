import { Link } from 'react-router-dom'

function Home() {
  return (
    <>
      <section className="hero">
        <h1>Find Lost Items. Return Found Ones.</h1>
        <p>
          UniFind helps students report, search, match, and claim lost or found items on campus.
        </p>

        <div className="hero-buttons">
          <Link to="/post-lost" className="hero-link">
            Report Lost Item
          </Link>

          <Link to="/post-found" className="hero-link secondary">
            Report Found Item
          </Link>
        </div>
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>

        <div className="steps">
          <div>
            <h3>1. Report</h3>
            <p>Post details about a lost or found item.</p>
          </div>

          <div>
            <h3>2. Match</h3>
            <p>UniFind checks for possible matches.</p>
          </div>

          <div>
            <h3>3. Claim</h3>
            <p>Submit proof of ownership and recover the item.</p>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home