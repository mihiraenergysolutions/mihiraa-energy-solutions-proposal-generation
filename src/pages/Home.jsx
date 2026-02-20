import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    return (
        <div className="app-screen">
            <div className="content-area" style={{ textAlign: "center", marginTop: "100px" }}>
                <h1 style={{ marginBottom: "20px" }}>React Proposal Form</h1>

                <button
                    className="primary-btn"
                    onClick={() => navigate("/proposal")}
                >
                    Create Proposal
                </button>
            </div>
        </div>
    );
}

export default Home;
