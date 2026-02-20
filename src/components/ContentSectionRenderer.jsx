import { useState } from "react";

/**
 * Convert project type to full form
 */
const getProjectTypeFullForm = (type) => {
    if (type === "BOOT")
        return "BOOT – Build, Own, Operate and Transfer";

    if (type === "EPC")
        return "EPC – Engineering, Procurement & Commissioning";

    if (type === "BOOT + EPC")
        return "BOOT + EPC – Build, Own, Operate and Transfer + Engineering, Procurement & Commissioning";

    return "";
};

/* ------------------ FORMATTERS ------------------ */

// Indian currency formatter
const formatCurrency = (value) => {
    if (!value && value !== 0) return "-";
    return `₹${new Intl.NumberFormat("en-IN").format(Math.round(value))}`;
};

/* ========================================================= */

function ContentSectionRenderer({ section, onChange, formData }) {
    const [heading, setHeading] = useState(section.heading || "");
    const [items, setItems] = useState(section.items || []);
    const [isEditing, setIsEditing] = useState(false);

    /* ------------------ PLACEHOLDER REPLACEMENT ------------------ */
    if (section.showIf) {
        if (!section.showIf.includes(formData?.projectType)) {
            return null;
        }
    }

    const replacePlaceholders = (text) => {
        if (!text) return "";

        return text
            .replace("{plantCapacity}", formData?.plantCapacity || "")
            .replace("{panelWattPeak}", formData?.panelWattPeak || "")
            .replace("{panelQuantity}", formData?.panelQuantity || "")
            .replace("{clientName}", formData?.clientName || "")
            .replace("{clientAddress}", formData?.clientAddress || "")
            .replace("{clientCity}", formData?.clientCity || "")
            .replace("{productWarranty}", formData?.productWarranty || "")
            .replace("{performanceWarranty}", formData?.performanceWarranty || "")
            .replace(
                "{projectTypeFull}",
                getProjectTypeFullForm(formData?.projectType) || ""
            );
    };

    /* =========================================================
       HEADER SECTION
       ========================================================= */
    if (section.type === "header-section") {
        const title = replacePlaceholders(section.titleTemplate);
        const subtitle = replacePlaceholders(section.subtitleTemplate);

        return (
            <div className="proposal-header">
                {/* {section.logo?.src && (
                    <img
                        src={section.logo.src}
                        alt={section.logo.alt}
                        className="company-logo"
                    />
                )} */}

                <h1>{title}</h1>
                {subtitle && <p className="proposal-subtitle">{subtitle}</p>}

                {section.clientBlock?.show && (
                    <div className="client-block">
                        {section.clientBlock.template.map((line, i) => {
                            const text = replacePlaceholders(line);
                            if (!text) return null;
                            return <p key={i}>{text}</p>;
                        })}
                    </div>
                )}
            </div>
        );
    }

    if (section.type === "proposer-section") {
        const proposer =
            formData?.proposer === "Other"
                ? formData?.customProposerName
                : formData?.proposer;

        return (
            <div className="editable-section">
                <h3>{section.heading}</h3>

                <div className="proposer-block">
                    <p><strong>Mihira Energy Solutions Pvt. Limited</strong></p>
                    {proposer && <p>{proposer}</p>}
                    <p>Phone: {formData?.proposerPhone || "-"}</p>

                    <br />

                    <p className="note-text">
                        Note: This is a computer generated quote and hence no signature required
                    </p>
                </div>
            </div>
        );
    }

    /* =========================================================
       GENERIC TABLE SECTION
       ========================================================= */
    if (section.type === "table-section") {
        const HeadingTag = `h${section.headingOrder || 3}`;

        const getValue = (row) => {
            /* ----- simple field ----- */
            if (!row.valueType || row.valueType === "field") {
                const value = formData?.[row.valueKey];
                if (!value && value !== 0) return "-";
                return `${row.prefix || ""}${value}${row.suffix || ""}`;
            }

            /* ----- array ----- */
            if (row.valueType === "array") {
                const value = formData?.[row.valueKey];
                return value?.length ? value.join(", ") : "-";
            }

            /* ----- inverter summary ----- */
            if (row.valueType === "inverterSummary") {
                if (!formData?.inverters?.length) return "-";

                return formData.inverters
                    .map(
                        (inv) =>
                            `${inv.capacity || ""}${inv.quantity ? ` × ${inv.quantity}` : ""
                            }`
                    )
                    .join(", ");
            }

            /* ----- CALCULATIONS ----- */

            const plant = Number(formData?.plantCapacity || 0);
            const perDay = Number(formData?.generationPerDay || 4);
            const clientTariff = Number(formData?.clientPowerTariff || 0);
            const bootTariff = Number(formData?.bootTariff || 0);

            const contractYears = parseInt(
                formData?.bootContractYears || formData?.contractYears || 0,
                10
            );

            const monthlyUnits = perDay * plant * 30;
            const epcMonthly = monthlyUnits * clientTariff;
            const epcAnnual = epcMonthly * 12;
            const bootBill = monthlyUnits * bootTariff;
            const bootMonthlySavings = epcMonthly - bootBill;
            const bootAnnual = bootMonthlySavings * 12;

            const lifetimeBoot =
                contractYears > 0
                    ? bootAnnual * contractYears +
                    epcAnnual * (30 - contractYears)
                    : null;

            const lifetimeEpc = epcAnnual * 30;
            const costPerKW = Number(formData?.costPerKW || 0);
            const totalProjectCost = costPerKW * plant;

            if (row.valueType === "monthlyUnits")
                return `${Math.round(monthlyUnits)} units`;

            if (row.valueType === "epcMonthly")
                return formatCurrency(epcMonthly);

            if (row.valueType === "epcAnnual")
                return formatCurrency(epcAnnual);

            if (row.valueType === "bootBill")
                return formatCurrency(bootBill);

            if (row.valueType === "bootMonthlySavings")
                return formatCurrency(bootMonthlySavings);

            if (row.valueType === "bootAnnual")
                return formatCurrency(bootAnnual);

            if (row.valueType === "lifetimeBoot")
                return lifetimeBoot ? formatCurrency(lifetimeBoot) : "-";

            if (row.valueType === "lifetimeEpc")
                return formatCurrency(lifetimeEpc);
            if (row.valueType === "totalProjectCost")
                return totalProjectCost
                    ? formatCurrency(totalProjectCost)
                    : "-";

            return "-";
        };

        return (
            <div className="editable-section">
                <HeadingTag className="section-title">
                    {section.heading}
                </HeadingTag>

                {section.subHeading && (
                    <h4 className="table-subheading">
                        {section.subHeading}
                    </h4>
                )}

                <table className="spec-table">
                    <tbody>
                        {section.rows
                            .filter((row) => {
                                if (!row.showIf) return true;
                                return row.showIf.includes(formData?.projectType);
                            })
                            .map((row, i) => (
                                <tr key={i}>
                                    <td className="spec-label">{row.label}</td>
                                    <td className="spec-value">{getValue(row)}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        );
    }

    /* =========================================================
       GROUP SECTION (Parent with child sections)
       ========================================================= */
    if (section.type === "group-section") {
        const HeadingTag = `h${section.headingOrder || 3}`;

        return (
            <div className="editable-section">
                <HeadingTag className="section-title">
                    {section.heading}
                </HeadingTag>

                {section.sections?.map((child) => (
                    <ContentSectionRenderer
                        key={child.id}
                        section={child}
                        formData={formData}
                        onChange={() => { }}
                    />
                ))}
            </div>
        );
    }

    /* =========================================================
       NORMAL EDITABLE SECTIONS (Paragraph / List)
       ========================================================= */

    const updateHeading = (value) => {
        setHeading(value);
        onChange({ heading: value, items });
    };

    const updateItem = (index, key, value) => {
        const updated = [...items];
        updated[index] = { ...updated[index], [key]: value };
        setItems(updated);
        onChange({ heading, items: updated });
    };

    const addItem = () => {
        let newItem = {};

        if (section.type === "paragraph-section") newItem = { text: "" };
        if (section.type === "list-section")
            newItem = { label: "", description: "" };

        const updated = [...items, newItem];
        setItems(updated);
        onChange({ heading, items: updated });
    };

    const removeItem = (index) => {
        const updated = items.filter((_, i) => i !== index);
        setItems(updated);
        onChange({ heading, items: updated });
    };

    const HeadingTag = `h${section.headingOrder || 3}`;

    return (
        <div className="editable-section">
            {/* SECTION HEADER */}
            <div className="section-header">
                {!isEditing ? (
                    <HeadingTag className="section-title">
                        {heading}
                    </HeadingTag>
                ) : (
                    <input
                        className="heading-input"
                        value={heading}
                        onChange={(e) => updateHeading(e.target.value)}
                    />
                )}

                <button
                    type="button"
                    className={`no-print edit-btn ${isEditing ? "editing" : ""}`}
                    onClick={() => setIsEditing(!isEditing)}
                >
                    {isEditing ? "✓ Done" : "✏️ Edit"}
                </button>
            </div>

            {/* CONTENT */}
            <div className="section-content">
                {/* PARAGRAPH */}
                {section.type === "paragraph-section" &&
                    items.map((item, i) => (
                        <div key={i} className="preview-paragraph">
                            {!isEditing ? (
                                <p>{replacePlaceholders(item.text)}</p>
                            ) : (
                                <textarea
                                    value={item.text}
                                    onChange={(e) =>
                                        updateItem(i, "text", e.target.value)
                                    }
                                />
                            )}

                            {isEditing && (
                                <button
                                    type="button"
                                    className="remove-btn"
                                    onClick={() => removeItem(i)}
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    ))}

                {/* LIST SECTION */}
                {section.type === "list-section" && (
                    <ul className="content-list">
                        {items.map((item, i) => {
                            /* ----- LOGISTICS DYNAMIC ITEM ----- */
                            if (item.valueType === "transportationScope") {
                                const scope = formData?.transportationScope;
                                if (!scope) return null;

                                let text =
                                    "Transportation of all materials to site";

                                if (scope === "Included") text += " — Included";

                                if (scope === "Excluded") {
                                    const cost = formData?.transportationCost || 0;
                                    text += ` — Excluded (${formatCurrency(
                                        cost
                                    )} + 18% GST)`;
                                }

                                return <li key={i}>{text}</li>;
                            }

                            /* ----- NORMAL LIST ITEM ----- */
                            return (
                                <li key={i} className="preview-list-item">
                                    {!isEditing ? (
                                        item.label ? (
                                            <>
                                                <strong>
                                                    {replacePlaceholders(item.label)}
                                                </strong>
                                                {item.description &&
                                                    ` — ${replacePlaceholders(
                                                        item.description
                                                    )}`}
                                            </>
                                        ) : (
                                            replacePlaceholders(item.description)
                                        )
                                    ) : (
                                        <div className="list-edit-row">
                                            <input
                                                placeholder="Label (optional)"
                                                value={item.label || ""}
                                                onChange={(e) =>
                                                    updateItem(i, "label", e.target.value)
                                                }
                                            />

                                            <input
                                                placeholder="Description"
                                                value={item.description || ""}
                                                onChange={(e) =>
                                                    updateItem(
                                                        i,
                                                        "description",
                                                        e.target.value
                                                    )
                                                }
                                            />

                                            <button
                                                type="button"
                                                className="remove-btn"
                                                onClick={() => removeItem(i)}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>

            {/* ADD ITEM BUTTON */}
            {isEditing &&
                section.type !== "header-section" &&
                section.type !== "table-section" && (
                    <button
                        type="button"
                        className="secondary-btn"
                        onClick={addItem}
                    >
                        + Add Item
                    </button>
                )}
        </div>
    );
}

export default ContentSectionRenderer;
