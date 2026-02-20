import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import proposalFormConfig from "../config/proposalFormConfig";
import otherDetailsConfig from "../config/otherDetailsConfig";

import FormRenderer from "../components/FormRenderer";
import OtherDetailsRenderer from "../components/OtherDetailsRenderer";

import { generateProposalCode } from "../utils/generateProposalCode";
import { supabase } from "../lib/supabase";

function ProposalForm() {
    const [activeTab, setActiveTab] = useState("basic");

    const [formData, setFormData] = useState({
        generationPerDay: 4
    });

    const [otherDetails, setOtherDetails] = useState({});
    const [loading, setLoading] = useState(false);

    const { id } = useParams();
    const navigate = useNavigate();

    /* ================= FETCH PROPOSAL ================= */

    const fetchProposal = async () => {
        if (!id) return;

        setLoading(true);

        const { data, error } = await supabase
            .from("proposals")
            .select("*")
            .eq("id", id)
            .single();

        if (!error && data) {
            if (data.form_data) setFormData(data.form_data);
            if (data.other_details) setOtherDetails(data.other_details);
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchProposal();
    }, [id]);

    /* ================= INIT PREVIEW FOR NEW PROPOSAL ================= */

    useEffect(() => {
        if (!id) {
            setOtherDetails(otherDetailsConfig);
        }
    }, [id]);

    /* ================= AUTO PANEL CALCULATION ================= */

    useEffect(() => {
        const plantCapacity = parseFloat(formData.plantCapacity);
        const panelWatt = parseFloat(formData.panelWattPeak);

        if (!plantCapacity || !panelWatt) return;

        const quantity = Math.ceil((plantCapacity * 1000) / panelWatt);

        setFormData((prev) => ({
            ...prev,
            panelQuantity: quantity
        }));
    }, [formData.plantCapacity, formData.panelWattPeak]);

    /* ================= HANDLE CHANGE ================= */

    const handleChange = (nameOrEvent, value) => {
        if (nameOrEvent?.target) {
            const { name, value } = nameOrEvent.target;

            setFormData((prev) => ({
                ...prev,
                [name]: value
            }));
            return;
        }

        setFormData((prev) => ({
            ...prev,
            [nameOrEvent]: value
        }));
    };

    /* ================= TOTAL INVERTER CAPACITY ================= */

    const totalInverterCapacity = useMemo(() => {
        const inverters = formData.inverters || [];
        let total = 0;

        inverters.forEach((inv) => {
            if (!inv.capacity || !inv.quantity) return;

            const capacityValue = parseFloat(
                inv.capacity.replace("kW", "")
            );

            const qty = parseFloat(inv.quantity);

            if (!isNaN(capacityValue) && !isNaN(qty)) {
                total += capacityValue * qty;
            }
        });

        return total;
    }, [formData.inverters]);

    /* ================= SAVE / UPDATE ================= */

    const handleGenerate = async () => {
        try {
            let result;

            // UPDATE EXISTING
            if (id) {
                const { data, error } = await supabase
                    .from("proposals")
                    .update({
                        client_name: formData.clientName,
                        client_city: formData.clientCity,
                        project_type: formData.projectType,
                        property_type: formData.propertyType,
                        plant_capacity: formData.plantCapacity,
                        form_data: formData,
                        other_details: otherDetails // ⭐ FIX
                    })
                    .eq("id", id)
                    .select()
                    .single();

                if (error) throw error;
                result = data;
            }

            // CREATE NEW
            else {
                const proposalCode = generateProposalCode();

                const { data, error } = await supabase
                    .from("proposals")
                    .insert({
                        proposal_code: proposalCode,
                        client_name: formData.clientName,
                        client_city: formData.clientCity,
                        project_type: formData.projectType,
                        property_type: formData.propertyType,
                        plant_capacity: formData.plantCapacity,
                        form_data: formData,
                        other_details: otherDetails // ⭐ FIX
                    })
                    .select()
                    .single();

                if (error) throw error;
                result = data;
            }

            navigate(`/proposal/${result.id}`);
        } catch (err) {
            console.error(err);
            alert("Failed to save proposal");
        }
    };

    /* ================= LOADING ================= */

    if (loading) {
        return (
            <div className="app-screen">
                <div className="card">Loading proposal...</div>
            </div>
        );
    }

    /* ================= UI ================= */

    return (
        <div className="app-screen">

            <div className="app-header">
                <h2>{id ? "Edit Proposal" : "Create Proposal"}</h2>
            </div>

            <div className="tabs no-print">
                <button
                    className={`tab ${activeTab === "basic" ? "active" : ""}`}
                    onClick={() => setActiveTab("basic")}
                >
                    Basic Details
                </button>

                <button
                    className={`tab ${activeTab === "preview" ? "active" : ""}`}
                    onClick={() => setActiveTab("preview")}
                >
                    Preview
                </button>
            </div>

            <div className="content-area">
                <div className="card">

                    {activeTab === "basic" && (
                        <>
                            <FormRenderer
                                config={proposalFormConfig}
                                formData={formData}
                                handleChange={handleChange}
                            />

                            {totalInverterCapacity > 0 && (
                                <div className="total-capacity-card">
                                    <span>Total Inverter Capacity</span>
                                    <strong>{totalInverterCapacity} kW</strong>
                                </div>
                            )}
                        </>
                    )}

                    {activeTab === "preview" && (
                        <OtherDetailsRenderer
                            config={otherDetailsConfig}
                            data={otherDetails}
                            setData={setOtherDetails}
                            formData={formData}
                        />
                    )}

                </div>
            </div>

            <div className="bottom-bar no-print">
                <button className="primary-btn" onClick={handleGenerate}>
                    {id ? "Update Proposal" : "Generate Proposal"}
                </button>
            </div>
        </div>
    );
}

export default ProposalForm;
