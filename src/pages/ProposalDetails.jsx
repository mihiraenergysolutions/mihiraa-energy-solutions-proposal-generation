import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import otherDetailsConfig from "../config/otherDetailsConfig";
import OtherDetailsRenderer from "../components/OtherDetailsRenderer";

function ProposalDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [proposal, setProposal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [pdfLoading, setPdfLoading] = useState(false);
    const [otherDetails, setOtherDetails] = useState(otherDetailsConfig);

    /* ================= FETCH PROPOSAL ================= */

    useEffect(() => {
        fetchProposal();
    }, [id]);

    const fetchProposal = async () => {
        setLoading(true);

        const { data, error } = await supabase
            .from("proposals")
            .select("*")
            .eq("id", id)
            .single();

        if (!error && data) {
            setProposal(data);

            // load preview data from DB
            if (data.other_details) {
                setOtherDetails(data.other_details);
            }
        }

        setLoading(false);
    };

    /* ================= DATE FORMAT ================= */

    const dateFormat = (createdDate) => {
        if (!createdDate) return "";

        return new Date(createdDate).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    };

    /* ================= GENERATE PDF ================= */

    const generatePDF = async () => {
        try {
            setPdfLoading(true);
            const response = await fetch(
                "https://pdf-renderer-hszc.onrender.com/api/generate-pdf",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        url: `${window.location.origin}/proposal/${proposal.id}`,
                        proposalCode: proposal.proposal_code,
                        clientName: proposal.client_name
                    })
                }
            );

            if (!response.ok) throw new Error("PDF generation failed");

            const blob = await response.blob();
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `${proposal.proposal_code}-${proposal.client_name}.pdf`;
            link.click();

        } catch (err) {
            console.error(err);
            alert("Failed to generate PDF");
        } finally {
            setPdfLoading(false); // stop loader
        }
    };

    /* ================= LOADING ================= */

    if (loading) return <div>Loading...</div>;
    if (!proposal) return <div>Proposal not found</div>;

    /* ================= UI ================= */

    return (
        <div className="proposal-details-page">
            {/* Header */}
            <div className="details-header">
                <div className="logo">
                    <img src="/mihira-logo.png" alt="Company Logo" />
                </div>

                <div className="right-content">
                    <div className="proposal-date">
                        Date: <span className="fw-bold">
                            {dateFormat(proposal.created_at)}
                        </span>
                    </div>

                    <div className="proposal-details-code">
                        Proposal Code: <span className="fw-bold">
                            {proposal.proposal_code}
                        </span>
                    </div>
                </div>
            </div>

            {/* Preview */}
            <OtherDetailsRenderer
                config={otherDetailsConfig}
                formData={proposal.form_data || {}}
                data={otherDetails}          // ⭐ FIXED HERE
                setData={setOtherDetails}    // allow edits if needed
            />

            <div className="no-print">
                <div className="proposal-bottom-bar">
                    {!pdfLoading && <button
                        className="secondary-btn"
                        onClick={() => navigate(`/proposal-form/${proposal.id}`)}
                    >
                        Edit Proposal
                    </button>}

                    <button
                        className="primary-btn"
                        onClick={generatePDF}
                        disabled={pdfLoading}
                    >
                        {pdfLoading ? (
                            <>
                                <span className="spinner"></span>
                                Generating PDF...
                            </>
                        ) : (
                            "Generate PDF"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProposalDetails;
