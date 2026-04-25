import "./landing.css";

function Landing() {
  return (
    <div className="container">
      <h1 className="title">Diagram</h1>

      <div className="card">
        <div className="avatar"></div>
        <h2>Lanjut sebagai tamu</h2>
        <p>Jelajahi menu terlebih dahulu tanpa login</p>
      </div>

      <button className="btn primary">
        Saya punya akun →
      </button>

      <button className="btn secondary">
        Buat Akun +
      </button>
    </div>
  );
}

export default Landing;