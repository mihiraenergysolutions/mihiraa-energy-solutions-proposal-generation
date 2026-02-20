import ContentSectionRenderer from "./ContentSectionRenderer";

function OtherDetailsRenderer({ config, data, setData, formData }) {
    const updateSection = (id, value) => {
        setData((prev) => ({
            ...prev,
            [id]: value
        }));
    };

    return (
        <>
            {config.map((section) => (
                <ContentSectionRenderer
                    key={section.id}
                    section={{
                        ...section,
                        heading: data[section.id]?.heading || section.heading,
                        items: data[section.id]?.items || section.items
                    }}
                    formData={formData}
                    onChange={(items) =>
                        updateSection(section.id, items)
                    }
                />
            ))}
        </>
    );
}

export default OtherDetailsRenderer;
