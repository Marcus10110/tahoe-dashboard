export default function TravelConditions() {
  return (
    <>
      <h2 className="section-header">Travel Conditions</h2>
      <div className="travel-section">
        <h3>Caltrans Road Conditions</h3>
        <div className="map-embed">
          <iframe src="https://quickmap.dot.ca.gov" title="Caltrans QuickMap"></iframe>
        </div>

        <h3 style={{ marginTop: '2rem' }}>Chain Control & Road Status</h3>
        <div className="travel-grid">
          <div className="travel-item">
            <h4>I-80 (to Palisades/Northstar)</h4>
            <a href="https://roads.dot.ca.gov/roadscell.php?roadnumber=80" target="_blank" rel="noopener noreferrer">
              I-80 Current Conditions
            </a>
            <a href="https://cwwp2.dot.ca.gov/vm/iframemap.htm" target="_blank" rel="noopener noreferrer">
              Chain Control Map
            </a>
          </div>

          <div className="travel-item">
            <h4>US-50 (to Heavenly)</h4>
            <a href="https://roads.dot.ca.gov/roadscell.php?roadnumber=50" target="_blank" rel="noopener noreferrer">
              US-50 Current Conditions
            </a>
            <a href="https://cwwp2.dot.ca.gov/vm/iframemap.htm" target="_blank" rel="noopener noreferrer">
              Chain Control Map
            </a>
          </div>

          <div className="travel-item">
            <h4>CA-88 (to Kirkwood)</h4>
            <a href="https://roads.dot.ca.gov/roadscell.php?roadnumber=88" target="_blank" rel="noopener noreferrer">
              CA-88 Current Conditions
            </a>
            <a href="https://cwwp2.dot.ca.gov/vm/iframemap.htm" target="_blank" rel="noopener noreferrer">
              Chain Control Map
            </a>
          </div>

          <div className="travel-item">
            <h4>Driving Directions</h4>
            <a href="https://www.google.com/maps/dir/San+Francisco,+CA/Palisades+Tahoe,+CA" target="_blank" rel="noopener noreferrer">
              SF → Palisades
            </a>
            <a href="https://www.google.com/maps/dir/San+Francisco,+CA/Northstar+California+Resort" target="_blank" rel="noopener noreferrer">
              SF → Northstar
            </a>
            <a href="https://www.google.com/maps/dir/San+Francisco,+CA/Heavenly+Mountain+Resort" target="_blank" rel="noopener noreferrer">
              SF → Heavenly
            </a>
            <a href="https://www.google.com/maps/dir/San+Francisco,+CA/Kirkwood+Mountain+Resort,+CA" target="_blank" rel="noopener noreferrer">
              SF → Kirkwood
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
