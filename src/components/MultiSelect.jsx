import { useState, useRef, useEffect } from "react";

function MultiSelect({
    label,
    options = [],
    value = [],
    onChange,
    placeholder = "Select..."
}) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const ref = useRef();

    // close when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleOption = (option) => {
        let updated = [...value];

        if (updated.includes(option)) {
            updated = updated.filter((v) => v !== option);
        } else {
            updated.push(option);
        }

        onChange(updated);
    };

    const removeChip = (option) => {
        onChange(value.filter((v) => v !== option));
    };

    const filteredOptions = options.filter((opt) =>
        opt.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="form-group" ref={ref}>
            <label>{label}</label>

            {/* Selected area */}
            <div className="multi-dropdown" onClick={() => setOpen(!open)}>
                {value.length === 0 ? (
                    <span className="placeholder">{placeholder}</span>
                ) : (
                    <div className="chips">
                        {value.map((v) => (
                            <div key={v} className="chip">
                                {v}
                                <span
                                    className="chip-remove"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeChip(v);
                                    }}
                                >
                                    ✕
                                </span>
                            </div>
                        ))}
                    </div>
                )
                }
            </div>

            {/* Dropdown */}
            {open && (
                <div className="dropdown-panel">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="search-input"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    {filteredOptions.map((opt) => (
                        <div
                            key={opt}
                            className={`dropdown-option ${value.includes(opt) ? "selected" : ""
                                }`}
                            onClick={() => toggleOption(opt)}
                        >
                            <span>{opt}</span>
                            {value.includes(opt) && <span>✓</span>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MultiSelect;
