import { useLocation } from "react-router-dom";
import otherDetailsConfig from "../config/otherDetailsConfig";
import OtherDetailsRenderer from "../components/OtherDetailsRenderer";

function ProposalPrint() {
    const location = useLocation();
    const { formData, proposalCode } = location.state || {};

    if (!formData) return <div>No data</div>;

    return (
        <div className="pdf-container">
            <div className="proposal-code">
                Proposal Code: <strong>{proposalCode}</strong>
            </div>

            <OtherDetailsRenderer
                config={otherDetailsConfig}
                formData={formData}
                data={{}}
                setData={() => { }}
            />
        </div>
    );
}

export default ProposalPrint;
