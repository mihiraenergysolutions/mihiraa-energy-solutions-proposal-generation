import MultiSelect from "./MultiSelect";

function FormRenderer({ config, formData, handleChange }) {
    /* =========================================================
       FIELD VISIBILITY (showIf support)
       ========================================================= */
    const shouldShow = (field) => {
        if (!field.showIf) return true;

        const fieldValue = formData[field.showIf.field];

        // single value condition
        if (field.showIf.value) {
            return fieldValue === field.showIf.value;
        }

        // multiple values condition
        if (field.showIf.values) {
            return field.showIf.values.includes(fieldValue);
        }

        return true;
    };

    /* =========================================================
       FIELD RENDERER
       ========================================================= */
    const renderField = (field, index) => {
        if (!shouldShow(field)) return null;

        switch (field.type) {
            /* ---------- TEXT ---------- */
            case "text":
                return (
                    <div className="form-group" key={field.name}>
                        <label>{field.label}</label>
                        <input
                            type="text"
                            name={field.name}
                            value={formData[field.name] || ""}
                            onChange={handleChange}
                            placeholder={field.placeholder}
                        />
                    </div>
                );

            /* ---------- TEXTAREA ---------- */
            case "textarea":
                return (
                    <div className="form-group" key={field.name}>
                        <label>{field.label}</label>
                        <textarea
                            name={field.name}
                            value={formData[field.name] || ""}
                            onChange={handleChange}
                            placeholder={field.placeholder}
                        />
                    </div>
                );

            /* ---------- SELECT ---------- */
            case "select":
                return (
                    <div className="form-group" key={field.name}>
                        <label>{field.label}</label>
                        <select
                            name={field.name}
                            value={formData[field.name] || ""}
                            onChange={(e) => {
                                const selectedValue = e.target.value;

                                handleChange({
                                    target: {
                                        name: field.name,
                                        value: selectedValue
                                    }
                                });

                                // ⭐ auto map extra fields if present
                                const selectedOption = field.options.find(
                                    opt => (opt.value || opt) === selectedValue
                                );

                                if (selectedOption?.phone) {
                                    handleChange({
                                        target: {
                                            name: "proposerPhone",
                                            value: selectedOption.phone
                                        }
                                    });
                                }
                            }}
                        >
                            <option value="" disabled>
                                {field.placeholder}
                            </option>

                            {field.options.map((opt) => {
                                const value = opt.value || opt;
                                const label = opt.label || opt;

                                return (
                                    <option key={value} value={value}>
                                        {label}
                                    </option>
                                );
                            })}

                        </select>
                    </div>
                );

            /* ---------- CURRENCY ---------- */
            case "currency":
                return (
                    <div className="form-group" key={field.name}>
                        <label>{field.label}</label>

                        <div className="currency-input">
                            <span className="currency-symbol">₹</span>
                            <input
                                type="number"
                                name={field.name}
                                value={formData[field.name] || ""}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                );

            /* ---------- NUMBER WITH PREFIX / SUFFIX ---------- */
            case "number":
                return (
                    <div className="form-group" key={field.name}>
                        <label>{field.label}</label>

                        <div className="input-wrapper">
                            {field.prefix && (
                                <span className="input-prefix">{field.prefix}</span>
                            )}

                            <input
                                type="number"
                                name={field.name}
                                value={formData[field.name] || ""}
                                placeholder={field.placeholder}
                                onChange={handleChange}
                            />

                            {field.suffix && (
                                <span className="input-suffix">{field.suffix}</span>
                            )}
                        </div>
                    </div>
                );

            /* ---------- UNIT INPUT ---------- */
            case "unit":
                return (
                    <div className="form-group" key={field.name}>
                        <label>{field.label}</label>

                        <div className="unit-input">
                            <input
                                type="number"
                                name={field.name}
                                value={formData[field.name] || ""}
                                onChange={handleChange}
                            />
                            <span className="unit-symbol">{field.unit}</span>
                        </div>
                    </div>
                );

            /* ---------- ROW LAYOUT ---------- */
            case "row":
                return (
                    <div className="form-row" key={index}>
                        {field.fields.map((f, i) => renderField(f, i))}
                    </div>
                );

            /* ---------- CHECKBOX GROUP ---------- */
            case "checkbox-group":
                return (
                    <div className="form-group" key={field.name}>
                        <label>{field.label}</label>

                        <div className="checkbox-group">
                            {field.options.map((opt) => {
                                const selectedValues = formData[field.name] || [];

                                return (
                                    <label key={opt} className="checkbox-item">
                                        <input
                                            type="checkbox"
                                            checked={selectedValues.includes(opt)}
                                            onChange={(e) => {
                                                let updated = [...selectedValues];

                                                if (e.target.checked) updated.push(opt);
                                                else updated = updated.filter((v) => v !== opt);

                                                handleChange({
                                                    target: { name: field.name, value: updated }
                                                });
                                            }}
                                        />
                                        <span>{opt}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                );

            /* ---------- REPEATER ---------- */
            case "repeater":
                const rows = formData[field.name] || [];

                const addRow = () =>
                    handleChange({
                        target: { name: field.name, value: [...rows, {}] }
                    });

                const removeRow = (idx) =>
                    handleChange({
                        target: {
                            name: field.name,
                            value: rows.filter((_, i) => i !== idx)
                        }
                    });

                const updateRow = (idx, key, value) => {
                    const updated = [...rows];
                    updated[idx] = { ...updated[idx], [key]: value };

                    handleChange({
                        target: { name: field.name, value: updated }
                    });
                };

                return (
                    <div className="form-group" key={field.name}>
                        <label>{field.label}</label>

                        {rows.map((row, idx) => (
                            <div className="repeater-row" key={idx}>
                                <select
                                    value={row.capacity || ""}
                                    onChange={(e) =>
                                        updateRow(idx, "capacity", e.target.value)
                                    }
                                >
                                    <option value="" disabled>
                                        Select capacity
                                    </option>

                                    {field.fields[0].options.map((opt) => (
                                        <option key={opt} value={opt}>
                                            {opt}
                                        </option>
                                    ))}
                                </select>

                                <input
                                    type="number"
                                    placeholder="Qty"
                                    value={row.quantity || ""}
                                    min="1"
                                    onChange={(e) =>
                                        updateRow(idx, "quantity", e.target.value)
                                    }
                                />

                                <button
                                    type="button"
                                    className="remove-btn"
                                    onClick={() => removeRow(idx)}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}

                        <button
                            type="button"
                            className="secondary-btn"
                            onClick={addRow}
                        >
                            + Add Inverter
                        </button>
                    </div>
                );

            /* ---------- MULTI SELECT ---------- */
            case "multi-select":
                return (
                    <MultiSelect
                        key={field.name}
                        label={field.label}
                        options={field.options}
                        value={formData[field.name] || []}
                        placeholder={field.placeholder}
                        onChange={(val) =>
                            handleChange({
                                target: { name: field.name, value: val }
                            })
                        }
                    />
                );

            /* ---------- SECTION ---------- */
            case "section":
                return (
                    <div className="form-section" key={index}>
                        <h3 className="section-heading">{field.title}</h3>
                        {field.fields.map((f, i) => renderField(f, i))}
                    </div>
                );

            /* ---------- READONLY ---------- */
            case "readonly":
                return (
                    <div className="form-group" key={field.name}>
                        <label>{field.label}</label>

                        <input
                            type="text"
                            value={formData[field.name] || ""}
                            readOnly
                            className="readonly-input"
                        />
                    </div>
                );

            default:
                return null;
        }
    };

    /* ========================================================= */
    return <>{config.map((f, i) => renderField(f, i))}</>;
}

export default FormRenderer;
