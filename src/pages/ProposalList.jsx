import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function ProposalList() {
    const navigate = useNavigate();

    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);

    /* ================= FETCH PROPOSALS ================= */

    useEffect(() => {
        fetchProposals();
    }, []);

    const fetchProposals = async () => {
        setLoading(true);

        const { data, error } = await supabase
            .from("proposals")
            .select("*")
            .order("created_at", { ascending: false });

        if (!error) {
            setProposals(data || []);
        }

        setLoading(false);
    };

    /* ================= DATE FORMAT ================= */

    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    };

    /* ================= UI ================= */

    return (
        <div className="proposal-list-page">
            <div className="details-header">
                <div className="logo">
                    <img src="/mihira-logo.png" alt="Company Logo" />
                </div>

                <div className="right-content">
                    <button
                        className="primary-btn"
                        onClick={() => navigate("/proposal")}
                    >
                        + New Proposal
                    </button>
                </div>
            </div>

            {/* Content */}

            {loading ? (
                <div className="empty-state">Loading proposals...</div>
            ) : proposals.length === 0 ? (
                <div className="empty-state">
                    <p>No proposals created yet</p>
                    <button
                        className="primary-btn"
                        onClick={() => navigate("/proposal-form")}
                    >
                        Create First Proposal
                    </button>
                </div>
            ) : (
                <div className="proposal-card-list">
                    {proposals.map((proposal) => (
                        <div key={proposal.id} className="proposal-card">

                            <div
                                className="proposal-card-content"
                                onClick={() => navigate(`/proposal/${proposal.id}`)}
                            >
                                <div className="proposal-top">
                                    <div className="proposal-code">
                                        {proposal.proposal_code}
                                    </div>

                                    <div className="proposal-date">
                                        {formatDate(proposal.created_at)}
                                    </div>
                                </div>

                                <div className="proposal-client">
                                    {proposal.client_name || "Unnamed Client"}
                                </div>

                                <div className="proposal-meta">
                                    <span>{proposal.project_type}</span>
                                    <span>{proposal.plant_capacity} kW</span>
                                    <span>{proposal.property_type}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="proposal-actions">
                                <button
                                    className="primary-btn"
                                    onClick={() => navigate(`/proposal/${proposal.id}`)}
                                >
                                    View
                                </button>

                                <button
                                    className="secondary-btn"
                                    onClick={() =>
                                        navigate(`/proposal-form/${proposal.id}`)
                                    }
                                >
                                    Edit
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ProposalList;
