const otherDetailsConfig = [
    {
        type: "header-section",
        id: "proposalHeader",
        headingOrder: 1,
        logo: {
            src: "/src/assets/mihira-logo.png",
            alt: "Mihira Energy Solutions"
        },

        titleTemplate: "SOLAR PLANT INSTALLATION PROPOSAL – {plantCapacity} kW",

        subtitleTemplate: "{projectTypeFull}",

        clientBlock: {
            show: true,
            template: [
                "To,",
                "{clientName}",
                "{clientAddress}",
                "{clientCity}"
            ]
        }
    },
    {
        type: "paragraph-section",
        id: "aboutMihira",
        heading: "About Mihira Energy Solutions",
        headingOrder: 2,
        items: [
            {
                text: `Mihira Energy Solutions is a professionally managed solar EPC company specializing in residential, commercial, and institutional solar power projects. We enable customers to significantly reduce their electricity (EB) bills by transitioning to clean and sustainable solar energy.`
            },
            {
                text: `Our team has collectively delivered projects aggregating over 2 GW across India. Mihira Energy Solutions brings proven engineering expertise, reliable execution, and long-term operational support.`
            }
        ]
    },

    // Example future section (list type)
    {
        type: "list-section",
        id: "coreServicesEpc",
        heading: "Our Core Services - EPC (Turnkey) Model",
        headingOrder: 3,
        items: [
            {
                label: "Rooftop Solar EPC (End-to-End Turnkey Execution)",
                description:
                    "Complete design, engineering, procurement, installation, testing & commissioning"
            },
            {
                label: "",
                description:
                    "On-grid rooftop solar plants for homes, apartments, factories, and commercial buildings"
            },
            {
                label: "",
                description:
                    "Use of MNRE-approved structures and Tier-1 components only"
            },
            {
                label: "",
                description:
                    "Single-point responsibility from project initiation to post-commissioning support"
            }
        ]
    },
    {
        type: "paragraph-section",
        id: "projectOverview",
        heading: "Project Overview",
        headingOrder: 2,

        items: [
            {
                text: "Mihira Energy Solutions is pleased to submit this proposal for the design, supply, installation, and commissioning of a {plantCapacity} kW On-Grid Rooftop Solar Power Plant at the premises of {clientName}."
            }
        ]
    },
    {
        type: "group-section",
        id: "technicalSpecsGroup",

        heading: "Technical Specifications & Scope of Supply",
        headingOrder: 2,

        sections: [
            {
                type: "table-section",
                id: "solarModules",

                subHeading: "Solar Modules",

                rows: [
                    { label: "Capacity", valueKey: "plantCapacity", suffix: " kW" },
                    { label: "Type", valueKey: "panelWattPeak", suffix: " W" },
                    { label: "Make", valueKey: "panelMakes", valueType: "array" },
                    { label: "Quantity", valueKey: "panelQuantity" },

                    { label: "Product Warranty", valueKey: "productWarranty", suffix: " Years" },
                    { label: "Performance Warranty", valueKey: "performanceWarranty", suffix: " Years" }
                ]
            },

            {
                type: "table-section",
                id: "inverterSpecs",

                subHeading: "Inverters",

                rows: [
                    {
                        label: "Make",
                        valueKey: "inverterMakes",
                        valueType: "array"
                    },
                    {
                        label: "Capacity",
                        valueType: "inverterSummary"
                    },
                    {
                        label: "Inverter Warranty",
                        valueKey: "inverterWarranty",
                        suffix: " Years"
                    }
                ]
            },
            {
                type: "table-section",
                id: "generationProjections",

                heading: "Generation Projections",
                headingOrder: 2,

                rows: [
                    // NEW — Current tariff
                    {
                        label: "Current Tariff",
                        valueKey: "clientPowerTariff",
                        prefix: "₹",
                        suffix: " / unit"
                    },

                    // NEW — BOOT tariff (conditional)
                    {
                        label: "BOOT Tariff",
                        valueKey: "bootTariff",
                        prefix: "₹",
                        suffix: " / unit",
                        showIf: ["BOOT", "BOOT + EPC"]
                    },
                    {
                        label: "Estimated Generation Per Day",
                        valueKey: "generationPerDay",
                        suffix: " units"
                    },

                    {
                        label: "Monthly Units",
                        valueType: "monthlyUnits"
                    },

                    // EPC (show for EPC or BOOT+EPC)
                    {
                        label: "Monthly Savings (EPC)",
                        valueType: "epcMonthly",
                        showIf: ["EPC", "BOOT + EPC"]
                    },
                    {
                        label: "Annual Savings (EPC)",
                        valueType: "epcAnnual",
                        showIf: ["EPC", "BOOT + EPC"]
                    },
                    {
                        label: "Lifetime Savings (EPC)",
                        valueType: "lifetimeEpc",
                        showIf: ["EPC"]
                    },

                    // BOOT
                    {
                        label: "Monthly BOOT Savings",
                        valueType: "bootMonthlySavings",
                        showIf: ["BOOT", "BOOT + EPC"]
                    },
                    {
                        label: "Annual BOOT Savings",
                        valueType: "bootAnnual",
                        showIf: ["BOOT", "BOOT + EPC"]
                    },
                    {
                        label: "Lifetime Savings (BOOT)",
                        valueType: "lifetimeBoot",
                        showIf: ["BOOT", "BOOT + EPC"]
                    }
                ]
            }

        ]
    },
    {
        type: "list-section",
        id: "mountingStructure",

        heading: "Mounting Structure",
        headingOrder: 4,

        items: [
            {
                description: "Hot-Dip Galvanized Steel Structure"
            },
            {
                description: "Designed as per MNRE & IS standards"
            },
            {
                label: "Warranty",
                description: "As per manufacturer"
            }
        ]
    },
    {
        type: "list-section",
        id: "electricalBos",

        heading: "Electrical Balance of System (BoS)",
        headingOrder: 4,

        items: [
            {
                label: "DC Cables",
                description: "Polycab"
            },
            {
                label: "AC Cables",
                description: "Polycab"
            },
            {
                label: "ACDB & DCDB",
                description: "Siemens / L&T"
            },
            {
                label: "Earthing",
                description: "Chemical earthing with rods (MNRE compliant)"
            },
            {
                label: "Lightning Arrestors",
                description: "MNRE compliant"
            },
            {
                label: "Other Hardware",
                description: "Nuts, bolts, conduits, trays — MNRE compliant"
            }
        ]
    },
    {
        type: "list-section",
        id: "installationCommissioning",

        heading: "Installation & Commissioning",
        headingOrder: 4,

        items: [
            {
                description: "Complete installation, testing & commissioning"
            },
            {
                description: "Executed strictly as per MNRE standards"
            },
            {
                description: "Included in project cost"
            }
        ]
    },
    {
        type: "list-section",
        id: "monitoringApprovals",

        heading: "Monitoring & Approvals",
        headingOrder: 4,

        items: [
            {
                label: "Initial generation & performance monitoring",
                description: "First 10 days — Included"
            },
            {
                label: "Net Metering & Government Approvals",
                description: "In Mihira's scope"
            },
            {
                description: "Local customer support required where applicable"
            }
        ]
    },
    {
        type: "list-section",
        id: "logistics",

        heading: "Logistics",
        headingOrder: 3,

        items: [
            {
                label: "Transportation of all materials to site",
                description: "Included in project cost"
            }
        ]
    },
    {
        type: "list-section",
        id: "performanceDegradation",

        heading: "Performance & Degradation",
        headingOrder: 3,

        items: [
            {
                label: "Annual Degradation",
                description: "~0.8% per year"
            },
            {
                description: "Designed for long-term stable energy generation"
            }
        ]
    },
    {
        type: "list-section",
        id: "projectTimeline",

        heading: "Project Timeline",
        headingOrder: 3,

        items: [
            {
                label: "Execution Period",
                description: "30 to 45 days from work order and approvals"
            }
        ]
    },
    {
        type: "list-section",
        id: "paymentTerms",

        heading: "Payment Terms for EPC Projects",
        headingOrder: 2,

        // ⭐ only show for EPC or BOOT + EPC
        showIf: ["EPC", "BOOT + EPC"],

        items: [
            {
                label: "Purchase order confirmation",
                description: "30% of the project amount"
            },
            {
                label: "After material dispatch",
                description: "60% of the project amount"
            },
            {
                label: "After installation and testing",
                description: "10% of the project amount"
            }
        ]
    },
    {
        type: "list-section",
        id: "paymentDetails",

        heading: "Payment Details",
        headingOrder: 3,

        items: [
            {
                description:
                    "Only Cheques/UPI/RTGS accepted and all payments to be made to"
            },
            {
                label: "Account Number",
                description: "50200118300114"
            },
            {
                label: "Name",
                description: "MIHIRA ENERGY SOLUTIONS"
            },
            {
                label: "IFSC Code",
                description: "HDFC0001243"
            },
            {
                description: "Dabagarden Branch"
            },
            {
                description: "Visakhapatnam"
            }
        ]
    },
    {
        type: "group-section",
        id: "commercialsGroup",

        heading: "Commercial Terms",
        headingOrder: 2,

        showIf: ["EPC", "BOOT + EPC"],

        sections: [
            // TOTAL PROJECT COST TABLE
            {
                type: "table-section",
                id: "commercialCost",

                rows: [
                    {
                        label: "Total Project Cost (Turnkey EPC)",
                        valueType: "totalProjectCost"
                    }
                ]
            },

            // NOTES / TERMS (editable)
            {
                type: "list-section",
                id: "commercialNotes",

                items: [
                    {
                        description: "Exclusive of GST (8.9%)"
                    },
                    {
                        description:
                            "Inclusive of installation, approvals, logistics & commissioning"
                    }
                ]
            }
        ]
    },
    {
        type: "paragraph-section",
        id: "proposalClosing",
        heading: "",
        headingOrder: 3,

        items: [
            {
                text: "We believe this proposal offers the best balance of quality, reliability, long-term performance, and value for {clientName}. By choosing Mihira Energy Solutions as your EPC partner, the community will benefit from reduced electricity expenses, stable power generation, and a sustainable energy asset designed to perform reliably for decades."
            },
            {
                text: "We assure complete transparency, strict adherence to MNRE and statutory norms, and single-point accountability throughout the project lifecycle from engineering and approvals to commissioning and after-sales support."
            },
            {
                text: "We look forward to the opportunity to partner with {clientName} in building a cleaner, greener, and cost-efficient energy future."
            }
        ]
    },
    {
        type: "proposer-section",
        id: "proposerBlock",
        heading: "From",
        headingOrder: 3
    }
];

export default otherDetailsConfig;
